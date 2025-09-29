import {
  type Duration,
  endOfDay,
  formatDuration,
  type NormalizedInterval,
  startOfDay,
  startOfMonth,
  sub,
} from 'date-fns';

export function isStartOfDay(date: Date): boolean {
  return date.getTime() === startOfDay(date).getTime();
}

export function isStartOfMonth(date: Date): boolean {
  return date.getTime() === startOfMonth(date).getTime();
}

export function isEndOfDay(date: Date): boolean {
  return date.getTime() === endOfDay(date).getTime();
}

export function humanizeDurationToNow(duration: Duration): string {
  return `Past ${formatDuration(duration)}`;
}

export interface IntervalToNowFromDurationOptions {
  /** When set, if an interval is given in a precise unit, it will be rounded-sm to full days
   *  (ex: 1 day, will generate intervals from midnight (d-1) to midnight (d))
   *  Does not apply to units lower than day */
  attemptRounding?: boolean;
}

export function intervalToNowFromDuration(
  duration: Duration,
  options?: IntervalToNowFromDurationOptions,
): NormalizedInterval {
  const now = new Date();
  const interval = {
    start: sub(now, duration),
    end: now,
  };
  if (!options?.attemptRounding) return interval;
  const units = Object.keys(duration);
  if (units.length !== 1) return interval;
  if (['hours', 'minutes', 'seconds'].includes(units[0])) return interval;
  return {
    start: startOfDay(interval.start),
    end: endOfDay(interval.end),
  };
}

const DURATION_SHORTCUTS: Record<keyof Duration, string> = {
  years: 'y',
  months: 'mo',
  weeks: 'w',
  days: 'd',
  hours: 'h',
  minutes: 'm',
  seconds: 's',
};

const DURATION_SHORTCUTS_REVERSED: Record<string, keyof Duration> = Object.fromEntries(
  Object.entries(DURATION_SHORTCUTS).map(([key, value]) => [value, key as keyof Duration]),
);

const DURATION_SHORTCUT_REGEX = new RegExp(
  `^(\\d+)(${Object.keys(DURATION_SHORTCUTS_REVERSED).join('|')})$`,
);

export function generateDurationShortcut(duration: Duration): string {
  const keys = Object.keys(duration) as (keyof Duration)[];
  if (keys.length !== 1) return '';
  const key = keys[0];
  const value = duration[key];
  return `${value}${DURATION_SHORTCUTS[key]}`;
}

export function parseTextDurationShortcut(text: string): Duration | undefined {
  const match = text.match(DURATION_SHORTCUT_REGEX);
  if (!match) return;
  const [_, value, shortcut] = match;
  const unit = DURATION_SHORTCUTS_REVERSED[shortcut];
  return {[unit]: Number.parseInt(value, 10)};
}

const dateSplitterRefex = /[-\u2013]/;

export function parseTextInterval(text: string): NormalizedInterval | undefined {
  const durationShortcut = parseTextDurationShortcut(text);
  if (durationShortcut) return intervalToNowFromDuration(durationShortcut);
  const textDates = text.split(dateSplitterRefex).map((token) => token.trim());
  if (textDates.length !== 2) return;
  const start = new Date(textDates[0]);
  const end = new Date(textDates[1]);
  if (Number.isNaN(start.getTime())) return;
  if (Number.isNaN(end.getTime())) return;
  return {start, end};
}
