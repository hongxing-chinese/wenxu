import test from 'node:test'
import assert from 'node:assert/strict'

import { baziCalculator } from '../src/utils/bazi/baziCalculator'
import { formatBaziForPrompt } from '../src/utils/bazi/baziAnalysisFormatter'

test('核心判断依据会输出旺衰拆分与喜忌类别，避免把类别误写成具体十神', () => {
  const result = baziCalculator.calculateBazi({
    year: 1995,
    month: 8,
    day: 15,
    timeIndex: 8,
    gender: 'female',
    isLunar: false,
    isLeapMonth: false,
    useTrueSolarTime: false,
  })

  const text = formatBaziForPrompt(result)

  assert.match(text, /【核心判断依据】/)
  assert.match(text, /旺衰拆分: 月令:[+-]?\d+(?:\.\d+)? \| 成局:[+-]?\d+(?:\.\d+)? \| 通根:[+-]?\d+(?:\.\d+)? \| 帮扶:[+-]?\d+(?:\.\d+)? \| 克泄耗:[+-]?\d+(?:\.\d+)?/)
  assert.match(text, /格局依据: /)
  assert.match(text, /用神: 主用/)
  assert.match(text, /主忌/)
  assert.match(text, /喜忌五行:/)
  assert.match(text, /喜忌十神:/)
  assert.match(text, /类别: 喜/)
  assert.match(text, /类别: 喜(比劫|食伤|财星|官杀|印星)/)
  assert.match(text, /忌(比劫|食伤|财星|官杀|印星)/)
  assert.doesNotMatch(text, /类别: 喜(正印|偏印|正官|七杀|正财|偏财|食神|伤官|比肩|劫财) /)
  assert.doesNotMatch(text, /忌(正印|偏印|正官|七杀|正财|偏财|食神|伤官|比肩|劫财)\n/)
})
