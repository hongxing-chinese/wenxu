import type { LuckCycle, SolarDateTimeInfo } from './baziTypes'

function getLastDayOfMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate()
}

export function toNativeDate(time: SolarDateTimeInfo | Date): Date {
  if (time instanceof Date) {
    return new Date(time.getTime())
  }

  return new Date(
    time.year,
    time.month - 1,
    time.day,
    time.hour,
    time.minute,
    time.second
  )
}

export function toSolarDateTimeInfo(time: {
  getYear(): number;
  getMonth(): number;
  getDay(): number;
  getHour(): number;
  getMinute(): number;
  getSecond(): number;
}): SolarDateTimeInfo {
  return {
    year: time.getYear(),
    month: time.getMonth(),
    day: time.getDay(),
    hour: time.getHour(),
    minute: time.getMinute(),
    second: time.getSecond()
  }
}

export function shiftSolarDateTimeYears(time: SolarDateTimeInfo, years: number): SolarDateTimeInfo {
  const nextYear = time.year + years
  const lastDayOfTargetMonth = getLastDayOfMonth(nextYear, time.month)

  return {
    ...time,
    year: nextYear,
    day: Math.min(time.day, lastDayOfTargetMonth)
  }
}

function getFallbackCycleEnd(cycle: LuckCycle): Date {
  if (cycle.isXiaoyun) {
    return new Date(cycle.year + Math.max(cycle.years.length, 1), 0, 1, 0, 0, 0)
  }

  return new Date(cycle.year + 10, 0, 1, 0, 0, 0)
}

export function isDateWithinLuckCycle(cycle: LuckCycle, referenceDate: Date = new Date()): boolean {
  const cycleStart = cycle.startSolarTime
    ? toNativeDate(cycle.startSolarTime)
    : new Date(cycle.year, 0, 1, 0, 0, 0)
  const cycleEnd = cycle.endSolarTime
    ? toNativeDate(cycle.endSolarTime)
    : getFallbackCycleEnd(cycle)

  return referenceDate >= cycleStart && referenceDate < cycleEnd
}

export function getLuckCycleForDate(cycles: LuckCycle[], referenceDate: Date = new Date()): LuckCycle | null {
  if (!cycles.length) {
    return null
  }

  const exactMatch = cycles.find(cycle => isDateWithinLuckCycle(cycle, referenceDate))
  if (exactMatch) {
    return exactMatch
  }

  const referenceYear = referenceDate.getFullYear()
  const fallbackMatch = cycles.find(cycle => {
    if (cycle.isXiaoyun) {
      const endYear = cycle.years.at(-1)?.year ?? cycle.year
      return referenceYear >= cycle.year && referenceYear <= endYear
    }

    return referenceYear >= cycle.year && referenceYear < cycle.year + 10
  })

  return fallbackMatch || null
}

export function formatSolarDateTime(time: SolarDateTimeInfo, withYear = false): string {
  const datePart = withYear
    ? `${time.year}年${time.month}月${time.day}日`
    : `${time.month}月${time.day}日`
  const timePart = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`
  return `${datePart} ${timePart}`
}
