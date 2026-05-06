import type { SolarDateTimeInfo } from './baziTypes'

export interface TrueSolarTimeResult {
  correctedTime: SolarDateTimeInfo;
  longitudeCorrectionMinutes: number;
  equationOfTimeMinutes: number;
  totalCorrectionMinutes: number;
}

function getDayOfYear(year: number, month: number, day: number): number {
  const current = new Date(Date.UTC(year, month - 1, day))
  const start = new Date(Date.UTC(year, 0, 1))
  return Math.floor((current.getTime() - start.getTime()) / 86400000) + 1
}

function toDateTimeInfo(date: Date): SolarDateTimeInfo {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds()
  }
}

export function calculateEquationOfTimeMinutes(year: number, month: number, day: number): number {
  const dayOfYear = getDayOfYear(year, month, day)
  const angle = (2 * Math.PI * (dayOfYear - 81)) / 364
  return 9.87 * Math.sin(2 * angle) - 7.53 * Math.cos(angle) - 1.5 * Math.sin(angle)
}

export function calculateTrueSolarTime(
  standardTime: Pick<SolarDateTimeInfo, 'year' | 'month' | 'day' | 'hour' | 'minute'>,
  longitude: number,
  standardMeridian = 120
): TrueSolarTimeResult {
  const equationOfTimeMinutes = calculateEquationOfTimeMinutes(
    standardTime.year,
    standardTime.month,
    standardTime.day
  )
  const longitudeCorrectionMinutes = (longitude - standardMeridian) * 4
  const totalCorrectionMinutes = equationOfTimeMinutes + longitudeCorrectionMinutes

  const correctedDate = new Date(Date.UTC(
    standardTime.year,
    standardTime.month - 1,
    standardTime.day,
    standardTime.hour,
    standardTime.minute,
    0
  ))
  correctedDate.setTime(correctedDate.getTime() + totalCorrectionMinutes * 60000)

  return {
    correctedTime: toDateTimeInfo(correctedDate),
    longitudeCorrectionMinutes,
    equationOfTimeMinutes,
    totalCorrectionMinutes
  }
}
