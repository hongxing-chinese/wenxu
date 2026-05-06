import test from 'node:test'
import assert from 'node:assert/strict'
import { ChildLimit, Gender, SolarTime } from 'tyme4ts'
import { baziCalculator } from '../src/utils/bazi/baziCalculator'
import { TIME_MAP } from '../src/utils/bazi/baziDisplayData'

function collectXiaoyunByAge(result: ReturnType<typeof baziCalculator.calculateBazi>) {
  const ageMap = new Map<number, string>()

  result.luckInfo.cycles.forEach(cycle => {
    cycle.years.forEach(year => {
      if (year.xiaoyun?.ganZhi && !ageMap.has(year.age)) {
        ageMap.set(year.age, year.xiaoyun.ganZhi)
      }
    })
  })

  return ageMap
}

function collectExpectedXiaoyunByAge(
  year: number,
  month: number,
  day: number,
  timeIndex: number,
  gender: 'male' | 'female',
  ages: number[]
) {
  const hour = TIME_MAP[timeIndex]?.hour
  if (typeof hour !== 'number') {
    throw new Error(`无效的时辰索引：${timeIndex}`)
  }

  const solarTime = SolarTime.fromYmdHms(year, month, day, hour, 0, 0)
  const childLimit = ChildLimit.fromSolarTime(
    solarTime,
    gender === 'male' ? Gender.MAN : Gender.WOMAN
  )
  const startFortune = childLimit.getStartFortune()
  const startAge = startFortune.getAge()

  return new Map(
    ages.map(age => [age, startFortune.next(age - startAge).getName()] as const)
  )
}

test('男命小运序列应与 tyme4ts 官方 Fortune 保持一致', () => {
  const input = {
    year: 1990,
    month: 1,
    day: 1,
    timeIndex: 12,
    gender: 'male' as const,
    isLunar: false,
    isLeapMonth: false,
    useTrueSolarTime: false,
  }

  const result = baziCalculator.calculateBazi(input)
  const actual = collectXiaoyunByAge(result)
  const expected = collectExpectedXiaoyunByAge(
    input.year,
    input.month,
    input.day,
    input.timeIndex,
    input.gender,
    [1, 2, 8, 9, 10, 18, 19]
  )

  expected.forEach((name, age) => {
    assert.equal(actual.get(age), name, `年龄 ${age} 的小运应为 ${name}`)
  })
})

test('女命小运序列应与 tyme4ts 官方 Fortune 保持一致', () => {
  const input = {
    year: 2012,
    month: 12,
    day: 21,
    timeIndex: 3,
    gender: 'female' as const,
    isLunar: false,
    isLeapMonth: false,
    useTrueSolarTime: false,
  }

  const result = baziCalculator.calculateBazi(input)
  const actual = collectXiaoyunByAge(result)
  const expected = collectExpectedXiaoyunByAge(
    input.year,
    input.month,
    input.day,
    input.timeIndex,
    input.gender,
    [1, 2, 5, 6, 7, 15, 16]
  )

  expected.forEach((name, age) => {
    assert.equal(actual.get(age), name, `年龄 ${age} 的小运应为 ${name}`)
  })
})

test('扁平流年数组中的交运年份应去重，并默认以后一步大运为准', () => {
  const result = baziCalculator.calculateBazi({
    year: 1990,
    month: 1,
    day: 1,
    timeIndex: 12,
    gender: 'male',
    isLunar: false,
    isLeapMonth: false,
    useTrueSolarTime: false,
  })

  const liunian1998 = result.liunian?.filter(item => item.year === 1998) ?? []
  const nextCycle1998 = result.luckInfo.cycles[1]?.years.find(item => item.year === 1998)

  assert.equal(liunian1998.length, 1)
  assert.equal(liunian1998[0]?.xiaoyun?.ganZhi, nextCycle1998?.xiaoyun?.ganZhi)
})

test('周期展示年份与分析年份应分离，交运年只保留在后一步 resolvedYears 中', () => {
  const result = baziCalculator.calculateBazi({
    year: 1990,
    month: 1,
    day: 1,
    timeIndex: 12,
    gender: 'male',
    isLunar: false,
    isLeapMonth: false,
    useTrueSolarTime: false,
  })

  const childCycle = result.luckInfo.cycles[0]
  const firstDayun = result.luckInfo.cycles[1]

  assert.equal(childCycle.years.some(item => item.year === 1998), true)
  assert.equal(childCycle.resolvedYears?.some(item => item.year === 1998), false)
  assert.equal(firstDayun.years.some(item => item.year === 1998), true)
  assert.equal(firstDayun.resolvedYears?.some(item => item.year === 1998), true)
})
