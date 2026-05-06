import type { BaziChartResult } from './baziTypes'
import { getCurrentTimeDescription } from './calendarTool'
import { getLuckCycleForDate } from './luckTiming'

interface FormatBaziOptions {
  includeRules?: boolean;
  includeShensha?: boolean;
  includeShenShaAnalysis?: boolean;
  includeWuxing?: boolean;
  includeCurrentTiming?: boolean;
  includeSpecialPillars?: boolean;
  includeLuckOverview?: boolean;
  includeCurrentLiunian?: boolean;
}

export type PromptChartScene = 'general' | 'fortune' | 'compatibility' | 'comprehensive' | 'concise'

function formatSignedScore(value: number): string {
  const rounded = Number(value.toFixed(1))
  return `${rounded >= 0 ? '+' : ''}${rounded}`
}

function joinOrFallback(values: string[] | undefined, fallback = '暂无'): string {
  return values && values.length > 0 ? values.join('、') : fallback
}

function buildBaziText(
  baziResult: BaziChartResult,
  options: FormatBaziOptions
): string {
  if (!baziResult) return '无法获取八字数据。'

  const { solarDate, timeInfo, dayMaster, pillars, tenGods, hiddenStems, hiddenTenGods, nayin, pillarLifeStages, shensha, shenShaAnalysis } = baziResult
  const {
    includeRules = true,
    includeShensha = true,
    includeShenShaAnalysis = false,
    includeWuxing = true,
    includeCurrentTiming = true,
    includeSpecialPillars = true,
    includeLuckOverview = true,
    includeCurrentLiunian = true
  } = options

  let result = '【命盘】\n'
  const isMale = baziResult.gender === 'male'
  result += `基本信息: ${isMale ? '乾造' : '坤造'} | ${solarDate.year}年${solarDate.month}月${solarDate.day}日 ${timeInfo.name} | 生肖:${baziResult.zodiac}\n`
  if (baziResult.timing?.enabled) {
    result += `真太阳时: ${baziResult.timing.correctedTime.year}年${baziResult.timing.correctedTime.month}月${baziResult.timing.correctedTime.day}日 ${String(baziResult.timing.correctedTime.hour).padStart(2, '0')}:${String(baziResult.timing.correctedTime.minute).padStart(2, '0')} | 出生地:${baziResult.timing.birthPlace || '未填写'} | 经度:${baziResult.timing.birthLongitude}\n`
  }
  result += `日元本命: ${dayMaster.gan}${dayMaster.element} (${dayMaster.yinYang})\n`
  if (baziResult.monthCommander) result += `月令司权: ${baziResult.monthCommander}\n`

  const specialPillars = [
    baziResult.mingGong ? `命宫:${baziResult.mingGong}` : '',
    baziResult.shenGong ? `身宫:${baziResult.shenGong}` : '',
    baziResult.taiYuan ? `胎元:${baziResult.taiYuan}` : ''
  ].filter(Boolean).join(' | ')
  if (includeSpecialPillars && specialPillars) result += `特殊宫位: ${specialPillars}\n`

  result += '\n【核心判断依据】\n'
  const analysis = baziResult.analysis
  result += `旺衰: ${analysis.dayMasterStrength.status}（得分:${analysis.dayMasterStrength.score}）\n`
  result += `旺衰拆分: 月令:${formatSignedScore(analysis.dayMasterStrength.details.seasonalScore)} | 成局:${formatSignedScore(analysis.dayMasterStrength.details.formationStrength)} | 通根:${formatSignedScore(analysis.dayMasterStrength.details.rootStrength)} | 帮扶:${formatSignedScore(analysis.dayMasterStrength.details.supportStrength)} | 克泄耗:${formatSignedScore(-analysis.dayMasterStrength.details.constraintStrength)}\n`
  result += `格局: ${analysis.mingGe.pattern}\n`
  if (analysis.mingGe.basis) {
    result += `格局依据: ${analysis.mingGe.basis}\n`
  }
  if (analysis.usefulGod) {
    const primaryFavorableWuxing = analysis.usefulGod.primaryFavorableWuxing || analysis.usefulGod.favorableWuxing?.[0] || '暂无'
    const secondaryFavorableWuxing = analysis.usefulGod.secondaryFavorableWuxing || analysis.usefulGod.favorableWuxing?.slice(1) || []
    const primaryUnfavorableWuxing = analysis.usefulGod.primaryUnfavorableWuxing || analysis.usefulGod.unfavorableWuxing?.[0] || '暂无'
    const secondaryUnfavorableWuxing = analysis.usefulGod.secondaryUnfavorableWuxing || analysis.usefulGod.unfavorableWuxing?.slice(1) || []
    const primaryFavorableTenGods = analysis.usefulGod.primaryFavorable || analysis.usefulGod.primaryFavorableWuxing
      ? (analysis.usefulGod.primaryFavorable || analysis.usefulGod.favorable?.slice(0, 2) || [])
      : []
    const primaryUnfavorableTenGods = analysis.usefulGod.primaryUnfavorable || analysis.usefulGod.primaryUnfavorableWuxing
      ? (analysis.usefulGod.primaryUnfavorable || analysis.usefulGod.unfavorable?.slice(0, 2) || [])
      : []

    result += `用神: 主用${primaryFavorableWuxing}${secondaryFavorableWuxing.length ? '+辅' + secondaryFavorableWuxing.join('、') : ''}(${joinOrFallback(primaryFavorableTenGods)}) | 主忌${primaryUnfavorableWuxing}${secondaryUnfavorableWuxing.length ? '+次' + secondaryUnfavorableWuxing.join('、') : ''}(${joinOrFallback(primaryUnfavorableTenGods)})\n`
    result += `喜忌五行: ${joinOrFallback(analysis.usefulGod.favorableWuxing)} | ${joinOrFallback(analysis.usefulGod.unfavorableWuxing)}\n`
    result += `喜忌十神: ${joinOrFallback(analysis.usefulGod.favorable)} | ${joinOrFallback(analysis.usefulGod.unfavorable)}\n`
    result += `类别: 喜${analysis.usefulGod.useful} 忌${analysis.usefulGod.avoid}\n`
    if (includeRules && analysis.usefulGod.primaryReason) {
      result += `主导规则: ${analysis.usefulGod.primaryReason}\n`
    }
    if (includeRules && analysis.usefulGod.matchedRules?.length) {
      result += `命中规则: ${analysis.usefulGod.matchedRules.map(rule => rule.label).join(', ')}\n`
    }
    if (includeRules && analysis.usefulGod.strategyTrace?.length) {
      result += `取用路径: ${analysis.usefulGod.strategyTrace.join(' -> ')}\n`
    }
  }

  result += '\n【四柱】\n'
  const pillarNames = ['年柱', '月柱', '日柱', '时柱'] as const
  const keys: Array<keyof typeof pillars> = ['year', 'month', 'day', 'hour']

  keys.forEach((key, index) => {
    const pillar = pillars[key]
    const tenGod = tenGods[key]
    const nayinValue = nayin?.[key] || ''
    const lifeStage = pillarLifeStages?.[key] || ''
    const shenShaValue = shensha?.[key]?.join(',') || ''
    const kongWangFlag = shenShaValue.includes('空亡') ? '(空亡)' : ''
    const hiddenStemValues = hiddenStems?.[key] || []
    const hiddenTenGodValues = hiddenTenGods?.[key] || []
    const hiddenStr = hiddenStemValues.map((stem, idx) => `${stem}${hiddenTenGodValues[idx] ? `[${hiddenTenGodValues[idx]}]` : ''}`).join('')
    const shenShaExplain = shenShaAnalysis?.[key]?.join(' | ') || ''

    const pillarParts = [
      `${pillarNames[index]}: ${pillar.ganZhi}`,
      tenGod ? `[${tenGod}]` : '',
      nayinValue,
      lifeStage,
      kongWangFlag
    ].filter(Boolean).join(' ')
    result += `${pillarParts}\n`
    if (hiddenStr) result += `  藏干: ${hiddenStr}\n`
    if (includeShensha && shenShaValue) result += `  神煞: ${shenShaValue}\n`
    if (includeShensha && shenShaExplain) result += `  提示: ${shenShaExplain}\n`
    if (!includeShensha && includeShenShaAnalysis && shenShaExplain) result += `  互参: ${shenShaExplain}\n`
  })

  const globalShenShaValue = shensha?.global?.join(',') || ''
  const globalShenShaExplain = shenShaAnalysis?.global?.join(' | ') || ''
  if (includeShensha && globalShenShaValue) {
    result += `全局神煞: ${globalShenShaValue}\n`
    if (globalShenShaExplain) {
      result += `  提示: ${globalShenShaExplain}\n`
    }
  }
  if (!includeShensha && includeShenShaAnalysis && globalShenShaExplain) {
    result += `全局互参: ${globalShenShaExplain}\n`
  }

  if (includeWuxing && baziResult.wuxingStrength?.percentages) {
    result += '\n【五行】\n'
    const wuxingMap = baziResult.wuxingStrength.percentages
    result += Object.entries(wuxingMap).map(([key, value]) => `${key}:${value}%`).join('  ')
    if (baziResult.wuxingStrength.missing?.length) {
      result += ` | 缺失:${baziResult.wuxingStrength.missing.join(',')}`
    }
    result += '\n'
  }

  if (includeLuckOverview && baziResult.luckInfo?.cycles) {
    result += '\n【大运】\n'
    result += `起运: ${baziResult.luckInfo.startInfo}\n`
    const cycles = baziResult.luckInfo.cycles.slice(0, 8)
    result += `${cycles.map(cycle => `${cycle.ganZhi}(${cycle.age}岁)`).join(' -> ')}\n`
  }

  if (includeCurrentLiunian && baziResult.liunian?.length) {
    const now = new Date()
    const currentYear = now.getFullYear()
    let currentLuckStr = ''
    let currentLiunian = baziResult.liunian.find(year => year.year === currentYear)

    if (baziResult.luckInfo?.cycles) {
      const currentLuck = getLuckCycleForDate(baziResult.luckInfo.cycles, now)
      if (currentLuck?.isXiaoyun) {
        currentLuckStr = ' | 【当前大运】 未起运(行童运)'
        currentLiunian = currentLuck.years.find(year => year.year === currentYear) || currentLiunian
      } else if (currentLuck) {
        currentLuckStr = ` | 【当前大运】 ${currentLuck.ganZhi}运`
        currentLiunian = currentLuck.years.find(year => year.year === currentYear) || currentLiunian
      }
    }

    if (currentLiunian) {
      result += `\n【当前流年】 ${currentYear}年 ${currentLiunian.ganZhi}${currentLuckStr}\n`
      result += `十神: ${currentLiunian.tenGod}/${currentLiunian.tenGodZhi}\n`
    }
  }

  if (includeCurrentTiming) {
    result += `\n${getCurrentTimeDescription()}`
  }
  return result
}

function getPromptSceneOptions(scene: PromptChartScene): FormatBaziOptions {
  if (scene === 'comprehensive') {
    return {
      includeRules: true,
      includeShensha: false,
      includeShenShaAnalysis: true,
      includeWuxing: true,
      includeCurrentTiming: true,
      includeSpecialPillars: true,
      includeLuckOverview: true,
      includeCurrentLiunian: true
    }
  }

  if (scene === 'fortune') {
    return {
      includeRules: true,
      includeShensha: false,
      includeShenShaAnalysis: true,
      includeWuxing: false,
      includeCurrentTiming: true,
      includeSpecialPillars: false,
      includeLuckOverview: true,
      includeCurrentLiunian: true
    }
  }

  if (scene === 'compatibility') {
    return {
      includeRules: true,
      includeShensha: false,
      includeShenShaAnalysis: false,
      includeWuxing: false,
      includeCurrentTiming: false,
      includeSpecialPillars: false,
      includeLuckOverview: false,
      includeCurrentLiunian: false
    }
  }

  if (scene === 'concise') {
    return {
      includeRules: true,
      includeShensha: false,
      includeShenShaAnalysis: false,
      includeWuxing: false,
      includeCurrentTiming: false,
      includeSpecialPillars: false,
      includeLuckOverview: false,
      includeCurrentLiunian: false
    }
  }

  return {
    includeRules: true,
    includeShensha: false,
    includeShenShaAnalysis: true,
    includeWuxing: false,
    includeCurrentTiming: true,
    includeSpecialPillars: true,
    includeLuckOverview: true,
    includeCurrentLiunian: true
  }
}

export function formatBaziForPrompt(baziResult: BaziChartResult, _selectedOption: unknown = null, scene: PromptChartScene = 'general'): string {
  if (!baziResult) return '无法获取八字数据。'

  return buildBaziText(baziResult, getPromptSceneOptions(scene))
}








