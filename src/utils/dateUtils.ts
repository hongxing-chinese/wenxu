/**
 * 日期时间工具函数
 */

/**
 * 格式化日期
 * @param year 年份
 * @param month 月份
 * @param day 日期
 * @returns 格式化后的日期字符串 (YYYY-MM-DD)
 */
function formatDate(year: string | number, month: string | number, day: string | number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/**
 * 格式化时间
 * @param timeIndex 时间索引
 * @returns 格式化后的时间字符串
 */
function formatTime(timeIndex: number): string {
  const times = [
    '00:00-00:59 (子时)',
    '01:00-02:59 (丑时)',
    '03:00-04:59 (寅时)',
    '05:00-06:59 (卯时)',
    '07:00-08:59 (辰时)',
    '09:00-10:59 (巳时)',
    '11:00-12:59 (午时)',
    '13:00-14:59 (未时)',
    '15:00-16:59 (申时)',
    '17:00-18:59 (酉时)',
    '19:00-20:59 (戌时)',
    '21:00-22:59 (亥时)',
    '23:00-24:00 (晚子时)'
  ]

  return times[timeIndex] || '未知时辰'
}

function formatClockTime(hour?: number, minute?: number): string {
  if (typeof hour !== 'number' || typeof minute !== 'number') {
    return ''
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function getTimeIndexFromClock(hour: number, minute = 0): number {
  if (hour === 23) return 12
  if (hour === 0) return 0
  if (hour >= 1 && hour < 3) return 1
  if (hour >= 3 && hour < 5) return 2
  if (hour >= 5 && hour < 7) return 3
  if (hour >= 7 && hour < 9) return 4
  if (hour >= 9 && hour < 11) return 5
  if (hour >= 11 && hour < 13) return 6
  if (hour >= 13 && hour < 15) return 7
  if (hour >= 15 && hour < 17) return 8
  if (hour >= 17 && hour < 19) return 9
  if (hour >= 19 && hour < 21) return 10
  if (hour >= 21 && hour < 23) return 11

  if (hour === 24 && minute === 0) {
    return 12
  }

  return -1
}

/**
 * 获取当前时间戳
 * @returns ISO 格式的时间戳
 */
function getCurrentTimestamp(): string {
  return new Date().toISOString()
}

/**
 * 计算年龄
 * @param birthYear 出生年份
 * @returns 年龄
 */
function calculateAge(birthYear: number): number {
  const currentYear = new Date().getFullYear()
  return currentYear - birthYear
}

/**
 * 检查是否为闰年
 * @param year 年份
 * @returns 是否为闰年
 */
function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * 获取月份的天数
 * @param year 年份
 * @param month 月份 (1-12)
 * @returns 该月份的天数
 */
export function getDaysInMonth(year: number, month: number): number {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (month === 2 && isLeapYear(year)) {
    return 29
  }
  return daysInMonth[month - 1]
}
