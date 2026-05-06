import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

test('八字 AI 系统规则明确要求复核命盘中已给出的喜忌结论', () => {
  const source = readFileSync(resolve('src/utils/ai/aiPrompts.ts'), 'utf8')

  assert.match(source, /《穷通宝鉴》/)
  assert.match(source, /判断喜忌/)
  assert.match(source, /先旺衰月令.*格局调候.*取用路径十神.*神煞/)
  assert.match(source, /普通格局按扶抑/)
  assert.match(source, /专旺从格按顺势/)
  assert.match(source, /神煞不得单独推翻主体判断/)
  assert.match(source, /说清核心用神/)
  assert.match(source, /结论与推理不一致时必须指出冲突点/)
  assert.match(source, /证据不足/)
  assert.match(source, /用神优先级/)
  assert.doesNotMatch(source, /本地/)
})

test('八字盘面格式化会把喜忌五行和十神清单直接写进提示词', () => {
  const source = readFileSync(resolve('src/utils/bazi/baziAnalysisFormatter.ts'), 'utf8')

  assert.match(source, /主用\$\{primaryFavorableWuxing\}/)
  assert.match(source, /辅.*secondaryFavorableWuxing/)
  assert.match(source, /主忌\$\{primaryUnfavorableWuxing\}/)
  assert.match(source, /喜忌五行:/)
  assert.match(source, /喜忌十神:/)
  assert.match(source, /类别: 喜/)
  assert.match(source, /旺衰拆分:/)
  assert.match(source, /格局依据:/)
  assert.match(source, /月令:/)
  assert.match(source, /通根:/)
  assert.match(source, /帮扶:/)
  assert.match(source, /克泄耗:/)
})

test('结果页摘要会突出核心用神与核心忌神，不再只展示并列清单', () => {
  const source = readFileSync(resolve('src/pages/ResultPage.tsx'), 'utf8')

  assert.match(source, /核心用神/)
  assert.match(source, /核心忌神/)
  assert.match(source, /主用:/)
  assert.match(source, /辅助:/)
  assert.match(source, /主忌:/)
  assert.match(source, /次忌:/)
})

test('八字单盘提示词统一改为 section 结构', () => {
  const source = readFileSync(resolve('src/utils/ai/aiPrompts.ts'), 'utf8')

  assert.doesNotMatch(source, /首句固定写成“核心用神：……，辅助喜用：……，主忌：……。”/)
  assert.doesNotMatch(source, /CORE_USEFUL_GOD_OPENING/)
  assert.match(source, /buildPromptSection\('当前时间'/)
  assert.match(source, /buildPromptSection\('排盘信息'/)
  assert.match(source, /buildPromptSection\('问题'/)
  assert.match(source, /buildPromptSection\('任务'/)
  assert.match(source, /buildPromptSection\('输出要求'/)
  assert.doesNotMatch(source, /输出：先给结论，再补关键依据与建议。/)
})

test('八字主提示词不再区分简洁模式，统一由同一套系统规则驱动', () => {
  const aiPromptsSource = readFileSync(resolve('src/utils/ai/aiPrompts.ts'), 'utf8')

  assert.doesNotMatch(aiPromptsSource, /conciseSystem/)
  assert.doesNotMatch(aiPromptsSource, /isSimpleQuestion/)
  assert.doesNotMatch(aiPromptsSource, /useConciseMode/)
  assert.match(aiPromptsSource, /buildPromptSection\('分析对象'/)
  assert.match(aiPromptsSource, /buildPromptSection\('输出要求', '先给核心判断，再展开最关键的 2 到 4 个重点。'\)/)
})

test('合盘提示词不应误要求使用单盘核心用神句式', () => {
  const source = readFileSync(resolve('src/utils/ai/aiPrompts.ts'), 'utf8')
  const compatibilityBlock = source.match(/compatibility:\s*\[[\s\S]*?\]/)?.[0] || ''

  assert.doesNotMatch(compatibilityBlock, /核心用神：……，辅助喜用：……，主忌：……/)
})

test('八字提示词各场景默认保留规则与取用路径信息', () => {
  const source = readFileSync(resolve('src/utils/bazi/baziAnalysisFormatter.ts'), 'utf8')
  const includeRulesTrueCount = (source.match(/includeRules: true/g) || []).length

  assert.ok(includeRulesTrueCount >= 5)
  assert.doesNotMatch(source, /includeRules: false/)
})

test('五行分布计算不再派生独立的旺衰与用忌结论', () => {
  const typesSource = readFileSync(resolve('src/utils/bazi/baziTypes.ts'), 'utf8')
  const calculatorSource = readFileSync(resolve('src/utils/bazi/WuxingCalculator.ts'), 'utf8')
  const resultPageSource = readFileSync(resolve('src/pages/ResultPage.tsx'), 'utf8')
  const wuxingStrengthDetailsBlock = typesSource.match(/export interface WuxingStrengthDetails \{[\s\S]*?\n\}/)?.[0] || ''

  assert.doesNotMatch(wuxingStrengthDetailsBlock, /yongShen:/)
  assert.doesNotMatch(wuxingStrengthDetailsBlock, /jiShen:/)
  assert.doesNotMatch(wuxingStrengthDetailsBlock, /suggestions:/)
  assert.doesNotMatch(wuxingStrengthDetailsBlock, /status: string;/)
  assert.doesNotMatch(calculatorSource, /_determineStrengthStatus/)
  assert.doesNotMatch(calculatorSource, /_determineYongShen/)
  assert.doesNotMatch(resultPageSource, /wuxingStrength\.status/)
})

test('分析结果结构不再保留重复字段', () => {
  const typesSource = readFileSync(resolve('src/utils/bazi/baziTypes.ts'), 'utf8')
  const pipelineSource = readFileSync(resolve('src/utils/bazi/baziAnalysisPipeline.ts'), 'utf8')
  const resultPageSource = readFileSync(resolve('src/pages/ResultPage.tsx'), 'utf8')
  const analysisResultBlock = typesSource.match(/export interface BaziAnalysisResult \{[\s\S]*?\n\}/)?.[0] || ''

  assert.doesNotMatch(analysisResultBlock, /^\s{2}dayMasterStatus:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}patternType:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}patternDescription:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}favorableElements:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}unfavorableElements:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}rootAnalysis:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}supportAnalysis:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}seasonalStatus:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}avoidGod:/m)
  assert.doesNotMatch(analysisResultBlock, /^\s{2}circulation:/m)
  assert.doesNotMatch(analysisResultBlock, /dayMasterStatus:/)
  assert.doesNotMatch(pipelineSource, /dayMasterStatus:\s*state\.dayMasterStrength\.status/)
  assert.doesNotMatch(pipelineSource, /dayMasterStatus:\s*state\.seasonalStatus/)
  assert.doesNotMatch(pipelineSource, /patternType:\s*state\.pattern\.type/)
  assert.doesNotMatch(pipelineSource, /patternDescription:\s*state\.pattern\.description/)
  assert.doesNotMatch(pipelineSource, /favorableElements:\s*state\.usefulGod\.favorableWuxing/)
  assert.doesNotMatch(pipelineSource, /unfavorableElements:\s*state\.usefulGod\.unfavorableWuxing/)
  assert.doesNotMatch(pipelineSource, /rootAnalysis:\s*state\.rootAnalysis/)
  assert.doesNotMatch(pipelineSource, /supportAnalysis:\s*state\.supportAnalysis/)
  assert.doesNotMatch(pipelineSource, /seasonalStatus:\s*\{/)
  assert.doesNotMatch(pipelineSource, /avoidGod:\s*state\.usefulGod\.avoid/)
  assert.doesNotMatch(pipelineSource, /circulation:\s*state\.usefulGod\.circulation/)
  assert.doesNotMatch(resultPageSource, /analysis\.avoidGod/)
  assert.doesNotMatch(resultPageSource, /analysis\.favorableElements/)
  assert.doesNotMatch(resultPageSource, /analysis\.unfavorableElements/)
})

test('日主旺衰只保留 status 字段且管道不暴露未使用阶段接口', () => {
  const typesSource = readFileSync(resolve('src/utils/bazi/baziTypes.ts'), 'utf8')
  const formatterSource = readFileSync(resolve('src/utils/bazi/baziAnalysisFormatter.ts'), 'utf8')
  const pipelineSource = readFileSync(resolve('src/utils/bazi/baziAnalysisPipeline.ts'), 'utf8')
  const usefulGodBlock = typesSource.match(/export interface UsefulGodAnalysis \{[\s\S]*?\n\}/)?.[0] || ''
  const dayMasterStrengthBlock = typesSource.match(/export interface DayMasterStrengthAnalysis \{[\s\S]*?\n\}/)?.[0] || ''

  assert.match(dayMasterStrengthBlock, /^\s{2}status:\s*string;/m)
  assert.doesNotMatch(dayMasterStrengthBlock, /^\s{2}strength:\s*string;/m)
  assert.doesNotMatch(usefulGodBlock, /^\s{2}circulation:\s*string;/m)
  assert.doesNotMatch(usefulGodBlock, /^\s{2}matchedRuleIds:/m)
  assert.match(formatterSource, /dayMasterStrength\.status/)
  assert.doesNotMatch(formatterSource, /dayMasterStrength\.strength/)
  assert.doesNotMatch(pipelineSource, /runStages\s*\(/)
})

test('格局结构不再保留未消费的成功标记字段', () => {
  const typesSource = readFileSync(resolve('src/utils/bazi/baziTypes.ts'), 'utf8')
  const patternSource = readFileSync(resolve('src/utils/bazi/baziPatternStrategy.ts'), 'utf8')
  const calculatorSource = readFileSync(resolve('src/utils/bazi/baziCalculator.ts'), 'utf8')
  const patternBlock = typesSource.match(/export interface PatternAnalysis \{[\s\S]*?\n\}/)?.[0] || ''

  assert.doesNotMatch(patternBlock, /success:/)
  assert.doesNotMatch(patternBlock, /successReason:/)
  assert.doesNotMatch(patternBlock, /type:/)
  assert.doesNotMatch(patternBlock, /description:/)
  assert.doesNotMatch(patternSource, /successReason/)
  assert.doesNotMatch(patternSource, /success:\s*true/)
  assert.doesNotMatch(patternSource, /type:\s*['"]/)
  assert.doesNotMatch(patternSource, /description\s*=/)
  assert.doesNotMatch(patternSource, /tenGod\s*===\s*['"]比肩['"]\s*\)\s*\{\s*return\s*\{\s*[^}]*success:\s*true/)
  assert.doesNotMatch(calculatorSource, /successReason:/)
  assert.doesNotMatch(calculatorSource, /success:\s*false/)
  assert.doesNotMatch(calculatorSource, /mingGe:\s*\{\s*pattern:\s*'未知',\s*type:/)
})
