import type {NormalizedInterval} from 'date-fns';
import {humanizeDurationToNow} from 'utils/date';
import {formatDateTimeRange} from 'utils/format/date';
import {getDurationFromCalendarInterval} from './calendar';
import {getDurationFromInterval, isRelativeToNow} from './intervals';

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
