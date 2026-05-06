/**
 * @file Bazi Utils
 * @description Contains stateless utility functions for Bazi calculations.
 */

import { BASIC_MAPPINGS, HIDDEN_STEMS, SEASON_STATUS, shenShaTypes } from './baziDefinitions'
import type { Wuxing } from './baziTypes'

const ctg = BASIC_MAPPINGS.HEAVENLY_STEMS as readonly string[]
const cdz = BASIC_MAPPINGS.EARTHLY_BRANCHES as readonly string[]
const wxtg = BASIC_MAPPINGS.STEM_WUXING as Wuxing[]
const wxdz = BASIC_MAPPINGS.BRANCH_WUXING as Wuxing[]

/**
 * 获取天干或地支的五行
 */
export function getWuxing(ganOrZhi: string): Wuxing | '未知' {
  const stemIndex = ctg.indexOf(ganOrZhi)
  if (stemIndex !== -1) return wxtg[stemIndex]
  const branchIndex = cdz.indexOf(ganOrZhi)
  if (branchIndex !== -1) return wxdz[branchIndex]
  return '未知'
}

/**
 * 获取天干阴阳
 */
export function getGanYinYang(gan: string): string {
  const stemIndex = ctg.indexOf(gan)
  if (stemIndex === -1) return '未知'
  return BASIC_MAPPINGS.STEM_YINYANG[stemIndex]
}

/**
 * 获取两个天干之间的十神关系
 */
export function getTenGod(gan: string, dayMaster: string): string {
  const ganIndex = ctg.indexOf(gan)
  const dayMasterIndex = ctg.indexOf(dayMaster)
  if (ganIndex === -1 || dayMasterIndex === -1) return '未知'
  const tenGodMatrix = [
    ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'],
    ['劫财', '比肩', '伤官', '食神', '正财', '偏财', '正官', '七杀', '正印', '偏印'],
    ['偏印', '正印', '比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官'],
    ['正印', '偏印', '劫财', '比肩', '伤官', '食神', '正财', '偏财', '正官', '七杀'],
    ['七杀', '正官', '偏印', '正印', '比肩', '劫财', '食神', '伤官', '偏财', '正财'],
    ['正官', '七杀', '正印', '偏印', '劫财', '比肩', '伤官', '食神', '正财', '偏财'],
    ['偏财', '正财', '七杀', '正官', '偏印', '正印', '比肩', '劫财', '食神', '伤官'],
    ['正财', '偏财', '正官', '七杀', '正印', '偏印', '劫财', '比肩', '伤官', '食神'],
    ['食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印', '比肩', '劫财'],
    ['伤官', '食神', '正财', '偏财', '正官', '七杀', '正印', '偏印', '劫财', '比肩']
  ]
  return tenGodMatrix[dayMasterIndex][ganIndex]
}

/**
 * 获取地支对应的十神（取藏干主气）
 */
export function getTenGodForBranch(zhi: string, dayMaster: string): string {
  const mainHiddenStem = HIDDEN_STEMS[zhi]?.[0]
  if (mainHiddenStem) {
    return getTenGod(mainHiddenStem, dayMaster)
  }
  return '未知'
}

/**
 * 获取月支对应的五行旺衰状态
 * @param monthBranch 月支
 * @returns 一个包含各五行状态的对象
 */
export function getSeasonStatus(monthBranch: string): Record<string, string> {
  return SEASON_STATUS[monthBranch] || {}
}
/**
 * 获取神煞属性 (吉/凶/中性)
 * @param shensha 神煞名称
 * @returns 属性名称
 */
export const getShenShaType = (shensha: string): '吉' | '凶' | '中性' => {
  if (shenShaTypes.lucky.includes(shensha)) {
    return '吉'
  } else if (shenShaTypes.unlucky.includes(shensha)) {
    return '凶'
  } else {
    return '中性'
  }
}
/**
 * 获取指定月份的季节
 * @param month - 月份 (1-12)
 * @returns '春季' | '夏季' | '秋季' | '冬季'
 */
const getMonthSeason = (month: number): '春季' | '夏季' | '秋季' | '冬季' => {
  if (month >= 3 && month <= 5) return '春季'
  if (month >= 6 && month <= 8) return '夏季'
  if (month >= 9 && month <= 11) return '秋季'
  return '冬季'
}

const getWuxingClass = (character: string) => {
  const wuxingMap: { [key: string]: string } = {
    '甲': 'wuxing-mu', '乙': 'wuxing-mu', '寅': 'wuxing-mu', '卯': 'wuxing-mu', '木': 'wuxing-mu',
    '丙': 'wuxing-huo', '丁': 'wuxing-huo', '巳': 'wuxing-huo', '午': 'wuxing-huo', '火': 'wuxing-huo',
    '戊': 'wuxing-tu', '己': 'wuxing-tu', '辰': 'wuxing-tu', '戌': 'wuxing-tu', '丑': 'wuxing-tu', '未': 'wuxing-tu', '土': 'wuxing-tu',
    '庚': 'wuxing-jin', '辛': 'wuxing-jin', '申': 'wuxing-jin', '酉': 'wuxing-jin', '金': 'wuxing-jin',
    '壬': 'wuxing-shui', '癸': 'wuxing-shui', '子': 'wuxing-shui', '亥': 'wuxing-shui', '水': 'wuxing-shui'
  }
  return wuxingMap[character] || ''
}

const sortShenSha = (shenSha: string[]): string[] => {
  const order = ['天乙贵人', '月德贵人', '天德贵人', '福星贵人', '文昌贵人', '禄神', '将星', '金舆', '红鸾', '天喜']
  return shenSha.sort((a, b) => {
    const aIndex = order.indexOf(a)
    const bIndex = order.indexOf(b)
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b)
    if (aIndex === -1) return 1
    if (bIndex === -1) return -1
    return aIndex - bIndex
  })
}

const getShenShaTypeClass = (shensha: string): string => {
  const type = getShenShaType(shensha)
  if (type === '吉') return 'type-lucky'
  if (type === '凶') return 'type-unlucky'
  return 'type-neutral'
}
