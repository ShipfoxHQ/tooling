import type {Duration, NormalizedInterval, StartOfWeekOptions} from 'date-fns';
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import {generateDurationShortcut, isEndOfDay, isStartOfDay} from 'utils/date';
import {
  DEFAULT_TOLERANCE,
  type IntervalOption,
  MS_PER_DAY,
  MS_PER_WEEK,
  WEEK_STARTS_ON_MONDAY,
} from './constants';
import {isWithinTolerance} from './intervals';

const WEEK_OPTIONS: StartOfWeekOptions<Date> = {weekStartsOn: WEEK_STARTS_ON_MONDAY};

function getCalendarIntervalDurationMs(optionValue: string): number | undefined {
  const calendarInterval = getCalendarInterval(optionValue);
  if (!calendarInterval) return undefined;
  return differenceInMilliseconds(calendarInterval.end, calendarInterval.start);
}

function calculateCalendarShortcut(value: string): string {
  const now = new Date();

  switch (value) {
    case 'today': {
      const todayStart = startOfDay(now);
      const hours = differenceInHours(now, todayStart);
      return generateDurationShortcut({hours}) || '0h';
    }
    case 'week-to-date': {
      const weekStart = startOfWeek(now, WEEK_OPTIONS);
      const days = differenceInDays(now, weekStart);
      const hours = differenceInHours(now, weekStart);
      return days > 0 ? generateDurationShortcut({days}) : generateDurationShortcut({hours});
    }
    case 'month-to-date': {
      const monthStart = startOfMonth(now);
      const days = differenceInDays(now, monthStart);
      return generateDurationShortcut({days}) || '0d';
    }
    case 'year-to-date': {
      const yearStart = startOfYear(now);
      const days = differenceInDays(now, yearStart);
      return generateDurationShortcut({days}) || '0d';
    }
    default:
      return '';
  }
}

export function getCalendarIntervals(): IntervalOption[] {
  const baseIntervals: Omit<IntervalOption, 'shortcut'>[] = [
    {value: 'today', label: 'Today', type: 'calendar'},
    {value: 'yesterday', label: 'Yesterday', type: 'calendar', duration: {days: 1}},
    {value: 'week-to-date', label: 'Week to Date', type: 'calendar'},
    {
      value: 'previous-week',
      label: 'Previous Week',
      type: 'calendar',
      duration: {weeks: 1},
    },
    {value: 'month-to-date', label: 'Month to Date', type: 'calendar'},
    {
      value: 'previous-month',
      label: 'Previous Month',
      type: 'calendar',
      duration: {months: 1},
    },
    {value: 'year-to-date', label: 'Year to Date', type: 'calendar'},
    {
      value: 'previous-year',
      label: 'Previous Year',
      type: 'calendar',
      duration: {years: 1},
    },
  ];

  return baseIntervals.map((interval) => {
    const dynamicShortcut = calculateCalendarShortcut(interval.value);
    return {
      ...interval,
      shortcut:
        dynamicShortcut ||
        (interval.duration ? generateDurationShortcut(interval.duration) || '' : ''),
    };
  });
}

export function getCalendarInterval(value: string): NormalizedInterval | undefined {
  const now = new Date();
  const todayStart = startOfDay(now);

  switch (value) {
    case 'today':
      return {start: todayStart, end: now};
    case 'yesterday': {
      const yesterday = subDays(now, 1);
      return {start: startOfDay(yesterday), end: endOfDay(yesterday)};
    }
    case 'week-to-date':
      return {start: startOfWeek(now, WEEK_OPTIONS), end: now};
    case 'previous-week': {
      const lastWeek = subWeeks(now, 1);
      return {
        start: startOfWeek(lastWeek, WEEK_OPTIONS),
        end: endOfWeek(lastWeek, WEEK_OPTIONS),
      };
    }
    case 'month-to-date':
      return {start: startOfMonth(now), end: now};
    case 'previous-month': {
      const lastMonth = subMonths(now, 1);
      return {start: startOfMonth(lastMonth), end: endOfMonth(lastMonth)};
    }
    case 'year-to-date':
      return {start: startOfYear(now), end: now};
    case 'previous-year': {
      const lastYear = subYears(now, 1);
      return {start: startOfYear(lastYear), end: endOfYear(lastYear)};
    }
    default:
      return undefined;
  }
}

export function getDurationFromCalendarInterval(
  interval: NormalizedInterval,
  tolerance = DEFAULT_TOLERANCE,
): Duration | undefined {
  const intervalDurationMs = differenceInMilliseconds(interval.end, interval.start);

  for (const option of getCalendarIntervals()) {
    if (!option.duration) continue;

    let expectedDurationMs: number | undefined;

    if (option.duration.days) {
      const isFullDay = isStartOfDay(interval.start) && isEndOfDay(interval.end);
      if (!isFullDay) continue;
      expectedDurationMs = option.duration.days * MS_PER_DAY;
    } else if (option.duration.weeks) {
      const weekStart = startOfWeek(interval.start, WEEK_OPTIONS);
      const weekEnd = endOfWeek(interval.end, WEEK_OPTIONS);
      const isFullWeek =
        isWithinTolerance(interval.start, weekStart) && isWithinTolerance(interval.end, weekEnd);
      if (!isFullWeek) continue;
      expectedDurationMs = option.duration.weeks * MS_PER_WEEK;
    } else if (option.duration.months) {
      const monthStart = startOfMonth(interval.start);
      const monthEnd = endOfMonth(interval.end);
      const isFullMonth =
        isWithinTolerance(interval.start, monthStart) && isWithinTolerance(interval.end, monthEnd);
      if (!isFullMonth) continue;
      expectedDurationMs = getCalendarIntervalDurationMs(option.value);
      if (expectedDurationMs === undefined) continue;
    } else if (option.duration.years) {
      const yearStart = startOfYear(interval.start);
      const yearEnd = endOfYear(interval.end);
      const isFullYear =
        isWithinTolerance(interval.start, yearStart) && isWithinTolerance(interval.end, yearEnd);
      if (!isFullYear) continue;
      expectedDurationMs = getCalendarIntervalDurationMs(option.value);
      if (expectedDurationMs === undefined) continue;
    } else {
      continue;
    }

    const durationDiff = Math.abs(intervalDurationMs - expectedDurationMs);
    if (durationDiff < expectedDurationMs * tolerance) {
      return option.duration;
    }
  }

  return undefined;
}
