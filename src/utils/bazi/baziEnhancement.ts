/**
 * 八字命理增强模块
 * 补充用神体系、格局体系、神煞系统、命局分析维度
 * 用于生成更专业的AI分析提示词
 */

import { BASIC_MAPPINGS, LU_BRANCH_MAP, REN_BRANCH_MAP, SAN_HE_MAP, SAN_HUI_MAP, SI_KU } from './baziDefinitions'
import type { PatternAnalysis, BaziChartResult } from './baziTypes'

// ==================== 用神体系扩充 ====================

/**
 * 用神方法枚举
 */
type UsefulGodMethod =
  | '扶抑法'    // 基本强弱法，最常用
  | '调候法'    // 穷通宝鉴寒热燥湿
  | '病药法'    // 找出命局最突出问题
  | '通关法'    // 两神相战时调和
  | '专旺法'    // 从旺格用神
  | '从势法'    // 从杀/从财/从儿

/**
 * 病药法规则
 * "有病有药"才是最理想的命局
 */
interface DiseaseMedicineRule {
  id: string
  label: string
  description: string
  diseasePatterns: string[]   // 病状模式
  medicinePatterns: string[]   // 药方模式
  priority: number
}

/**
 * 病药法规则库
 */
const DISEASE_MEDICINE_RULES: DiseaseMedicineRule[] = [
  {
    id: 'disease-water-fire-war',
    label: '水火相战病药',
    description: '命局水火对峙失衡，以木通关调和为药',
    diseasePatterns: ['水旺火弱', '火旺水弱', '水火相激'],
    medicinePatterns: ['木通关', '木泄水火'],
    priority: 100
  },
  {
    id: 'disease-wood-metal-war',
    label: '木金相战病药',
    description: '命局木金对峙失衡，以水通关调和为药',
    diseasePatterns: ['木旺金弱', '金旺木弱', '木金相战'],
    medicinePatterns: ['水通关', '水泄金木'],
    priority: 100
  },
  {
    id: 'disease-earth-fire-war',
    label: '土火相战病药',
    description: '命局土火对峙失衡，以金通关调和为药',
    diseasePatterns: ['土旺火弱', '火旺土弱', '土火相激'],
    medicinePatterns: ['金通关', '金泄土火'],
    priority: 100
  },
  {
    id: 'disease-over-strong',
    label: '过旺为病',
    description: '某五行过旺为病，以泄为药',
    diseasePatterns: ['身强', '偏强', '极强', '专旺'],
    medicinePatterns: ['食伤泄秀', '财星耗泄', '官杀克抑'],
    priority: 90
  },
  {
    id: 'disease-over-weak',
    label: '过弱为病',
    description: '某五行过弱为病，以生扶为药',
    diseasePatterns: ['身弱', '偏弱', '极弱'],
    medicinePatterns: ['印星生扶', '比劫助身'],
    priority: 90
  },
  {
    id: 'disease-cold-heat',
    label: '寒热病药',
    description: '命局过寒或过热为病，调候为药',
    diseasePatterns: ['过寒', '过热', '寒热失调'],
    medicinePatterns: ['丙火调候', '癸水润燥', '寒者喜暖', '热者喜凉'],
    priority: 95
  },
  {
    id: 'disease-dry-wet',
    label: '燥湿病药',
    description: '命局过燥或过湿为病，调候为药',
    diseasePatterns: ['过燥', '过湿', '燥湿失调'],
    medicinePatterns: ['水润燥', '火烤湿', '燥者喜润', '湿者喜燥'],
    priority: 95
  }
]

/**
 * 通关法规则
 * 两神相战时，寻找调和的桥梁
 */
interface TongguanRule {
  id: string
  label: string
  description: string
  conflictWuxings: [string, string]  // 相战的两种五行
  tongguanWuxing: string            // 通关五行
  priority: number
}

const TONGGUAN_RULES: TongguanRule[] = [
  { id: 'tg-water-fire', label: '水火通关', description: '木泄水火，调和相战', conflictWuxings: ['水', '火'], tongguanWuxing: '木', priority: 100 },
  { id: 'tg-wood-metal', label: '木金通关', description: '水泄金木，调和相战', conflictWuxings: ['木', '金'], tongguanWuxing: '水', priority: 100 },
  { id: 'tg-earth-fire', label: '土火通关', description: '金泄土火，调和相战', conflictWuxings: ['土', '火'], tongguanWuxing: '金', priority: 100 },
  { id: 'tg-earth-water', label: '土水通关', description: '木泄水土，调和相战', conflictWuxings: ['土', '水'], tongguanWuxing: '木', priority: 100 },
  { id: 'tg-metal-fire', label: '金火通关', description: '土泄金火，调和相战', conflictWuxings: ['金', '火'], tongguanWuxing: '土', priority: 100 },
  { id: 'tg-wood-fire', label: '木火通关', description: '土泄火木，调和相战', conflictWuxings: ['木', '火'], tongguanWuxing: '土', priority: 90 }
]

/**
 * 判断命局中是否存在两神相战需要通关
 */
export function detectTongguanNeed(
  wuxingCounts: Record<string, number>,
  favorableWuxing: string[],
  unfavorableWuxing: string[]
): { need: boolean; conflict?: [string, string]; tongguan?: string; rule?: TongguanRule } {
  // 通关法的核心：喜用五行与忌神五行形成对峙（相克关系），需通关调和
  // 必须一端在喜用、另一端在忌用，才构成真正的"两神相战"
  for (const rule of TONGGUAN_RULES) {
    const [w1, w2] = rule.conflictWuxings
    // 场景A：w1在喜用、w2在忌用
    const favorableHasW1 = favorableWuxing.includes(w1)
    const unfavorableHasW2 = unfavorableWuxing.includes(w2)
    // 场景B：w2在喜用、w1在忌用
    const favorableHasW2 = favorableWuxing.includes(w2)
    const unfavorableHasW1 = unfavorableWuxing.includes(w1)

    const isConflict = (favorableHasW1 && unfavorableHasW2) || (favorableHasW2 && unfavorableHasW1)

    if (isConflict) {
      // 检查这两种五行是否都很强旺（势均力敌才需要通关）
      const w1Strong = (wuxingCounts[w1] || 0) >= 25
      const w2Strong = (wuxingCounts[w2] || 0) >= 25

      if (w1Strong && w2Strong) {
        return { need: true, conflict: rule.conflictWuxings, tongguan: rule.tongguanWuxing, rule }
      }
    }
  }

  return { need: false }
}

/**
 * 识别命局的"病"与"药"
 */
export function detectDiseaseMedicine(
  wuxingCounts: Record<string, number>,
  pattern: PatternAnalysis,
  strengthStatus: string
): { hasDisease: boolean; disease?: string; medicine?: string; rule?: DiseaseMedicineRule } {
  // 1. 检查过旺过弱
  for (const [wuxing, count] of Object.entries(wuxingCounts)) {
    if (count >= 40) {
      const rule = DISEASE_MEDICINE_RULES.find(r => r.id === 'disease-over-strong')
      // 土过旺时，克法（木）和泄法（金）并用；其他五行过旺时按原有逻辑
      let medicine: string
      if (wuxing === '土') {
        medicine = pattern.isSpecial
          ? '顺势化泄'
          : `木克土为制，金泄土为化（泄秀更佳）`
      } else {
        medicine = pattern.isSpecial
          ? '顺势化泄'
          : getOppositeWuxing(wuxing)
      }
      return { hasDisease: true, disease: `${wuxing}过旺为病`, medicine, rule }
    }
    if (count <= 10) {
      const rule = DISEASE_MEDICINE_RULES.find(r => r.id === 'disease-over-weak')
      const medicine = getSupportiveWuxing(wuxing)
      return { hasDisease: true, disease: `${wuxing}过弱为病`, medicine, rule }
    }
  }

  // 2. 检查寒热燥湿
  const seasonInfo = getSeasonBalance(wuxingCounts)
  if (seasonInfo.imbalance) {
    const rule = DISEASE_MEDICINE_RULES.find(r =>
      seasonInfo.type === 'cold' ? r.id === 'disease-cold-heat' : r.id === 'disease-dry-wet'
    )
    return {
      hasDisease: true,
      disease: seasonInfo.type === 'cold' ? '过寒为病' : '过燥为病',
      medicine: seasonInfo.medicine,
      rule
    }
  }

  return { hasDisease: false }
}

function getOppositeWuxing(wuxing: string): string {
  const opposites: Record<string, string> = {
    '木': '金', '金': '木',
    '水': '火', '火': '水',
    '土': '木'  // 克土首选木
  }
  return opposites[wuxing] || '待定'
}

/**
 * 获取泄某五行的五行（土→金泄，火→土泄，木→火泄，金→水泄，水→木泄）
 * 用于通关法和病药法中泄法取用
 */
export function getDrainWuxing(wuxing: string): string {
  const drainMap: Record<string, string> = {
    '土': '金', '火': '土', '木': '火', '金': '水', '水': '木'
  }
  return drainMap[wuxing] || ''
}

function getSupportiveWuxing(wuxing: string): string {
  const sheng = BASIC_MAPPINGS.WUXING_SHENG
  const wuxingIndex = Object.values(sheng).indexOf(wuxing)
  if (wuxingIndex >= 0) {
    const keys = Object.keys(sheng)
    return keys[wuxingIndex] || ''
  }
  return ''
}

function getSeasonBalance(wuxingCounts: Record<string, number>): {
  imbalance: boolean
  type?: 'cold' | 'hot' | 'dry' | 'wet'
  medicine?: string
} {
  const water = wuxingCounts['水'] || 0
  const fire = wuxingCounts['火'] || 0
  const wood = wuxingCounts['木'] || 0
  const metal = wuxingCounts['金'] || 0

  // 过寒：水木旺盛，火金衰弱
  if (water + wood >= 45 && fire + metal <= 20) {
    return { imbalance: true, type: 'cold', medicine: '丙火调候' }
  }

  // 过热：火金旺盛，水木衰弱
  if (fire + metal >= 45 && water + wood <= 20) {
    return { imbalance: true, type: 'hot', medicine: '癸水润燥' }
  }

  // 过燥：火旺土燥
  if (fire >= 30 && (wuxingCounts['土'] || 0) >= 30 && water <= 15) {
    return { imbalance: true, type: 'dry', medicine: '水润燥' }
  }

  // 过湿：水旺土虚
  if (water >= 35 && (wuxingCounts['土'] || 0) <= 15) {
    return { imbalance: true, type: 'wet', medicine: '火暖局' }
  }

  return { imbalance: false }
}

// ==================== 格局体系扩充 ====================

/**
 * 经典格局定义
 */
interface ClassicPattern {
  id: string
  name: string
  description: string
  conditions: {
    dayStems?: string[]           // 日干条件
    monthBranch?: string[]         // 月令条件
    otherConditions?: string[]     // 其他条件
    exactMonthBranchMap?: Record<string, string>  // 日干→月支精确映射（阳刃格专用）
    excludePatterns?: string[]     // 命局格局排除条件
  }
  favorableWuxing: string[]       // 喜用五行
  unfavorableWuxing: string[]       // 忌讳五行
  level: '极品' | '上等' | '中等'  // 格局层次
}

/**
 * 经典格局库
 */
const CLASSIC_PATTERNS: ClassicPattern[] = [
  // 禄刃格（阳刃格只论阳干，阴干无真正羊刃）
  {
    id: 'lu-ren-yang',
    name: '阳刃格',
    description: '甲羊刃在卯，丙戊羊刃在午，庚羊刃在酉，壬羊刃在子。阴干不论阳刃。羊刃帮身有力，但需官杀制伏方为贵。',
    conditions: {
      dayStems: ['甲', '丙', '戊', '庚', '壬'],
      monthBranch: ['卯', '午', '酉', '子'],
      exactMonthBranchMap: { '甲': '卯', '丙': '午', '戊': '午', '庚': '酉', '壬': '子' },
      otherConditions: ['羊刃透出', '羊刃当令'],
      excludePatterns: ['从财格', '从杀格', '从儿格', '从势格']
    },
    favorableWuxing: ['官', '杀'],
    unfavorableWuxing: ['刃', '比'],
    level: '上等'
  },
  {
    id: 'lu-ren-lu',
    name: '建禄格',
    description: '日干与月支同气，如甲木生寅月。建禄自旺，不祖则兄，主辛苦创业。',
    conditions: {
      dayStems: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
      monthBranch: ['寅', '卯', '巳', '午', '申', '酉', '亥', '子'],
      exactMonthBranchMap: { '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳', '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子' },
      otherConditions: ['日干与月支同气', '月令司权'],
      excludePatterns: ['从财格', '从杀格', '从儿格', '从势格']
    },
    favorableWuxing: ['财', '官', '食'],
    unfavorableWuxing: ['印', '比'],
    level: '中等'
  },

  // 金神格
  {
    id: 'jin-shen',
    name: '金神格',
    description: '甲己日生乙丑、己巳、癸酉三时。金神入格，性情刚烈，多主武贵。忌火乡运行，喜水木运。',
    conditions: {
      dayStems: ['甲', '己'],
      otherConditions: ['时柱为乙丑', '时柱为己巳', '时柱为癸酉']
    },
    favorableWuxing: ['水', '木'],
    unfavorableWuxing: ['火'],
    level: '上等'
  },

  // 井栏叉格
  {
    id: 'jing-lan-cha',
    name: '井栏叉格',
    description: '庚申、庚子、庚辰三柱重逢，天干三庚、地支申子辰三合水局。忌丙丁火破局，喜水木清华。主清贵富足。',
    conditions: {
      dayStems: ['庚'],
      otherConditions: ['天干三庚', '申子辰三合水局']
    },
    favorableWuxing: ['水', '木'],
    unfavorableWuxing: ['火', '土'],
    level: '极品'
  },

  // 癸丁格
  {
    id: 'gui-ding',
    name: '癸丁格',
    description: '癸日见丁巳时。癸水遇丁火财星坐巳，财官双美。忌亥冲巳破局，喜金水相辅。',
    conditions: {
      dayStems: ['癸'],
      otherConditions: ['时柱为丁巳']
    },
    favorableWuxing: ['金', '水'],
    unfavorableWuxing: ['木', '土'],
    level: '上等'
  },

  // 壬骑龙背格
  {
    id: 'ren-qi-long',
    name: '壬骑龙背格',
    description: '壬辰日生，辰为水库，壬水得辰中癸水帮扶。多见辰字更贵，忌戌冲辰破局。主大富大贵。',
    conditions: {
      dayStems: ['壬'],
      otherConditions: ['日柱为壬辰']
    },
    favorableWuxing: ['水', '木'],
    unfavorableWuxing: ['土', '戌'],
    level: '极品'
  },

  // 六阴朝阳格
  {
    id: 'liu-yin-chao-yang',
    name: '六阴朝阳格',
    description: '辛日见戊子时。六阴至子而朝阳，辛金得戊土生扶、子水润泽。忌午冲子破局，忌丙丁火出干混局。主清贵。',
    conditions: {
      dayStems: ['辛'],
      otherConditions: ['时柱为戊子']
    },
    favorableWuxing: ['金', '水'],
    unfavorableWuxing: ['火', '午'],
    level: '上等'
  },

  // 仁者变德格
  {
    id: 'ren-zhe-bian-de',
    name: '仁者变德格',
    description: '甲己日见亥月，亥为甲木长生、己土胞胎。甲己合而化德，仁而有守。忌刑冲破害，喜官印相生。',
    conditions: {
      dayStems: ['甲', '己'],
      monthBranch: ['亥'],
      otherConditions: ['亥中壬水发用', '亥水当令']
    },
    favorableWuxing: ['水', '木'],
    unfavorableWuxing: ['金'],
    level: '上等'
  },

  // 润下格
  {
    id: 'run-xia',
    name: '润下格',
    description: '壬癸日见亥子丑三会水局或申子辰三合水局，水势泛滥。忌土来制水，喜木泄水为用。',
    conditions: {
      dayStems: ['壬', '癸'],
      otherConditions: ['亥子丑三会水局', '三合水局', '水势旺盛'],
      excludePatterns: ['从财格', '从杀格', '从儿格', '从势格']
    },
    favorableWuxing: ['木', '火'],
    unfavorableWuxing: ['土'],
    level: '极品'
  },

  // 炎上格
  {
    id: 'yan-shang',
    name: '炎上格',
    description: '丙丁日见巳午未三会火局。火势炎上，忌水来破局，喜木火相助。',
    conditions: {
      dayStems: ['丙', '丁'],
      otherConditions: ['巳午未三会火局', '火势旺盛'],
      excludePatterns: ['从财格', '从杀格', '从儿格', '从势格']
    },
    favorableWuxing: ['木', '火'],
    unfavorableWuxing: ['水'],
    level: '极品'
  },

  // 从革格
  {
    id: 'cong-ge',
    name: '从革格',
    description: '庚辛日见申酉戌三会金局。金气纯粹，忌火来克金，喜土金相助。',
    conditions: {
      dayStems: ['庚', '辛'],
      otherConditions: ['申酉戌三会金局', '金势旺盛'],
      excludePatterns: ['从财格', '从杀格', '从儿格', '从势格']
    },
    favorableWuxing: ['土', '金'],
    unfavorableWuxing: ['火', '木'],
    level: '极品'
  },

  // 曲直格
  {
    id: 'qu-zhi',
    name: '曲直格',
    description: '甲乙日见寅卯辰三会木局。木性曲直，忌金来克木，喜水木相助。',
    conditions: {
      dayStems: ['甲', '乙'],
      otherConditions: ['寅卯辰三会木局', '木势旺盛'],
      excludePatterns: ['从财格', '从杀格', '从儿格', '从势格']
    },
    favorableWuxing: ['水', '木'],
    unfavorableWuxing: ['金'],
    level: '极品'
  },

  // 稼穑格
  {
    id: 'jia-se',
    name: '稼穑格',
    description: '戊己日见辰戌丑未全局。土性厚重，忌木来克土，喜火土相助。',
    conditions: {
      dayStems: ['戊', '己'],
      otherConditions: ['辰戌丑未全', '土势旺盛'],
      excludePatterns: ['从财格', '从杀格', '从儿格', '从势格']
    },
    favorableWuxing: ['火', '土'],
    unfavorableWuxing: ['木', '水'],
    level: '极品'
  },

  // ==================== 时柱取格 ====================

  // 飞天禄马格
  {
    id: 'fei-tian-lu-ma',
    name: '飞天禄马格',
    description: '庚日子时或壬日子时。庚禄在申、壬禄在亥，借子位暗冲丙火官星、午火财星。忌丙丁巳午填实，喜金水助之。主大贵。',
    conditions: {
      dayStems: ['庚', '壬'],
      otherConditions: ['时柱为丙子', '时柱为庚子']
    },
    favorableWuxing: ['金', '水'],
    unfavorableWuxing: ['火', '土'],
    level: '极品'
  },

  // 乙己鼠贵格
  {
    id: 'yi-ji-shu-gui',
    name: '乙己鼠贵格',
    description: '乙日或己日见丙子时。乙己阴柔，夜生得子时为贵。忌午冲子破局，忌丑合子散局。主名利双收。',
    conditions: {
      dayStems: ['乙', '己'],
      otherConditions: ['时柱为丙子']
    },
    favorableWuxing: ['水', '木'],
    unfavorableWuxing: ['火', '午'],
    level: '上等'
  },

  // 刑冲得禄格
  {
    id: 'xing-chong-de-lu',
    name: '刑冲得禄格',
    description: '日干禄神逢刑冲而得用。如甲日见寅被申冲，反得申中庚金为官。刑冲得禄，因祸得福。忌禄神被合住失效。',
    conditions: {
      dayStems: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'],
      otherConditions: ['禄神逢冲']
    },
    favorableWuxing: ['官', '杀'],
    unfavorableWuxing: ['比', '劫'],
    level: '上等'
  },

  // 倒冲格
  {
    id: 'dao-chong',
    name: '倒冲格',
    description: '丙日见午多或丁日见巳多，火势极旺，反冲子水为官。忌壬癸亥子填实，喜火旺助冲。主异路功名。',
    conditions: {
      dayStems: ['丙', '丁'],
      otherConditions: ['地支多午', '地支多巳']
    },
    favorableWuxing: ['火', '木'],
    unfavorableWuxing: ['水'],
    level: '上等'
  },

  // 夹丘格
  {
    id: 'jia-qiu',
    name: '夹丘格',
    description: '戊己日生辰戌时或丑未时，两库夹日。土得库藏，财富丰厚。忌木来克破，喜火生土。',
    conditions: {
      dayStems: ['戊', '己'],
      otherConditions: ['时支见辰', '时支见戌', '时支见丑', '时支见未']
    },
    favorableWuxing: ['火', '土'],
    unfavorableWuxing: ['木'],
    level: '中等'
  },

  // ==================== 化气格 ====================

  {
    id: 'hua-qi-tu',
    name: '甲己化土格',
    description: '甲己合化土，月令辰戌丑未土旺之地，天干甲己同透，无乙庚争合破局。化气纯粹则贵，喜火土生扶，忌木克土破化。',
    conditions: {
      dayStems: ['甲', '己'],
      monthBranch: ['辰', '戌', '丑', '未'],
      otherConditions: ['甲己同透', '无乙庚争合']
    },
    favorableWuxing: ['火', '土'],
    unfavorableWuxing: ['木', '水'],
    level: '极品'
  },
  {
    id: 'hua-qi-jin',
    name: '乙庚化金格',
    description: '乙庚合化金，月令巳酉丑或申酉戌金旺之地，天干乙庚同透，无丙辛争合破局。化气纯粹则贵，喜土金生扶，忌火克金破化。',
    conditions: {
      dayStems: ['乙', '庚'],
      monthBranch: ['巳', '酉', '丑', '申', '戌'],
      otherConditions: ['乙庚同透', '无丙辛争合']
    },
    favorableWuxing: ['土', '金'],
    unfavorableWuxing: ['火', '木'],
    level: '极品'
  },
  {
    id: 'hua-qi-shui',
    name: '丙辛化水格',
    description: '丙辛合化水，月令申子辰或亥子丑水旺之地，天干丙辛同透，无丁壬争合破局。化气纯粹则贵，喜金水生扶，忌土克水破化。',
    conditions: {
      dayStems: ['丙', '辛'],
      monthBranch: ['申', '子', '辰', '亥', '丑'],
      otherConditions: ['丙辛同透', '无丁壬争合']
    },
    favorableWuxing: ['金', '水'],
    unfavorableWuxing: ['土', '火'],
    level: '极品'
  },
  {
    id: 'hua-qi-mu',
    name: '丁壬化木格',
    description: '丁壬合化木，月令亥卯未或寅卯辰木旺之地，天干丁壬同透，无戊癸争合破局。化气纯粹则贵，喜水木生扶，忌金克木破化。',
    conditions: {
      dayStems: ['丁', '壬'],
      monthBranch: ['亥', '卯', '未', '寅', '辰'],
      otherConditions: ['丁壬同透', '无戊癸争合']
    },
    favorableWuxing: ['水', '木'],
    unfavorableWuxing: ['金', '土'],
    level: '极品'
  },
  {
    id: 'hua-qi-huo',
    name: '戊癸化火格',
    description: '戊癸合化火，月令寅午戌或巳午未火旺之地，天干戊癸同透，无甲己争合破局。化气纯粹则贵，喜木火生扶，忌水克火破化。',
    conditions: {
      dayStems: ['戊', '癸'],
      monthBranch: ['寅', '午', '戌', '巳', '未'],
      otherConditions: ['戊癸同透', '无甲己争合']
    },
    favorableWuxing: ['木', '火'],
    unfavorableWuxing: ['水', '金'],
    level: '极品'
  }
]

/**
 * 识别经典格局
 */
export function identifyClassicPattern(
  dayStem: string,
  monthBranch: string,
  pillars: BaziChartResult['pillars'],
  hiddenStems: BaziChartResult['hiddenStems'],
  currentPattern?: string
): ClassicPattern | null {
  for (const pattern of CLASSIC_PATTERNS) {
    // 检查日干条件
    if (pattern.conditions.dayStems && !pattern.conditions.dayStems.includes(dayStem)) {
      continue
    }

    // 检查月令条件
    if (pattern.conditions.monthBranch && !pattern.conditions.monthBranch.includes(monthBranch)) {
      continue
    }

    // 精确月支映射校验（阳刃格专用：日干必须与月支严格对应）
    if (pattern.conditions.exactMonthBranchMap) {
      const requiredBranch = pattern.conditions.exactMonthBranchMap[dayStem]
      if (!requiredBranch || monthBranch !== requiredBranch) {
        continue
      }
    }

    // 从格排除校验（阳刃格等身旺格局，在从格命局中不应成立）
    if (pattern.conditions.excludePatterns && currentPattern) {
      if (pattern.conditions.excludePatterns.includes(currentPattern)) {
        continue
      }
    }

    // 检查其他条件
    if (pattern.conditions.otherConditions) {
      let conditionsMet = true
      for (const condition of pattern.conditions.otherConditions) {
        if (!checkCondition(condition, dayStem, pillars, hiddenStems)) {
          conditionsMet = false
          break
        }
      }
      if (!conditionsMet) continue
    }

    return pattern
  }

  return null
}

/**
 * 检查四柱地支中是否包含指定的地支组合
 */
function branchesContain(
  pillars: BaziChartResult['pillars'],
  requiredBranches: string[],
  requireAll: boolean = true
): boolean {
  const allBranches = [
    pillars.year.zhi,
    pillars.month.zhi,
    pillars.day.zhi,
    pillars.hour.zhi,
  ]
  if (requireAll) {
    return requiredBranches.every(b => allBranches.includes(b))
  }
  return requiredBranches.some(b => allBranches.includes(b))
}

/**
 * 地支相冲映射（从 BASIC_MAPPINGS.DI_ZHI_CHONG 派生）
 */
const ZHI_CHONG_MAP = BASIC_MAPPINGS.DI_ZHI_CHONG

/**
 * 统一的条件检查函数
 * 覆盖经典格局中 allConditions 的各种类型
 */
function checkCondition(
  condition: string,
  dayStem: string,
  pillars: BaziChartResult['pillars'],
  hiddenStems: BaziChartResult['hiddenStems']
): boolean {
  const allBranches = [pillars.year.zhi, pillars.month.zhi, pillars.day.zhi, pillars.hour.zhi]
  const allStems = [pillars.year.gan, pillars.month.gan, pillars.day.gan, pillars.hour.gan]

  // 1. 三合局
  if (condition.includes('三合')) {
    const wuxingSanheMap: Record<string, string> = {
      '三合金': '巳酉丑', '三合水': '申子辰', '三合木': '亥卯未', '三合火': '寅午戌'
    }
    for (const [keyword, key] of Object.entries(wuxingSanheMap)) {
      if (condition.includes(keyword)) {
        return branchesContain(pillars, SAN_HE_MAP[key])
      }
    }
    // 泛化三合：任意三合即可
    for (const branches of Object.values(SAN_HE_MAP)) {
      if (branchesContain(pillars, branches)) return true
    }
    return false
  }

  // 2. 三会局
  if (condition.includes('三会')) {
    const wuxingSanhuiMap: Record<string, string> = {
      '三会水': '亥子丑', '三会木': '寅卯辰', '三会火': '巳午未', '三会金': '申酉戌'
    }
    for (const [keyword, key] of Object.entries(wuxingSanhuiMap)) {
      if (condition.includes(keyword)) {
        return branchesContain(pillars, SAN_HUI_MAP[key])
      }
    }
    // 泛化三会：任意三会即可
    for (const branches of Object.values(SAN_HUI_MAP)) {
      if (branchesContain(pillars, branches)) return true
    }
    return false
  }

  // 3. 辰戌丑未全
  if (condition.includes('辰戌丑未') || condition.includes('四库')) {
    return branchesContain(pillars, SI_KU)
  }

  // 4. 地支冲（如"午子冲"）
  const chongMatch = condition.match(/([子丑寅卯辰巳午未申酉戌亥])([子丑寅卯辰巳午未申酉戌亥])冲/)
  if (chongMatch) {
    const b1 = chongMatch[1]
    const b2 = chongMatch[2]
    return allBranches.includes(b1) && allBranches.includes(b2)
  }

  // 5. 时柱干支（如"时柱为乙丑"、"时柱为己巳"、"时柱为癸酉"）
  const shiZhuMatch = condition.match(/时柱为([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])/)
  if (shiZhuMatch) {
    return pillars.hour.gan === shiZhuMatch[1] && pillars.hour.zhi === shiZhuMatch[2]
  }

  // 6. 时支见某地支（如"时支见酉"）
  const shiZhiMatch = condition.match(/时支见([子丑寅卯辰巳午未申酉戌亥])/)
  if (shiZhiMatch) {
    return pillars.hour.zhi === shiZhiMatch[1]
  }

  // 7. 日支见某地支（如"日支见辰"）
  const riZhiMatch = condition.match(/日支见([子丑寅卯辰巳午未申酉戌亥])/)
  if (riZhiMatch) {
    return pillars.day.zhi === riZhiMatch[1]
  }

  // 7.5 日柱为某干支（如"日柱为壬辰"）
  const riZhuMatch = condition.match(/日柱为([甲乙丙丁戊己庚辛壬癸])([子丑寅卯辰巳午未申酉戌亥])/)
  if (riZhuMatch) {
    return pillars.day.gan === riZhuMatch[1] && pillars.day.zhi === riZhuMatch[2]
  }

  // 8. 见某地支（如"见酉"、"见丑"）
  const jianZhiMatch = condition.match(/见([子丑寅卯辰巳午未申酉戌亥])/)
  if (jianZhiMatch) {
    return allBranches.includes(jianZhiMatch[1])
  }

  // 9. 天干透出（如"丁火透干"、"壬水发用"）
  const touGanMatch = condition.match(/([甲乙丙丁戊己庚辛壬癸])[金木水火土]?透干/)
  if (touGanMatch) {
    return allStems.includes(touGanMatch[1])
  }

  // 10. 天干发用（如"壬水发用"、"亥中壬水发用"）
  const faYongMatch = condition.match(/([甲乙丙丁戊己庚辛壬癸])[金木水火土]?发用/)
  if (faYongMatch) {
    return allStems.includes(faYongMatch[1])
  }

  // 11. 当令/旺盛/势旺——这些条件由月令和旺衰分析决定，经典格局识别阶段视为满足
  //    （经典格局识别是辅助性提示，实际格局由 determinePattern 核心算法决定）
  if (condition.includes('当令') || condition.includes('旺盛') || condition.includes('势旺')) {
    return true
  }

  // 12. 日干与月支同气——已有 exactMonthBranchMap 精确校验，此处降级为 true
  if (condition.includes('日干与月支同气') || condition.includes('月令司权')) {
    return true
  }

  // 13. 羊刃透出/羊刃当令——已被 exactMonthBranchMap 和 excludePatterns 处理
  if (condition.includes('羊刃')) {
    return true
  }

  // 15. 天干多某干（如"天干三庚"——四柱中至少三个天干为某字）
  const tianGanDuoMatch = condition.match(/天干三([甲乙丙丁戊己庚辛壬癸])/)
  if (tianGanDuoMatch) {
    const targetGan = tianGanDuoMatch[1]
    const count = allStems.filter(s => s === targetGan).length
    return count >= 3
  }

  // 16. 禄神逢冲（日干禄位在地支中被冲）
  if (condition.includes('禄神逢冲')) {
    const luZhi = LU_BRANCH_MAP[dayStem]
    if (luZhi && allBranches.includes(luZhi)) {
      const chongZhi = ZHI_CHONG_MAP[luZhi]
      return chongZhi ? allBranches.includes(chongZhi) : false
    }
    return false
  }

  // 17. 地支多某字（如"地支多午"、"地支多巳"——至少两个）
  const diZhiDuoMatch = condition.match(/地支多([子丑寅卯辰巳午未申酉戌亥])/)
  if (diZhiDuoMatch) {
    const targetZhi = diZhiDuoMatch[1]
    const count = allBranches.filter(b => b === targetZhi).length
    return count >= 2
  }

  // 18. 天干五合同透（化气格专用：如"甲己同透"、"乙庚同透"）
  const wuHeMatch = condition.match(/([甲乙丙丁戊己庚辛壬癸])([甲乙丙丁戊己庚辛壬癸])同透/)
  if (wuHeMatch) {
    const g1 = wuHeMatch[1]
    const g2 = wuHeMatch[2]
    return allStems.includes(g1) && allStems.includes(g2)
  }

  // 19. 无争合（化气格专用：如"无乙庚争合"、"无丙辛争合"）
  const noZhengHeMatch = condition.match(/无([甲乙丙丁戊己庚辛壬癸])([甲乙丙丁戊己庚辛壬癸])争合/)
  if (noZhengHeMatch) {
    const g1 = noZhengHeMatch[1]
    const g2 = noZhengHeMatch[2]
    return !(allStems.includes(g1) && allStems.includes(g2))
  }

  // 20. 其他未知条件——保守不匹配
  return false
}

// ==================== 神煞系统扩充 ====================

/**
 * 桃花详细类型
 */
interface PeachBlossomDetail {
  type: '墙内桃花' | '墙外桃花' | '普通桃花'
  position: string
  description: string
  favorable: string
  unfavorable: string
}

/**
 * 桃花详细规则
 */
const PEACH_BLOSSOM_DETAILS: Record<string, PeachBlossomDetail> = {
  '墙内桃花': {
    type: '墙内桃花',
    position: '日支（夫妻宫）、年柱',
    description: '墙内桃花指在日支（夫妻宫）或年柱的桃花。日支为夫妻宫，桃花在夫妻宫内，主正当的夫妻感情，主配偶有魅力、感情丰富。年柱桃花多主祖上或早年异性缘。',
    favorable: '婚姻内感情和谐，配偶有魅力，利于夫妻关系',
    unfavorable: '需防配偶异性缘过旺'
  },
  '墙外桃花': {
    type: '墙外桃花',
    position: '时柱、月柱',
    description: '墙外桃花指在时柱或月柱的桃花。时柱为子女宫、晚运，月柱为事业宫、社会宫，桃花在此主外部社交中的异性缘，容易招惹婚外桃花，需谨慎对待。',
    favorable: '异性缘佳，社交魅力出众，利于演艺、文艺等职业',
    unfavorable: '感情易有纠纷，需防婚外情，需谨慎对待感情'
  },
  '普通桃花': {
    type: '普通桃花',
    position: '其他位置',
    description: '普通桃花指神煞桃花在一般位置，影响力适中。',
    favorable: '有一定的异性缘',
    unfavorable: '需适度把握'
  }
}

/**
 * 获取桃花的详细分类
 */
export function getPeachBlossomDetail(
  pillarPosition: 'year' | 'month' | 'day' | 'hour'
): PeachBlossomDetail {
  // 传统说法：日支为夫妻宫，桃花在日支为墙内桃花；
  // 年柱代表祖上根基，桃花在年柱也属墙内；
  // 时柱（子女宫/晚运）和月柱（社会宫）的桃花为墙外桃花
  if (pillarPosition === 'day' || pillarPosition === 'year') {
    return PEACH_BLOSSOM_DETAILS['墙内桃花']
  } else if (pillarPosition === 'month' || pillarPosition === 'hour') {
    return PEACH_BLOSSOM_DETAILS['墙外桃花']
  }
  return PEACH_BLOSSOM_DETAILS['普通桃花']
}

/**
 * 寿元分析
 */
interface LifespanAnalysis {
  hasNayinHint: boolean        // 纳音是否有寿元暗示
  nayinLifespan: string        // 纳音寿命等级
  hasYunxianHint: boolean       // 是否有运限暗示
  riskPeriods: string[]        // 风险时段
  protectiveFactors: string[]  // 保护因素
}

const NAYIN_LIFESPAN_MAP: Record<string, '长寿' | '中等' | '需注意'> = {
  // 长寿纳音：水木清秀、金水相生之象
  '大林木': '长寿', '涧下水': '长寿', '泉中水': '长寿', '天河水': '长寿',
  '松柏木': '长寿', '长流水': '长寿', '大溪水': '长寿', '平地木': '长寿',

  // 需注意纳音：土重、火烈之象
  '路旁土': '需注意', '屋上土': '需注意', '大驿土': '需注意',
  '山头火': '需注意', '霹雳火': '需注意', '天上火': '需注意',
  '沙中土': '需注意',

  // 中等纳音
  '海中金': '中等', '炉中火': '中等', '城头土': '中等', '白蜡金': '中等',
  '杨柳木': '中等', '剑锋金': '中等', '覆灯火': '中等', '山下火': '中等',
  '金箔金': '中等', '壁上土': '中等', '钗钏金': '中等', '桑柘木': '中等',
  '沙中金': '中等', '石榴木': '中等', '大海水': '中等',
}

/**
 * 天赦日详细信息
 */
const TIAN_SHE_DAYS = {
  '春': '戊寅日',
  '夏': '甲午日',
  '秋': '戊申日',
  '冬': '甲子日'
}

/**
 * 天德贵人详细月支映射
 * 与 baziShenSha.ts 中天德贵人计算口径对齐：
 * 正月(寅)→丁, 二月(卯)→申, 三月(辰)→壬, 四月(巳)→辛,
 * 五月(午)→亥, 六月(未)→甲, 七月(申)→癸, 八月(酉)→寅,
 * 九月(戌)→丙, 十月(亥)→乙, 十一月(子)→巳, 十二月(丑)→庚
 */
const TIAN_DE_MAPPINGS: Record<string, string> = {
  '寅': '丁', '卯': '申', '辰': '壬', '巳': '辛',
  '午': '亥', '未': '甲', '申': '癸', '酉': '寅',
  '戌': '丙', '亥': '乙', '子': '巳', '丑': '庚'
}

/**
 * 月德贵人详细月支
 */
const YUE_DE_MAPPINGS: Record<string, string> = {
  '寅': '丙', '卯': '甲', '辰': '壬', '巳': '庚',
  '午': '丙', '未': '甲', '申': '壬', '酉': '庚',
  '戌': '丙', '亥': '甲', '子': '壬', '丑': '庚'
}

// ==================== 命局深度分析维度 ====================

/**
 * 伏吟反吟分析
 */
interface FuxinAnalysis {
  hasFuxin: boolean
  fuxinPositions: string[]        // 伏吟位置
  fuxinImpact: string              // 影响
  hasFanxin: boolean
  fanxinPositions: string[]       // 反吟位置
  fanxinImpact: string             // 影响
}

/**
 * 判断伏吟反吟
 * 伏吟：两柱天干地支完全相同（如年柱甲子、月柱甲子）
 * 反吟：两柱天克地冲（天干相克且地支相冲）
 */
function analyzeFuxinFanxin(pillars: BaziChartResult['pillars']): FuxinAnalysis {
  const result: FuxinAnalysis = {
    hasFuxin: false,
    fuxinPositions: [],
    fuxinImpact: '',
    hasFanxin: false,
    fanxinPositions: [],
    fanxinImpact: ''
  }

  if (!pillars) return result

  const pillarEntries: [string, { gan: string; zhi: string; ganZhi: string }][] = [
    ['年柱', pillars.year],
    ['月柱', pillars.month],
    ['日柱', pillars.day],
    ['时柱', pillars.hour],
  ]

  // 天干相克映射（七杀关系：甲→庚、乙→辛、丙→壬、丁→癸、戊→甲、己→乙、庚→丙、辛→丁、壬→戊、癸→己）
  const ganKeMap: Record<string, string> = {
    '甲': '庚', '乙': '辛', '丙': '壬', '丁': '癸',
    '戊': '甲', '己': '乙', '庚': '丙', '辛': '丁',
    '壬': '戊', '癸': '己',
  }

  // 地支相冲映射（复用全局 ZHI_CHONG_MAP）
  const zhiChongMap = ZHI_CHONG_MAP

  for (let i = 0; i < pillarEntries.length; i++) {
    for (let j = i + 1; j < pillarEntries.length; j++) {
      const [label1, pillar1] = pillarEntries[i]
      const [label2, pillar2] = pillarEntries[j]

      // 伏吟：干支完全相同
      if (pillar1.ganZhi === pillar2.ganZhi) {
        result.hasFuxin = true
        result.fuxinPositions.push(`${label1}与${label2}`)
      }

      // 反吟：天克地冲（天干相克且地支相冲）
      const ganClash = ganKeMap[pillar1.gan] === pillar2.gan || ganKeMap[pillar2.gan] === pillar1.gan
      const zhiClash = zhiChongMap[pillar1.zhi] === pillar2.zhi
      if (ganClash && zhiClash) {
        result.hasFanxin = true
        result.fanxinPositions.push(`${label1}与${label2}`)
      }
    }
  }

  // 伏吟影响
  if (result.hasFuxin) {
    const impacts: string[] = []
    if (result.fuxinPositions.some(p => p.includes('年') && p.includes('月'))) {
      impacts.push('早年奔波，父母多有变动')
    }
    if (result.fuxinPositions.some(p => p.includes('日') && p.includes('时'))) {
      impacts.push('晚年孤寂，子女多变动')
    }
    if (result.fuxinPositions.some(p => p.includes('年') && p.includes('日'))) {
      impacts.push('自身重复之象，做事多反复')
    }
    result.fuxinImpact = impacts.join('；') || '主变动、重复、拖延'
  }

  // 反吟影响
  if (result.hasFanxin) {
    const impacts: string[] = []
    if (result.fanxinPositions.some(p => p.includes('年') && p.includes('日'))) {
      impacts.push('祖孙三代不合，自身多波折')
    }
    if (result.fanxinPositions.some(p => p.includes('月') && p.includes('时'))) {
      impacts.push('兄弟姐妹不和，晚年孤独')
    }
    if (result.fanxinPositions.some(p => p.includes('年') && p.includes('月'))) {
      impacts.push('早年家庭动荡')
    }
    result.fanxinImpact = impacts.join('；') || '主动荡、反复、克害'
  }

  return result
}

/**
 * 空亡详解
 */
interface KongWangDetail {
  hasKongWang: boolean
  kongWangStems: string[]         // 空亡的天干
  kongWangBranches: string[]      // 空亡的地支
  impact: {
    personality: string            // 对性格影响
    career: string                // 对事业影响
    relationship: string          // 对感情影响
    fortune: string              // 对财运影响
  }
}

/**
 * 刑冲合会破综合分析
 */
interface XingChongHeHuiAnalysis {
  hasHe: boolean
  heDetails: { pillars: string; content: string; impact: string }[]
  hasChong: boolean
  chongDetails: { pillars: string; content: string; impact: string }[]
  hasXing: boolean
  xingDetails: { pillars: string; content: string; impact: string }[]
  hasPo: boolean
  poDetails: { pillars: string; content: string; impact: string }[]
  overallImpact: string
}

/**
 * 限运分析
 */
export interface PeriodAnalysis {
  earlyStage: {    // 少年（1-16岁）
    description: string
    focus: string[]
    tips: string[]
  }
  midStage: {      // 青年中年（17-45岁）
    description: string
    focus: string[]
    tips: string[]
  }
  lateStage: {     // 中老年（46岁以后）
    description: string
    focus: string[]
    tips: string[]
  }
}

/**
 * 生成限运分析
 */
export function generatePeriodAnalysis(
  pattern: PatternAnalysis,
  strengthStatus: string,
  dayStem: string
): PeriodAnalysis {
  const base = pattern.isSpecial ? '特殊格局' : pattern.pattern
  const baseTips = pattern.isSpecial
    ? ['顺势而行', '化敌为友']
    : strengthStatus.includes('强')
      ? ['抑制过旺', '泄秀为用']
      : ['扶助过弱', '生身为用']

  return {
    earlyStage: {
      description: '少年时期，多受父母、长辈影响，性格形成阶段。',
      focus: ['学业发展', '性格培养', '身体健康'],
      tips: ['打好学习基础', '培养良好习惯', '注意安全']
    },
    midStage: {
      description: '青中年时期，是人生事业、感情发展的关键阶段。',
      focus: ['事业发展', '感情婚姻', '财富积累'],
      tips: [...baseTips, '把握机遇', '稳健发展']
    },
    lateStage: {
      description: '中老年时期，注重健康养生、子女发展。',
      focus: ['身体健康', '子女缘分', '晚年规划'],
      tips: ['注重养生', '家庭和睦', '传承家风']
    }
  }
}

// ==================== 合盘分析维度 ====================

/**
 * 婚姻配对分析
 */
interface MarriageMatchAnalysis {
  wuxingMatch: {       // 五行匹配
    score: number      // 1-100分
    description: string
  }
  heMatch: {           // 合婚匹配
    score: number
    description: string
    matchedItems: string[]
  }
  chongMatch: {        // 冲克分析
    score: number
    description: string
    issues: string[]
  }
  taoHuaMatch: {       // 桃花匹配
    score: number
    description: string
  }
  overallScore: number
  conclusion: string
  suggestions: string[]
}

/**
 * 子女缘分分析
 */
interface ChildrenFateAnalysis {
  childStar: {         // 子女星状态
    shiShang: string   // 食神状态
    shangGuan: string  // 伤官状态
    overall: string
  }
  childPalace: {       // 子女宫状态
    position: string
    shensha: string[]
    analysis: string
  }
  timing: {            // 时机判断
    favorable: string[]
    unfavorable: string[]
  }
  gender: {           // 性别倾向
    boy: string
    girl: string
    analysis: string
  }
  education: string[]  // 教育建议
}

/**
 * 父母吉凶分析
 */
interface ParentsAnalysis {
  fatherStar: {        // 父亲星
    yinStar: string
    status: string
    analysis: string
  }
  motherStar: {       // 母亲星
    yinStar: string
    status: string
    analysis: string
  }
  parentsPalace: {     // 父母宫
    position: string
    analysis: string
  }
  healthRisk: string[] // 健康风险
  suggestions: string[]
}

/**
 * 兄弟朋友分析
 */
interface SiblingsAnalysis {
  biJieStar: {        // 兄弟星
    biShan: string
    jieCai: string
    status: string
  }
  siblingCount: string // 兄弟姐妹数
  siblingRelation: string // 关系倾向
  helpfulSiblings: string[] // 帮助型
  conflictingSiblings: string[] // 冲突型
  suggestions: string[]
}

// ==================== 提示词增强 ====================

/**
 * 生成增强的分析维度提示词片段
 */
export function generateAnalysisDimensionHints(
  dimension: 'fuxin' | 'kongwang' | 'xingchong' | 'period' | 'lifespan'
): string {
  const hints: Record<string, string> = {
    fuxin: `【伏吟反吟】伏吟（同柱重复）主变动拖延：年月→早年奔波、日时→晚年孤寂；反吟（天克地冲）主动荡克害：年日→自身波折、月时→晚年孤独。分析伏吟反吟对婚姻、事业、财运的具体影响。`,

    kongwang: `【空亡详解】空亡五行代表命主最缺能量，需后天补充。年空→祖上无缘，月空→机遇难握，日空→配偶缘浅、才华难展，时空→子女缘薄。分析空亡对性格、事业、感情、财运的影响。`,

    xingchong: `【刑冲合会破】合（三合/六合）主和谐凝聚，冲（天克地冲最烈）主变动分离，刑（三刑、自刑）主是非伤害，会主力量凝聚，破主损失破裂。综合分析刑冲合会破对命局的影响。`,

    period: `【限运分析】少年(1-16)：学业、性格、健康；中青年(17-45)：事业、婚姻、财富；中老年(46+)：养生、子女、晚年规划。分析各阶段重点任务。`,

    lifespan: `【寿元分析】纳音：长寿类(大林木/长流水/松柏木等)、需注意类(路旁土/大驿土等)；风险期：大运冲克命局、流年叠大运不吉时；保护：用神得力、贵人护身。综合判断健康风险和养生建议。`
  }

  return hints[dimension] || ''
}

/**
 * 生成婚姻配对分析提示词
 */
export function generateMarriageMatchHints(): string {
  return `【婚姻配对】1.五行互补 2.合婚(六合/三合/六冲/相刑) 3.桃花配合 4.用神互补 5.大运同步。分析匹配度、相处模式、矛盾点。`
}

/**
 * 生成子女缘分分析提示词
 */
export function generateChildrenFateHints(): string {
  return `【子女缘分】1.子女星(食神→女、伤官→男) 2.子女宫时柱(神煞/空亡) 3.时柱旺衰 4.生育时机(食伤透利生育/官杀混杂需择时)。分析子女缘分、性格、教育重点。`
}

/**
 * 生成父母吉凶分析提示词
 */
export function generateParentsAnalysisHints(): string {
  return `【父母吉凶】1.父母星(父:偏财/母:正印) 2.父母宫年柱(神煞/刑冲) 3.健康(印星→母/财星→父/岁运克应)。分析父母缘分、健康风险、赡养时机。`
}

/**
 * 生成兄弟朋友分析提示词
 */
export function generateSiblingsAnalysisHints(): string {
  return `【兄弟朋友】1.兄弟星(比肩同/劫财异) 2.数量(纳音+旺衰) 3.关系(为用互助/为忌相争) 4.朋友类型(用神十神/贵人方位)。分析兄弟缘分、人际、交友建议。`
}
