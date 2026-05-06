import type FunctionalAstrolabe from 'iztro/lib/astro/FunctionalAstrolabe';
import type FunctionalHoroscope from 'iztro/lib/astro/FunctionalHoroscope';
import type { Config } from 'iztro/lib/data/types';
import type { ChartInput } from '../../types/chart';

export function normalizeChartInput(input: ChartInput): ChartInput {
  return {
    ...input,
    name: input.name?.trim() ?? '',
    birthDate: input.birthDate.trim(),
    fixLeap: input.fixLeap ?? true,
  };
}

export function buildIztroConfig(input: ChartInput): Config {
  return {
    algorithm: input.algorithm,
    yearDivide: input.yearDivide,
    horoscopeDivide: input.horoscopeDivide,
    ageDivide: input.ageDivide,
    dayDivide: input.dayDivide,
  };
}

function timeToIndex(hour: number) {
  if (hour === 0) {
    return 0;
  }

  if (hour === 23) {
    return 12;
  }

  return Math.floor((hour + 1) / 2);
}

export async function buildAstrolabeFromInput(
  input: ChartInput,
): Promise<FunctionalAstrolabe> {
  const normalized = normalizeChartInput(input);
  const { astro } = await import('iztro');

  return astro.withOptions({
    type: normalized.dateType,
    dateStr: normalized.birthDate,
    timeIndex: normalized.birthTimeIndex,
    gender: normalized.gender,
    isLeapMonth: normalized.isLeapMonth,
    fixLeap: normalized.fixLeap,
    astroType: normalized.astroType,
    language: 'zh-CN',
    config: buildIztroConfig(normalized),
  }) as FunctionalAstrolabe;
}

export function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getDefaultHoroscopeContext(now = new Date()) {
  return {
    dateStr: formatLocalDate(now),
    hourIndex: timeToIndex(now.getHours()),
  };
}

export function buildHoroscope(
  astrolabe: FunctionalAstrolabe,
  dateStr: string,
  hourIndex: number,
): FunctionalHoroscope {
  return astrolabe.horoscope(dateStr, hourIndex) as FunctionalHoroscope;
}

export function shiftLocalDate(
  dateStr: string,
  amount: number,
  unit: 'year' | 'month' | 'day',
): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (unit === 'year') date.setFullYear(date.getFullYear() + amount);
  if (unit === 'month') date.setMonth(date.getMonth() + amount);
  if (unit === 'day') date.setDate(date.getDate() + amount);

  return formatLocalDate(date);
}

