import type {Duration, NormalizedInterval} from 'date-fns';
import {differenceInMilliseconds} from 'date-fns';
import {intervalToNowFromDuration} from 'utils/date';
import {
  DEFAULT_TOLERANCE,
  INTERVAL_MATCH_TOLERANCE_MS,
  PAST_INTERVALS,
  RECENT_THRESHOLD_MS,
} from './constants';

export function isWithinTolerance(
  date1: Date,
  date2: Date,
  toleranceMs = INTERVAL_MATCH_TOLERANCE_MS,
): boolean {
  return Math.abs(date1.getTime() - date2.getTime()) < toleranceMs;
}

export function intervalsMatch(
  interval1: NormalizedInterval,
  interval2: NormalizedInterval,
): boolean {
  return (
    isWithinTolerance(interval1.start, interval2.start) &&
    isWithinTolerance(interval1.end, interval2.end)
  );
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
