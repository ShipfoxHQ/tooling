import type {Duration, NormalizedInterval, StartOfWeekOptions} from 'date-fns';
import {
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMonths,
  differenceInYears,
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
import {
  generateDurationShortcut,
  humanizeDurationToNow,
  intervalToNowFromDuration,
  isEndOfDay,
  isStartOfDay,
  parseTextDurationShortcut,
} from 'utils/date';
import {formatDateTimeRange} from 'utils/format/date';

const RECENT_THRESHOLD_MS = 60000;
const INTERVAL_MATCH_TOLERANCE_MS = 60000;
const DEFAULT_TOLERANCE = 0.05;
const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const DAYS_PER_WEEK = 7;
const MS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND;
const MS_PER_WEEK = DAYS_PER_WEEK * MS_PER_DAY;
const WEEK_STARTS_ON_MONDAY = 1;
const WEEK_OPTIONS: StartOfWeekOptions<Date> = {weekStartsOn: WEEK_STARTS_ON_MONDAY};

function isWithinTolerance(
  date1: Date,
  date2: Date,
  toleranceMs = INTERVAL_MATCH_TOLERANCE_MS,
): boolean {
  return Math.abs(date1.getTime() - date2.getTime()) < toleranceMs;
}

function intervalsMatch(interval1: NormalizedInterval, interval2: NormalizedInterval): boolean {
  return (
    isWithinTolerance(interval1.start, interval2.start) &&
    isWithinTolerance(interval1.end, interval2.end)
  );
}

function getCalendarIntervalDurationMs(optionValue: string): number | undefined {
  const calendarInterval = getCalendarInterval(optionValue);
  if (!calendarInterval) return undefined;
  return differenceInMilliseconds(calendarInterval.end, calendarInterval.start);
}

export type IntervalOptionType = 'past' | 'calendar' | 'custom';

export interface IntervalOption {
  value: string;
  label: string;
  shortcut: string;
  type: IntervalOptionType;
  duration?: Duration;
}

export const PAST_INTERVALS: IntervalOption[] = [
  {value: '5m', duration: {minutes: 5}, label: 'Past 5 Minutes', shortcut: '5m', type: 'past'},
  {value: '15m', duration: {minutes: 15}, label: 'Past 15 Minutes', shortcut: '15m', type: 'past'},
  {value: '30m', duration: {minutes: 30}, label: 'Past 30 Minutes', shortcut: '30m', type: 'past'},
  {value: '1h', duration: {hours: 1}, label: 'Past 1 Hour', shortcut: '1h', type: 'past'},
  {value: '4h', duration: {hours: 4}, label: 'Past 4 Hours', shortcut: '4h', type: 'past'},
  {value: '1d', duration: {days: 1}, label: 'Past 1 Day', shortcut: '1d', type: 'past'},
  {value: '2d', duration: {days: 2}, label: 'Past 2 Days', shortcut: '2d', type: 'past'},
  {value: '1w', duration: {weeks: 1}, label: 'Past 1 Week', shortcut: '1w', type: 'past'},
  {value: '1mo', duration: {months: 1}, label: 'Past 1 Month', shortcut: '1mo', type: 'past'},
];

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

export function findOption(
  value: string,
  pastIntervals: IntervalOption[] = PAST_INTERVALS,
  calendarIntervals: IntervalOption[] = getCalendarIntervals(),
): IntervalOption | undefined {
  return [...pastIntervals, ...calendarIntervals].find((opt) => opt.value === value);
}

export function getLabelForValue(
  val: string | undefined,
  pastIntervals: IntervalOption[] = PAST_INTERVALS,
  calendarIntervals: IntervalOption[] = getCalendarIntervals(),
): string | undefined {
  if (!val) return undefined;
  const option = findOption(val, pastIntervals, calendarIntervals);
  return option?.label;
}

export function findOptionByInterval(
  interval: NormalizedInterval,
  pastIntervals: IntervalOption[] = PAST_INTERVALS,
  calendarIntervals: IntervalOption[] = getCalendarIntervals(),
): IntervalOption | undefined {
  for (const opt of calendarIntervals) {
    const calendarInterval = getCalendarInterval(opt.value);
    if (calendarInterval && intervalsMatch(interval, calendarInterval)) {
      return opt;
    }
  }

  for (const opt of pastIntervals) {
    if (opt.duration) {
      const expectedInterval = intervalToNowFromDuration(opt.duration);
      if (intervalsMatch(interval, expectedInterval)) {
        return opt;
      }
    }
  }

  return undefined;
}

export function findOptionValueForInterval(
  interval: NormalizedInterval,
  tolerance = DEFAULT_TOLERANCE,
): string | undefined {
  const now = new Date();
  const isRecent = Math.abs(interval.end.getTime() - now.getTime()) < RECENT_THRESHOLD_MS;

  if (!isRecent) {
    return undefined;
  }

  const duration = interval.end.getTime() - interval.start.getTime();

  for (const option of PAST_INTERVALS) {
    if (option.duration) {
      const expectedInterval = intervalToNowFromDuration(option.duration);
      const expectedDuration = expectedInterval.end.getTime() - expectedInterval.start.getTime();
      const durationDiff = Math.abs(duration - expectedDuration);

      if (durationDiff < expectedDuration * tolerance) {
        return option.value;
      }
    }
  }

  return undefined;
}

export function isRelativeToNow(
  interval: NormalizedInterval,
  toleranceMs = RECENT_THRESHOLD_MS,
): boolean {
  const now = new Date();
  return isWithinTolerance(interval.end, now, toleranceMs);
}

export function getDurationFromInterval(
  interval: NormalizedInterval,
  tolerance = DEFAULT_TOLERANCE,
): Duration | undefined {
  if (!isRelativeToNow(interval)) {
    return undefined;
  }

  const durationMs = differenceInMilliseconds(interval.end, interval.start);

  for (const option of PAST_INTERVALS) {
    if (option.duration) {
      const expectedInterval = intervalToNowFromDuration(option.duration);
      const expectedDurationMs = differenceInMilliseconds(
        expectedInterval.end,
        expectedInterval.start,
      );
      const durationDiff = Math.abs(durationMs - expectedDurationMs);

      if (durationDiff < expectedDurationMs * tolerance) {
        return option.duration;
      }
    }
  }

  return undefined;
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

export function formatIntervalDisplay(interval: NormalizedInterval, isFocused: boolean): string {
  const isAbsolute = !isRelativeToNow(interval);

  if (isFocused) {
    return formatDateTimeRange(interval, {forceShowTime: isAbsolute});
  }

  const duration = getDurationFromInterval(interval);
  if (duration) {
    return humanizeDurationToNow(duration);
  }

  const calendarDuration = getDurationFromCalendarInterval(interval);
  if (calendarDuration) {
    return humanizeDurationToNow(calendarDuration);
  }

  return formatDateTimeRange(interval, {forceShowTime: isAbsolute});
}

export interface ParsedShortcut {
  shortcut: string;
  duration: Duration;
  label: string;
}

export interface CalendarShortcutResult {
  shortcut: string | undefined;
  label: string;
  value: string | undefined;
}

function normalizeDurationToAppropriateUnit(duration: Duration): Duration {
  const normalized: Duration = {...duration};

  if (normalized.minutes && normalized.minutes >= 60) {
    const hours = Math.floor(normalized.minutes / 60);
    const remainingMinutes = normalized.minutes % 60;
    normalized.hours = (normalized.hours || 0) + hours;
    if (remainingMinutes > 0) {
      normalized.minutes = remainingMinutes;
    } else {
      delete normalized.minutes;
    }
  }

  if (normalized.hours && normalized.hours >= 24) {
    const days = Math.round(normalized.hours / 24);
    normalized.days = (normalized.days || 0) + days;
    delete normalized.hours;
  }

  if (normalized.days && normalized.days >= 30) {
    const months = Math.round(normalized.days / 30);
    normalized.months = (normalized.months || 0) + months;
    delete normalized.days;
  }

  if (normalized.months && normalized.months >= 12) {
    const years = Math.floor(normalized.months / 12);
    const remainingMonths = normalized.months % 12;
    normalized.years = (normalized.years || 0) + years;
    if (remainingMonths > 0) {
      normalized.months = remainingMonths;
    } else {
      delete normalized.months;
    }
  }

  const units = ['years', 'months', 'weeks', 'days', 'hours', 'minutes'] as const;
  for (const unit of units) {
    if (normalized[unit]) {
      return {[unit]: normalized[unit]};
    }
  }

  return normalized;
}

export function parseRelativeTimeShortcut(input: string): ParsedShortcut | undefined {
  const trimmed = input.trim();
  if (!trimmed) return undefined;

  let duration = parseTextDurationShortcut(trimmed);
  if (!duration) return undefined;

  if (duration.days !== undefined) {
    const days = duration.days;
    if (days > 730) return undefined;
    if (days > 547) {
      return {
        shortcut: '2y',
        duration: {years: 2},
        label: 'Past 2 Years',
      };
    }
  }

  duration = normalizeDurationToAppropriateUnit(duration);

  if (duration.years !== undefined) {
    if (duration.years !== 1) return undefined;
    return {
      shortcut: '1y',
      duration: {years: 1},
      label: 'Past 1 Year',
    };
  }

  if (duration.months !== undefined) {
    const months = duration.months;
    if (months > 17) {
      return {
        shortcut: '2y',
        duration: {years: 2},
        label: 'Past 2 Years',
      };
    }
    return {
      shortcut: `${months}mo`,
      duration: {months},
      label: `Past ${months} ${months === 1 ? 'Month' : 'Months'}`,
    };
  }

  if (duration.weeks !== undefined) {
    const weeks = duration.weeks;
    if (weeks > 104) return undefined;
    if (weeks > 78) {
      return {
        shortcut: '2y',
        duration: {years: 2},
        label: 'Past 2 Years',
      };
    }
    if (weeks >= 52) {
      return {
        shortcut: '1y',
        duration: {years: 1},
        label: 'Past 1 Year',
      };
    }
    if (weeks > 17) {
      const months = Math.round(weeks / 4.33);
      return {
        shortcut: `${months}mo`,
        duration: {months},
        label: `Past ${months} ${months === 1 ? 'Month' : 'Months'}`,
      };
    }
    return {
      shortcut: `${weeks}w`,
      duration: {weeks},
      label: `Past ${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`,
    };
  }

  if (duration.days !== undefined) {
    const days = duration.days;
    if (days >= 30 && days <= 31) {
      return {
        shortcut: '1mo',
        duration: {months: 1},
        label: 'Past 1 Month',
      };
    }
    if (days > 31) return undefined;
    return {
      shortcut: `${days}d`,
      duration: {days},
      label: `Past ${days} ${days === 1 ? 'Day' : 'Days'}`,
    };
  }

  if (duration.hours !== undefined) {
    const hours = duration.hours;
    return {
      shortcut: `${hours}h`,
      duration: {hours},
      label: `Past ${hours} ${hours === 1 ? 'Hour' : 'Hours'}`,
    };
  }

  if (duration.minutes !== undefined) {
    const minutes = duration.minutes;
    return {
      shortcut: `${minutes}m`,
      duration: {minutes},
      label: `Past ${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`,
    };
  }

  return undefined;
}

export function detectShortcutFromCalendarInterval(
  interval: NormalizedInterval,
): CalendarShortcutResult | undefined {
  if (isRelativeToNow(interval)) {
    return undefined;
  }

  const formatOptions = {forceShowTime: true};

  const matchingOption = findOptionByInterval(interval);
  if (matchingOption?.shortcut) {
    return {
      shortcut: matchingOption.shortcut,
      label: formatDateTimeRange(interval, formatOptions),
      value: matchingOption.value,
    };
  }

  const days = Math.abs(differenceInDays(interval.end, interval.start));
  const months = Math.abs(differenceInMonths(interval.end, interval.start));
  const years = Math.abs(differenceInYears(interval.end, interval.start));

  let shortcut: string | undefined;

  if (years > 0) {
    if (years > 1) {
      return {
        shortcut: undefined,
        label: formatDateTimeRange(interval, formatOptions),
        value: undefined,
      };
    }
    shortcut = '1y';
  } else if (months > 0) {
    shortcut = `${months}mo`;
  } else if (days > 0) {
    if (days > 30) {
      shortcut = '1mo';
    } else {
      shortcut = `${days}d`;
    }
  } else {
    return {
      shortcut: undefined,
      label: formatDateTimeRange(interval, formatOptions),
      value: undefined,
    };
  }

  return {
    shortcut,
    label: formatDateTimeRange(interval, formatOptions),
    value: undefined,
  };
}
