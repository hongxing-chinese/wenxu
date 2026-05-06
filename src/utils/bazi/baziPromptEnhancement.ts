/**
 * AI 提示词增强模块
 * 整合病药法、通关法、经典格局、神煞详解、命局分析维度
 */

import type { BaziChartResult } from './baziTypes'
import {
  identifyClassicPattern,
  getPeachBlossomDetail,
  generatePeriodAnalysis,
  generateAnalysisDimensionHints,
  generateMarriageMatchHints,
  generateChildrenFateHints,
  generateParentsAnalysisHints,
  generateSiblingsAnalysisHints,
  detectDiseaseMedicine,
  detectTongguanNeed
} from './baziEnhancement'

/**
 * 分析维度配置
 */
interface AnalysisDimensionConfig {
  includeDiseaseMedicine: boolean     // 病药法分析
  includeTongguan: boolean           // 通关法分析
  includeClassicPattern: boolean     // 经典格局分析
  includePeachBlossomDetail: boolean // 桃花详解
  includeLifespan: boolean          // 寿元分析
  includeFuxin: boolean             // 伏吟反吟
  includeKongWang: boolean          // 空亡详解
  includeXingChong: boolean          // 刑冲合会破
  includePeriod: boolean            // 限运分析
}

/**
 * 默认的分析维度配置
 */
const DEFAULT_ANALYSIS_DIMENSIONS: AnalysisDimensionConfig = {
  includeDiseaseMedicine: true,
  includeTongguan: true,
  includeClassicPattern: true,
  includePeachBlossomDetail: true,
  includeLifespan: false,
  includeFuxin: false,
  includeKongWang: false,
  includeXingChong: false,
  includePeriod: false
}

/**
 * 场景对应的分析维度
 */
const SCENE_ANALYSIS_DIMENSIONS: Record<string, AnalysisDimensionConfig> = {
  marriage: {
    includeDiseaseMedicine: true,
    includeTongguan: true,
    includeClassicPattern: true,
    includePeachBlossomDetail: true,
    includeLifespan: false,
    includeFuxin: true,
    includeKongWang: true,
    includeXingChong: true,
    includePeriod: false
  },
  career: {
    includeDiseaseMedicine: true,
    includeTongguan: true,
    includeClassicPattern: true,
    includePeachBlossomDetail: false,
    includeLifespan: false,
    includeFuxin: false,
    includeKongWang: false,
    includeXingChong: true,
    includePeriod: true
  },
  health: {
    includeDiseaseMedicine: true,
    includeTongguan: false,
    includeClassicPattern: false,
    includePeachBlossomDetail: false,
    includeLifespan: true,
    includeFuxin: false,
    includeKongWang: false,
    includeXingChong: false,
    includePeriod: false
  },
  wealth: {
    includeDiseaseMedicine: true,
    includeTongguan: true,
    includeClassicPattern: true,
    includePeachBlossomDetail: false,
    includeLifespan: false,
    includeFuxin: false,
    includeKongWang: true,
    includeXingChong: true,
    includePeriod: false
  },
  study: {
    includeDiseaseMedicine: false,
    includeTongguan: false,
    includeClassicPattern: true,
    includePeachBlossomDetail: false,
    includeLifespan: false,
    includeFuxin: false,
    includeKongWang: false,
    includeXingChong: false,
    includePeriod: true
  },
  children: {
    includeDiseaseMedicine: true,
    includeTongguan: false,
    includeClassicPattern: false,
    includePeachBlossomDetail: true,
    includeLifespan: false,
    includeFuxin: true,
    includeKongWang: true,
    includeXingChong: true,
    includePeriod: false
  },
  parents: {
    includeDiseaseMedicine: true,
    includeTongguan: false,
    includeClassicPattern: false,
    includePeachBlossomDetail: false,
    includeLifespan: true,
    includeFuxin: false,
    includeKongWang: true,
    includeXingChong: true,
    includePeriod: false
  },
  general: {
    includeDiseaseMedicine: true,
    includeTongguan: true,
    includeClassicPattern: true,
    includePeachBlossomDetail: true,
    includeLifespan: false,
    includeFuxin: false,
    includeKongWang: false,
    includeXingChong: false,
    includePeriod: false
  }
}

/**
 * 生成经典格局分析片段
 */
function generateClassicPatternSection(chartResult: BaziChartResult): string {
  if (!chartResult.pillars) return ''

  const dayStem = chartResult.pillars.day.gan
  const monthBranch = chartResult.pillars.month.zhi

  const classicPattern = identifyClassicPattern(
    dayStem,
    monthBranch,
    chartResult.pillars,
    chartResult.hiddenStems,
    chartResult.analysis?.mingGe?.pattern
  )

  if (!classicPattern) return ''

  return `【经典格局】${classicPattern.name}(${classicPattern.level}) | ${classicPattern.description} | 喜:${classicPattern.favorableWuxing.join('、')} 忌:${classicPattern.unfavorableWuxing.join('、')}`
}

/**
 * 生成桃花详解片段
 */
function generatePeachBlossomDetailSection(chartResult: BaziChartResult): string {
  const taohuaShensha = chartResult.shensha?.global?.find(s => s.includes('桃花'))
  if (!taohuaShensha) return ''

  const lines = [`【桃花详解】命带桃花：${taohuaShensha}`]
  const pillarNames = ['year', 'month', 'day', 'hour'] as const
  const pillarLabels = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' } as const
  for (const pillar of pillarNames) {
    const pillarTaohua = chartResult.shensha?.[pillar]?.find(s => s.includes('桃花'))
    if (pillarTaohua) {
      const d = getPeachBlossomDetail(pillar)
      lines.push(`${pillarLabels[pillar]}:${d.type} | ${d.description} | 利:${d.favorable} 忌:${d.unfavorable}`)
    }
  }

  return lines.join('\n')
}

/**
 * 生成限运分析片段
 */
function generatePeriodAnalysisSection(chartResult: BaziChartResult): string {
  const { analysis } = chartResult
  const period = generatePeriodAnalysis(
    analysis.mingGe,
    analysis.dayMasterStrength.status,
    chartResult.pillars?.day.gan || ''
  )

  return `【限运分析】少年(1-16):${period.earlyStage.description}重点:${period.earlyStage.focus.join('、')}；青中年(17-45):${period.midStage.description}重点:${period.midStage.focus.join('、')}；中老年(46+):${period.lateStage.description}重点:${period.lateStage.focus.join('、')}`
}

/**
 * 根据场景生成增强分析片段
 */
export function generateEnhancedAnalysisSection(
  chartResult: BaziChartResult,
  scene: string = 'general'
): string {
  const config = SCENE_ANALYSIS_DIMENSIONS[scene] || DEFAULT_ANALYSIS_DIMENSIONS
  const sections: string[] = []

  // 病药法
  if (config.includeDiseaseMedicine) {
    const wuxingCounts = chartResult.wuxingStrength?.percentages
    if (wuxingCounts && chartResult.analysis?.mingGe) {
      const dm = detectDiseaseMedicine(
        wuxingCounts,
        chartResult.analysis.mingGe,
        chartResult.analysis.dayMasterStrength.status
      )
      if (dm.hasDisease) {
        sections.push(`【病药法】病:${dm.disease} | 药:${dm.medicine}`)
      }
    }
  }

  // 通关法
  if (config.includeTongguan) {
    const wuxingCounts = chartResult.wuxingStrength?.percentages
    const favorableWuxing = chartResult.analysis?.usefulGod?.favorableWuxing || []
    const unfavorableWuxing = chartResult.analysis?.usefulGod?.unfavorableWuxing || []
    if (wuxingCounts && favorableWuxing.length > 0) {
      const tg = detectTongguanNeed(wuxingCounts, favorableWuxing, unfavorableWuxing)
      if (tg.need && tg.conflict && tg.tongguan) {
        sections.push(`【通关法】${tg.conflict[0]}与${tg.conflict[1]}相战，以${tg.tongguan}通关调和`)
      }
    }
  }

  // 经典格局
  if (config.includeClassicPattern) {
    const classicSection = generateClassicPatternSection(chartResult)
    if (classicSection) sections.push(classicSection)
  }

  // 桃花详解
  if (config.includePeachBlossomDetail) {
    const taohuaSection = generatePeachBlossomDetailSection(chartResult)
    if (taohuaSection) sections.push(taohuaSection)
  }

  // 伏吟反吟
  if (config.includeFuxin) {
    sections.push(generateAnalysisDimensionHints('fuxin'))
  }

  // 空亡详解
  if (config.includeKongWang) {
    sections.push(generateAnalysisDimensionHints('kongwang'))
  }

  // 刑冲合会破
  if (config.includeXingChong) {
    sections.push(generateAnalysisDimensionHints('xingchong'))
  }

  // 限运分析
  if (config.includePeriod) {
    const periodSection = generatePeriodAnalysisSection(chartResult)
    if (periodSection) sections.push(periodSection)
  }

  // 寿元分析
  if (config.includeLifespan) {
    sections.push(generateAnalysisDimensionHints('lifespan'))
  }

  return sections.join('\n\n')
}

/**
 * 生成合盘分析增强片段
 */
export function generateCompatibilityEnhancedSection(type: 'marriage' | 'children' | 'parents' | 'siblings'): string {
  switch (type) {
    case 'marriage':
      return generateMarriageMatchHints()
    case 'children':
      return generateChildrenFateHints()
    case 'parents':
      return generateParentsAnalysisHints()
    case 'siblings':
      return generateSiblingsAnalysisHints()
    default:
      return ''
  }
}

/**
 * 根据问题文本推断分析场景
 */
export function detectQuestionScene(questionText: string): string {
  const text = questionText.trim()
  if (!text) return 'general'

  if (/婚|恋|感情|配[偶偶]|伴侣|夫妻|姻缘/.test(text)) return 'marriage'
  if (/事业|工作|职业|创业|升职|跳槽/.test(text)) return 'career'
  if (/财|投资|理财|偏财|正财/.test(text)) return 'wealth'
  if (/健康|身体|疾病|体质/.test(text)) return 'health'
  if (/子女|孩子|宝宝|生育|亲子/.test(text)) return 'children'
  if (/父母|爸妈|赡养/.test(text)) return 'parents'
  if (/学业|考试|升学/.test(text)) return 'study'

  return 'general'
}
