import {getYear, type NormalizedInterval} from 'date-fns';
import {isEndOfDay, isStartOfDay} from 'utils/date';

interface DateTimeFormatOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
}

const defaultOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
};

function getDateTimeFormatter({
  locale,
  ...options
}: DateTimeFormatOptions = {}): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(locale, {
    ...defaultOptions,
    ...options,
  });
}

function areCurrentYear({start, end}: NormalizedInterval): boolean {
  const now = new Date();
  return getYear(end) === getYear(now) && getYear(start) === getYear(now);
}

export function formatDateTime(date: Date, options?: DateTimeFormatOptions): string {
  const formatter = getDateTimeFormatter(options);
  return formatter.format(date);
}

export function formatDateTimeRelativeToInterval(
  date: Date,
  interval: NormalizedInterval,
  options?: DateTimeFormatOptions,
) {
  const formatter = getDateTimeFormatter({
    year: areCurrentYear(interval) ? undefined : defaultOptions.year,
    ...options,
  });
  return formatter.format(date);
}

export function formatDateTimeRange(
  interval: NormalizedInterval,
  options?: DateTimeFormatOptions,
): string {
  const {start, end} = interval;
  const areFullDays = isStartOfDay(start) && isEndOfDay(end);
  const formatter = getDateTimeFormatter({
    year: areCurrentYear(interval) ? undefined : defaultOptions.year,
    hour: areFullDays ? undefined : defaultOptions.hour,
    minute: areFullDays ? undefined : defaultOptions.minute,
    ...options,
  });
  return formatter.formatRange(start, end);
}

export function formatTimeSeriesTick(
  date: Date,
  {locale, ...options}: DateTimeFormatOptions = {},
): string {
  const tickOptions: DateTimeFormatOptions = isStartOfDay(date)
    ? {month: 'short', day: 'numeric'}
    : {hour: 'numeric', minute: '2-digit'};
  const formatter = new Intl.DateTimeFormat(locale, {
    ...tickOptions,
    ...options,
  });
  return formatter.format(date);
}
