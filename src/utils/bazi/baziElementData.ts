/**
 * 五行与十神基础参考数据
 */

export const TEN_GODS_DEFINITIONS: Record<string, { wuxing: string; yinyang: string; description: string }> = {
  '比肩': { wuxing: '同我', yinyang: '同性', description: '代表兄弟、朋友、同事，主自尊、独立。' },
  '劫财': { wuxing: '同我', yinyang: '异性', description: '代表姐妹、异性朋友，主竞争、合作。' },
  '食神': { wuxing: '我生', yinyang: '同性', description: '代表福气、才华、口福，主温和、享受。' },
  '伤官': { wuxing: '我生', yinyang: '异性', description: '代表智慧、技艺、叛逆，主聪明、傲气。' },
  '偏财': { wuxing: '我克', yinyang: '同性', description: '代表父亲、情人、意外之财，主大方、投机。' },
  '正财': { wuxing: '我克', yinyang: '异性', description: '代表妻子、稳定收入，主勤劳、踏实。' },
  '七杀': { wuxing: '克我', yinyang: '同性', description: '代表小人、压力、权威，主刚强、果断。' },
  '正官': { wuxing: '克我', yinyang: '异性', description: '代表上司、事业、名誉，主正直、自律。' },
  '偏印': { wuxing: '生我', yinyang: '同性', description: '代表继母、偏门学问，主孤独、敏感。' },
  '正印': { wuxing: '生我', yinyang: '异性', description: '代表母亲、正统学问，主仁慈、善良。' }
}

const WUXING_SUGGESTIONS: Record<string, { color: string; direction: string; industry: string; number: string }> = {
  '木': { color: '绿色', direction: '东方', industry: '木材、家具、文化、教育', number: '3, 8' },
  '火': { color: '红色、紫色', direction: '南方', industry: '电子、化工、餐饮、能源', number: '2, 7' },
  '土': { color: '黄色、棕色', direction: '中央、本地', industry: '地产、建筑、农业、矿产', number: '5, 0' },
  '金': { color: '白色、金色', direction: '西方', industry: '金融、五金、机械、珠宝', number: '4, 9' },
  '水': { color: '黑色、蓝色', direction: '北方', industry: '水利、运输、贸易、旅游', number: '1, 6' }
}

const WUXING_COLORS: Record<string, string> = {
  '木': '#28a745',
  '火': '#dc3545',
  '土': '#816119',
  '金': '#EB8524',
  '水': '#007bff'
}

export const SEASON_STATUS: Record<string, Record<string, string>> = {
  '寅': { '木': '旺', '火': '相', '土': '死', '金': '囚', '水': '休' },
  '卯': { '木': '旺', '火': '相', '土': '死', '金': '囚', '水': '休' },
  '辰': { '土': '旺', '金': '相', '水': '死', '木': '囚', '火': '休' },
  '巳': { '火': '旺', '土': '相', '金': '死', '水': '囚', '木': '休' },
  '午': { '火': '旺', '土': '相', '金': '死', '水': '囚', '木': '休' },
  '未': { '土': '旺', '金': '相', '水': '死', '木': '囚', '火': '休' },
  '申': { '金': '旺', '水': '相', '木': '死', '火': '囚', '土': '休' },
  '酉': { '金': '旺', '水': '相', '木': '死', '火': '囚', '土': '休' },
  '戌': { '土': '旺', '金': '相', '水': '死', '木': '囚', '火': '休' },
  '亥': { '水': '旺', '木': '相', '火': '死', '土': '囚', '金': '休' },
  '子': { '水': '旺', '木': '相', '火': '死', '土': '囚', '金': '休' },
  '丑': { '土': '旺', '金': '相', '水': '死', '木': '囚', '火': '休' }
}
