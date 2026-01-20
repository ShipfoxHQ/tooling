import type {NormalizedInterval} from 'date-fns';
import {intervalToNowFromDuration} from 'utils/date';
import {calendarIntervals as defaultCalendarIntervals, getCalendarInterval} from './calendar';
import {
  DEFAULT_TOLERANCE,
  type IntervalOption,
  PAST_INTERVALS,
  RECENT_THRESHOLD_MS,
} from './constants';
import {intervalsMatch} from './intervals';

export function findOption(
  value: string,
  pastIntervals: IntervalOption[] = PAST_INTERVALS,
  calendarIntervals: IntervalOption[] = defaultCalendarIntervals,
): IntervalOption | undefined {
  return [...pastIntervals, ...calendarIntervals].find((opt) => opt.value === value);
}

export function getLabelForValue(
  val: string | undefined,
  pastIntervals: IntervalOption[] = PAST_INTERVALS,
  calendarIntervals: IntervalOption[] = defaultCalendarIntervals,
): string | undefined {
  if (!val) return undefined;
  const option = findOption(val, pastIntervals, calendarIntervals);
  return option?.label;
}

export function findOptionByInterval(
  interval: NormalizedInterval,
  pastIntervals: IntervalOption[] = PAST_INTERVALS,
  calendarIntervals: IntervalOption[] = defaultCalendarIntervals,
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
