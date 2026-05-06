/**
 * @file Bazi Definitions
 * @description This file contains the static definitions for various Bazi concepts,
 * such as ShenSha (Symbolic Stars) and Ten Gods (ShiShen).
 * It serves as a centralized "knowledge base" to be used across the application.
 */

import { TEN_GODS_DEFINITIONS } from './baziElementData'

// 十二长生详解
const LIFE_STAGE_DESCRIPTIONS: Record<string, { meaning: string; characteristics: string; advice: string }> = {
  '长生': {
    meaning: '万物萌发，如人初生',
    characteristics: '充满活力，温和善良，虽有冲劲但稍显稚嫩。',
    advice: '适合开创新的事业，保持谦虚好学的态度。'
  },
  '沐浴': {
    meaning: '万物受滋润，如人洗礼',
    characteristics: '容易动情，多愁善感，不稳定，易受外界影响。',
    advice: '注意感情纠葛，做事要稳重，避免浮躁。'
  },
  '冠带': {
    meaning: '万物渐荣，如人成年加冠',
    characteristics: '自尊心强，喜欢表现，有领导欲望，进取心强。',
    advice: '发挥领导才能，但要避免过于骄傲自大。'
  },
  '临官': {
    meaning: '万物壮大，如人出仕',
    characteristics: '独立自主，事业心强，有责任感，稳重踏实。',
    advice: '适合独立创业或在职场打拼，承担重要责任。'
  },
  '帝旺': {
    meaning: '万物极盛，如人登峰造极',
    characteristics: '气势强盛，独断专行，不愿服输，容易得罪人。',
    advice: '盛极必衰，要注意收敛锋芒，听取他人意见。'
  },
  '衰': {
    meaning: '万物形衰，如人过顶峰',
    characteristics: '保守稳健，不喜争斗，甚至消极，缺乏冲劲。',
    advice: '适合守成，巩固现有基础，不要盲目扩张。'
  },
  '病': {
    meaning: '万物病态，如人身体欠安',
    characteristics: '敏感多疑，身体较弱，富有同情心，精神世界丰富。',
    advice: '注意身体健康，适合从事文艺、宗教等精神领域。'
  },
  '死': {
    meaning: '万物静止，如人终结',
    characteristics: '外柔内刚，固执己见，不善变通，钻牛角尖。',
    advice: '学会变通，多接触正能量，避免陷入死胡同。'
  },
  '墓': {
    meaning: '万物归藏，如人入墓',
    characteristics: '性格内向，精打细算，收藏积蓄，不喜张扬。',
    advice: '适合理财储蓄，做幕后工作，不要锋芒太露。'
  },
  '绝': {
    meaning: '万物绝灭，如人气尽',
    characteristics: '喜新厌旧，做事无长性，容易受人影响，大起大落。',
    advice: '培养定力，坚持到底，做事要有始有终。'
  },
  '胎': {
    meaning: '万物孕育，如人受胎',
    characteristics: '充满希望，好奇心强，天真烂漫，依赖心重。',
    advice: '保持初心，多学习新知识，培养独立能力。'
  },
  '养': {
    meaning: '万物成形，如人成胎',
    characteristics: '温和敦厚，人缘好，甚至有些懦弱，依赖家庭。',
    advice: '广结善缘，利用好人际关系，但也要培养主见。'
  }
}

// 四柱含义
const PILLAR_MEANINGS = {
  year: {
    name: '年柱',
    meaning: '祖上、根基',
    timeRange: '1-16岁',
    represents: ['祖辈', '父母', '早年运', '根基']
  },
  month: {
    name: '月柱',
    meaning: '父母、事业',
    timeRange: '17-32岁',
    represents: ['父母', '兄弟', '事业', '社交']
  },
  day: {
    name: '日柱',
    meaning: '自己、配偶',
    timeRange: '33-48岁',
    represents: ['自己', '配偶', '婚姻', '家庭']
  },
  hour: {
    name: '时柱',
    meaning: '子女、晚年',
    timeRange: '49岁以后',
    represents: ['子女', '晚辈', '事业', '晚运']
  }
}

// 十神详解
const TEN_GODS_DETAILED: Record<string, {
  meaning: string;
  positive: string[];
  negative: string[];
  career: string;
  wealth: string;
}> = {
  '比肩': {
    meaning: '代表自我、独立、竞争与合作',
    positive: ['意志坚定', '自尊心强', '有主见', '善于合作'],
    negative: ['固执己见', '自我中心', '好胜心强', '容易与人争执'],
    career: '适合与人合作的、需要竞争的行业，如销售、体育、创业。',
    wealth: '财运平稳，通过自身努力获得，不适合投机。'
  },
  '劫财': {
    meaning: '代表朋友、同事、竞争与损失',
    positive: ['热情坦率', '善于交际', '有行动力', '团队精神'],
    negative: ['冲动鲁莽', '好赌投机', '容易破财', '嫉妒心强'],
    career: '适合需要团队合作、开拓性的工作，但需防范小人。',
    wealth: '财运波动大，容易因朋友或投机而破财，需谨慎理财。'
  },
  '食神': {
    meaning: '代表才华、福气、享受与表达',
    positive: ['温和善良', '有口福', '才华横溢', '懂得享受生活'],
    negative: ['理想主义', '懒散安逸', '容易幻想', '缺乏执行力'],
    career: '适合发挥才华的行业，如艺术、设计、餐饮、演艺。',
    wealth: '财源广进，多由才华和创意带来，衣食无忧。'
  },
  '伤官': {
    meaning: '代表智慧、技艺、叛逆与创新',
    positive: ['聪明绝顶', '多才多艺', '有创新精神', '口才佳'],
    negative: ['恃才傲物', '不服管束', '容易得罪人', '情绪化'],
    career: '适合需要创新和智慧的行业，如科技、研发、法律、咨询。',
    wealth: '财源多变，可通过技术和智慧获利，但不稳定。'
  },
  '偏财': {
    meaning: '代表意外之财、父亲、慷慨与投机',
    positive: ['慷慨大方', '善于交际', '有商业头脑', '机智敏锐'],
    negative: ['好赌投机', '风流多情', '不喜正业', '花钱无度'],
    career: '适合商业、投资、销售等需要冒险和人脉的行业。',
    wealth: '偏财运旺，容易获得意外之财，但需控制风险。'
  },
  '正财': {
    meaning: '代表稳定收入、妻子、勤劳与踏实',
    positive: ['勤劳节俭', '踏实稳重', '有责任感', '重视家庭'],
    negative: ['保守固执', '缺乏变通', '过于看重金钱', '吝啬'],
    career: '适合稳定的工作，如公务员、教师、会计等。',
    wealth: '正财运稳定，多为工资性收入，适合储蓄和稳健投资。'
  },
  '七杀': {
    meaning: '代表压力、权威、小人与魄力',
    positive: ['有威严', '有魄力', '执行力强', '不畏艰难'],
    negative: ['性情刚烈', '容易树敌', '压力过大', '健康不佳'],
    career: '适合军警、司法、管理等需要权威和魄力的行业。',
    wealth: '财运伴随风险，多为辛苦得来，需努力拼搏。'
  },
  '正官': {
    meaning: '代表事业、名誉、上司与自律',
    positive: ['正直负责', '遵纪守法', '有领导才能', '受人尊敬'],
    negative: ['循规蹈矩', '缺乏创新', '过于保守', '胆小怕事'],
    career: '适合公职、管理、行政等需要责任感和规范性的工作。',
    wealth: '财运稳定，多因地位和名誉而来，收入有保障。'
  },
  '偏印': {
    meaning: '代表偏门学问、继母、孤独与敏感',
    positive: ['领悟力强', '有独特见解', '精通偏门技艺', '第六感强'],
    negative: ['性格孤僻', '多疑敏感', '三心二意', '缺乏人情味'],
    career: '适合研究、设计、命理、心理学等需要独特思维的行业。',
    wealth: '财运不稳定，多为偏门收入，不适合常规投资。'
  },
  '正印': {
    meaning: '代表学问、母亲、善良与庇护',
    positive: ['仁慈善良', '博学多才', '有贵人相助', '重视精神生活'],
    negative: ['依赖性强', '缺乏主见', '好面子', '不善理财'],
    career: '适合教育、文化、学术、咨询等需要知识和爱心的行业。',
    wealth: '财运平平，不重物质，但一生衣食无忧，有贵人资助。'
  }
}

// 时辰信息
export const TIME_MAP = [
  { index: 0, name: '早子时', range: '00:00-01:00', hour: 0 },
  { index: 1, name: '丑时', range: '01:00-03:00', hour: 1 },
  { index: 2, name: '寅时', range: '03:00-05:00', hour: 3 },
  { index: 3, name: '卯时', range: '05:00-07:00', hour: 5 },
  { index: 4, name: '辰时', range: '07:00-09:00', hour: 7 },
  { index: 5, name: '巳时', range: '09:00-11:00', hour: 9 },
  { index: 6, name: '午时', range: '11:00-13:00', hour: 11 },
  { index: 7, name: '未时', range: '13:00-15:00', hour: 13 },
  { index: 8, name: '申时', range: '15:00-17:00', hour: 15 },
  { index: 9, name: '酉时', range: '17:00-19:00', hour: 17 },
  { index: 10, name: '戌时', range: '19:00-21:00', hour: 19 },
  { index: 11, name: '亥时', range: '21:00-23:00', hour: 21 },
  { index: 12, name: '晚子时', range: '23:00-24:00', hour: 23 }
]

// 十神列表
const TEN_GODS_LIST = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印']

// 五行列表
const WUXING_LIST = ['水', '木', '火', '土', '金']

// 十二长生列表
const LIFE_STAGES_LIST = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养']

// 五行强弱计算权重
export const WUXING_STRENGTH_SCORES = {
  tianGan: 12,
  diZhiBenQi: 12,
  diZhiZhongQi: 6,
  diZhiYuQi: 3
}

// 月令对五行强弱的影响权重
export const WUXING_MONTH_WEIGHTS: Record<string, Record<string, number>> = {
  '寅': { '木': 2.0, '火': 1.5, '土': 0.8, '金': 0.6, '水': 1.2 },
  '卯': { '木': 2.2, '火': 1.6, '土': 0.7, '金': 0.5, '水': 1.1 },
  '辰': { '土': 2.0, '金': 1.5, '水': 0.8, '木': 1.2, '火': 0.6 },
  '巳': { '火': 2.0, '土': 1.5, '金': 0.8, '水': 0.6, '木': 1.2 },
  '午': { '火': 2.2, '土': 1.6, '金': 0.7, '水': 0.5, '木': 1.1 },
  '未': { '土': 2.0, '金': 1.5, '水': 0.8, '木': 1.2, '火': 0.6 },
  '申': { '金': 2.0, '水': 1.5, '木': 0.8, '火': 0.6, '土': 1.2 },
  '酉': { '金': 2.2, '水': 1.6, '木': 0.7, '火': 0.5, '土': 1.1 },
  '戌': { '土': 2.0, '金': 1.5, '水': 0.8, '木': 1.2, '火': 0.6 },
  '亥': { '水': 2.0, '木': 1.5, '火': 0.8, '土': 0.6, '金': 1.2 },
  '子': { '水': 2.2, '木': 1.6, '火': 0.7, '土': 0.5, '金': 1.1 },
  '丑': { '土': 2.0, '金': 1.5, '水': 0.8, '木': 1.2, '火': 0.6 }
}

// 五行生克关系 (用于判断同党/异党)
const WUXING_RELATIONSHIPS: Record<string, { allies: string[]; enemies: string[] }> = {
  '金': { allies: ['金', '土'], enemies: ['火', '水', '木'] },
  '木': { allies: ['木', '水'], enemies: ['金', '火', '土'] },
  '水': { allies: ['水', '金'], enemies: ['土', '木', '火'] },
  '火': { allies: ['火', '木'], enemies: ['水', '土', '金'] },
  '土': { allies: ['土', '火'], enemies: ['木', '金', '水'] }
}

/**
 * 获取十神详解信息
 * @param shishen 十神名称
 * @returns 包含该十神详细信息的对象
 */
const getShishenInfo = (shishen: string) => {
  const shishenData = TEN_GODS_DETAILED[shishen]
  if (!shishenData) {
    return null
  }
  const basicInfo = TEN_GODS_DEFINITIONS[shishen]
  return {
    ...shishenData,
    yinYang: basicInfo?.yinyang,
    element: basicInfo?.wuxing
  }
}
