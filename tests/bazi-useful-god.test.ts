import test from 'node:test'
import assert from 'node:assert/strict'

import { determineUsefulGod } from '../src/utils/bazi/baziUsefulGodStrategy'
import type { PatternAnalysis } from '../src/utils/bazi/baziTypes'

test('普通偏财格但身弱时，喜忌仍先按扶抑取印比', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火')

  assert.deepEqual(result.favorableWuxing, ['木', '火'])
  assert.deepEqual(result.unfavorableWuxing, ['土', '金', '水'])
  assert.equal(result.useful, '印星')
  assert.equal(result.avoid, '食伤')
  assert.match(result.strategyTrace?.[0] || '', /普通格局:偏财格，喜忌先按身弱扶抑/)
  assert.ok(result.strategyTrace?.includes('身弱取印比'))
  assert.notEqual(result.useful, '正印')
  assert.notEqual(result.avoid, '食神')
  assert.ok(!result.unfavorable.includes('正印'))
  assert.ok(!result.unfavorable.includes('偏印'))
  assert.ok(!result.unfavorable.includes('比肩'))
  assert.ok(!result.unfavorable.includes('劫财'))
})

test('特殊从格仍按从势规则，不受普通扶抑逻辑干扰', () => {
  const pattern: PatternAnalysis = {
    pattern: '从格',
    isSpecial: true
  }

  const result = determineUsefulGod('极弱', pattern, '火')

  assert.deepEqual(result.favorableWuxing, ['土', '金', '水'])
  assert.deepEqual(result.unfavorableWuxing, ['木', '火'])
  assert.equal(result.useful, '食伤')
  assert.equal(result.avoid, '印星')
  assert.notEqual(result.useful, '食神')
  assert.notEqual(result.avoid, '正印')
  assert.ok(result.strategyTrace?.includes('从格从势取用'))
  assert.ok(!result.strategyTrace?.some(trace => trace.includes('普通格局')))
})

test('土月病药疏泄规则不应一刀切覆盖非土日主的司令取用', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', '辛')

  assert.deepEqual(result.favorableWuxing, ['金', '土', '水'])
  assert.equal(result.useful, '财星')
  assert.equal(result.primaryReason, '司令')
  assert.ok(result.strategyTrace?.includes('司令排序:金'))
  assert.ok(!result.strategyTrace?.includes('病药优先:土'))
})

test('甲日酉月调候不应仍按秋木一律先取水，而应先取火制金暖木', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '酉', undefined, '甲')

  assert.equal(result.favorableWuxing[0], '火')
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-jia-fire-forge'))
})

test('壬日酉月调候应支持日干级规则，优先取木制土清源，而不是停留在普通扶抑', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '酉', undefined, '壬')

  assert.equal(result.favorableWuxing[0], '木')
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:木')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-ren-jia-drain-soil'))
})

test('甲日辰月调候不应仍按春木先火，而应先取金裁木成器', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '辰', undefined, '甲')

  assert.equal(result.favorableWuxing[0], '金')
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:金')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-jia-geng-first'))
})

test('壬日巳月调候应支持先扶日元，不应直接把金印排在最前', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '巳', undefined, '壬')

  assert.equal(result.favorableWuxing[0], '水')
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:水')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-ren-water-self-support'))
})

test('癸日卯月调候应支持庚辛发源规则，不应停留在泛化扶抑', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '卯', undefined, '癸')

  assert.equal(result.favorableWuxing[0], '金')
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:金')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-gui-geng-first'))
})

test('甲日巳月调候应保留先癸后丁庚佐的次序，而不只是首选五行', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '巳', undefined, '甲')

  assert.deepEqual(result.favorableWuxing?.slice(0, 3), ['水', '火', '金'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:水 -> 火 -> 金')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-jia-gui-ding-geng'))
})

test('甲日未月调候应区分午未先后，不应仍与午月同断为先水后火', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '未', undefined, '甲')

  assert.deepEqual(result.favorableWuxing?.slice(0, 3), ['火', '金', '水'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 金 -> 水')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-jia-ding-geng'))
})

test('壬日寅月调候应支持庚丙戊次第，而不是只停留在金水泛扶', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '寅', undefined, '壬')

  assert.deepEqual(result.favorableWuxing?.slice(0, 3), ['金', '火', '土'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:金 -> 火 -> 土')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-ren-geng-bing-wu'))
})

test('壬日未月调候应支持先辛后甲癸次辅，不应只按身弱取印比', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '未', undefined, '壬')

  assert.deepEqual(result.favorableWuxing?.slice(0, 3), ['金', '木', '水'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:金 -> 木 -> 水')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-ren-xin-jia-gui'))
})

test('癸日子月调候应体现先丙解冻再辛滋扶，不应仍只给冬水单取火', () => {
  const pattern: PatternAnalysis = {
    pattern: '正印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '子', undefined, '癸')

  assert.deepEqual(result.favorableWuxing?.slice(0, 2), ['火', '金'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 金')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-gui-bing-xin'))
})

test('癸日辰月清明后调候应专取丙火，不应提前把辛甲并提到同层优先', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '辰', undefined, '癸', {
    currentJieqi: '清明'
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.equal(result.favorableWuxing?.[1], '金')
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-gui-qingming-bing-only'))
})

test('癸日辰月谷雨后调候应兼取辛甲，不应仍按清明后单取丙火', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '辰', undefined, '癸', {
    currentJieqi: '谷雨'
  })

  assert.deepEqual(result.favorableWuxing?.slice(0, 3), ['火', '金', '木'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 金 -> 木')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-gui-guyu-bing-xin-jia'))
})

test('壬日丑月小寒后调候应专用丙火，不应把甲木提前并列', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '壬', {
    currentJieqi: '小寒'
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火')))
  assert.ok(!result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 木')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-ren-xiaohan-bing-only'))
})

test('壬日丑月大寒后调候应丙火仍先且甲木佐之，不应仍与小寒后同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '壬', {
    currentJieqi: '大寒'
  })

  assert.deepEqual(result.favorableWuxing?.slice(0, 2), ['火', '木'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 木')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-ren-dahan-bing-jia'))
})

test('甲日午月无癸透时，调候不应仍固守先水，而应允许丁火权代为先', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '午', undefined, '甲', {
    visibleStems: ['甲', '丙', '丁', '庚'],
    wuxingCounts: { 木: 2, 火: 3, 土: 1, 金: 2, 水: 0 }
  })

  assert.deepEqual(result.favorableWuxing?.slice(0, 3), ['火', '金', '水'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 金 -> 水')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-jia-no-gui-use-ding'))
})

test('乙日午月上半月若柱多金水，调候应改以丙火为先，不应仍一概先取癸水', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '午', undefined, '乙', {
    currentJieqi: '芒种',
    visibleStems: ['乙', '庚', '壬', '辛'],
    wuxingCounts: { 木: 1, 火: 1, 土: 0, 金: 3, 水: 3 }
  })

  assert.deepEqual(result.favorableWuxing?.slice(0, 2), ['火', '水'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 水')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-yi-mangzhong-metal-water-fire-first'))
})

test('己日夏月无癸而壬透时，不应退回普通扶抑，应允许壬水权代润土', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '午', undefined, '己', {
    visibleStems: ['己', '丙', '壬', '甲'],
    wuxingCounts: { 木: 1, 火: 2, 土: 3, 金: 0, 水: 2 }
  })

  assert.deepEqual(result.favorableWuxing?.slice(0, 2), ['水', '火'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:水 -> 火')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-wu-wei-month-ji-no-gui-ren-allowed'))
})

test('己日夏月壬癸并透时，不应仍按无癸有壬权代规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '午', undefined, '己', {
    visibleStems: ['己', '壬', '癸', '甲'],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 0, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-wu-wei-month-ji-no-gui-ren-allowed'))
})

test('乙日酉月秋分后有丙无癸时，不应仍按秋木泛取水，而应先取丙火向阳', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '酉', undefined, '乙', {
    currentJieqi: '秋分',
    visibleStems: ['乙', '丙', '辛', '戊'],
    wuxingCounts: { 木: 1, 火: 2, 土: 2, 金: 2, 水: 1 }
  })

  assert.deepEqual(result.favorableWuxing?.slice(0, 2), ['火', '水'])
  assert.equal(result.primaryReason, '调候')
  assert.ok(result.strategyTrace?.some(trace => trace.includes('调候优先:火 -> 水')))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-yi-qiufen-bing-no-gui'))
})

test('丙日巳月无壬而癸透时，应明确标记癸水只是权代，不应与壬水正用等量齐观', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '巳', undefined, '丙', {
    visibleStems: ['丙', '癸', '甲', '戊'],
    wuxingCounts: { 木: 1, 火: 3, 土: 2, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水权代'))
  assert.ok(result.strategyTrace?.includes('成格层次:不富必贵但逊于壬水正用'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-bing-no-ren-use-gui'))
})

test('丙日巳月壬癸并透时，不应仍按无壬用癸规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '巳', undefined, '丙', {
    visibleStems: ['丙', '壬', '癸', '戊'],
    wuxingCounts: { 木: 0, 火: 3, 土: 2, 金: 0, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-bing-no-ren-use-gui'))
})

test('丙日午月无壬而癸透时，应标记功名层次下降，不应与壬水正用同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '羊刃格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丙', {
    visibleStems: ['丙', '癸', '己', '甲'],
    wuxingCounts: { 木: 1, 火: 4, 土: 1, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水权代'))
  assert.ok(result.strategyTrace?.includes('成格层次:略富贵或功名不久'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-bing-no-ren-use-gui'))
})

test('乙日酉月秋分后有癸无丙时，应明确提示名利虚花，不应与有丙无癸同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '酉', undefined, '乙', {
    currentJieqi: '秋分',
    visibleStems: ['乙', '癸', '辛', '戊'],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水独用'))
  assert.ok(result.strategyTrace?.includes('成格层次:名利虚花'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-yi-qiufen-gui-no-bing'))
})

test('乙日酉月秋分后丙癸并透时，不应仍按有丙无癸或有癸无丙两条偏式误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '酉', undefined, '乙', {
    currentJieqi: '秋分',
    visibleStems: ['乙', '丙', '癸', '辛'],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 2, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-yi-qiufen-bing-no-gui'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-yi-qiufen-gui-no-bing'))
})

test('乙日酉月白露后无癸而壬透时，应明确标记壬水为姑用权代', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '酉', undefined, '乙', {
    currentJieqi: '白露',
    visibleStems: ['乙', '壬', '辛', '戊'],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水权代'))
  assert.ok(result.strategyTrace?.includes('成格层次:姑用，不及癸水正用'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-yi-bailu-ren-temporary'))
})

test('乙日酉月白露后壬癸并透时，不应仍按无癸姑用壬规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '木', '酉', undefined, '乙', {
    currentJieqi: '白露',
    visibleStems: ['乙', '壬', '癸', '辛'],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 2, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-yi-bailu-ren-temporary'))
})

test('丙日巳月无壬而庚癸同透时，应升级为不富必贵层次，不应停留在普通癸水权代', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '巳', undefined, '丙', {
    visibleStems: ['丙', '癸', '庚', '戊'],
    wuxingCounts: { 木: 0, 火: 3, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水权代'))
  assert.ok(result.strategyTrace?.includes('成格层次:见庚透癸，不富必贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-bing-no-ren-gui-geng'))
})

test('丙日寅月无壬而癸透时，应标记仅略富贵，不应与壬水正用同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '寅', undefined, '丙', {
    visibleStems: ['丙', '癸', '庚', '甲'],
    wuxingCounts: { 木: 2, 火: 2, 土: 0, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水权代'))
  assert.ok(result.strategyTrace?.includes('成格层次:略富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-bing-no-ren-use-gui'))
})

test('丙日卯月无壬而己透时，应明确己土只是姑用，层次仅才学衣食', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '卯', undefined, '丙', {
    visibleStems: ['丙', '己', '乙', '辛'],
    wuxingCounts: { 木: 2, 火: 2, 土: 1, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:己土姑用'))
  assert.ok(result.strategyTrace?.includes('成格层次:有才学但难成名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-bing-no-ren-ji-temporary'))
})

test('戊日未月有癸无丙见甲时，应标记可许秀才，不应与无甲者同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '未', undefined, '戊', {
    visibleStems: ['戊', '癸', '甲', '辛'],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水为主，甲木辅佐'))
  assert.ok(result.strategyTrace?.includes('成格层次:见甲可许秀才'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-wu-gui-jia-no-bing'))
})

test('戊日未月丙癸并透时，不应仍按有癸无丙见甲规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '未', undefined, '戊', {
    visibleStems: ['戊', '癸', '丙', '甲'],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 0, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-wu-gui-jia-no-bing'))
})

test('戊日未月有癸无丙无甲时，应标记仅略富，不应误判为见甲层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '未', undefined, '戊', {
    visibleStems: ['戊', '癸', '辛', '己'],
    wuxingCounts: { 木: 0, 火: 0, 土: 4, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水独用'))
  assert.ok(result.strategyTrace?.includes('成格层次:无甲略富'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-wu-gui-no-bing-no-jia'))
})

test('丙日寅月双庚无辛时，应提升为清贵，不应与庚辛混杂同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '寅', undefined, '丙', {
    visibleStems: ['丙', '庚', '庚', '甲'],
    wuxingCounts: { 木: 2, 火: 2, 土: 0, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水为尊，庚金并透'))
  assert.ok(result.strategyTrace?.includes('成格层次:双庚无辛，定主清贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-bing-double-geng-no-xin'))
})

test('丙日寅月三庚并透时，不应仍按双庚无辛清贵误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '寅', undefined, '丙', {
    visibleStems: ['丙', '庚', '庚', '庚'],
    wuxingCounts: { 木: 0, 火: 1, 土: 0, 金: 3, 水: 1 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:双庚无辛，定主清贵'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-bing-double-geng-no-xin'))
})

test('丙日寅月庚辛并透时，应降为常人，不应仍按双庚清贵误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '寅', undefined, '丙', {
    visibleStems: ['丙', '庚', '辛', '甲'],
    wuxingCounts: { 木: 2, 火: 2, 土: 0, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:庚辛混杂'))
  assert.ok(result.strategyTrace?.includes('成格层次:常人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-bing-geng-xin-mixed'))
})

test('丙日午月独壬无庚时，应标记仅主页监，不应误判为上命', () => {
  const pattern: PatternAnalysis = {
    pattern: '羊刃格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丙', {
    visibleStems: ['丙', '壬', '甲', '戊'],
    wuxingCounts: { 木: 1, 火: 3, 土: 2, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水正用'))
  assert.ok(result.strategyTrace?.includes('成格层次:独壬无庚，主衣衿页监'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-bing-ren-no-geng'))
})

test('丙日午月壬癸并透而无庚时，不应仍按独壬无庚页监规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '羊刃格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丙', {
    visibleStems: ['丙', '壬', '癸', '甲'],
    wuxingCounts: { 木: 1, 火: 3, 土: 0, 金: 0, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-bing-ren-no-geng'))
})

test('丙日午月双壬无庚时，不应仍按独壬无庚页监规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '羊刃格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丙', {
    visibleStems: ['丙', '壬', '壬', '甲'],
    wuxingCounts: { 木: 1, 火: 3, 土: 0, 金: 0, 水: 2 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:独壬无庚，主衣衿页监'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-bing-ren-no-geng'))
})

test('丙日午月丁壬同透时，应提示丁壬化合降为平人', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丙', {
    visibleStems: ['丙', '丁', '壬', '甲'],
    wuxingCounts: { 木: 1, 火: 4, 土: 0, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:丁壬化合'))
  assert.ok(result.strategyTrace?.includes('成格层次:平人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-bing-ding-ren-he'))
})

test('丙日午月壬庚高透又见戊土时，应降为异路功名，不应仍按上命直断', () => {
  const pattern: PatternAnalysis = {
    pattern: '羊刃格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丙', {
    visibleStems: ['丙', '壬', '庚', '戊'],
    wuxingCounts: { 木: 0, 火: 3, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:戊己杂乱'))
  assert.ok(result.strategyTrace?.includes('成格层次:异路功名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-bing-ren-geng-tu-misc'))
})

test('丙日午月虽壬庚高透但不见戊己时，不应仍按戊己杂乱降格误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '羊刃格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丙', {
    visibleStems: ['丙', '壬', '庚', '甲'],
    wuxingCounts: { 木: 1, 火: 3, 土: 0, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-bing-ren-geng-tu-misc'))
})

test('丙日辰月有甲无壬时，应标记劳碌浊富，不应误判为壬甲并用富贵路数', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '辰', undefined, '丙', {
    visibleStems: ['丙', '甲', '戊', '辛'],
    wuxingCounts: { 木: 1, 火: 2, 土: 3, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:甲木独辅'))
  assert.ok(result.strategyTrace?.includes('成格层次:劳碌浊富'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-bing-jia-no-ren'))
})

test('丁日卯月庚乙俱透时，应标记贪合致贫，不应仍按庚甲成格路线判断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '卯', undefined, '丁', {
    visibleStems: ['丁', '庚', '乙', '辛'],
    wuxingCounts: { 木: 2, 火: 1, 土: 0, 金: 2, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('破格因素:庚乙贪合'))
  assert.ok(result.strategyTrace?.includes('成格层次:一贫彻骨'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-ding-geng-yi-greedy-combine'))
})

test('丁日午月仅癸透而无壬时，应标记独杀当权，不应与壬水正官并见同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丁', {
    visibleStems: ['丁', '癸', '甲', '丙'],
    wuxingCounts: { 木: 1, 火: 4, 土: 0, 金: 0, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水独透'))
  assert.ok(result.strategyTrace?.includes('成格层次:独杀当权，出人头地'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-ding-gui-unique-kill'))
})

test('丁日午月壬癸并透时，不应仍按癸透独杀当权规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丁', {
    visibleStems: ['丁', '壬', '癸', '甲'],
    wuxingCounts: { 木: 1, 火: 3, 土: 0, 金: 0, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-ding-gui-unique-kill'))
})

test('丁日午月庚壬两透而无土时，应标记科甲定然，不应仍按普通夏火调候收束', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丁', {
    visibleStems: ['丁', '庚', '壬', '甲'],
    wuxingCounts: { 木: 1, 火: 3, 土: 0, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水为用，庚金发源'))
  assert.ok(result.strategyTrace?.includes('成格层次:庚壬两透，科甲定然'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-ding-geng-ren-kejia'))
})

test('丁日午月庚壬两透又见己土时，应降为常人，不应仍按科甲定然上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丁', {
    visibleStems: ['丁', '庚', '壬', '己'],
    wuxingCounts: { 木: 0, 火: 3, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:土透制壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:常人'))
  assert.ok(!result.strategyTrace?.includes('成格层次:庚壬两透，科甲定然'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-ding-geng-ren-tu-ordinary'))
})

test('丁日午月庚壬两透但不见戊己时，不应仍按见土常人规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丁', {
    visibleStems: ['丁', '庚', '壬', '甲'],
    wuxingCounts: { 木: 1, 火: 3, 土: 0, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-ding-geng-ren-tu-ordinary'))
})

test('丁日午月双癸并透时，不应仍按独杀当权规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '建禄格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '午', undefined, '丁', {
    visibleStems: ['丁', '癸', '癸', '甲'],
    wuxingCounts: { 木: 1, 火: 3, 土: 0, 金: 0, 水: 2 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:独杀当权，出人头地'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-ding-gui-unique-kill'))
})

test('丙日未月庚壬两透而不杂戊己时，应标记科甲名宦，不应仍按泛化夏火规则处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '未', undefined, '丙', {
    visibleStems: ['丙', '庚', '壬', '甲'],
    wuxingCounts: { 木: 1, 火: 2, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水为用，庚金辅佐'))
  assert.ok(result.strategyTrace?.includes('成格层次:庚壬两透，科甲名宦'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-bing-geng-ren-kejia'))
})

test('丙日未月无庚有壬且不见戊己时，应标记小富小贵，不应误判为贴身相生上格', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '未', undefined, '丙', {
    visibleStems: ['丙', '壬', '甲', '乙'],
    wuxingCounts: { 木: 2, 火: 2, 土: 1, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水可用'))
  assert.ok(result.strategyTrace?.includes('成格层次:小富小贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-bing-ren-no-geng-no-wu'))
})

test('丙日未月无庚有壬见戊时，应降为为贤而已，不应仍按小富小贵判断', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '未', undefined, '丙', {
    visibleStems: ['丙', '壬', '戊', '乙'],
    wuxingCounts: { 木: 1, 火: 2, 土: 2, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:戊土制壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:为贤而已'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-bing-ren-wu-no-geng'))
})

test('丙日未月己土出干混杂时，应标记庸夫俗子，不应仍按壬水用神上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '未', undefined, '丙', {
    visibleStems: ['丙', '己', '辛', '乙'],
    wuxingCounts: { 木: 1, 火: 2, 土: 3, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:己土混杂'))
  assert.ok(result.strategyTrace?.includes('成格层次:庸夫俗子'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-bing-ji-mixed-vulgar'))
})

test('丙日酉月无壬而癸透时，应标记功名不久，不应退回普通扶抑', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '癸', '甲', '戊'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸水权代'))
  assert.ok(result.strategyTrace?.includes('成格层次:功名不久'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-no-ren-use-gui'))
})

test('丙日戌月甲壬两透时，应标记富贵非凡，不应仍按普通秋火衰退收束', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '甲', '壬', '辛'],
    wuxingCounts: { 木: 1, 火: 2, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:甲木为先，壬水继之'))
  assert.ok(result.strategyTrace?.includes('成格层次:甲壬两透，富贵非凡'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-bing-jia-ren-all'))
})

test('丙日戌月有甲无壬而癸透时，应标记异路功名，不应误判为富贵非凡', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '甲', '癸', '辛'],
    wuxingCounts: { 木: 1, 火: 2, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:甲木为先，癸水权代'))
  assert.ok(result.strategyTrace?.includes('成格层次:异路功名'))
  assert.ok(!result.strategyTrace?.includes('成格层次:甲壬两透，富贵非凡'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-bing-jia-gui-no-ren'))
})

test('丙日戌月无甲壬癸时，应直接标记下格，不应仍按普通病药提示收束', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '庚', '戊', '辛'],
    wuxingCounts: { 木: 0, 火: 1, 土: 3, 金: 2, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:甲壬癸俱无'))
  assert.ok(result.strategyTrace?.includes('成格层次:下格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-bing-no-jia-no-ren-no-gui'))
})

test('丙日酉月辛透无丁时，应标记贫苦到老，不应仍按普通扶抑收束', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '辛', '戊', '己'],
    wuxingCounts: { 木: 0, 火: 1, 土: 3, 金: 2, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:辛金透干'))
  assert.ok(result.strategyTrace?.includes('成格层次:贫苦到老'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-xin-poor'))
})

test('丙日酉月支成金局而无辛出干时，应标记朱门饿莩，不应误作从才富贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '戊', '甲', '己'],
    hiddenStems: ['辛', '庚'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 4, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:金局无辛出干'))
  assert.ok(result.strategyTrace?.includes('成格层次:朱门饿莩'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-metal-formation-no-xin'))
})

test('丙日酉月支成金局且辛透又不见比劫时，应标记从才格反主富贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '辛', '戊', '己'],
    hiddenStems: ['庚', '辛'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:支成金局，辛金透干'))
  assert.ok(result.strategyTrace?.includes('成格层次:从才格，反主富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-metal-formation-xin-follow-wealth'))
})

test('丙日酉月支成金局且辛透但壬癸并透时，不应仍按从才格反主富贵误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '辛', '壬', '癸'],
    hiddenStems: ['庚', '辛'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 0, 金: 4, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-bing-metal-formation-xin-follow-wealth'))
})

test('丁日酉月金势成局而辛透、不见庚且无比劫时，应标记弃命从才富而且贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '酉', undefined, '丁', {
    visibleStems: ['丁', '辛', '己', '戊'],
    hiddenStems: ['庚', '辛'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:金气成势，辛金透干'))
  assert.ok(result.strategyTrace?.includes('成格层次:弃命从才，富而且贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-ding-xin-follow-wealth'))
})

test('丁日酉月金势成局而庚辛并透时，不应仍按辛金从才规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '酉', undefined, '丁', {
    visibleStems: ['丁', '庚', '辛', '戊'],
    hiddenStems: ['庚', '辛'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 1, 金: 5, 水: 0 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-ding-xin-follow-wealth'))
})

test('丁日酉月金势成局而辛透但另见比劫透干时，不应仍按弃命从才论', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '酉', undefined, '丁', {
    visibleStems: ['丁', '辛', '丙', '戊'],
    hiddenStems: ['庚', '辛'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 2, 土: 1, 金: 4, 水: 0 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:弃命从才，富而且贵'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-ding-xin-follow-wealth'))
})

test('丙日酉月支成金局且辛透但另见比劫透干时，不应仍按从才格反主富贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '辛', '丁', '己'],
    hiddenStems: ['庚', '辛'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 2, 土: 1, 金: 4, 水: 0 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:从才格，反主富贵'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-bing-metal-formation-xin-follow-wealth'))
})

test('丙日酉月支成金局且辛透而仅地支暗藏比劫时，仍可按不见比劫透干处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '辛', '戊', '己'],
    hiddenStems: ['丙', '庚', '辛'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('成格层次:从才格，反主富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-metal-formation-xin-follow-wealth'))
})

test('丙日酉月多丙而一壬高透时，应标记富贵双全，不应仍按普通秋火衰退收束', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '壬', '丙', '甲'],
    hiddenStems: ['辛', '丁', '壬'],
    wuxingCounts: { 木: 1, 火: 2, 土: 1, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水高透'))
  assert.ok(result.strategyTrace?.includes('成格层次:登科及第，富贵双全'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-one-ren-rich'))
})

test('丙日酉月壬藏支不透时，应标记秀才，不应误判为辛透贫困或癸水权代', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '甲', '戊', '乙'],
    hiddenStems: ['壬'],
    wuxingCounts: { 木: 2, 火: 1, 土: 2, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水藏支'))
  assert.ok(result.strategyTrace?.includes('成格层次:秀才'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-hidden-ren-xiucai'))
})

test('丙日酉月壬藏支但天干又透癸时，不应仍按壬藏支秀才规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '癸', '甲', '戊'],
    hiddenStems: ['壬'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-bing-hidden-ren-xiucai'))
})

test('丙日酉月壬透而土重时，应降为假作斯文，不应仍按一壬高透富贵双全上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '壬', '戊', '己'],
    hiddenStems: ['辛', '丁'],
    wuxingCounts: { 木: 0, 火: 1, 土: 4, 金: 2, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:戊多困水'))
  assert.ok(result.strategyTrace?.includes('成格层次:假作斯文'))
  assert.ok(!result.strategyTrace?.includes('成格层次:登科及第，富贵双全'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-wu-heavy-false-scholar'))
})

test('丙日酉月丁辛同透时，应标记奸诈，不应仍按单纯辛透贫困同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '酉', undefined, '丙', {
    visibleStems: ['丙', '丁', '辛', '戊'],
    wuxingCounts: { 木: 0, 火: 2, 土: 2, 金: 2, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:丁火制辛'))
  assert.ok(result.strategyTrace?.includes('成格层次:奸诈，不识高低'))
  assert.ok(!result.strategyTrace?.includes('成格层次:贫苦到老'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-bing-ding-xin-cunning'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-bing-xin-poor'))
})

test('丙日戌月甲藏壬透而无庚破甲时，应标记可许秀才，不应误判为甲壬两透富贵非凡', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '壬', '戊', '辛'],
    hiddenStems: ['甲'],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:甲木藏支，壬水透干'))
  assert.ok(result.strategyTrace?.includes('成格层次:可许秀才'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-bing-hidden-jia-ren-no-geng'))
})

test('丙日戌月甲已明透时，不应仍按甲藏壬透秀才规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '甲', '壬', '辛'],
    hiddenStems: ['甲'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-bing-hidden-jia-ren-no-geng'))
})

test('丙日戌月壬癸藏支不透时，应标记页监而已，不应误判为下格', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '庚', '戊', '辛'],
    hiddenStems: ['壬'],
    wuxingCounts: { 木: 0, 火: 1, 土: 3, 金: 2, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('取用层次:壬癸藏支'))
  assert.ok(result.strategyTrace?.includes('成格层次:页监而已'))
  assert.ok(!result.strategyTrace?.includes('成格层次:下格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-bing-hidden-ren-gui-page'))
})

test('丙日戌月既无壬癸透也无壬癸藏时，不应仍按壬癸藏支页监规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '庚', '戊', '辛'],
    hiddenStems: ['丁'],
    wuxingCounts: { 木: 0, 火: 1, 土: 3, 金: 2, 水: 0 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-bing-hidden-ren-gui-page'))
})

test('丙日戌月甲壬并见而庚戊同透时，应降为庸才，不应仍按甲壬两透富贵非凡上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '甲', '壬', '庚', '戊'],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 1, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:庚戊困木水'))
  assert.ok(result.strategyTrace?.includes('成格层次:庸才'))
  assert.ok(!result.strategyTrace?.includes('成格层次:甲壬两透，富贵非凡'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-bing-geng-wu-trap-jia-ren'))
})

test('丙日戌月虽见庚戊甲但全无壬癸时，不应仍按庚戊困木水庸才规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '食神格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '火', '戌', undefined, '丙', {
    visibleStems: ['丙', '甲', '庚', '戊'],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 1, 水: 0 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-bing-geng-wu-trap-jia-ren'))
})

test('戊日申月丙癸甲全透时，应提升为富贵极品，不应与单透同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '申', undefined, '戊', {
    visibleStems: ['戊', '丙', '癸', '甲'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:丙癸甲并用'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵极品'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-wu-bing-gui-jia-all'))
})

test('戊日申月无丙得癸甲时，应标记清雅家富，不应误判为极品', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '申', undefined, '戊', {
    visibleStems: ['戊', '癸', '甲', '辛'],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 2, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸甲并用'))
  assert.ok(result.strategyTrace?.includes('成格层次:清雅家富千金'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-wu-gui-jia-no-bing'))
})

test('戊日申月丙癸并透时，不应仍按无丙得癸甲规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '申', undefined, '戊', {
    visibleStems: ['戊', '丙', '癸', '甲'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-wu-gui-jia-no-bing'))
})

test('戊日申月丙甲癸俱无时，应直接标记下流之命，不应仅收为常人', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '申', undefined, '戊', {
    visibleStems: ['戊', '辛', '己', '庚'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 3, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:丙甲癸俱无'))
  assert.ok(result.strategyTrace?.includes('成格层次:下流之命'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-wu-no-bing-no-gui-no-jia'))
})

test('戊日酉月丙癸两透时，应标记科甲中人，不应与全无同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '酉', undefined, '戊', {
    visibleStems: ['戊', '丙', '癸', '辛'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 2, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:丙癸并用'))
  assert.ok(result.strategyTrace?.includes('成格层次:科甲中人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-wu-bing-gui-all'))
})

test('戊日酉月癸丙全无时，应标记奔流之客，不应仍按普通常人收束', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '土', '酉', undefined, '戊', {
    visibleStems: ['戊', '辛', '己', '庚'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 3, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:癸丙全无'))
  assert.ok(result.strategyTrace?.includes('成格层次:奔流之客'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-wu-no-bing-no-gui'))
})

test('辛日辰月壬甲两透时，应按富贵必然处理，不应仍停留在泛化春金调候', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '戊'],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:先壬后甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:壬甲两透，富贵必然'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-ren-jia-all'))
})

test('辛日辰月壬透甲藏时，应标记廪贡不失，不应与壬甲两透或平常格混同', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '庚'],
    hiddenStems: ['甲'],
    hiddenStemSources: [
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] },
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 4, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水透干，甲木藏支'))
  assert.ok(result.strategyTrace?.includes('成格层次:廪贡不失'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-ren-visible-jia-hidden'))
})

test('辛日辰月壬甲皆无时，应只作平常之格，不应误判为壬甲得用', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '戊', '己', '庚'],
    hiddenStems: ['戊', '己'],
    wuxingCounts: { 木: 0, 火: 0, 土: 4, 金: 3, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬甲皆无'))
  assert.ok(result.strategyTrace?.includes('成格层次:平常之格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-no-ren-no-jia'))
})

test('辛日辰月月时皆丙而又得癸水制丙时，应标记可许采芹，不应仍按争合风流处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '丙', '癸', '丙'],
    visibleStemSources: [
      { pillar: 'year', stem: '辛' },
      { pillar: 'month', stem: '丙' },
      { pillar: 'day', stem: '癸' },
      { pillar: 'hour', stem: '丙' }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:月时皆丙，而得癸水制丙'))
  assert.ok(result.strategyTrace?.includes('成格层次:可许采芹'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-double-bing-with-gui-scholarly'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'chen-month-xin-double-bing-argue-combine'))
})

test('辛日辰月月时皆丙而不见癸时，应标记争合风流，不应误抬到采芹', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '丙', '戊', '丙'],
    visibleStemSources: [
      { pillar: 'year', stem: '辛' },
      { pillar: 'month', stem: '丙' },
      { pillar: 'day', stem: '戊' },
      { pillar: 'hour', stem: '丙' }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 2, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:月时皆丙，争合辛金'))
  assert.ok(result.strategyTrace?.includes('成格层次:慷慨风流，交四海'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-double-bing-argue-combine'))
})

test('辛日辰月支坐亥子之乡而又见申时，应标记高增禄位，不应仍按普通辰月平断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '己', '戊', '丁'],
    hiddenStemSources: [
      { pillar: 'year', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] },
      { pillar: 'hour', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:支坐亥子之乡，支又见申'))
  assert.ok(result.strategyTrace?.includes('成格层次:高增禄位'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-hai-zi-land-with-shen-rank'))
})

test('辛日辰月戊土出干制水而不见甲乙时，应标记清闲之人，不应误抬到壬甲富贵层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '戊', '己', '庚'],
    hiddenStems: ['癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 4, 金: 2, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:戊土出干制水，不见甲乙'))
  assert.ok(result.strategyTrace?.includes('成格层次:清闲之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-wu-control-water-no-jia-yi-leisure'))
})

test('辛日辰月四支齐见四库而甲不透时，应标记愚顽之辈，不应仍按平常格处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '戊', '己', '庚'],
    hiddenStemSources: [
      { pillar: 'year', branch: '丑', stems: ['己', '癸', '辛'] },
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] },
      { pillar: 'day', branch: '未', stems: ['己', '丁', '乙'] },
      { pillar: 'hour', branch: '戌', stems: ['戊', '辛', '丁'] }
    ],
    wuxingCounts: { 木: 2, 火: 2, 土: 6, 金: 3, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:支见四库，土厚埋金'))
  assert.ok(result.strategyTrace?.includes('成格层次:愚顽之辈'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-four-storage-no-jia-dull'))
})

test('辛日辰月火多而无壬癸透制时，应标记主作缁衣，不应仍按普通春金调候收束', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '丙', '丁', '戊'],
    hiddenStemSources: [
      { pillar: 'year', branch: '巳', stems: ['丙', '庚', '戊'] },
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] },
      { pillar: 'hour', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 1, 火: 4, 土: 4, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:四柱火多，无水制伏'))
  assert.ok(result.strategyTrace?.includes('成格层次:主作缁衣'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-fire-many-no-water-monastic'))
})

test('辛日辰月火多而癸透时，应标记见癸可解，不应仍按缁衣处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '丙', '丁', '癸'],
    hiddenStemSources: [
      { pillar: 'year', branch: '巳', stems: ['丙', '庚', '戊'] },
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] },
      { pillar: 'hour', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 1, 火: 4, 土: 3, 金: 2, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('取用层次:四柱火多，而得癸水制火'))
  assert.ok(result.strategyTrace?.includes('成格关键:见癸可解'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-fire-many-with-gui-relief'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'chen-month-xin-fire-many-no-water-monastic'))
})

test('辛日辰月比劫重重而壬癸浅弱时，应标记主夭，不应仍按普通有根身旺处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '辛', '辛', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 3, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:比劫重重，壬癸浅弱'))
  assert.ok(result.strategyTrace?.includes('成格层次:主夭'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-companions-heavy-water-weak-early-loss'))
})

test('辛日辰月比劫重重而甲透且不见庚时，应标记则贵，不应仍按主夭处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '辰', undefined, '辛', {
    visibleStems: ['辛', '辛', '辛', '甲'],
    hiddenStemSources: [
      { pillar: 'month', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 2, 火: 0, 土: 1, 金: 3, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:比劫重重，而甲木出干'))
  assert.ok(result.strategyTrace?.includes('成格关键:无庚制甲方妙'))
  assert.ok(result.strategyTrace?.includes('成格层次:则贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-xin-companions-heavy-water-weak-jia-noble'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'chen-month-xin-companions-heavy-water-weak-early-loss'))
})

test('辛日戌月壬甲两透时，应标记桃洞之仙，不应仍按泛化秋金论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '戊'],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:先壬后甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:壬甲两透，桃洞之仙'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ren-jia-all'))
})

test('辛日戌月甲透壬藏时，应标记异途之仕，不应误判为壬甲两透', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '甲', '戊', '己'],
    hiddenStems: ['壬'],
    wuxingCounts: { 木: 1, 火: 0, 土: 4, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:甲木透干，壬水藏支'))
  assert.ok(result.strategyTrace?.includes('成格层次:异途之仕'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-jia-visible-ren-hidden'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ren-jia-all'))
})

test('辛日戌月壬透甲藏而又见戊时，应只作平人，不应误抬到桃洞或异途层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '己'],
    hiddenStems: ['甲'],
    wuxingCounts: { 木: 1, 火: 0, 土: 4, 金: 2, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬透甲藏而又见戊'))
  assert.ok(result.strategyTrace?.includes('成格层次:只作平人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ren-visible-jia-hidden-with-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ren-jia-all'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-jia-visible-ren-hidden'))
})

test('辛日戌月土厚甲不透而壬出时，应断富而可求，不应误入平人层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '己'],
    hiddenStems: ['甲'],
    wuxingCounts: { 木: 1, 火: 0, 土: 4, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:土厚而甲不出干，得壬洗土助甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:虽不发达，富而可求'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-heavy-earth-ren-visible-jia-hidden-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ren-visible-jia-hidden-with-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ren-jia-all'))
})

test('辛日戌月土多无壬甲而时月多透丙辛时，应断略贵，不应仍退回常格', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['己', '丙', '辛', '辛'],
    visibleStemSources: [
      { pillar: 'year', stem: '己' },
      { pillar: 'month', stem: '丙' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '辛' }
    ],
    hiddenStems: ['戊', '辛', '丁'],
    hiddenStemSources: [
      { pillar: 'month', branch: '戌', stems: ['戊', '辛', '丁'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 3, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:土多无壬甲，而时月多透丙辛'))
  assert.ok(result.strategyTrace?.includes('成格层次:略贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-no-ren-jia-bing-xin-slight-noble'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-no-ren-jia-bing-xin-with-chen-glory'))
})

test('辛日戌月土多无壬甲而时月多透丙辛、又见辰支时，应断荣显，不应仍只按略贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['己', '丙', '辛', '辛'],
    visibleStemSources: [
      { pillar: 'year', stem: '己' },
      { pillar: 'month', stem: '丙' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '辛' }
    ],
    hiddenStems: ['戊', '辛', '丁', '戊', '乙', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '戌', stems: ['戊', '辛', '丁'] },
      { pillar: 'hour', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 4, 金: 3, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:土多无壬甲，而时月多透丙辛'))
  assert.ok(result.strategyTrace?.includes('成格关键:支再见辰'))
  assert.ok(result.strategyTrace?.includes('成格层次:荣显莫及'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-no-ren-jia-bing-xin-with-chen-glory'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-no-ren-jia-bing-xin-slight-noble'))
})

test('辛日戌月木多土厚而全无壬癸时，应断常人，不应误抬到有水层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '甲', '己', '乙'],
    hiddenStems: ['甲', '戊'],
    wuxingCounts: { 木: 3, 火: 0, 土: 3, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:木多土厚，而全无壬癸'))
  assert.ok(result.strategyTrace?.includes('成格层次:常人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-wood-many-earth-thick-no-water-ordinary'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-wood-earth-double-gui-rich-hardship'))
})

test('辛日戌月木多土厚而干上重见癸水时，应断富而辛苦，不应仍按无水常人', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '癸', '癸', '甲'],
    hiddenStems: ['甲', '戊', '己'],
    wuxingCounts: { 木: 3, 火: 0, 土: 3, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:木多土厚，而干上重见癸水'))
  assert.ok(result.strategyTrace?.includes('成格层次:主富，辛苦'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-wood-earth-double-gui-rich-hardship'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-wood-many-earth-thick-no-water-ordinary'))
})

test('辛日戌月己透无壬有癸且己不多时，应断衣衿之贵，不应误落浊富', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '己', '癸', '甲'],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:己土透干，无壬而有癸'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣衿之贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ji-visible-gui-no-ren-scholarly'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-many-ji-gui-no-ren-cloudy-rich'))
})

test('辛日戌月己多无壬有癸时，应断浊富，不应仍按衣衿之贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '己', '癸', '己'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:己土偏多，而无壬仅赖癸水'))
  assert.ok(result.strategyTrace?.includes('成格层次:不免浊富'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-many-ji-gui-no-ren-cloudy-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ji-visible-gui-no-ren-scholarly'))
})

test('辛日戌月己多无壬有癸时，应以浊富规则优先，不应被己透衣衿规则抢先', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '戌', undefined, '辛', {
    visibleStems: ['辛', '己', '癸', '己'],
    hiddenStems: ['乙'],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 2, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('成格层次:不免浊富'))
  assert.ok(!result.strategyTrace?.includes('成格层次:衣衿之贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'xu-month-xin-many-ji-gui-no-ren-cloudy-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'xu-month-xin-ji-visible-gui-no-ren-scholarly'))
})

test('辛日亥月壬丙两透时，应标记金榜题名，不应仍按普通冬金泛断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '壬', '丙', '戊'],
    hiddenStems: ['甲'],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:先壬后丙'))
  assert.ok(result.strategyTrace?.includes('成格层次:壬丙两透，金榜题名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-bing-all'))
})

test('辛日亥月丙透壬藏时，应标记采芹之造，不应误判为两透或寒湿偏枯', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '丙', '己', '甲'],
    hiddenStems: ['壬'],
    hiddenStemSources: [
      { pillar: 'month', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:丙火透干，壬水藏支'))
  assert.ok(result.strategyTrace?.includes('成格层次:采芹之造'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-bing-visible-ren-hidden'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-bing-all'))
})

test('辛日亥月壬透丙藏时，应标记富有千金，不应误落到丙透壬藏或壬丙两透', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '甲'],
    hiddenStems: ['丙'],
    hiddenStemSources: [
      { pillar: 'day', branch: '巳', stems: ['丙', '庚', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水透干，丙火藏支'))
  assert.ok(result.strategyTrace?.includes('成格层次:富有千金'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-visible-bing-hidden'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-bing-all'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'hai-month-xin-bing-visible-ren-hidden'))
})

test('辛日亥月壬丙俱在支而不透时，应标记聪明之士，不应误作两透之贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '己', '甲', '乙'],
    hiddenStems: ['壬', '丙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'hour', branch: '巳', stems: ['丙', '庚', '戊'] }
    ],
    wuxingCounts: { 木: 2, 火: 1, 土: 1, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬丙皆在支内'))
  assert.ok(result.strategyTrace?.includes('成格层次:聪明之士'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-bing-hidden'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-bing-all'))
})

test('辛日亥月壬水偏多而无戊时，应标记辛水汪洋贫贱，不应仍把壬水偏多当成得用', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '乙'],
    hiddenStems: ['壬'],
    wuxingCounts: { 木: 1, 火: 0, 土: 0, 金: 1, 水: 5 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬水偏多而无戊为岸'))
  assert.ok(result.strategyTrace?.includes('成格层次:辛水汪洋，反成贫贱'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-many-no-wu'))
})

test('辛日亥月戊壬并存而不见丙时，应标记积蓄之人，不应误按汪洋贫贱或两透科名处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '己'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'month', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:戊壬并存于柱'))
  assert.ok(result.strategyTrace?.includes('成格层次:积蓄之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-wu-ren-storage'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ren-bing-all'))
})

test('辛日亥月戊多壬少时，应标记主成名，不应仍只按戊壬并存积蓄之人处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '戊', '戊', '壬'],
    hiddenStems: ['甲'],
    hiddenStemSources: [
      { pillar: 'month', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:戊多壬少'))
  assert.ok(result.strategyTrace?.includes('成格层次:又主成名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-wu-many-ren-few-fame'))
})

test('辛日亥月甲多戊少时，应标记因艺术而蓄金，不应混入成名或积蓄格', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '甲', '甲', '壬'],
    hiddenStems: ['甲'],
    hiddenStemSources: [
      { pillar: 'month', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 3, 火: 0, 土: 0, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:甲多而戊少'))
  assert.ok(result.strategyTrace?.includes('成格层次:因艺术而蓄金'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-jia-many-wu-few-art'))
})

test('辛日亥月己多有戊且仍有壬时，应标记不过诚实之人，不应误抬到成名层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '己', '己', '戊'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'month', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:己多有戊，壬水被困，金被埋'))
  assert.ok(result.strategyTrace?.includes('成格层次:不过诚实之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-ji-many-with-wu-honest'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'hai-month-xin-wu-many-ren-few-fame'))
})

test('辛日亥月壬癸偏多而无戊丙时，应标记劳碌辛苦，不应仅停留在壬多无戊层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '亥', undefined, '辛', {
    visibleStems: ['辛', '壬', '癸', '甲'],
    hiddenStems: ['壬', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 0, 金: 1, 水: 5 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:壬癸偏多而无戊丙'))
  assert.ok(result.strategyTrace?.includes('成格层次:劳碌辛苦'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'hai-month-xin-water-many-no-wu-bing'))
})

test('辛日子月壬丙两透而不见戊癸时，应标记衣锦腰金，不应仍按普通冬辛喜火喜水泛断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '壬', '丙', '甲'],
    hiddenStems: ['癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 0, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:壬丙两透，不见戊癸'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣锦腰金'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-bing-all-no-wu-gui'))
})

test('辛日子月壬藏丙透时，应标记一榜堪图，不应误抬到壬丙两透', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '丙', '甲', '己'],
    hiddenStems: ['壬', '癸'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'month', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:壬藏而丙透'))
  assert.ok(result.strategyTrace?.includes('成格层次:一榜堪图'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-hidden-bing-visible'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-bing-all-no-wu-gui'))
})

test('辛日子月癸出而丙透、却无壬时，应标记冻金困丙，不应误按衣锦腰金或一榜堪图处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '癸', '丙', '甲'],
    hiddenStems: ['癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 0, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:癸水出干，冻金困丙'))
  assert.ok(result.strategyTrace?.includes('成格关键:丙火受困，不宜高断'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-gui-visible-bing-visible-no-ren'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-bing-all-no-wu-gui'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-hidden-bing-visible'))
})

test('辛日子月壬多有戊而丙甲出干时，应标记青云之客，不应与壬多寒儒同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '丙', '甲', '戊'],
    hiddenStems: ['壬', '壬', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '子', stems: ['癸'] },
      { pillar: 'day', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'hour', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 2, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:壬多有戊，丙甲出干'))
  assert.ok(result.strategyTrace?.includes('成格层次:青云之客'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-many-with-wu-bing-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-many-no-wu-bing'))
})

test('辛日子月壬多而无戊丙时，应标记寒儒，不应误把多壬当成有源有用', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '乙'],
    hiddenStems: ['壬', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '子', stems: ['癸'] },
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 2, 火: 0, 土: 0, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:壬多而无戊丙'))
  assert.ok(result.strategyTrace?.includes('成格层次:泄金太过，定主寒儒'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-many-no-wu-bing'))
})

test('辛日子月壬多而甲乙重重、又无丙时，应标记贫寒，不应仍只按寒儒处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '乙'],
    hiddenStems: ['壬', '甲', '乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '子', stems: ['癸'] },
      { pillar: 'day', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'hour', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 4, 火: 0, 土: 0, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:壬多而甲乙重重，无丙火温暖'))
  assert.ok(result.strategyTrace?.includes('成格层次:多主贫寒'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-ren-many-jia-yi-heavy-no-bing'))
})

test('辛日子月支成水局而癸透、又有二戊制水时，应标记富贵恩荣，不应仍按常人处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '癸', '戊', '戊'],
    formationWuxings: ['水'],
    hiddenStems: ['癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:支成水局，癸水出干，二戊制之'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵恩荣'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-water-formation-gui-two-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-water-formation-gui-no-wu'))
})

test('辛日子月支成水局而癸透、却无戊制水时，应只作常人，不应误抬到恩荣层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '癸', '甲', '乙'],
    formationWuxings: ['水'],
    hiddenStems: ['癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 2, 火: 0, 土: 0, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('破格因素:支成水局而无戊制水'))
  assert.ok(result.strategyTrace?.includes('成格层次:只作常人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-water-formation-gui-no-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-water-formation-gui-two-wu'))
})

test('辛日子月亥子丑全而比劫透出、又无丙时，应标记润下格富贵双全，不应把日主自身误当唯一比劫', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '庚', '壬', '癸'],
    hiddenStems: ['癸', '壬', '甲', '己', '癸', '辛'],
    hiddenStemSources: [
      { pillar: 'year', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'month', branch: '子', stems: ['癸'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 2, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:支见亥子丑，干出比劫，无丙'))
  assert.ok(result.strategyTrace?.includes('成格层次:润下格，富贵双全'))
  assert.ok(result.strategyTrace?.includes('运势警语:运喜西北'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-run-down-prosper'))
})

test('辛日子月亥子丑全但仅有日主自身一辛、并无额外庚辛时，不应误判为润下格', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '壬', '癸', '甲'],
    hiddenStems: ['癸', '壬', '甲', '己', '癸', '辛'],
    hiddenStemSources: [
      { pillar: 'year', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'month', branch: '子', stems: ['癸'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 1, 水: 4 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-run-down-prosper'))
})

test('辛日子月亥子丑全而无庚辛、反见甲乙且无戊丙时，应标记僧道，不应误按润下格富贵处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '甲', '乙', '癸'],
    hiddenStems: ['癸', '壬', '甲', '己', '癸', '辛'],
    hiddenStemSources: [
      { pillar: 'year', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'month', branch: '子', stems: ['癸'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 2, 火: 0, 土: 1, 金: 1, 水: 4 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:亥子丑全而无庚辛，反见甲乙'))
  assert.ok(result.strategyTrace?.includes('成格层次:必主僧道'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-run-down-no-metal-monastic'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-xin-run-down-prosper'))
})

test('辛日子月支成木局而丁戊并见时，应标记功名特达，不应仍按普通冬金木旺受克处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '子', undefined, '辛', {
    visibleStems: ['辛', '丁', '戊', '甲'],
    formationWuxings: ['木'],
    wuxingCounts: { 木: 4, 火: 1, 土: 1, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:支成木局，丁火出干，又见戊土'))
  assert.ok(result.strategyTrace?.includes('成格层次:功名特达'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-xin-wood-formation-ding-wu-merit'))
})

test('辛日丑月丙壬两透时，应标记金马玉堂，不应仍按普通寒金看待', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '丑', undefined, '辛', {
    visibleStems: ['辛', '丙', '壬', '戊'],
    hiddenStems: ['己', '癸', '辛'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:先丙后壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:丙壬两透，金马玉堂'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-xin-bing-ren-all'))
})

test('辛日丑月壬丙俱藏时，应标记游庠食廪，不应误作纯寒无药', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '丑', undefined, '辛', {
    visibleStems: ['辛', '己', '乙', '癸'],
    hiddenStems: ['壬', '丙'],
    hiddenStemSources: [
      { pillar: 'year', branch: '巳', stems: ['丙', '庚', '戊'] },
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:壬丙俱藏'))
  assert.ok(result.strategyTrace?.includes('成格层次:游庠食廪'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-xin-bing-ren-hidden'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'chou-month-xin-bing-ren-all'))
})

test('辛日丑月有丙无壬时，应标记富真贵假，不应误抬到丙壬两透', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '丑', undefined, '辛', {
    visibleStems: ['辛', '丙', '己', '乙'],
    hiddenStems: ['己', '癸'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:有丙无壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:富真贵假'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-xin-bing-only-no-ren'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'chou-month-xin-bing-ren-all'))
})

test('辛日丑月有壬无丙时，应标记贱而且贫，不应误把壬水当成足用', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '丑', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '癸'],
    hiddenStems: ['己', '癸'],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 1, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:有壬而乏丙火'))
  assert.ok(result.strategyTrace?.includes('成格层次:贱而且贫'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-xin-ren-only-no-bing'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'chou-month-xin-bing-ren-all'))
})

test('辛日丑月丙多而无壬、有癸时，应标记市中贸易，不应仍只按有丙无壬富真贵假处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '丑', undefined, '辛', {
    visibleStems: ['辛', '丙', '丙', '癸'],
    hiddenStems: ['己', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:丙多无壬而有癸'))
  assert.ok(result.strategyTrace?.includes('成格层次:市中贸易之流'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-xin-many-bing-no-ren-gui-trade'))
})

test('辛日丑月水多而戊己出干、又见丙丁时，应标记衣食充盈一生安乐，不应仍按寒湿偏枯处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '丑', undefined, '辛', {
    visibleStems: ['辛', '戊', '丁', '己'],
    hiddenStems: ['癸', '壬', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '丑', stems: ['己', '癸', '辛'] },
      { pillar: 'day', branch: '子', stems: ['癸'] },
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:水多而戊己出干，又见丙丁'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣食充盈，一生安乐'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-xin-water-many-earth-fire-peace'))
})

test('辛日寅月己壬两透且支见庚制甲时，应标记科甲定然，不应仍按普通春金调候处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '正印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '己', '壬', '丁'],
    hiddenStems: ['甲', '丙', '戊', '庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] },
      { pillar: 'hour', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 3, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:己壬两透，支见庚制甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:科甲定然'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ji-ren-visible-geng-hidden-jia-control'))
})

test('辛日寅月己透而支中有甲时，应标记异路恩荣，不应误抬到己壬两透科甲', () => {
  const pattern: PatternAnalysis = {
    pattern: '正印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '己', '丁', '戊'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 3, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:己土透干，支中有甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:异路恩荣'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ji-visible-jia-hidden-alt-grace'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ji-ren-visible-geng-hidden-jia-control'))
})

test('辛日寅月见壬而全无己庚时，应标记贫贱之徒，不应误把壬水当作得用', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '丁'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    wuxingCounts: { 木: 2, 火: 2, 土: 1, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:见壬而无己庚'))
  assert.ok(result.strategyTrace?.includes('成格层次:贫贱之徒'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ren-visible-no-ji-geng-poor'))
})

test('辛日寅月壬透而庚尚存、己不透时，应标记富贵难全，不应误落贫贱', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '壬', '庚', '丁'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 1, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('破格因素:己土不全，君臣失势'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵难全'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ren-visible-geng-no-ji-incomplete'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ren-visible-no-ji-geng-poor'))
})

test('辛日寅月丙火出干而不见壬时，应标记武学之途，不应误混入贫贱或科甲', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '丙', '甲', '丁'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    wuxingCounts: { 木: 2, 火: 3, 土: 1, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:丙火出干'))
  assert.ok(result.strategyTrace?.includes('成格层次:亦主武学'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-bing-visible-martial'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ren-visible-no-ji-geng-poor'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ji-ren-visible-geng-hidden-jia-control'))
})

test('辛日寅月支成火局而壬透兼有己土时，应标记寻常之人，不应误抬到破局显达', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '丁'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 1, 火: 4, 土: 2, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:支成火局，壬透仍不能克己'))
  assert.ok(result.strategyTrace?.includes('成格层次:寻常之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-fire-formation-ren-only-ordinary'))
})

test('辛日寅月支成火局但壬透而无己庚时，仍应按贫贱论，不应误判为火局壬透常人', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '丁'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 2, 火: 4, 土: 1, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('成格层次:贫贱之徒'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-ren-visible-no-ji-geng-poor'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-fire-formation-ren-only-ordinary'))
})

test('辛日寅月支成火局而庚壬两透时，应标记显达，不应仍按火局壬透寻常处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '庚', '壬', '己'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 1, 火: 4, 土: 2, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:支成火局，庚壬两透破局制火'))
  assert.ok(result.strategyTrace?.includes('成格层次:必为显达之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-fire-formation-geng-ren-all-distinguished'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-fire-formation-ren-only-ordinary'))
})

test('辛日寅月支成水局而仅月令暗藏丙、不见丙透时，应标记金弱沉寒平常之士', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '癸'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    formationWuxings: ['水'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:支成水局而不见丙火'))
  assert.ok(result.strategyTrace?.includes('成格层次:金弱沉寒，平常之士'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-water-formation-no-bing-ordinary'))
})

test('辛日寅月支成水局而丙火透出时，应标记反主富贵，不应仍按沉寒平常处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    visibleStems: ['辛', '丙', '壬', '己'],
    hiddenStems: ['甲', '丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] }
    ],
    formationWuxings: ['水'],
    wuxingCounts: { 木: 1, 火: 2, 土: 2, 金: 1, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:支成水局，得丙透照暖'))
  assert.ok(result.strategyTrace?.includes('成格层次:反主富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-water-formation-bing-visible-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-water-formation-no-bing-ordinary'))
})

test('辛日寅月逢卯日子时，应标记朝阳格象，不应仍只按普通寅月辛金判断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    hourBranch: '子',
    visibleStems: ['辛', '己', '壬', '丁'],
    hiddenStems: ['甲', '丙', '戊', '乙', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] },
      { pillar: 'day', branch: '卯', stems: ['乙'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 2, 火: 2, 土: 1, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('特殊格象:辛逢卯日，子时'))
  assert.ok(result.strategyTrace?.includes('成格名目:名曰朝阳'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-month-xin-mao-day-zi-hour-chaoyang'))
})

test('辛日寅月虽逢子时但日支不为卯时，不应误判为朝阳格', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '寅', undefined, '辛', {
    hourBranch: '子',
    visibleStems: ['辛', '己', '壬', '丁'],
    hiddenStems: ['甲', '丙', '戊', '辛', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '寅', stems: ['甲', '丙', '戊'] },
      { pillar: 'day', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 1, 金: 2, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-month-xin-mao-day-zi-hour-chaoyang'))
  assert.ok(!result.strategyTrace?.includes('成格名目:名曰朝阳'))
})

test('辛日卯月壬甲两透时，应标记贵显，不应仍按普通春金扶抑论', () => {
  const pattern: PatternAnalysis = {
    pattern: '正财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '丁'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 2, 火: 1, 土: 0, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬甲两透'))
  assert.ok(result.strategyTrace?.includes('成格层次:贵显'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-jia-all-noble'))
})

test('辛日卯月壬丙齐透时，应标记大富大贵，不应仍只按壬甲贵显层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '正财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '丙', '丁'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 0, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬丙齐透'))
  assert.ok(result.strategyTrace?.includes('成格层次:方许大富大贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-bing-all-great-wealth'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-jia-all-noble'))
})

test('辛日卯月壬坐亥支且天干不见戊己时，应标记家亦小康，不应把别柱亥支误作壬坐亥', () => {
  const pattern: PatternAnalysis = {
    pattern: '正财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['壬', '丁', '辛', '乙'],
    visibleStemSources: [
      { pillar: 'year', stem: '壬' },
      { pillar: 'month', stem: '丁' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '乙' }
    ],
    hiddenStems: ['壬', '甲', '乙'],
    hiddenStemSources: [
      { pillar: 'year', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 2, 火: 1, 土: 0, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬坐亥支，不见土出'))
  assert.ok(result.strategyTrace?.includes('成格层次:家亦小康'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-sits-hai-no-earth-well-off'))
})

test('辛日卯月虽见壬但亥支在别柱时，不应误判为壬坐亥支家亦小康', () => {
  const pattern: PatternAnalysis = {
    pattern: '正财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['壬', '丁', '辛', '乙'],
    visibleStemSources: [
      { pillar: 'year', stem: '壬' },
      { pillar: 'month', stem: '丁' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '乙' }
    ],
    hiddenStems: ['壬', '甲', '乙'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 2, 火: 1, 土: 0, 金: 1, 水: 2 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:家亦小康'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-sits-hai-no-earth-well-off'))
})

test('辛日卯月壬不透而得申中暗壬时，应标记异途名望，不应退回无壬常人', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['乙', '丁', '辛', '甲'],
    hiddenStems: ['庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 2, 火: 1, 土: 1, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:得申中之壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:异途名望'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-shen-hidden-ren-alt-fame'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-no-ren-ordinary'))
})

test('辛日卯月壬戊透而甲仅暗藏不透时，仍应标记平常，不应误把暗藏甲当成甲出干', () => {
  const pattern: PatternAnalysis = {
    pattern: '正财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '丁'],
    hiddenStems: ['甲', '壬'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 1, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬戊并透而甲不出干'))
  assert.ok(result.strategyTrace?.includes('成格层次:病不遇药，平常之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-wu-visible-no-jia-ordinary'))
})

test('辛日卯月壬戊乙透而甲仅暗藏不透时，应标记假名假利，不应因暗藏甲而漏判', () => {
  const pattern: PatternAnalysis = {
    pattern: '正财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '乙'],
    hiddenStems: ['甲', '壬'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 2, 火: 0, 土: 1, 金: 1, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('取用层次:乙木破戊'))
  assert.ok(result.strategyTrace?.includes('成格层次:颇有衣衿，但假名假利'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-wu-with-yi-scholarly-false'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-wu-visible-no-jia-ordinary'))
})

test('辛日卯月壬水重重而无戊时，应标记略有衣食全无作为，不应仍按普通有壬论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['壬', '辛', '壬', '丁'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 0, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('破格因素:一派壬水汪洋，不得中和'))
  assert.ok(result.strategyTrace?.includes('成格层次:略有衣食，全无作为'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-flood-no-wu-meager'))
})

test('辛日卯月壬水重重而得戊时，应标记得戊反吉，不应仍按汪洋无为处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['壬', '辛', '戊', '壬'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水重重而得戊土'))
  assert.ok(result.strategyTrace?.includes('成格层次:得戊反吉'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-flood-with-wu-auspicious'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-flood-no-wu-meager'))
})

test('辛日卯月全无壬水时，应标记常人，不应误抬到壬甲贵显层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '正财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '甲', '丁', '己'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 2, 火: 1, 土: 1, 金: 1, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬水全无'))
  assert.ok(result.strategyTrace?.includes('成格层次:常人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-no-ren-ordinary'))
})

test('辛日卯月支成木局而庚仅暗藏时，仍应按有庚富贵，不应误限为庚必须透干', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '丁', '己'],
    hiddenStems: ['庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    formationWuxings: ['木'],
    wuxingCounts: { 木: 4, 火: 1, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:支成木局而得庚金'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-wood-formation-with-geng-rich'))
})

test('辛日卯月支成木局而全无庚金时，应标记平人，不应误判为木局有庚富贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '丁', '己'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    formationWuxings: ['木'],
    wuxingCounts: { 木: 4, 火: 1, 土: 1, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:支成木局而无庚金'))
  assert.ok(result.strategyTrace?.includes('成格层次:平人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-wood-formation-no-geng-ordinary'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-wood-formation-with-geng-rich'))
})

test('辛日卯月支成火局而二壬透出制火时，应标记富贵反奇，不应把藏壬混作出壬数量', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '丁'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 2, 火: 4, 土: 0, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:支成火局而二壬出制'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵反奇'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-fire-formation-double-ren-marvel'))
})

test('辛日卯月支成火局而仅一壬透、一壬暗藏时，不应误判为二壬出制富贵反奇', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '丁', '己'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 2, 火: 4, 土: 1, 金: 1, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('成格层次:下流之格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-fire-formation-base-low'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-fire-formation-double-ren-marvel'))
})

test('辛日卯月支成火局而全无壬透时，应直接按下流之格处理，不应退回无壬常人', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '丁', '己', '乙'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 2, 火: 4, 土: 1, 金: 1, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:支成火局，官印相争'))
  assert.ok(result.strategyTrace?.includes('破格因素:金水两伤'))
  assert.ok(result.strategyTrace?.includes('成格层次:下流之格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-fire-formation-base-low'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-no-ren-ordinary'))
})

test('辛日卯月支成火局而二壬透出时，不应再落入火局下流规则', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '丁'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 2, 火: 4, 土: 0, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-fire-formation-base-low'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-fire-formation-double-ren-marvel'))
})

test('辛日卯月壬水纯一而不见丙甲戊己时，应标记显达，不应退回一般平常层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '辛'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 0, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:一派壬水，不见丙火'))
  assert.ok(result.strategyTrace?.includes('成格层次:即能显达，家无宿舂'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-pure-ren-no-bing-prominent'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-no-ren-ordinary'))
})

test('辛日卯月若壬水已成汪洋三重时，不应误按纯壬无丙显达规则处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['壬', '辛', '壬', '丁'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 0, 金: 1, 水: 4 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-pure-ren-no-bing-prominent'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-xin-ren-flood-no-wu-meager'))
})

test('辛日卯月纯壬成象但一见丙火时，不应仍按无丙显达规则处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '卯', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '丙'],
    hiddenStems: ['乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '卯', stems: ['乙'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 0, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-xin-pure-ren-no-bing-prominent'))
})

test('辛日巳月癸透壬藏时，应标记富真贵假，不应与壬水高透科甲同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '癸', '甲', '戊'],
    hiddenStems: ['壬'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:癸透壬藏'))
  assert.ok(result.strategyTrace?.includes('成格层次:富真贵假'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-gui-visible-ren-hidden'))
})

test('辛日巳月支成金局而水透木制戊时，应标记一清澈底科甲功名，不应仍只按普通夏辛喜水处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '戊'],
    formationWuxings: ['金'],
    hiddenStemSources: [
      { pillar: 'month', branch: '巳', stems: ['丙', '庚', '戊'] },
      { pillar: 'day', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 4, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:支成金局，水透出干，木来制戊'))
  assert.ok(result.strategyTrace?.includes('成格层次:一清澈底，科甲功名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-metal-formation-water-wood-clarity'))
})

test('辛日巳月支成金局虽有水透但无木制戊时，不应误判为一清澈底科甲功名', () => {
  const pattern: PatternAnalysis = {
    pattern: '正官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '己'],
    formationWuxings: ['金'],
    hiddenStemSources: [
      { pillar: 'month', branch: '巳', stems: ['丙', '庚', '戊'] },
      { pillar: 'day', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 3, 金: 4, 水: 2 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:一清澈底，科甲功名'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-metal-formation-water-wood-clarity'))
})

test('辛日巳月壬藏亥中而戊不透时，应标记亦主上达，不应误作壬癸全无', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '己', '乙', '丁'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'day', branch: '未', stems: ['己', '丁', '乙'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 2, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水藏亥，戊不出干'))
  assert.ok(result.strategyTrace?.includes('成格层次:亦主上达'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-ren-hai-hidden-no-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-no-ren-gui-jia'))
})

test('辛日巳月虽壬藏亥中，但戊透时应降为常人，不应仍按上达规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '戊', '己', '乙'],
    hiddenStems: ['壬', '乙'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'day', branch: '未', stems: ['己', '丁', '乙'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬水藏亥而戊出'))
  assert.ok(result.strategyTrace?.includes('成格层次:只作常人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-ren-hai-hidden-with-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-ren-hai-hidden-no-wu'))
})

test('辛日巳月壬藏亥中而甲透时，应标记衣禄可求，不应仍按上达或常人处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '戊', '甲', '己'],
    hiddenStems: ['壬', '甲'],
    hiddenStemSources: [
      { pillar: 'hour', branch: '亥', stems: ['壬', '甲'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:壬藏亥中，甲木透干'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣禄可求'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-ren-hai-jia-visible'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-ren-hai-hidden-with-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-ren-hai-hidden-no-wu'))
})

test('辛日巳月壬癸皆藏且戊己亦藏时，应标记略富，不应误作壬癸全无', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '乙', '丙', '丁'],
    hiddenStems: ['壬', '癸', '戊', '己'],
    hiddenStemSources: [
      { pillar: 'year', branch: '亥', stems: ['壬', '甲'] },
      { pillar: 'day', branch: '丑', stems: ['己', '癸', '辛'] },
      { pillar: 'hour', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 3, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬癸皆藏，戊己亦藏'))
  assert.ok(result.strategyTrace?.includes('成格层次:略富'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-ren-gui-hidden-wu-ji-hidden'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-no-ren-gui-jia'))
})

test('辛日巳月支成火局而得水制时，应标记有制则吉，不应退成无水取土或鳏独', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '壬', '丙', '戊'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 2, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:支成火局，得水制火'))
  assert.ok(result.strategyTrace?.includes('成格层次:有制则吉'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-fire-formation-water-control'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-fire-formation-no-water-earth'))
})

test('辛日巳月壬癸俱无而火透时，应标记鳏独，不应仍按有水洗淘论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '丁', '戊', '己'],
    hiddenStems: ['丙'],
    wuxingCounts: { 木: 0, 火: 3, 土: 3, 金: 1, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬癸俱无而火出'))
  assert.ok(result.strategyTrace?.includes('成格层次:必主鳏独'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-no-ren-gui-fire-lonely'))
})

test('辛日巳月支成火局而无水时，应改取土泄火，不应仍执水或混入火局有制', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '庚', '丙', '丁'],
    hiddenStems: ['戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '巳', stems: ['丙', '庚', '戊'] }
    ],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 1, 金: 2, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('破格因素:支成火局而无水制火'))
  assert.ok(result.strategyTrace?.includes('取用层次:火旺无水，取土泄之'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-fire-formation-no-water-earth'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-fire-formation-water-control'))
})

test('辛日巳月有甲而无壬癸时，应标记富贵虚浮，不应误判为真富真贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '甲', '戊', '己'],
    hiddenStems: ['戊'],
    wuxingCounts: { 木: 1, 火: 1, 土: 4, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('破格因素:有甲无壬癸'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵虚浮'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-jia-no-ren-gui'))
})

test('辛日巳月壬癸甲全无时，应标记下品，不应误落到有甲虚浮或火透鳏独', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '巳', undefined, '辛', {
    visibleStems: ['辛', '庚', '戊', '己'],
    hiddenStems: ['丙', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '巳', stems: ['丙', '庚', '戊'] },
      { pillar: 'day', branch: '戌', stems: ['戊', '辛', '丁'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 4, 金: 2, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:壬癸甲三者全无'))
  assert.ok(result.strategyTrace?.includes('成格层次:下品之格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'si-month-xin-no-ren-gui-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'si-month-xin-jia-no-ren-gui'))
})

test('辛日午月壬己两透而支见癸水不冲时，应标记显达，不应仍退回泛化己壬并用', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '庚'],
    hiddenStems: ['己', '癸', '辛'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬己两透，支见癸水而不冲'))
  assert.ok(result.strategyTrace?.includes('成格层次:定主显达'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-ren-ji-visible-hidden-gui'))
})

test('辛日午月壬透而己只藏支、支见癸水不冲时，应标记廪贡，不应误拔到壬己两透显达', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '壬', '庚', '乙'],
    hiddenStems: ['己', '癸', '辛'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬透而己藏支，兼见癸水不冲'))
  assert.ok(result.strategyTrace?.includes('成格层次:亦有廪贡'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-ren-visible-ji-hidden-gui-page'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-ren-ji-visible-hidden-gui'))
})

test('辛日午月虽壬己两透，但癸只见子支冲月时，不应误按支见癸水不冲显达或廪贡处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '庚'],
    hiddenStems: ['癸', '己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 2, 金: 2, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-ren-ji-visible-hidden-gui'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-ren-visible-ji-hidden-gui-page'))
})

test('辛日午月无壬而己透时，应标记异途，不应仍按壬己并用显达处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '己', '丁', '乙'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 1, 火: 3, 土: 2, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('破格因素:无壬正用，仅见己土'))
  assert.ok(result.strategyTrace?.includes('成格层次:须得异途'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-no-ren-ji-visible-alt-path'))
})

test('辛日午月无壬而癸透又见庚时，应标记衣锦恩荣，不应仍只按无壬异途或癸力浅看待', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '癸', '庚', '己'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 2, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:无壬而癸出有庚'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣锦恩荣'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-gui-geng-no-ren-grace'))
})

test('辛日午月无壬而癸透、且仍有己土承接时，应标记癸水权代，不应继续停留在通用夏金先水', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '癸', '己', '乙'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 1, 火: 3, 土: 2, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:无壬而癸透，可权代为用'))
  assert.ok(result.strategyTrace?.includes('成格层次:癸力小，不及壬水正用'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-no-ren-gui-weak-substitute'))
})

test('辛日午月虽无壬而癸透，但若又见庚时，不应仍按癸力小权代规则处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '癸', '庚', '己'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 0, 火: 3, 土: 2, 金: 2, 水: 1 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-no-ren-gui-weak-substitute'))
})

test('辛日午月无壬而癸戊并见时，应标记僧道，不应误提到衣锦恩荣', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '癸', '戊', '己'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 1, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:无壬而癸见戊'))
  assert.ok(result.strategyTrace?.includes('成格层次:僧道之流'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-no-ren-gui-wu-monastic'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-gui-geng-no-ren-grace'))
})

test('辛日午月无壬而癸戊并见，若再有一二重辛金时，应标记僧道而不孤，不应仍按纯僧道孤寒处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '辛', '癸', '戊'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '午', stems: ['丁', '己'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 2, 金: 2, 水: 1 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:无壬而癸见戊'))
  assert.ok(result.strategyTrace?.includes('成格层次:僧道之流'))
  assert.ok(result.strategyTrace?.includes('成格转轻:一二比肩，不致孤独'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-no-ren-gui-wu-with-companion'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-gui-geng-no-ren-grace'))
})

test('辛日午月支成火局而壬透时，应标记破火生员，不应把癸水权代误作足用', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '壬', '癸', '戊'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:支成火局，须壬透破火'))
  assert.ok(result.strategyTrace?.includes('成格层次:必主生员'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-fire-formation-ren-break-fire'))
})

test('辛日午月支成火局但仅癸透无壬时，不应误按壬透破火生员规则处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '癸', '癸', '己'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 2, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-fire-formation-ren-break-fire'))
  assert.ok(!result.strategyTrace?.includes('成格层次:必主生员'))
})

test('辛日午月支成火局而重见癸水、却无壬透时，应标记癸水亦不济，不应仍按癸水权代看待', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '癸', '癸', '己'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 2, 金: 1, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:支成火局，重见癸水亦难济火'))
  assert.ok(result.strategyTrace?.includes('成格层次:癸水重见，亦不济火'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-fire-formation-gui-heavy-no-ren'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-no-ren-gui-weak-substitute'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-fire-formation-ren-break-fire'))
})

test('辛日午月水土并重而甲透时，应标记见甲方妙，不应仍只停留在泛化水土并见', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '甲', '壬', '戊'],
    wuxingCounts: { 木: 1, 火: 2, 土: 3, 金: 1, 水: 3 }
  })

  assert.ok(result.strategyTrace?.includes('取用层次:水土并重'))
  assert.ok(result.strategyTrace?.includes('取用调整:见甲疏土引流，方妙'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-water-earth-heavy-see-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-ren-ji-visible-hidden-gui'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-ren-visible-ji-hidden-gui-page'))
})

test('辛日午月虽水土并重但不见甲时，不应误按见甲方妙规则处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '壬', '己', '庚'],
    hiddenStems: ['癸', '戊'],
    hiddenStemSources: [
      { pillar: 'year', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 2, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-water-earth-heavy-see-jia'))
  assert.ok(!result.strategyTrace?.includes('取用调整:见甲疏土引流，方妙'))
})

test('辛日午月木火过盛而别无金水时，应标记逢金水运反败，不应仍只停留在通用夏金先水', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '甲', '乙', '丙'],
    hiddenStems: ['丁'],
    wuxingCounts: { 木: 3, 火: 4, 土: 0, 金: 1, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:木火过盛，不见金水'))
  assert.ok(result.strategyTrace?.includes('运势警语:逢金水运反败'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-xin-wood-fire-heavy-no-metal-water-warning'))
})

test('辛日午月虽木火偏盛，但若已见壬水时，不应仍按无金水运败警语处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '金', '午', undefined, '辛', {
    visibleStems: ['辛', '甲', '丙', '壬'],
    hiddenStems: ['丁'],
    wuxingCounts: { 木: 2, 火: 4, 土: 0, 金: 1, 水: 1 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-xin-wood-fire-heavy-no-metal-water-warning'))
  assert.ok(!result.strategyTrace?.includes('运势警语:逢金水运反败'))
})

test('辛日未月壬庚两透而无戊时，应标记科甲功名，不应与戊出破局同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '壬', '庚', '己'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬庚两透'))
  assert.ok(result.strategyTrace?.includes('成格层次:科甲功名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ren-geng-no-wu'))
})

test('辛日未月丁乙透干且庚壬并见时，应标记显贵，不应仍只按普通未月辛金论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '丁', '乙', '壬'],
    hiddenStems: ['庚'],
    hiddenStemSources: [
      { pillar: 'day', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:丁乙出干，庚壬并见'))
  assert.ok(result.strategyTrace?.includes('成格层次:显贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ding-yi-with-ren-geng'))
})

test('辛日未月丁乙虽透但不见壬时，不应误按丁乙庚壬显贵规则处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '丁', '乙', '庚'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'day', branch: '未', stems: ['己', '丁', '乙'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 2, 水: 0 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ding-yi-with-ren-geng'))
})

test('辛日未月丁乙透干而全局无壬时，应标记无壬不成局，不应仍按丁乙显贵或普通吉格宽论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '丁', '乙', '庚'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '未', stems: ['己', '丁', '乙'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 2, 水: 0 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:丁乙虽透，而无壬润泽'))
  assert.ok(result.strategyTrace?.includes('成格层次:无壬者，否'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ding-yi-no-ren-fails'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ding-yi-with-ren-geng'))
})

test('辛日未月壬庚两透但戊土出干时，不应仍按无戊科甲规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '壬', '庚', '戊'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 2, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ren-geng-no-wu'))
})

test('辛日未月戊土出干而不见甲木制伏时，应标记戊出破局，不应仍按壬庚得用宽泛上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '壬', '庚', '戊'],
    hiddenStems: ['己'],
    hiddenStemSources: [
      { pillar: 'month', branch: '未', stems: ['己', '丁', '乙'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 3, 金: 2, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:戊土出干而无甲制伏'))
  assert.ok(result.strategyTrace?.includes('成格关键:土重掩金，壬水受壅'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wu-visible-no-jia-break'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ren-geng-no-wu'))
})

test('辛日未月戊出而局中有壬、甲隔位制土时，应标记方吉，不应误作甲己贪合', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['甲', '戊', '辛', '己'],
    visibleStemSources: [
      { pillar: 'year', stem: '甲' },
      { pillar: 'month', stem: '戊' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '己' }
    ],
    hiddenStems: ['壬'],
    hiddenStemSources: [
      { pillar: 'year', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:戊出而得甲制'))
  assert.ok(result.strategyTrace?.includes('成格关键:甲木隔位，不与己合'))
  assert.ok(result.strategyTrace?.includes('成格层次:方吉'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wu-jia-separated'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wu-jia-adjacent-ji'))
})

test('辛日未月戊出而局中有壬、甲己相贴时，应标记贪己合下贱，不应仍按方吉处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['甲', '己', '辛', '戊'],
    visibleStemSources: [
      { pillar: 'year', stem: '甲' },
      { pillar: 'month', stem: '己' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '戊' }
    ],
    hiddenStems: ['壬'],
    hiddenStemSources: [
      { pillar: 'year', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:甲木贴己，反成贪合'))
  assert.ok(result.strategyTrace?.includes('成格层次:下贱之格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wu-jia-adjacent-ji'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wu-jia-separated'))
})

test('辛日未月戊出虽有甲隔位，但庚又出干制甲时，应标记破局，不应仍按方吉处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['甲', '庚', '辛', '戊'],
    visibleStemSources: [
      { pillar: 'year', stem: '甲' },
      { pillar: 'month', stem: '庚' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '戊' }
    ],
    hiddenStems: ['己', '壬'],
    hiddenStemSources: [
      { pillar: 'month', branch: '未', stems: ['己', '丁', '乙'] },
      { pillar: 'year', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:庚金出干，反制甲木'))
  assert.ok(result.strategyTrace?.includes('成格关键:甲木受伤，难制戊土'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wu-jia-geng-break'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wu-jia-separated'))
})

test('辛日未月只有未中一己而见子壬水，若甲木再出时，应标记平人，不应仍按壬庚两透上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['壬', '甲', '辛', '庚'],
    visibleStemSources: [
      { pillar: 'year', stem: '壬' },
      { pillar: 'month', stem: '甲' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '庚' }
    ],
    hiddenStems: ['己', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '未', stems: ['己', '丁', '乙'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 1, 金: 2, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:见子壬水，湿泥不能任甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:甲出反作平人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-zi-ren-jia-ordinary'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ren-geng-no-wu'))
})

test('辛日未月一壬一己而见庚无甲时，应标记方妙，不应仍停留在泛化壬庚两透', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['壬', '庚', '辛', '丁'],
    visibleStemSources: [
      { pillar: 'year', stem: '壬' },
      { pillar: 'month', stem: '庚' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '丁' }
    ],
    hiddenStems: ['己', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '未', stems: ['己', '丁', '乙'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 2, 土: 1, 金: 2, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:一壬一己，见庚无甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:方妙'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-single-ren-single-ji-geng-no-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ren-geng-no-wu'))
})

test('辛日未月壬庚虽不透但同藏得所时，应标记亦有荣华，不应仍退回普通未月辛金', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '丁', '乙', '己'],
    hiddenStems: ['庚', '壬'],
    hiddenStemSources: [
      { pillar: 'year', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬庚不透，藏支得所'))
  assert.ok(result.strategyTrace?.includes('成格层次:亦有荣华'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ren-geng-hidden-glory'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-xin-ren-geng-no-wu'))
})

test('辛日未月支成木局而壬透见庚时，应标记可云富贵，不应仍停留在普通取水层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '未', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '丁'],
    hiddenStems: ['庚'],
    hiddenStemSources: [
      { pillar: 'year', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    formationWuxings: ['木'],
    wuxingCounts: { 木: 3, 火: 1, 土: 1, 金: 2, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:木局成势，壬透庚发源'))
  assert.ok(result.strategyTrace?.includes('成格层次:可云富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-xin-wood-formation-ren-visible-geng-total'))
})

test('辛日申月壬居申中而全局不另见戊时，应标记官清不富，不应混入土重常人格', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '庚', '丁'],
    hiddenStems: ['庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 1, 金: 3, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水居申，戊止申中为岸'))
  assert.ok(result.strategyTrace?.includes('成格层次:为官清正，但不富耳'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-xin-ren-in-shen-no-extra-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-earth-no-jia'))
})

test('辛日申月金多而壬透、一戊得甲制时，应标记自然富贵，不应仍停留在官清不富', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '庚'],
    hiddenStems: ['庚', '壬', '戊', '辛'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] },
      { pillar: 'hour', branch: '酉', stems: ['辛'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 4, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:金多得壬泄秀，一戊为卫'))
  assert.ok(result.strategyTrace?.includes('成格关键:甲木制戊'))
  assert.ok(result.strategyTrace?.includes('成格层次:自然富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-xin-metal-rich-ren-jia-single-wu'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-ren-in-shen-no-extra-wu'))
})

test('辛日申月虽金多见甲，但若壬不透而仅见癸时，不应仍按壬水泄秀自然富贵误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '癸', '甲', '庚'],
    hiddenStems: ['庚', '壬', '戊', '辛'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] },
      { pillar: 'hour', branch: '酉', stems: ['辛'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 4, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-metal-rich-ren-jia-single-wu'))
})

test('辛日申月虽壬居申中，但若他支再见戊土时，不应仍按官清不富规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '庚', '丁'],
    hiddenStems: ['庚', '壬', '戊', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] },
      { pillar: 'hour', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 3, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-ren-in-shen-no-extra-wu'))
})

test('辛日申月干支水多、重见戊土而得火生时，应标记福寿之造，不应仍按普通土重处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '丁'],
    hiddenStems: ['庚', '壬', '戊', '癸', '戊', '乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] },
      { pillar: 'day', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 1, 土: 3, 金: 2, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:干支水多，重见戊土'))
  assert.ok(result.strategyTrace?.includes('成格关键:戊土得火生扶'))
  assert.ok(result.strategyTrace?.includes('成格层次:福寿之造'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-xin-water-rich-wu-supported-longevity'))
})

test('辛日申月虽干支水多重见戊土，但若无火生扶时，不应仍按福寿之造处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '庚'],
    hiddenStems: ['庚', '壬', '戊', '癸', '戊', '乙'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] },
      { pillar: 'day', branch: '辰', stems: ['戊', '乙', '癸'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 3, 金: 3, 水: 4 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-water-rich-wu-supported-longevity'))
})

test('辛日申月局中有土而无甲时，应标记有病无药常人，不应误抬层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '戊', '庚', '丁'],
    hiddenStems: ['庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 3, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('破格因素:土重而无甲疏土'))
  assert.ok(result.strategyTrace?.includes('成格层次:有病无药，常人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-xin-earth-no-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-earth-with-jia'))
})

test('辛日申月局中有土而得甲木疏土时，应标记衣衿可望，不应仍按无甲常人处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '戊', '甲', '庚'],
    hiddenStems: ['庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 3, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:土重得甲疏通'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣衿可望'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-xin-earth-with-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-earth-no-jia'))
})

test('辛日申月若只见癸而不见壬时，不应仍按秋金泛化先取水，而应退取甲戊', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '癸', '庚', '丁'],
    hiddenStems: ['庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 1, 金: 3, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用总纲:壬水为尊，甲戊酌用'))
  assert.ok(result.strategyTrace?.includes('破格因素:独见癸水，不可为用'))
  assert.ok(result.strategyTrace?.includes('取用调整:退取甲木与戊土'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-xin-gui-only-not-usable'))
})

test('辛日申月若壬癸并见时，不应仍按独癸不可为用规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '癸', '庚'],
    hiddenStems: ['庚', '壬', '戊'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    wuxingCounts: { 木: 0, 火: 0, 土: 1, 金: 3, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-gui-only-not-usable'))
})

test('辛日申月金多水浅而壬透不过多时，应标记体全之象，仍以壬为尊，不应只停留在泛化秋金喜水', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '癸', '庚'],
    hiddenStems: ['庚', '壬', '戊', '辛'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] },
      { pillar: 'hour', branch: '酉', stems: ['辛'] }
    ],
    wuxingCounts: { 木: 0, 火: 0, 土: 1, 金: 4, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用总纲:水浅金多，号曰体全之象'))
  assert.ok(result.strategyTrace?.includes('取用层次:壬水为尊，甲戊酌用'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'shen-month-xin-metal-many-shallow-water-balance'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-gui-only-not-usable'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-ren-in-shen-no-extra-wu'))
})

test('辛日申月若两壬并透时，不应仍按壬不在多的体全之象处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '申', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '庚'],
    hiddenStems: ['庚', '壬', '戊', '辛'],
    hiddenStemSources: [
      { pillar: 'month', branch: '申', stems: ['庚', '壬', '戊'] },
      { pillar: 'hour', branch: '酉', stems: ['辛'] }
    ],
    wuxingCounts: { 木: 0, 火: 0, 土: 1, 金: 4, 水: 3 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'shen-month-xin-metal-many-shallow-water-balance'))
  assert.ok(!result.strategyTrace?.includes('取用总纲:水浅金多，号曰体全之象'))
})

test('辛日酉月比肩一二而壬甲各一、无庚时，应标记亦有恩荣，不应误落土厚埋金', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '壬', '甲'],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 3, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:壬甲皆一，比肩相随'))
  assert.ok(result.strategyTrace?.includes('成格层次:亦有恩荣'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-jia-single-no-geng'))
})

test('辛日酉月一派辛金而只见一壬、无庚杂乱时，应标记富中取贵，不应仅按恩荣层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '辛', '壬'],
    wuxingCounts: { 木: 0, 火: 0, 土: 0, 金: 5, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:一派辛金，一位壬水'))
  assert.ok(result.strategyTrace?.includes('成格层次:富中取贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-pure-xin-single-ren'))
})

test('辛日酉月虽壬甲各一但庚透时，不应仍按无庚恩荣规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '庚'],
    wuxingCounts: { 木: 1, 火: 0, 土: 1, 金: 3, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-jia-single-no-geng'))
})

test('辛日酉月一壬而甲多、又无庚制甲时，应标记奸诈，不应仍按壬甲恩荣处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '丁'],
    hiddenStems: ['甲'],
    wuxingCounts: { 木: 2, 火: 1, 土: 0, 金: 2, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('破格因素:一壬被群甲泄气'))
  assert.ok(result.strategyTrace?.includes('成格关键:无庚制甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:奸诈之徒'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-many-jia-no-geng'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-jia-single-no-geng'))
})

test('辛日酉月一壬而甲多，但得庚制甲时，应转为仁义，不应仍按奸诈处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '庚'],
    hiddenStems: ['甲'],
    wuxingCounts: { 木: 2, 火: 0, 土: 0, 金: 3, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:一壬甲多而得庚制甲'))
  assert.ok(result.strategyTrace?.includes('成格关键:庚金护壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:反主仁义'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-many-jia-with-geng'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-many-jia-no-geng'))
})

test('辛日酉月三辛一壬、甲多而庚透且不见丁时，应提升为大富贵，不应仍只按仁义处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '庚'],
    hiddenStems: ['辛', '辛', '甲'],
    wuxingCounts: { 木: 2, 火: 0, 土: 0, 金: 5, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:三辛一壬，甲多得庚'))
  assert.ok(result.strategyTrace?.includes('成格关键:庚透制甲而护壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:主大富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-three-xin-single-ren-many-jia-geng-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-many-jia-with-geng'))
})

test('辛日酉月三辛一壬、甲多而庚透但再见丁时，应降为风雅清高，不应仍按大富贵处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '庚'],
    hiddenStems: ['辛', '辛', '甲', '丁'],
    wuxingCounts: { 木: 2, 火: 1, 土: 0, 金: 5, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:三辛一壬，甲多得庚'))
  assert.ok(result.strategyTrace?.includes('破格因素:见丁火而减贵'))
  assert.ok(result.strategyTrace?.includes('成格层次:风雅清高，衣食饶裕'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-three-xin-single-ren-many-jia-geng-ding-refined'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-three-xin-single-ren-many-jia-geng-rich'))
})

test('辛日酉月虽有三辛一壬与甲多，但无庚透时，不应误入三辛一壬甲多庚透的大富贵规则', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '丁'],
    hiddenStems: ['辛', '甲'],
    wuxingCounts: { 木: 2, 火: 1, 土: 0, 金: 3, 水: 1 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-three-xin-single-ren-many-jia-geng-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-three-xin-single-ren-many-jia-geng-ding-refined'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-many-jia-no-geng'))
})

test('辛日酉月若壬水不止一位，即使三辛甲多且庚透，也不应误入三辛一壬的大富贵规则', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '庚'],
    hiddenStems: ['辛', '甲', '甲'],
    wuxingCounts: { 木: 2, 火: 0, 土: 0, 金: 3, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-three-xin-single-ren-many-jia-geng-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-three-xin-single-ren-many-jia-geng-ding-refined'))
})

test('辛日酉月二三比肩、一壬而戊土多见又无甲时，应标记愚懦，不应仍按富中取贵或恩荣', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '壬', '戊'],
    hiddenStems: ['戊'],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 3, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('破格因素:土厚埋金，一壬难润'))
  assert.ok(result.strategyTrace?.includes('成格层次:此人愚懦'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-soil-bury-metal-no-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-pure-xin-single-ren'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-ren-jia-single-no-geng'))
})

test('辛日酉月土厚埋金即使仅一辛透干、另一辛伏藏时，仍应按愚懦处理，不应退回秋金泛取水', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '戊', '己'],
    hiddenStems: ['辛', '戊'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 3, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('破格因素:土厚埋金，一壬难润'))
  assert.ok(result.strategyTrace?.includes('成格层次:此人愚懦'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-soil-bury-metal-no-jia'))
})

test('辛日酉月土厚埋金而甲木透出时，应标记创立之人，不应仍按愚懦处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '甲', '戊'],
    hiddenStems: ['辛', '戊'],
    wuxingCounts: { 木: 1, 火: 0, 土: 2, 金: 3, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:土厚埋金而甲木透出'))
  assert.ok(result.strategyTrace?.includes('成格关键:甲木疏土'))
  assert.ok(result.strategyTrace?.includes('成格层次:必为创立之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-soil-bury-metal-with-jia'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-soil-bury-metal-no-jia'))
})

test('辛日酉月支成金局且无壬淘洗时，应明确转取丁火总纲，不应仍执壬水为先', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '丁', '戊'],
    hiddenStems: ['辛', '庚'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:支成金局，无壬淘洗'))
  assert.ok(result.strategyTrace?.includes('用神转换:此宜用丁'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-ren-high'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-no-ren-with-ding'))
})

test('辛日酉月支成金局而无壬但已见丁时，应标记得丁锻炼，不应落入无丁凶顽', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '丁', '己'],
    hiddenStems: ['辛', '庚'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:支成金局，无壬淘洗'))
  assert.ok(result.strategyTrace?.includes('用神转换:此宜用丁'))
  assert.ok(result.strategyTrace?.includes('成格关键:得丁锻炼'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-no-ren-with-ding'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-no-ren-no-ding'))
})

test('辛日酉月支成金局而无壬无丁时，应标记凶顽无赖，不应只停留在宜用丁的抽象提示', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '戊', '己'],
    hiddenStems: ['辛', '庚'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '丑', stems: ['己', '癸', '辛'] }
    ],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 4, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:支成金局，无壬淘洗'))
  assert.ok(result.strategyTrace?.includes('用神转换:此宜用丁'))
  assert.ok(result.strategyTrace?.includes('破格因素:金局无壬且无丁'))
  assert.ok(result.strategyTrace?.includes('成格层次:凶顽无赖'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-no-ren-no-ding'))
})

test('辛日酉月支成金局但仅见庚劫而无额外辛透时，不应误按干见比肩无壬无丁论', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '庚', '戊', '己'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 4, 水: 0 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-no-ren-no-ding'))
  assert.ok(!result.strategyTrace?.includes('成格层次:凶顽无赖'))
})

test('辛日酉月支成金局而壬水高透时，应标记一清到底，不应落入无壬用丁规则', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '壬', '己'],
    hiddenStems: ['辛', '庚'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'day', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 4, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:支成金局，壬水高透'))
  assert.ok(result.strategyTrace?.includes('成格层次:一清到底'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-ren-high'))
  assert.ok(!result.strategyTrace?.includes('用神转换:此宜用丁'))
})

test('辛日酉月支成金局但仅见庚劫而无额外辛透时，不应误按壬高透一清到底论', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '庚', '壬', '戊'],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 4, 水: 1 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-metal-formation-ren-high'))
  assert.ok(!result.strategyTrace?.includes('成格层次:一清到底'))
})

test('辛日酉月支成金局、戊己透而壬透无火时，应标记白虎格，不应与有火平庸同断', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '戊', '己', '壬'],
    hiddenStems: ['辛', '庚'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'day', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 0, 土: 3, 金: 4, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:金局土透，壬透无火'))
  assert.ok(result.strategyTrace?.includes('成格层次:白虎格'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-white-tiger'))
})

test('辛日酉月白虎格若丙火透出时，不应仍按无火白虎规则误判', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '戊', '丙', '壬'],
    hiddenStems: ['辛', '庚'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'day', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-white-tiger'))
})

test('辛日酉月白虎格若丙火透出时，应降为平庸，不应继续按白虎格高断', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '戊', '丙', '壬'],
    hiddenStems: ['辛', '庚'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'day', branch: '申', stems: ['庚', '壬', '戊'] }
    ],
    formationWuxings: ['金'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 2 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:白虎格见丙火'))
  assert.ok(result.strategyTrace?.includes('成格层次:亦属平庸'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-white-tiger-with-fire-ordinary'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-white-tiger'))
})

test('辛日酉月一二辛金而一派己土时，应标记僧道，不应仍退回秋金泛取水', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '辛', '己', '己'],
    hiddenStems: ['辛'],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 3, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('破格因素:一派己土，壅金埋光'))
  assert.ok(result.strategyTrace?.includes('成格层次:定为僧道'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-pure-ji-monastic'))
})

test('辛日酉月己土透干而地支见庚甲时，应标记一生安闲，不应仍按僧道或通用秋金处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '己', '己', '丁'],
    hiddenStems: ['庚', '甲', '辛'],
    wuxingCounts: { 木: 1, 火: 1, 土: 2, 金: 2, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:己土透干，支见庚甲'))
  assert.ok(result.strategyTrace?.includes('成格层次:一生安闲'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-ji-with-geng-jia-hidden-leisure'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-pure-ji-monastic'))
})

test('辛日酉月一派壬水而无戊止流时，应标记沙水同流奔波贫苦，不应仍按秋金喜水处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '壬'],
    hiddenStems: ['辛'],
    wuxingCounts: { 木: 0, 火: 0, 土: 0, 金: 2, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('破格因素:壬水成派，无戊止流'))
  assert.ok(result.strategyTrace?.includes('成格层次:沙水同流，奔波贫苦'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-water-flood-no-wu'))
})

test('辛日酉月一派壬水但地支独见一戊止流时，应标记才略艺术，不应仍按奔波贫苦处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '伤官格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '壬', '壬', '壬'],
    hiddenStems: ['辛', '戊'],
    wuxingCounts: { 木: 0, 火: 0, 土: 1, 金: 2, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:壬水成派，支见一戊止流'))
  assert.ok(result.strategyTrace?.includes('成格层次:颇有才略，艺术过人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-water-flood-hidden-wu-artistry'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-water-flood-no-wu'))
})

test('辛日酉月一派乙木而不见庚壬时，应标记才多身弱，不应仍按秋金喜水处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '乙', '乙', '乙'],
    hiddenStems: ['辛'],
    wuxingCounts: { 木: 3, 火: 0, 土: 0, 金: 2, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('破格因素:一派乙木，不见庚壬'))
  assert.ok(result.strategyTrace?.includes('成格层次:才多身弱'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-yi-wood-no-geng-ren'))
})

test('辛日酉月一派乙木但得庚金裁制时，应标记富贵可期，不应仍按才多身弱处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    visibleStems: ['辛', '乙', '乙', '庚'],
    hiddenStems: ['辛'],
    wuxingCounts: { 木: 2, 火: 0, 土: 0, 金: 3, 水: 0 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:一派乙木，得庚金裁制'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵可期'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-yi-wood-with-geng'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-yi-wood-no-geng-ren'))
})

test('辛日酉月辛日得戊子时且不见丙丁时，应按六阴朝阳处理，不应仍退回普通酉月辛金规则', () => {
  const pattern: PatternAnalysis = {
    pattern: '正印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    hourBranch: '子',
    visibleStems: ['戊', '辛', '辛', '戊'],
    visibleStemSources: [
      { pillar: 'year', stem: '戊' },
      { pillar: 'month', stem: '辛' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '戊' }
    ],
    hiddenStems: ['辛', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 3, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取象依据:六阴朝阳'))
  assert.ok(result.strategyTrace?.includes('成格关键:时上戊子而不见丙丁'))
  assert.ok(result.strategyTrace?.includes('成格层次:阴若朝阳'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-wuzi-chaoyang'))
})

test('辛日酉月辛日得戊子时又成巳酉丑全、庚辛并见时，应提升为位重权高', () => {
  const pattern: PatternAnalysis = {
    pattern: '正印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    hourBranch: '子',
    visibleStems: ['庚', '辛', '辛', '戊'],
    visibleStemSources: [
      { pillar: 'year', stem: '庚' },
      { pillar: 'month', stem: '辛' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '戊' }
    ],
    hiddenStems: ['庚', '辛', '癸', '辛', '己', '癸'],
    hiddenStemSources: [
      { pillar: 'year', branch: '巳', stems: ['丙', '庚', '戊'] },
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'day', branch: '丑', stems: ['己', '癸', '辛'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 4, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取象依据:六阴朝阳'))
  assert.ok(result.strategyTrace?.includes('成格关键:庚辛并见，巳酉丑全'))
  assert.ok(result.strategyTrace?.includes('成格层次:位重权高'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'you-month-xin-wuzi-chaoyang-authority'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-wuzi-chaoyang'))
})

test('辛日酉月辛日得戊子时但见丁火时，不应误入六阴朝阳规则', () => {
  const pattern: PatternAnalysis = {
    pattern: '正印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身强', pattern, '金', '酉', undefined, '辛', {
    hourBranch: '子',
    visibleStems: ['丁', '辛', '辛', '戊'],
    visibleStemSources: [
      { pillar: 'year', stem: '丁' },
      { pillar: 'month', stem: '辛' },
      { pillar: 'day', stem: '辛' },
      { pillar: 'hour', stem: '戊' }
    ],
    hiddenStems: ['辛', '癸'],
    hiddenStemSources: [
      { pillar: 'month', branch: '酉', stems: ['辛'] },
      { pillar: 'hour', branch: '子', stems: ['癸'] }
    ],
    wuxingCounts: { 木: 0, 火: 1, 土: 1, 金: 3, 水: 1 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-wuzi-chaoyang'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'you-month-xin-wuzi-chaoyang-authority'))
})

test('戊日辰月木多且无比印透时，应按从杀层次处理，不应仍退回春土泛论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '辰', undefined, '戊', {
    visibleStems: ['甲', '乙', '戊', '癸'],
    wuxingCounts: { 木: 4, 火: 0, 土: 2, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:官杀成势，无比印透'))
  assert.ok(result.strategyTrace?.includes('成格层次:作从杀而论，亦主富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-wu-follow-kill'))
})

test('戊日寅月木多、无庚且无比印时，应标记难作从杀，不应误按可从之局处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '寅', undefined, '戊', {
    visibleStems: ['甲', '乙', '戊', '癸'],
    wuxingCounts: { 木: 4, 火: 0, 土: 2, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('破格因素:无庚且无比印'))
  assert.ok(result.strategyTrace?.includes('成格层次:难作从杀，定主遭凶'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'yin-mao-month-wu-no-geng-no-resource-follow-kill-fail'))
})

test('戊日寅月虽木多，但一见丙印透干时，不应仍按无比印难从杀论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '寅', undefined, '戊', {
    visibleStems: ['甲', '乙', '戊', '丙'],
    wuxingCounts: { 木: 4, 火: 1, 土: 2, 金: 0, 水: 1 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:难作从杀，定主遭凶'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'yin-mao-month-wu-no-geng-no-resource-follow-kill-fail'))
})

test('己日卯月木势偏盛且明暗都无比印时，应按从杀者贵处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '卯', undefined, '己', {
    visibleStems: ['甲', '乙', '己', '癸'],
    hiddenStems: ['甲', '乙', '癸'],
    wuxingCounts: { 木: 4, 火: 0, 土: 2, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '木')
  assert.ok(result.strategyTrace?.includes('取用层次:木旺成势，明暗无比印'))
  assert.ok(result.strategyTrace?.includes('成格层次:无比印，从杀者贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'mao-month-ji-follow-kill-no-resource'))
})

test('己日卯月虽天干无比印，但地支暗藏丙印时，不应仍按无比印从杀论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '卯', undefined, '己', {
    visibleStems: ['甲', '乙', '己', '癸'],
    hiddenStems: ['甲', '乙', '丙'],
    wuxingCounts: { 木: 4, 火: 1, 土: 2, 金: 0, 水: 1 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:无比印，从杀者贵'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'mao-month-ji-follow-kill-no-resource'))
})

test('丁日子月水多癸旺且金无比印时，应标记弃命从杀而非普通冬丁调候', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '子', undefined, '丁', {
    visibleStems: ['癸', '壬', '丁', '庚'],
    hiddenStems: ['癸', '壬', '庚'],
    wuxingCounts: { 木: 0, 火: 1, 土: 0, 金: 2, 水: 5 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:水旺癸强，金神相随'))
  assert.ok(result.strategyTrace?.includes('成格层次:弃命从杀，异途功名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-ding-follow-kill-water-prosper'))
})

test('丁日子月虽水旺，但一见乙印暗藏时，不应仍按金无比印的弃命从杀论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '子', undefined, '丁', {
    visibleStems: ['癸', '壬', '丁', '庚'],
    hiddenStems: ['癸', '壬', '庚', '乙'],
    wuxingCounts: { 木: 1, 火: 1, 土: 0, 金: 2, 水: 4 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:弃命从杀，异途功名'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-ding-follow-kill-water-prosper'))
})

test('丁日子月水多癸旺但再见丁比透干时，应降为常人，不应仍按弃命从杀论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '子', undefined, '丁', {
    visibleStems: ['癸', '壬', '丁', '丁', '庚'],
    hiddenStems: ['癸', '壬', '庚'],
    wuxingCounts: { 木: 0, 火: 2, 土: 0, 金: 2, 水: 5 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:丁比出干'))
  assert.ok(result.strategyTrace?.includes('成格层次:难合格局，常人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'zi-month-ding-follow-kill-broken-by-companion'))
  assert.ok(!result.strategyTrace?.includes('成格层次:弃命从杀，异途功名'))
})

test('丁日子月仅见丙劫透干而无额外丁透时，不应误按丁比出干破格', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '火', '子', undefined, '丁', {
    visibleStems: ['癸', '壬', '丁', '丙', '庚'],
    hiddenStems: ['癸', '壬', '庚'],
    wuxingCounts: { 木: 0, 火: 2, 土: 0, 金: 2, 水: 5 }
  })

  assert.ok(!result.strategyTrace?.includes('破格因素:丁比出干'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'zi-month-ding-follow-kill-broken-by-companion'))
})

test('戊日辰月支成木局且甲乙并透见庚时，应按官杀会党得庚扫杀论富贵', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '辰', undefined, '戊', {
    visibleStems: ['甲', '乙', '戊', '庚'],
    hiddenStems: ['乙', '癸', '戊'],
    formationWuxings: ['木'],
    wuxingCounts: { 木: 4, 火: 0, 土: 2, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:官杀会党，庚金扫杀'))
  assert.ok(result.strategyTrace?.includes('成格层次:得庚透，亦主富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-wu-officer-party-geng'))
})

test('戊日辰月支成木局但无庚时，应降为浅薄之人，不应仍按得庚扫杀富贵论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '辰', undefined, '戊', {
    visibleStems: ['甲', '乙', '戊', '癸'],
    hiddenStems: ['乙', '癸', '戊'],
    formationWuxings: ['木'],
    wuxingCounts: { 木: 4, 火: 0, 土: 2, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:官杀会党无庚'))
  assert.ok(result.strategyTrace?.includes('成格层次:无庚乃浅薄之人'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-wu-officer-party-no-geng'))
  assert.ok(!result.strategyTrace?.includes('成格层次:得庚透，亦主富贵'))
})

test('戊日辰月支成木局而乙透甲藏见庚时，仍应按官杀会党得庚扫杀论，不应要求甲乙都明透', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '土', '辰', undefined, '戊', {
    visibleStems: ['乙', '戊', '庚', '癸'],
    hiddenStems: ['甲', '乙', '戊'],
    formationWuxings: ['木'],
    wuxingCounts: { 木: 4, 火: 0, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:官杀会党，庚金扫杀'))
  assert.ok(result.strategyTrace?.includes('成格层次:得庚透，亦主富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chen-month-wu-officer-party-geng'))
})

test('癸日丑月癸己会党且年透丁火、夜生时，应提升为雪后灯光之贵，不应仍按普通冬水调候', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '癸', {
    yearStem: '丁',
    hourBranch: '亥',
    visibleStems: ['丁', '癸', '己', '辛'],
    hiddenStems: ['癸', '己'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('取用层次:癸己会党，年透丁火'))
  assert.ok(result.strategyTrace?.includes('成格层次:雪后灯光，夜生可贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-gui-gui-ji-party-night-ding'))
})

test('癸日丑月同为癸己会党但日生时，不应仍按夜生雪后灯光贵论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '癸', {
    yearStem: '丁',
    hourBranch: '巳',
    visibleStems: ['丁', '癸', '己', '辛'],
    hiddenStems: ['癸', '己'],
    wuxingCounts: { 木: 0, 火: 1, 土: 2, 金: 1, 水: 4 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:雪后灯光，夜生可贵'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'chou-month-gui-gui-ji-party-night-ding'))
})

test('癸日丑月癸己会党但无丁火时，应落到孤贫层次，不应仍按雪后灯光上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '癸', {
    yearStem: '辛',
    hourBranch: '亥',
    visibleStems: ['辛', '癸', '己', '庚'],
    hiddenStems: ['癸', '己'],
    wuxingCounts: { 木: 0, 火: 0, 土: 2, 金: 2, 水: 4 }
  })

  assert.ok(result.strategyTrace?.includes('破格因素:癸己会党无丁'))
  assert.ok(result.strategyTrace?.includes('成格层次:无丁火，多主孤贫'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-gui-gui-ji-party-no-ding'))
})

test('癸日丑月支成水局而无丙火时，应标记四海为家一生劳苦，不应仍按普通冬水调候上断', () => {
  const pattern: PatternAnalysis = {
    pattern: '比肩格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '癸', {
    visibleStems: ['癸', '壬', '辛', '庚'],
    hiddenStems: ['癸'],
    formationWuxings: ['水'],
    wuxingCounts: { 木: 0, 火: 0, 土: 1, 金: 2, 水: 5 }
  })

  assert.equal(result.favorableWuxing?.[0], '火')
  assert.ok(result.strategyTrace?.includes('破格因素:支成水局无丙'))
  assert.ok(result.strategyTrace?.includes('成格层次:四海为家，一生劳苦'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-gui-water-formation-no-bing'))
})

test('癸日丑月支成火局且庚辛透干时，应提升为衣食充足，不应误落到孤苦零丁层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '癸', {
    visibleStems: ['癸', '庚', '戊', '壬'],
    hiddenStems: ['丁'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:支成火局，金透辅救'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣食充足'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-gui-fire-formation-metal-support'))
  assert.ok(!result.strategyTrace?.includes('成格层次:孤苦零丁'))
})

test('癸日丑月支成火局而庚辛不透时，应降为孤苦零丁，不应仍按见金可救论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '丑', undefined, '癸', {
    visibleStems: ['癸', '戊', '己', '壬'],
    hiddenStems: ['丁'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 3, 金: 0, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('破格因素:支成火局无金透'))
  assert.ok(result.strategyTrace?.includes('成格层次:孤苦零丁'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'chou-month-gui-fire-formation-no-metal'))
  assert.ok(!result.strategyTrace?.includes('成格层次:衣食充足'))
})

test('癸日午月庚辛透而又见壬癸时，应按金水会夏天论富贵，不应仍停留在普通夏水泛断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '壬', '庚', '戊'],
    wuxingCounts: { 木: 0, 火: 3, 土: 2, 金: 1, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:金水会夏天'))
  assert.ok(result.strategyTrace?.includes('成格层次:富贵永无边'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-wei-month-gui-metal-water-summer-rich'))
})

test('癸日午月仅金透但地支成水局时，应标记金榜挂名，不应要求壬癸也必须透干', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '庚', '戊', '己'],
    formationWuxings: ['水'],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 1, 水: 4 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:金透水局'))
  assert.ok(result.strategyTrace?.includes('成格层次:金榜挂名'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-gui-metal-stem-water-formation'))
  assert.ok(!result.strategyTrace?.includes('成格层次:富贵永无边'))
})

test('癸日未月小暑后庚辛透而又有比劫扶身时，应按上半月富贵论，不应仍与下半月混断', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '未', undefined, '癸', {
    currentJieqi: '小暑',
    visibleStems: ['癸', '壬', '庚', '己'],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 1, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:小暑后庚辛休囚，须比劫助身'))
  assert.ok(result.strategyTrace?.includes('成格层次:可云富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-gui-xiaoshu-metal-water-rich'))
})

test('癸日未月小暑后虽有庚辛但不见额外比劫时，不应仍按上半月富贵论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '未', undefined, '癸', {
    currentJieqi: '小暑',
    visibleStems: ['癸', '庚', '戊', '己'],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 1, 水: 2 }
  })

  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-gui-xiaoshu-metal-water-rich'))
  assert.ok(!result.strategyTrace?.includes('取用层次:小暑后庚辛休囚，须比劫助身'))
})

test('癸日未月大暑后庚辛有气时，即使无额外比劫也可按富贵论，不应仍强求壬癸同扶', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '未', undefined, '癸', {
    currentJieqi: '大暑',
    visibleStems: ['癸', '庚', '戊', '己'],
    wuxingCounts: { 木: 0, 火: 2, 土: 3, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:大暑后庚辛有气，即无比劫亦可'))
  assert.ok(result.strategyTrace?.includes('成格层次:可云富贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-gui-dashu-metal-rich'))
})

test('癸日未月庚辛为用但又见丁火时，应按破局不吉处理，不应仍按小暑或大暑富贵论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '未', undefined, '癸', {
    currentJieqi: '大暑',
    visibleStems: ['癸', '庚', '戊', '丁'],
    wuxingCounts: { 木: 0, 火: 3, 土: 2, 金: 1, 水: 2 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('破格因素:丁火出现，破伤庚辛'))
  assert.ok(result.strategyTrace?.includes('成格层次:丁在干支，均属不吉'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wei-month-gui-ding-break-metal'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-gui-xiaoshu-metal-water-rich'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wei-month-gui-dashu-metal-rich'))
})

test('癸日午月无水透而支只一水时，应标记一富之造，不应仍提升到金水会夏天的富贵层次', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏印格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '庚', '戊', '己'],
    wuxingCounts: { 木: 0, 火: 3, 土: 3, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '金')
  assert.ok(result.strategyTrace?.includes('取用层次:庚辛透干，支只一水'))
  assert.ok(result.strategyTrace?.includes('成格层次:一富之造，富重贵轻'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-gui-metal-no-visible-water-single-water-rich'))
  assert.ok(!result.strategyTrace?.includes('成格层次:富贵永无边'))
})

test('癸日午月支成炎局而无壬出干时，应标记僧道，不应仍按普通夏水富贵论', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '庚', '戊', '己'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 3, 金: 1, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('破格因素:支成炎局，无壬出干'))
  assert.ok(result.strategyTrace?.includes('成格层次:定主僧道'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-gui-fire-formation-no-ren-monastic'))
})

test('癸日午月支成炎局但二壬一庚同透时，应提升为衣锦腰金，不应仍按无壬僧道处理', () => {
  const pattern: PatternAnalysis = {
    pattern: '偏财格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '壬', '壬', '庚'],
    formationWuxings: ['火'],
    wuxingCounts: { 木: 0, 火: 4, 土: 1, 金: 1, 水: 3 }
  })

  assert.equal(result.favorableWuxing?.[0], '水')
  assert.ok(result.strategyTrace?.includes('取用层次:炎局中二壬一庚同透'))
  assert.ok(result.strategyTrace?.includes('成格层次:衣锦腰金'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-gui-fire-formation-two-ren-one-geng'))
  assert.ok(!result.strategyTrace?.includes('成格层次:定主僧道'))
})

test('癸日午月一派己土且无甲出制时，应按从杀大贵处理，不应仍退回普通夏水扶抑', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '己', '己', '丙'],
    hiddenStems: ['己', '己'],
    wuxingCounts: { 木: 0, 火: 2, 土: 5, 金: 0, 水: 1 }
  })

  assert.equal(result.favorableWuxing?.[0], '土')
  assert.ok(result.strategyTrace?.includes('取用层次:一派己土，无甲出制'))
  assert.ok(result.strategyTrace?.includes('成格层次:作从杀而论，又主大贵'))
  assert.ok(result.matchedRules?.some(rule => rule.id === 'wu-month-gui-ji-pure-follow-kill'))
})

test('癸日午月一派己土但甲木透干时，不应仍按从杀大贵论', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '己', '己', '甲'],
    hiddenStems: ['己', '己'],
    wuxingCounts: { 木: 1, 火: 1, 土: 5, 金: 0, 水: 1 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:作从杀而论，又主大贵'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-gui-ji-pure-follow-kill'))
})

test('癸日午月土虽重但混入戊土时，不应误判为一派己土从杀', () => {
  const pattern: PatternAnalysis = {
    pattern: '七杀格',
    isSpecial: false
  }

  const result = determineUsefulGod('身弱', pattern, '水', '午', undefined, '癸', {
    visibleStems: ['癸', '己', '戊', '丙'],
    hiddenStems: ['己', '己'],
    wuxingCounts: { 木: 0, 火: 2, 土: 5, 金: 0, 水: 1 }
  })

  assert.ok(!result.strategyTrace?.includes('成格层次:作从杀而论，又主大贵'))
  assert.ok(!result.matchedRules?.some(rule => rule.id === 'wu-month-gui-ji-pure-follow-kill'))
})
