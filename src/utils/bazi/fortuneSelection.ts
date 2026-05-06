import { SolarTime } from 'tyme4ts';
import {
  getBaziDayIndexByDate,
  getBaziMonthIndexByDate,
  getMonthDaysInfo,
  getYearInfo,
} from './calendarTool';
import type { BaziChartResult, LiunianInfo, LuckCycle } from './baziTypes';

interface FortunePromptPayload {
  scopeLabel: string;
  summaryLines: string[];
  breakdownTitle?: string;
  breakdownLines?: string[];
}

export interface FortuneSelectionContext {
  scope: 'dayun' | 'year' | 'month' | 'day';
  cycleIndex: number;
  cycleLabel: string;
  cycleGanZhi: string;
  cycleStartYear: number;
  cycleAge: number;
  cycleType: string;
  isXiaoyun: boolean;
  year?: number;
  yearGanZhi?: string;
  yearAge?: number;
  month?: number;
  monthGanZhi?: string;
  monthLabel?: string;
  monthStartDate?: string;
  monthEndDate?: string;
  monthJieqiName?: string;
  monthJieqiDate?: string;
  yearBreakdown?: Array<{
    year: number;
    ganZhi: string;
    age: number;
  }>;
  monthBreakdown?: Array<{
    month: number;
    label: string;
    ganZhi: string;
    startDate: string;
    endDate: string;
    startDateTime?: string;
    endDateTime?: string;
    startTermName?: string;
    endTermName?: string;
  }>;
  dayBreakdown?: Array<{
    date: string;
    label: string;
    ganZhi: string;
    startDateTime?: string;
    endDateTime?: string;
    boundaryNote?: string;
  }>;
  hourBreakdown?: Array<{
    label: string;
    ganZhi: string;
    timeRange?: string;
  }>;
  displayLabel: string;
  displayText: string;
  promptPayload: FortunePromptPayload;
}

export interface BaziFortuneSelectionValue {
  scope: 'natal' | 'dayun' | 'year' | 'month' | 'day';
  cycleIndex?: number;
  year?: number;
  month?: number;
  day?: number;
}

function getDayHourBreakdown(year: number, month: number, day: number) {
  const previousDate = new Date(year, month - 1, day - 1);
  const entries = [
    {
      year: previousDate.getFullYear(),
      month: previousDate.getMonth() + 1,
      day: previousDate.getDate(),
      hour: 23,
      label: '晚子时',
      timeRange: `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}-${String(previousDate.getDate()).padStart(2, '0')} 23:00-23:59`,
    },
    {
      year,
      month,
      day,
      hour: 0,
      label: '早子时',
      timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 00:00-00:59`,
    },
    { year, month, day, hour: 2, label: '丑时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 01:00-02:59` },
    { year, month, day, hour: 4, label: '寅时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 03:00-04:59` },
    { year, month, day, hour: 6, label: '卯时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 05:00-06:59` },
    { year, month, day, hour: 8, label: '辰时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 07:00-08:59` },
    { year, month, day, hour: 10, label: '巳时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 09:00-10:59` },
    { year, month, day, hour: 12, label: '午时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 11:00-12:59` },
    { year, month, day, hour: 14, label: '未时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 13:00-14:59` },
    { year, month, day, hour: 16, label: '申时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 15:00-16:59` },
    { year, month, day, hour: 18, label: '酉时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 17:00-18:59` },
    { year, month, day, hour: 20, label: '戌时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 19:00-20:59` },
    { year, month, day, hour: 22, label: '亥时', timeRange: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} 21:00-22:59` },
  ];

  return entries.map((entry) => {
    const solarTime = SolarTime.fromYmdHms(entry.year, entry.month, entry.day, entry.hour, 0, 0);
    const hourPillar = solarTime.getLunarHour().getEightChar().getHour();

    return {
      label: entry.label,
      ganZhi: hourPillar.getName(),
      timeRange: entry.timeRange,
    };
  });
}

function formatCycleLabel(cycle: LuckCycle) {
  if (cycle.isXiaoyun || cycle.ganZhi === '小运') {
    return '童运';
  }

  return `${cycle.ganZhi}运`;
}

function formatYearLabel(yearInfo: LiunianInfo) {
  return `${yearInfo.year}年 ${yearInfo.ganZhi}`;
}

function resolveCycleIndex(result: BaziChartResult, selection: BaziFortuneSelectionValue) {
  if (!result.luckInfo.cycles.length) return -1;

  if (
    typeof selection.cycleIndex === 'number' &&
    selection.cycleIndex >= 0 &&
    selection.cycleIndex < result.luckInfo.cycles.length
  ) {
    return selection.cycleIndex;
  }

  if (typeof selection.year === 'number') {
    let matchedIndex = -1;
    for (let i = result.luckInfo.cycles.length - 1; i >= 0; i -= 1) {
      if (result.luckInfo.cycles[i].years.some((item) => item.year === selection.year)) {
        matchedIndex = i;
        break;
      }
    }
    if (matchedIndex >= 0) {
      return matchedIndex;
    }
  }

  const currentYear = new Date().getFullYear();
  let currentCycleIndex = -1;
  for (let i = result.luckInfo.cycles.length - 1; i >= 0; i -= 1) {
    if (result.luckInfo.cycles[i].years.some((item) => item.year === currentYear)) {
      currentCycleIndex = i;
      break;
    }
  }
  return currentCycleIndex >= 0 ? currentCycleIndex : 0;
}

function resolveSelectedYear(cycle: LuckCycle | undefined, selection: BaziFortuneSelectionValue) {
  if (!cycle?.years.length) return undefined;

  if (
    typeof selection.year === 'number' &&
    cycle.years.some((item) => item.year === selection.year)
  ) {
    return selection.year;
  }

  const currentYear = new Date().getFullYear();
  const currentItem = cycle.years.find((item) => item.year === currentYear);
  return currentItem?.year ?? cycle.years[0]?.year;
}

function resolveSelectedMonth(selection: BaziFortuneSelectionValue) {
  if (typeof selection.year !== 'number') return undefined;

  const monthOptions = getYearInfo(selection.year).months;
  if (
    typeof selection.month === 'number' &&
    selection.month >= 1 &&
    selection.month <= monthOptions.length
  ) {
    return selection.month;
  }

  return getBaziMonthIndexByDate(selection.year, new Date()) ?? 1;
}

function resolveSelectedDay(
  year: number | undefined,
  month: number | undefined,
  selection: BaziFortuneSelectionValue,
) {
  if (!year || !month) return undefined;
  const dayOptions = getMonthDaysInfo(year, month);

  if (
    typeof selection.day === 'number' &&
    selection.day >= 1 &&
    selection.day <= dayOptions.length
  ) {
    return selection.day;
  }

  return getBaziDayIndexByDate(year, month, new Date()) ?? 1;
}

export function normalizeFortuneSelection(
  result: BaziChartResult,
  selection: BaziFortuneSelectionValue,
): BaziFortuneSelectionValue {
  if (selection.scope === 'natal' || !result.luckInfo.cycles.length) {
    return { scope: 'natal' };
  }

  const cycleIndex = resolveCycleIndex(result, selection);
  const cycle = result.luckInfo.cycles[cycleIndex];

  if (!cycle) {
    return { scope: 'natal' };
  }

  const year = resolveSelectedYear(cycle, selection);

  if (selection.scope === 'dayun') {
    return {
      scope: 'dayun',
      cycleIndex,
      year,
    };
  }

  if (!year) {
    return {
      scope: 'dayun',
      cycleIndex,
    };
  }

  const month = resolveSelectedMonth(selection);

  if (selection.scope === 'year') {
    return {
      scope: 'year',
      cycleIndex,
      year,
      month,
    };
  }

  const day = resolveSelectedDay(year, month, selection);

  if (selection.scope === 'month') {
    return {
      scope: 'month',
      cycleIndex,
      year,
      month,
      day,
    };
  }

  return {
    scope: 'day',
    cycleIndex,
    year,
    month,
    day,
  };
}

export function buildFortuneSelectionContext(
  result: BaziChartResult,
  selection: BaziFortuneSelectionValue,
): FortuneSelectionContext | null {
  const normalized = normalizeFortuneSelection(result, selection);
  if (normalized.scope === 'natal') {
    return null;
  }

  const cycle = result.luckInfo.cycles[normalized.cycleIndex ?? -1];
  if (!cycle) {
    return null;
  }

  const cycleLabel = formatCycleLabel(cycle);
  const yearItem = cycle.years.find((item) => item.year === normalized.year);
  const monthInfoList = normalized.year ? getYearInfo(normalized.year).months : [];
  const monthInfo = normalized.month ? monthInfoList[normalized.month - 1] : undefined;
  const dayInfoList =
    normalized.year && normalized.month
      ? getMonthDaysInfo(normalized.year, normalized.month)
      : [];
  const dayInfo = dayInfoList.find((item) => item.day === normalized.day);

  const baseContext = {
    cycleIndex: normalized.cycleIndex ?? 0,
    cycleLabel,
    cycleGanZhi: cycle.ganZhi,
    cycleStartYear: cycle.year,
    cycleAge: cycle.age,
    cycleType: cycle.type,
    isXiaoyun: cycle.isXiaoyun,
    year: yearItem?.year,
    yearGanZhi: yearItem?.ganZhi,
    yearAge: yearItem?.age,
  };

  if (normalized.scope === 'dayun') {
    const breakdown = cycle.years.map((item) => ({
      year: item.year,
      ganZhi: item.ganZhi,
      age: item.age,
    }));

    return {
      ...baseContext,
      scope: 'dayun',
      yearBreakdown: breakdown,
      displayLabel: cycleLabel,
      displayText: `${cycleLabel}（${cycle.year}年起，${cycle.age}岁交运）`,
      promptPayload: {
        scopeLabel: `当前选择：${cycleLabel}`,
        summaryLines: [
          `大运干支：${cycle.ganZhi}`,
          `起运年份：${cycle.year}年`,
          `起运年龄：${cycle.age}岁`,
          cycle.isXiaoyun ? '类型：未起运，行童运' : `类型：${cycle.type === '小运' ? '童运' : cycle.type}`,
        ],
        breakdownTitle: '该大运包含的流年',
        breakdownLines: breakdown.map((item) => `${item.year}年（${item.age}岁） ${item.ganZhi}`),
      },
    };
  }

  if (!yearItem) {
    return null;
  }

  if (normalized.scope === 'year') {
    const breakdown = monthInfoList.map((item, index) => ({
      month: index + 1,
      label: item.month,
      ganZhi: item.ganZhi,
      startDate: item.startDate,
      endDate: item.endDate,
      startDateTime: item.startDateTime,
      endDateTime: item.endDateTime,
      startTermName: item.startTermName,
      endTermName: item.endTermName,
    }));

    return {
      ...baseContext,
      scope: 'year',
      monthBreakdown: breakdown,
      displayLabel: formatYearLabel(yearItem),
      displayText: `${yearItem.year}年 ${yearItem.ganZhi}（${yearItem.age}岁）`,
      promptPayload: {
        scopeLabel: `当前选择：${yearItem.year}年流年`,
        summaryLines: [
          `所属大运：${cycleLabel}`,
          `流年干支：${yearItem.ganZhi}`,
          `对应年龄：${yearItem.age}岁`,
        ].filter(Boolean) as string[],
        breakdownTitle: '该流年包含的流月',
        breakdownLines: breakdown.map((item) => (
          `${item.month}月（${item.label}） ${item.ganZhi}｜日期范围 ${item.startDate} 至 ${item.endDate}｜交节 ${item.startTermName || ''} ${item.startDateTime || ''} 起，${item.endTermName || ''} ${item.endDateTime || ''} 交下节`
        )),
      },
    };
  }

  if (!monthInfo || !normalized.month) {
    return null;
  }

  if (normalized.scope === 'month') {
    const breakdown = dayInfoList.map((item) => ({
      date: item.solarDate,
      label: item.solarLabel,
      ganZhi: item.ganZhi,
      startDateTime: item.startDateTime,
      endDateTime: item.endDateTime,
      boundaryNote: item.boundaryNote,
    }));

    return {
      ...baseContext,
      scope: 'month',
      month: normalized.month,
      monthGanZhi: monthInfo.ganZhi,
      monthLabel: monthInfo.month,
      monthBreakdown: [
        {
          month: normalized.month,
          label: monthInfo.month,
          ganZhi: monthInfo.ganZhi,
          startDate: monthInfo.startDate,
          endDate: monthInfo.endDate,
          startDateTime: monthInfo.startDateTime,
          endDateTime: monthInfo.endDateTime,
          startTermName: monthInfo.startTermName,
          endTermName: monthInfo.endTermName,
        },
      ],
      dayBreakdown: breakdown,
      displayLabel: `${yearItem.year}年${monthInfo.month}`,
      displayText: `${yearItem.year}年 ${monthInfo.month}（${monthInfo.ganZhi}，${monthInfo.startDateTime || monthInfo.startDate} 起，至 ${monthInfo.endDateTime || monthInfo.endDate} 交下节）`,
      promptPayload: {
        scopeLabel: `当前选择：${yearItem.year}年${monthInfo.month}流月`,
        summaryLines: [
          `所属大运：${cycleLabel}`,
          `所属流年：${yearItem.year}年 ${yearItem.ganZhi}`,
          `流月：${monthInfo.month} ${monthInfo.ganZhi}`,
          `日期范围：${monthInfo.startDate} 至 ${monthInfo.endDate}`,
          `交节时刻：${monthInfo.startTermName || ''} ${monthInfo.startDateTime || ''} 起，${monthInfo.endTermName || ''} ${monthInfo.endDateTime || ''} 交下节`,
        ],
        breakdownTitle: '该流月包含的流日',
        breakdownLines: breakdown.map((item) => `${item.date} ${item.ganZhi}${item.boundaryNote ? `｜${item.boundaryNote}` : ''}`),
      },
    };
  }

  if (!dayInfo || !normalized.day) {
    return null;
  }

  const actualDate = dayInfo.solarDate;
  const [actualYear, actualMonth, actualDay] = actualDate.split('-').map(Number);
  const hourBreakdown = getDayHourBreakdown(actualYear, actualMonth, actualDay);
  const previousDate = new Date(actualYear, actualMonth - 1, actualDay - 1);
  const ziChuStart = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}-${String(previousDate.getDate()).padStart(2, '0')} 23:00`;
  const ziChuEnd = `${actualDate} 22:59`;

  return {
    ...baseContext,
    scope: 'day',
    month: normalized.month,
    monthGanZhi: monthInfo.ganZhi,
    monthLabel: monthInfo.month,
    hourBreakdown,
    dayBreakdown: [
      {
        date: actualDate,
        label: dayInfo.solarLabel,
        ganZhi: dayInfo.ganZhi,
      },
    ],
    displayLabel: actualDate,
    displayText: `${actualDate}（${dayInfo.ganZhi}）`,
    promptPayload: {
      scopeLabel: `当前选择：${actualDate}流日`,
      summaryLines: [
        `所属大运：${cycleLabel}`,
        `所属流年：${yearItem.year}年 ${yearItem.ganZhi}`,
        `所属流月：${monthInfo.month} ${monthInfo.ganZhi}`,
        `流日：${actualDate} ${dayInfo.ganZhi}`,
        `按子初换日：${ziChuStart} 至 ${ziChuEnd}`,
        ...(dayInfo.boundaryNote ? [`交节提示：${dayInfo.boundaryNote}`] : []),
      ],
      breakdownTitle: '该流日包含的流时',
      breakdownLines: hourBreakdown.map((item) => `${item.label} ${item.timeRange || ''} ${item.ganZhi}`.trim()),
    },
  };
}
