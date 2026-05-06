/**
 * 八字 AI 提示词模块
 *
 * 前端调用链：
 *   单盘 → buildPromptFromConfig()
 *   合盘 → getCompatibilityPrompt()
 *
 * 两者均通过 prompt-engine.ts 统一导出给 ResultPage.tsx
 */

import type { BaziChartResult } from '@/utils/bazi/baziTypes'
import { formatBaziForPrompt, type PromptChartScene } from '@/utils/bazi/baziAnalysisFormatter'
import type { FortuneSelectionContext } from '@/utils/bazi/fortuneSelection'
import {
  generateEnhancedAnalysisSection,
  generateCompatibilityEnhancedSection,
  detectQuestionScene,
} from '@/utils/bazi/baziPromptEnhancement'

// ─── 类型 ──────────────────────────────────────────

export interface AIPromptOption {
  id: string;
  prompt: string;
  scene?: string;
}

// ─── 系统提示词 ────────────────────────────────────

const BASE_SYSTEM_ROLE = '你是资深八字命理师，熟悉《渊海子平》《滴天髓》《三命通会》《穷通宝鉴》。'

const BASE_SYSTEM_RULES = [
  '只基于提供的命盘、岁运和问题作答',
  '判断喜忌：先旺衰月令→格局调候→取用路径十神→神煞；普通格局按扶抑，专旺从格按顺势；神煞不得单独推翻主体判断',
  '说清核心用神、辅助喜用与主忌，结论与推理不一致时必须指出冲突点',
  '信息不足时说明证据不足，不得强行给确定结论',
  '用通俗中文，不写套话，不复述无关背景',
  '用神优先级：扶抑法为基础，病药法找突出问题，通关法调两神相战，调候法调寒热燥湿，专旺从势法顺势',
]

const COMPAT_SYSTEM_ADDONS = [
  '只基于提供的双方命盘和问题作答',
  '先判断关系主基调',
  '再讲2到4个关键点',
  '重点说相处模式、互补点、冲突点和建议',
]

function buildSystemText(rules: readonly string[] = BASE_SYSTEM_RULES): string {
  return [
    BASE_SYSTEM_ROLE,
    '要求：',
    ...rules.map(line => `- ${line}`),
  ].join('\n')
}

/** 单盘系统提示词 */
const SYSTEM_PROMPT = buildSystemText()
/** 合盘系统提示词 */
const COMPATIBILITY_SYSTEM_PROMPT = buildSystemText([...BASE_SYSTEM_RULES, ...COMPAT_SYSTEM_ADDONS])

// ─── 工具函数 ──────────────────────────────────────

function buildPromptSection(title: string, content: string): string {
  return `【${title}】\n${content}`
}

function joinPromptSections(sections: Array<string | null | undefined>): string {
  return sections.filter(Boolean).join('\n\n')
}

function resolvePromptScene(promptId: string): PromptChartScene {
  // 当前快捷按钮均已走 general 场景格式化，保留 fortune 分支以备将来扩展
  if (promptId.startsWith('ai-fortune-') || promptId === 'ai-current-luck' || promptId === 'ai-this-year') {
    return 'fortune'
  }
  return 'general'
}

function formatFortuneSelectionSection(ctx: FortuneSelectionContext | null | undefined): string {
  if (!ctx) return ''
  const { promptPayload } = ctx
  const lines = [promptPayload.scopeLabel, ...promptPayload.summaryLines]
  if (promptPayload.breakdownTitle && promptPayload.breakdownLines?.length) {
    lines.push(promptPayload.breakdownTitle)
    lines.push(...promptPayload.breakdownLines.map((line, i) => `${i + 1}. ${line}`))
  }
  return lines.join('\n')
}

function buildFortunePromptAddon(promptId: string, ctx: FortuneSelectionContext | null): string {
  if (!ctx) return ''
  if (promptId === 'ai-fortune-detail') {
    if (ctx.scope === 'dayun') return '按逐年列表依次分析这一步大运，先总后分。'
    if (ctx.scope === 'year') return '按流月列表依次分析这一年，先总后分。'
    if (ctx.scope === 'month') return '按流日列表依次分析这个流月，先总后分。'
    return '聚焦这个流日的主题、机会风险和建议。'
  }
  if (promptId === 'ai-fortune-overview') return '聚焦整体节奏、机会、风险和应对。'
  return ''
}

// ─── 快捷按钮配置 ──────────────────────────────────

export const BAZI_AI_PROMPTS = {
  /** 单盘快捷选项 — 仅保留前端 baziSingleShortcutActions 实际引用的 promptId */
  single: [
    {
      id: 'ai-mingge-zonglun',
      prompt: '判断日主旺衰、格局层次、用神喜忌，抓2到3个最有辨识度的影响，讲清命局的病与药，并给出调整建议。',
      scene: 'general'
    },
    {
      id: 'ai-career',
      prompt: '判断命局更适合守成、开拓、技术、管理还是经营，再说明当前阶段的赚钱方式、职业方向和风险点。',
      scene: 'career'
    },
    {
      id: 'ai-wealth-timing',
      prompt: '判断财运应期，说明财更容易在哪些阶段、年份或环境里起来，再指出机会点和破财情形。',
      scene: 'wealth'
    },
    {
      id: 'ai-marriage',
      prompt: '围绕配偶星、夫妻宫和相处模式，判断感情优势、隐患与关系节奏，再说明适合的对象、容易推进的阶段和经营建议。',
      scene: 'marriage'
    },
    {
      id: 'ai-children-fate',
      prompt: '判断子女缘分深浅、子女性格倾向和教育相处方式，说明更该关注生育时机、子女互动还是教育重点。',
      scene: 'children'
    },
    {
      id: 'ai-health',
      prompt: '判断最需要注意的身体倾向与生活习惯问题，说明风险主要落在哪些系统或体质失衡上，再给出饮食、作息、运动建议。',
      scene: 'health'
    },
  ] as AIPromptOption[],
  /** 合盘快捷选项 — 仅保留前端 baziCompatibilityShortcutActions 实际引用的 promptId */
  combined: [
    {
      id: 'ai-compat-marriage',
      prompt: '判断两人的婚恋匹配度是互补、互耗还是强吸引强摩擦，再说明相处优势、冲突来源、长期走向和相处建议。',
      scene: 'marriage'
    },
    {
      id: 'ai-compat-career',
      prompt: '判断合作是否顺手、谁主导、谁执行、谁控风险，再说明最强互补点、最大利益冲突点和是否适合长期合伙。',
      scene: 'career'
    },
    {
      id: 'ai-compat-friendship',
      prompt: '判断两人的相处模式是容易投缘、容易互补还是容易暗中较劲，再说明适合的距离和相处提醒。',
      scene: 'general'
    },
    {
      id: 'ai-compat-children',
      prompt: '从双方食伤星、子女宫和桃花配合角度，判断子女缘分的深浅、子女性格倾向和亲子相处重点。',
      scene: 'children'
    },
    {
      id: 'ai-compat-parents',
      prompt: '从双方父母星、父母宫和当前岁运切入，判断双方父母健康状况、需要关注的风险方向和赡养建议。',
      scene: 'parents'
    },
    {
      id: 'ai-compat-siblings',
      prompt: '从双方比劫关系、命宫和相处模式切入，判断两人之间兄弟朋友关系的亲疏、助力与牵制、相处建议。',
      scene: 'general'
    },
  ] as AIPromptOption[]
}

// ─── 单盘提示词构建（主入口） ──────────────────────

type SinglePromptConfig = typeof BAZI_AI_PROMPTS.single[number]

/**
 * 构建单盘八字提示词
 *
 * 主路径：根据 selectedOption 匹配 BAZI_AI_PROMPTS.single 配置，
 *         注入增强分析（病药法/通关法/经典格局/神煞详解等）
 * fallback：配置匹配不到时走基础拼装
 */
export function buildPromptFromConfig(
  questionText: string,
  selectedOption: AIPromptOption,
  chartResult: BaziChartResult | null,
  fortuneSelectionContext: FortuneSelectionContext | null = null
): { system: string; user: string } {
  const promptConfig: SinglePromptConfig | null =
    chartResult?.pillars
      ? BAZI_AI_PROMPTS.single.find(c => c.id === selectedOption.id) ?? null
      : null

  // ── 主路径 ──
  if (promptConfig) {
    const chartData = chartResult
      ? formatBaziForPrompt(chartResult, selectedOption, resolvePromptScene(promptConfig.id))
      : '无法获取命盘数据。'
    const fortuneSection = formatFortuneSelectionSection(fortuneSelectionContext)
    const fortuneAddon = buildFortunePromptAddon(promptConfig.id, fortuneSelectionContext)
    const task = [promptConfig.prompt, fortuneAddon].filter(Boolean).join(' ')

    // 增强分析片段
    let enhancedSection = ''
    if (chartResult) {
      const scene = selectedOption.scene || detectQuestionScene(questionText)
      enhancedSection = generateEnhancedAnalysisSection(chartResult, scene)
    }

    return {
      system: SYSTEM_PROMPT,
      user: joinPromptSections([
        buildPromptSection('当前时间', new Date().toLocaleString('zh-CN')),
        buildPromptSection('排盘信息', [chartData, enhancedSection].filter(Boolean).join('\n')),
        fortuneSection ? buildPromptSection('分析对象', fortuneSection) : '',
        buildPromptSection('问题', questionText.trim() || '请先做整体解读。'),
        buildPromptSection('任务', task || '请直接判断重点。'),
        buildPromptSection('输出要求', '先给核心判断，再展开最关键的 2 到 4 个重点。'),
      ])
    }
  }

  // ── fallback ──
  const chartData = chartResult?.pillars
    ? formatBaziForPrompt(chartResult, selectedOption, 'general')
    : '命盘数据格式不支持。'

  return {
    system: SYSTEM_PROMPT,
    user: joinPromptSections([
      buildPromptSection('当前时间', new Date().toLocaleString('zh-CN')),
      buildPromptSection('排盘信息', chartData),
      buildPromptSection('问题', questionText.trim() || '请先做整体解读。'),
      buildPromptSection('任务', '请直接判断重点。'),
      buildPromptSection('输出要求', '先给结论，再补关键依据与建议。'),
    ])
  }
}

// ─── 合盘提示词构建（主入口） ──────────────────────

export type CompatType = 'marriage' | 'children' | 'parents' | 'siblings'

/**
 * 构建合盘八字提示词
 *
 * 接受原始 BaziChartResult，内部完成格式化 + 增强分析注入
 */
export function getCompatibilityPrompt(
  questionText: string,
  baziResult1: BaziChartResult | null,
  baziResult2: BaziChartResult | null,
  compatType?: CompatType
): { system: string; user: string } {
  const data1 = baziResult1 ? formatBaziForPrompt(baziResult1, null, 'compatibility') : '无法获取第一人命盘数据。'
  const data2 = baziResult2 ? formatBaziForPrompt(baziResult2, null, 'compatibility') : '无法获取第二人命盘数据。'

  const enhancedSection = compatType ? generateCompatibilityEnhancedSection(compatType) : ''

  return {
    system: COMPATIBILITY_SYSTEM_PROMPT,
    user: joinPromptSections([
      buildPromptSection('当前时间', new Date().toLocaleString('zh-CN')),
      buildPromptSection('第一人排盘信息', data1),
      buildPromptSection('第二人排盘信息', data2),
      enhancedSection ? buildPromptSection('合盘分析框架', enhancedSection) : '',
      buildPromptSection('问题', questionText.trim() || '请先从整体关系匹配度和相处建议开始分析。'),
      buildPromptSection('任务', '请先判断关系主基调，再说明相处模式、互补点、冲突点和建议。'),
      buildPromptSection('输出要求', '先给关系结论，再展开重点。'),
    ])
  }
}
