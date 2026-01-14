import type {Duration, NormalizedInterval} from 'date-fns';
import {intervalToNowFromDuration} from 'utils/date';

const RECENT_THRESHOLD_MS = 60000;

export type IntervalOptionType = 'past' | 'custom';

export interface IntervalOption {
  value: string;
  label: string;
  shortcut: string;
  type: IntervalOptionType;
  duration?: Duration;
}

export const PAST_INTERVALS: IntervalOption[] = [
  {value: '1h', duration: {hours: 1}, label: 'Past 1 hour', shortcut: '1h', type: 'past'},
  {value: '6h', duration: {hours: 6}, label: 'Past 6 hours', shortcut: '6h', type: 'past'},
  {value: '12h', duration: {hours: 12}, label: 'Past 12 hours', shortcut: '12h', type: 'past'},
  {value: '1d', duration: {days: 1}, label: 'Past 1 day', shortcut: '1d', type: 'past'},
  {value: '2d', duration: {days: 2}, label: 'Past 2 days', shortcut: '2d', type: 'past'},
  {value: '1w', duration: {weeks: 1}, label: 'Past 1 week', shortcut: '1w', type: 'past'},
  {value: '1mo', duration: {months: 1}, label: 'Past 1 month', shortcut: '1mo', type: 'past'},
];

export function findOption(value: string): IntervalOption | undefined {
  return PAST_INTERVALS.find((opt) => opt.value === value);
}

export function findOptionValueForInterval(
  interval: NormalizedInterval,
  tolerance = 0.05,
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
