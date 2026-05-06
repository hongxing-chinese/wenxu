/**
 * 八字神煞计算模块
 * 统一采用当前项目固定口径的神煞计算逻辑
 */

import { BASIC_MAPPINGS } from './baziDefinitions'
import type { ShenShaResult } from './baziTypes'

type BaziArray = [string, string][];
type PillarKey = 'year' | 'month' | 'day' | 'hour';

/**
 * 神煞计算器
 */
export class ShenShaCalculator {
  private ctg: readonly string[]
  private cdz: readonly string[]

  constructor() {
    this.ctg = BASIC_MAPPINGS.HEAVENLY_STEMS
    this.cdz = BASIC_MAPPINGS.EARTHLY_BRANCHES
  }

  /**
   * 获取地支索引
   */
  private zhiIdx(zhi: string): number {
    return this.cdz.indexOf(zhi)
  }

  /**
   * 计算所有神煞
   */
  public calculateAllShenSha(baziArray: BaziArray, gender: string): ShenShaResult {
    const result: ShenShaResult = {
      year: [],
      month: [],
      day: [],
      hour: []
    }
    const pillars: PillarKey[] = ['year', 'month', 'day', 'hour']

    baziArray.forEach((pillar, index) => {
      const [gan, zhi] = pillar
      const shenShaList = this.calculatePillarShenSha(
        gan, zhi, index, baziArray, gender
      )
      result[pillars[index]] = shenShaList
    })

    const globalShenSha = this.calculateGlobalShenSha(baziArray)
    if (globalShenSha.length > 0) {
      result.global = globalShenSha
    }

    return result
  }

  public analyzeGlobalShenSha(shenShaList: string[]): string[] {
    const analysis: string[] = []

    if (shenShaList.includes('三奇贵人')) {
      analysis.push('整局天干顺布三奇，主悟性、机缘与贵人助力')
    }

    return analysis
  }

  private calculateGlobalShenSha(baziArray: BaziArray): string[] {
    const globalShenSha: string[] = []
    const gans = baziArray.map(([gan]) => gan)
    // 三奇贵人：天上三奇甲戊庚、地下三奇乙丙丁、人中三奇辛壬癸
    // 天干需按序出现，但允许间隔（不要求连续三柱）
    const sequences: string[][] = [
      ['甲', '戊', '庚'],  // 天上三奇
      ['乙', '丙', '丁'],  // 地下三奇
      ['辛', '壬', '癸']   // 人中三奇
    ]

    for (const seq of sequences) {
      let matchIdx = 0
      for (const g of gans) {
        if (g === seq[matchIdx]) matchIdx++
        if (matchIdx === seq.length) break
      }
      if (matchIdx === seq.length) {
        globalShenSha.push('三奇贵人')
        break
      }
    }

    return globalShenSha
  }

  /**
   * 结合十神的神煞分析 (高级分析)
   * 例如：驿马+偏财 = 动中求财；桃花+七杀 = 桃花劫
   */
  public analyzeShenShaWithTenGod(shenShaList: string[], tenGod: string): string[] {
    const analysis: string[] = []

    // 驿马互参
    if (shenShaList.includes('驿马')) {
      if (tenGod === '偏财') analysis.push('马奔财乡(动中求财)')
      if (tenGod === '正官' || tenGod === '七杀') analysis.push('马头带剑(威镇边疆或奔波劳碌)')
      if (tenGod === '食神' || tenGod === '伤官') analysis.push('艺术奔波')
      if (tenGod === '正印' || tenGod === '偏印') analysis.push('求学变动')
    }

    // 桃花互参
    if (shenShaList.includes('桃花')) {
      if (tenGod === '七杀') analysis.push('桃花带杀(因色生灾)')
      if (tenGod === '正官') analysis.push('桃花带官(因妻致富)')
      if (tenGod === '比肩' || tenGod === '劫财') analysis.push('桃花劫(因色破财)')
      if (tenGod === '正财' || tenGod === '偏财') analysis.push('财星桃花(异性缘带来财富)')
    }

    // 羊刃互参
    if (shenShaList.includes('羊刃')) {
      if (tenGod === '七杀') analysis.push('羊刃驾杀(掌兵权/威严)')
      if (tenGod === '正官') analysis.push('羊刃带官(掌权柄)')
      if (tenGod === '伤官') analysis.push('羊刃伤官(傲气/易惹是非)')
    }

    // 贵人互参
    if (shenShaList.includes('天乙贵人')) {
      if (tenGod === '食神') analysis.push('食神带贵(福禄丰厚)')
      if (tenGod === '正官') analysis.push('贵人带官(仕途顺遂)')
    }

    return analysis
  }

  /**
   * 计算单柱神煞
   */
  private calculatePillarShenSha(gan: string, zhi: string, pillarIndex: number, baziArray: BaziArray, gender: string): string[] {
    const results: string[] = []
    const [nianGan, nianZhi] = baziArray[0]
    const [, yueZhi] = baziArray[1]
    const [riGan, riZhi] = baziArray[2]
    const riGZ = riGan + riZhi
    const pillarGZ = gan + zhi
    const isMan = gender === 'male'

    // 神煞计算规则
    const rules: Record<string, () => boolean> = {
      // --- 贵人神煞 ---
      '天乙贵人': () => {
        const map: Record<string, string[]> = {
          '甲': ['丑', '未'], '戊': ['丑', '未'], '庚': ['寅', '午'], '己': ['子', '申'],
          '乙': ['子', '申'], '丙': ['亥', '酉'], '丁': ['亥', '酉'],
          '壬': ['卯', '巳'], '癸': ['卯', '巳'], '辛': ['寅', '午']
        }
        return (map[nianGan] && map[nianGan].includes(zhi)) || (map[riGan] && map[riGan].includes(zhi))
      },
      '太极贵人': () => {
        const map: Record<string, string[]> = {
          '甲': ['子', '午'], '乙': ['子', '午'], '丙': ['卯', '酉'], '丁': ['卯', '酉'],
          '戊': ['辰', '戌', '丑', '未'], '己': ['辰', '戌', '丑', '未'],
          '庚': ['寅', '亥'], '辛': ['寅', '亥'], '壬': ['巳', '申'], '癸': ['巳', '申']
        }
        return (map[nianGan] && map[nianGan].includes(zhi)) || (map[riGan] && map[riGan].includes(zhi))
      },
      '天德贵人': () => {
        const monthMap: Record<string, number> = { '寅':1, '卯':2, '辰':3, '巳':4, '午':5, '未':6, '申':7, '酉':8, '戌':9, '亥':10, '子':11, '丑':12 }
        const monthNum = monthMap[yueZhi]
        if (!monthNum) return false
        const tianDeTarget: string = ({ 1:'丁', 2:'申', 3:'壬', 4:'辛', 5:'亥', 6:'甲', 7:'癸', 8:'寅', 9:'丙', 10:'乙', 11:'巳', 12:'庚' } as Record<number, string>)[monthNum]
        return tianDeTarget === gan || tianDeTarget === zhi
      },
      '天德合': () => {
        const monthMap: Record<string, number> = { '寅':1, '卯':2, '辰':3, '巳':4, '午':5, '未':6, '申':7, '酉':8, '戌':9, '亥':10, '子':11, '丑':12 }
        const monthNum = monthMap[yueZhi]
        if (!monthNum) return false
        const tianDeHeTarget: string = ({ 1:'壬', 2:'巳', 3:'丁', 4:'丙', 5:'寅', 6:'己', 7:'戊', 8:'亥', 9:'辛', 10:'庚', 11:'申', 12:'乙' } as Record<number, string>)[monthNum]
        return tianDeHeTarget === gan || tianDeHeTarget === zhi
      },
      '月德贵人': () => {
        const map: Record<string, string> = { '寅':'丙', '午':'丙', '戌':'丙', '申':'壬', '子':'壬', '辰':'壬', '亥':'甲', '卯':'甲', '未':'甲', '巳':'庚', '酉':'庚', '丑':'庚' }
        return map[yueZhi] === gan
      },
      '月德合': () => {
        const yueDeGan: string = ({ '寅':'丙', '午':'丙', '戌':'丙', '申':'壬', '子':'壬', '辰':'壬', '亥':'甲', '卯':'甲', '未':'甲', '巳':'庚', '酉':'庚', '丑':'庚' } as Record<string, string>)[yueZhi]
        const heGanMap: Record<string, string> = {'甲':'己','乙':'庚','丙':'辛','丁':'壬','戊':'癸','己':'甲','庚':'乙','辛':'丙','壬':'丁','癸':'戊'}
        return heGanMap[yueDeGan] === gan
      },
      '福星贵人': () => {
        const map: Record<string, string[]> = {
          '甲': ['丙寅', '丙子'],
          '乙': ['丁丑', '丁亥'],
          '丙': ['戊子', '戊戌'],
          '丁': ['己亥', '己酉'],
          '戊': ['庚戌', '庚申'],
          '己': ['辛酉', '辛未'],
          '庚': ['壬申', '壬午'],
          '辛': ['癸未', '癸巳'],
          '壬': ['甲午', '甲辰'],
          '癸': ['乙巳', '乙卯']
        }
        return (map[nianGan] && map[nianGan].includes(pillarGZ)) || (map[riGan] && map[riGan].includes(pillarGZ))
      },
      '文昌贵人': () => {
        const map: Record<string, string> = { '甲':'巳', '乙':'午', '丙':'申', '丁':'酉', '戊':'申', '己':'酉', '庚':'亥', '辛':'子', '壬':'寅', '癸':'卯' }
        return (map[nianGan] === zhi) || (map[riGan] === zhi)
      },
      '国印贵人': () => {
        const map: Record<string, string> = { '甲':'戌', '乙':'亥', '丙':'丑', '丁':'寅', '戊':'丑', '己':'寅', '庚':'辰', '辛':'巳', '壬':'未', '癸':'申' }
        return (map[nianGan] === zhi) || (map[riGan] === zhi)
      },
      '学堂': () => {
        // 学堂取日干五行长生位，土长生在寅（火土同宫）
        const wuxingMap: Record<string, string> = { '木':'亥', '火':'寅', '土':'寅', '金':'巳', '水':'申' }
        const riGanWuxing = BASIC_MAPPINGS.STEM_WUXING[this.ctg.indexOf(riGan)]
        const nianGanWuxing = BASIC_MAPPINGS.STEM_WUXING[this.ctg.indexOf(nianGan)]
        return wuxingMap[riGanWuxing] === zhi || wuxingMap[nianGanWuxing] === zhi
      },
      '词馆': () => {
        const map: Record<string, string> = { '甲':'寅', '乙':'卯', '丙':'巳', '丁':'午', '戊':'巳', '己':'午', '庚':'申', '辛':'酉', '壬':'亥', '癸':'子' }
        return map[riGan] === zhi
      },
      '天厨贵人': () => {
        // 天厨贵人：食神临官禄位的天干在四柱中见对应地支
        // 食神：日干所生之同性天干
        const foodGodMap: Record<string, string> = {
          '甲': '丙', '乙': '丁', '丙': '戊', '丁': '己', '戊': '庚',
          '己': '辛', '庚': '壬', '辛': '癸', '壬': '甲', '癸': '乙'
        }
        // 食神临官禄位（食神的禄神地支）
        const luBranchMap: Record<string, string> = {
          '甲': '寅', '乙': '卯', '丙': '巳', '丁': '午', '戊': '巳',
          '己': '午', '庚': '申', '辛': '酉', '壬': '亥', '癸': '子'
        }
        // 按日干查
        const riFoodGod = foodGodMap[riGan]
        const riLuBranch = riFoodGod ? luBranchMap[riFoodGod] : undefined
        // 按年干查
        const nianFoodGod = foodGodMap[nianGan]
        const nianLuBranch = nianFoodGod ? luBranchMap[nianFoodGod] : undefined
        return riLuBranch === zhi || nianLuBranch === zhi
      },
      '德秀贵人': () => {
        // 德秀贵人：以月令三合局定德与秀
        // 德=三合局五行之阴干，秀=德之合化天干
        // 修正为按五行生克关系推算，并支持天干合化
        const deXiuMap: Record<string, { de: string[]; xiu: string[] }> = {
          // 寅午戌火局：火之德在丙丁，秀在丙丁所合之干（辛壬）化为戊癸水
          '寅': { de: ['丙', '丁'], xiu: ['戊', '癸'] },
          '午': { de: ['丙', '丁'], xiu: ['戊', '癸'] },
          '戌': { de: ['丙', '丁'], xiu: ['戊', '癸'] },
          // 申子辰水局：水之德在壬癸，秀在丁壬化木（甲乙）
          '申': { de: ['壬', '癸'], xiu: ['甲', '乙'] },
          '子': { de: ['壬', '癸'], xiu: ['甲', '乙'] },
          '辰': { de: ['壬', '癸'], xiu: ['甲', '乙'] },
          // 巳酉丑金局：金之德在庚辛，秀在乙庚化金
          '巳': { de: ['庚', '辛'], xiu: ['乙', '庚'] },
          '酉': { de: ['庚', '辛'], xiu: ['乙', '庚'] },
          '丑': { de: ['庚', '辛'], xiu: ['乙', '庚'] },
          // 亥卯未木局：木之德在甲乙，秀在丁壬化木
          '亥': { de: ['甲', '乙'], xiu: ['丁', '壬'] },
          '卯': { de: ['甲', '乙'], xiu: ['丁', '壬'] },
          '未': { de: ['甲', '乙'], xiu: ['丁', '壬'] },
        }
        const config = deXiuMap[yueZhi]
        if (!config) return false
        // 天干五合映射
        const heGanMap: Record<string, string> = { '甲':'己','乙':'庚','丙':'辛','丁':'壬','戊':'癸','己':'甲','庚':'乙','辛':'丙','壬':'丁','癸':'戊' }
        const allGans = baziArray.map(([currentGan]) => currentGan)
        // 德：四柱天干直接见德干，或见德干之合干（合化成德）
        const hasDe = config.de.some(d => allGans.includes(d) || allGans.includes(heGanMap[d]))
        // 秀：四柱天干直接见秀干，或见秀干之合干
        const hasXiu = config.xiu.some(s => allGans.includes(s) || allGans.includes(heGanMap[s]))
        // 当前柱天干需是德或秀（含合化）
        const isDeOrXiu = config.de.includes(gan) || config.xiu.includes(gan) ||
          config.de.some(d => heGanMap[d] === gan) || config.xiu.some(s => heGanMap[s] === gan)
        return hasDe && hasXiu && isDeOrXiu
      },

      // --- 禄刃马星 ---
      '禄神': () => {
        const map: Record<string, string> = { '甲':'寅', '乙':'卯', '丙':'巳', '丁':'午', '戊':'巳', '己':'午', '庚':'申', '辛':'酉', '壬':'亥', '癸':'子' }
        return map[riGan] === zhi
      },
      '羊刃': () => {
        // 阳干羊刃（帝旺位）+ 阴干羊刃（帝旺位）
        const map: Record<string, string> = { '甲':'卯', '乙':'寅', '丙':'午', '丁':'巳', '戊':'午', '己':'巳', '庚':'酉', '辛':'申', '壬':'子', '癸':'亥' }
        return map[riGan] === zhi
      },
      '飞刃': () => {
        const yangRenMap: Record<string, string> = { '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳', '戊': '午', '己': '巳', '庚': '酉', '辛': '申', '壬': '子', '癸': '亥' }
        const yangRenZhi = yangRenMap[riGan]
        if (!yangRenZhi) return false
        const clashMap: Record<string, string> = { '子':'午', '丑':'未', '寅':'申', '卯':'酉', '辰':'戌', '巳':'亥', '午':'子', '未':'丑', '申':'寅', '酉':'卯', '戌':'辰', '亥':'巳' }
        return clashMap[yangRenZhi] === zhi
      },
      '驿马': () => {
        const map: Record<string, string> = { '申':'寅', '子':'寅', '辰':'寅', '亥':'巳', '卯':'巳', '未':'巳', '寅':'申', '午':'申', '戌':'申', '巳':'亥', '酉':'亥', '丑':'亥' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '将星': () => {
        const map: Record<string, string> = { '申':'子', '子':'子', '辰':'子', '亥':'卯', '卯':'卯', '未':'卯', '寅':'午', '午':'午', '戌':'午', '巳':'酉', '酉':'酉', '丑':'酉' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '华盖': () => {
        const map: Record<string, string> = { '申':'辰', '子':'辰', '辰':'辰', '亥':'未', '卯':'未', '未':'未', '寅':'戌', '午':'戌', '戌':'戌', '巳':'丑', '酉':'丑', '丑':'丑' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '金舆': () => {
        // 金舆：日干/年干禄神前两位的地支
        const map: Record<string, string> = { '甲':'辰', '乙':'巳', '丙':'未', '丁':'申', '戊':'未', '己':'申', '庚':'戌', '辛':'亥', '壬':'丑', '癸':'寅' }
        return map[riGan] === zhi || map[nianGan] === zhi
      },
      '金神': () => ['乙丑', '己巳', '癸酉'].includes(pillarGZ) && pillarIndex === 3,

      // --- 吉日凶煞 ---
      '天赦日': () => {
        if (pillarIndex !== 2) return false
        const season: string = ({ '寅':'春', '卯':'春', '辰':'春', '巳':'夏', '午':'夏', '未':'夏', '申':'秋', '酉':'秋', '戌':'秋', '亥':'冬', '子':'冬', '丑':'冬' } as Record<string, string>)[yueZhi]
        if (season === '春' && riGZ === '戊寅') return true
        if (season === '夏' && riGZ === '甲午') return true
        if (season === '秋' && riGZ === '戊申') return true
        if (season === '冬' && riGZ === '甲子') return true
        return false
      },
      '魁罡': () => pillarIndex === 2 && ['庚辰', '壬辰', '戊戌', '庚戌'].includes(riGZ),
      '阴差阳错': () => pillarIndex === 2 && ['丙子','丁丑','戊寅','辛卯','壬辰','癸巳','丙午','丁未','戊申','辛酉','壬戌','癸亥'].includes(riGZ),
      '孤鸾煞': () => pillarIndex === 2 && ['乙巳','丁巳','辛亥','戊申','甲寅','壬子','丙午','戊午','己未','癸丑'].includes(riGZ),
      '十灵日': () => pillarIndex === 2 && ['甲辰','乙亥','丙辰','丁酉','戊午','庚戌','辛亥','壬寅','癸未'].includes(riGZ),
      '六秀日': () => pillarIndex === 2 && ['丙午','丁未','戊子','戊午','己丑','己未'].includes(riGZ),
      '八专': () => pillarIndex === 2 && ['甲寅','乙卯','己未','丁巳','庚申','辛酉','戊戌','癸丑'].includes(riGZ),
      '九丑': () => pillarIndex === 2 && ['戊子','戊午','壬子','壬午','乙卯','辛卯','乙酉','辛酉','己卯','己酉'].includes(riGZ),
      '四废日': () => {
        if (pillarIndex !== 2) return false
        const seasonMap: Record<string, string> = { '寅':'春', '卯':'春', '辰':'春', '巳':'夏', '午':'夏', '未':'夏', '申':'秋', '酉':'秋', '戌':'秋', '亥':'冬', '子':'冬', '丑':'冬' }
        const rulesMap: Record<string, string[]> = { '春':['庚申','辛酉'], '夏':['壬子','癸亥'], '秋':['甲寅','乙卯'], '冬':['丙午','丁巳'] }
        const season = seasonMap[yueZhi]
        return !!season && rulesMap[season].includes(riGZ)
      },
      '十恶大败': () => {
        // 十恶大败日：甲辰、乙巳、丙申、丁亥、戊戌、己丑、庚辰、辛巳、壬申、癸亥
        // 此十日禄入空亡（如甲辰旬空寅卯，甲禄在寅，故为空）
        if (pillarIndex !== 2) return false
        const badDays = ['甲辰', '乙巳', '丙申', '丁亥', '戊戌', '己丑', '庚辰', '辛巳', '壬申', '癸亥']
        return badDays.includes(riGZ)
      },
      '童子煞': () => {
        if (pillarIndex !== 2 && pillarIndex !== 3) return false
        const seasonMap: Record<string, string> = { '寅':'春', '卯':'春', '辰':'春', '巳':'夏', '午':'夏', '未':'夏', '申':'秋', '酉':'秋', '戌':'秋', '亥':'冬', '子':'冬', '丑':'冬' }
        const season = seasonMap[yueZhi]
        if (!season) return false
        // 春秋寅子贵
        if ((season === '春' || season === '秋') && (zhi === '寅' || zhi === '子')) return true
        // 夏冬卯未辰
        if ((season === '夏' || season === '冬') && (zhi === '卯' || zhi === '未' || zhi === '辰')) return true
        // 木火连牛角（木火命见丑/辰）
        const riGanWuxing = BASIC_MAPPINGS.STEM_WUXING[this.ctg.indexOf(riGan)]
        if ((riGanWuxing === '木' || riGanWuxing === '火') && (zhi === '丑' || zhi === '辰')) return true
        // 金水马犬龙（金水命见午/戌/辰）
        if ((riGanWuxing === '金' || riGanWuxing === '水') && (zhi === '午' || zhi === '戌' || zhi === '辰')) return true
        // 土命逢辰巳（土命见辰/巳）
        if (riGanWuxing === '土' && (zhi === '辰' || zhi === '巳')) return true
        return false
      },
      '天转': () => (pillarIndex === 2 || pillarIndex === 3) && ({'春':'乙卯', '夏':'戊午', '秋':'辛酉', '冬':'癸子'} as Record<string, string>)[({ '寅':'春', '卯':'春', '辰':'春', '巳':'夏', '午':'夏', '未':'夏', '申':'秋', '酉':'秋', '戌':'秋', '亥':'冬', '子':'冬', '丑':'冬' } as Record<string, string>)[yueZhi]] === pillarGZ,
      '地转': () => (pillarIndex === 2 || pillarIndex === 3) && ({'春':'甲寅', '夏':'丁巳', '秋':'庚申', '冬':'癸亥'} as Record<string, string>)[({ '寅':'春', '卯':'春', '辰':'春', '巳':'夏', '午':'夏', '未':'夏', '申':'秋', '酉':'秋', '戌':'秋', '亥':'冬', '子':'冬', '丑':'冬' } as Record<string, string>)[yueZhi]] === pillarGZ,

      // --- 姻缘神煞 ---
      '桃花': () => {
        const map: Record<string, string> = { '寅':'卯', '午':'卯', '戌':'卯', '亥':'子', '卯':'子', '未':'子', '申':'酉', '子':'酉', '辰':'酉', '巳':'午', '酉':'午', '丑':'午' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '红鸾': () => {
        const map: Record<string, string> = { '子':'卯', '丑':'寅', '寅':'丑', '卯':'子', '辰':'亥', '巳':'戌', '午':'酉', '未':'申', '申':'未', '酉':'午', '戌':'巳', '亥':'辰' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '天喜': () => {
        const map: Record<string, string> = { '子':'酉', '丑':'申', '寅':'未', '卯':'午', '辰':'巳', '巳':'辰', '午':'卯', '未':'寅', '申':'丑', '酉':'子', '戌':'亥', '亥':'戌' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '孤辰': () => {
        const map: Record<string, string> = { '亥':'寅', '子':'寅', '丑':'寅', '寅':'巳', '卯':'巳', '辰':'巳', '巳':'申', '午':'申', '未':'申', '申':'亥', '酉':'亥', '戌':'亥' }
        return map[nianZhi] === zhi
      },
      '寡宿': () => {
        const map: Record<string, string> = { '亥':'戌', '子':'戌', '丑':'戌', '寅':'丑', '卯':'丑', '辰':'丑', '巳':'辰', '午':'辰', '未':'辰', '申':'未', '酉':'未', '戌':'未' }
        return map[nianZhi] === zhi
      },
      '红艳煞': () => {
        const map: Record<string, string> = { '甲':'午', '乙':'申', '丙':'寅', '丁':'未', '戊':'辰', '己':'辰', '庚':'戌', '辛':'酉', '壬':'子', '癸':'申' }
        return map[riGan] === zhi
      },
      '勾绞煞': () => {
        const gouIdx = (this.zhiIdx(nianZhi) + 3) % 12
        const jiaoIdx = (this.zhiIdx(nianZhi) - 3 + 12) % 12
        return zhi === this.cdz[gouIdx] || zhi === this.cdz[jiaoIdx]
      },

      // --- 灾厄神煞 ---
      '空亡': () => {
        // 以日柱和年柱的旬查空亡地支，看当前柱地支是否落入
        const getEmptyBranches = (g: string, z: string): string[] => {
          const gIdx = this.ctg.indexOf(g)
          const zIdx = this.cdz.indexOf(z)
          if (gIdx === -1 || zIdx === -1) return []
          const e1 = (10 + zIdx - gIdx) % 12
          const e2 = (11 + zIdx - gIdx) % 12
          return [this.cdz[e1], this.cdz[e2]]
        }
        const riEmpty = getEmptyBranches(riGan, riZhi)
        const nianEmpty = getEmptyBranches(nianGan, nianZhi)
        return riEmpty.includes(zhi) || nianEmpty.includes(zhi)
      },
      '亡神': () => {
        const map: Record<string, string> = { '申':'亥', '子':'亥', '辰':'亥', '亥':'申', '卯':'申', '未':'申', '寅':'巳', '午':'巳', '戌':'巳', '巳':'寅', '酉':'寅', '丑':'寅' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '劫煞': () => {
        const map: Record<string, string> = { '申':'巳', '子':'巳', '辰':'巳', '亥':'寅', '卯':'寅', '未':'寅', '寅':'亥', '午':'亥', '戌':'亥', '巳':'申', '酉':'申', '丑':'申' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '灾煞': () => {
        const map: Record<string, string> = { '申':'午', '子':'午', '辰':'午', '亥':'酉', '卯':'酉', '未':'酉', '寅':'子', '午':'子', '戌':'子', '巳':'卯', '酉':'卯', '丑':'卯' }
        return map[nianZhi] === zhi || map[riZhi] === zhi
      },
      '元辰': () => {
        const nianGanIsYang = this.ctg.indexOf(nianGan) % 2 === 0
        const offset = (nianGanIsYang && isMan) || (!nianGanIsYang && !isMan) ? 5 : 7
        const targetIdx = (this.zhiIdx(nianZhi) + offset + 12) % 12
        return this.cdz[targetIdx] === zhi
      },
      '血刃': () => {
        const map: Record<string, string> = { '寅':'丑', '卯':'寅', '辰':'卯', '巳':'辰', '午':'巳', '未':'午', '申':'未', '酉':'申', '戌':'酉', '亥':'戌', '子':'亥', '丑':'子' }
        return map[yueZhi] === zhi
      },
      '流霞': () => {
        const map: Record<string, string> = { '甲':'酉', '乙':'戌', '丙':'未', '丁':'申', '戊':'巳', '己':'午', '庚':'辰', '辛':'卯', '壬':'亥', '癸':'寅' }
        return map[riGan] === zhi
      },
      '天罗': () => {
        // 戌亥互见为天罗
        const hasXu = baziArray.some(p => p[1] === '戌')
        const hasHai = baziArray.some(p => p[1] === '亥')
        return hasXu && hasHai && (zhi === '戌' || zhi === '亥')
      },
      '地网': () => {
        // 辰巳互见为地网
        const hasChen = baziArray.some(p => p[1] === '辰')
        const hasSi = baziArray.some(p => p[1] === '巳')
        return hasChen && hasSi && (zhi === '辰' || zhi === '巳')
      },
      '天医': () => {
        // 正月(寅)见丑，二月(卯)见寅... 即月令前一位
        const monthIdx = this.cdz.indexOf(yueZhi)
        if (monthIdx === -1) return false
        const targetIdx = (monthIdx - 1 + 12) % 12
        return this.cdz[targetIdx] === zhi
      },
      '丧门': () => this.cdz[(this.zhiIdx(nianZhi) + 2) % 12] === zhi,
      '吊客': () => this.cdz[(this.zhiIdx(nianZhi) - 2 + 12) % 12] === zhi,
      '披麻': () => this.cdz[(this.zhiIdx(nianZhi) - 3 + 12) % 12] === zhi
    }

    for (const name in rules) {
      if (rules[name]()) {
        results.push(name)
      }
    }

    return results
  }
}
