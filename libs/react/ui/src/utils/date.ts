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
  /** When set, if an interval is given in a precise unit, it will be rounded to full days
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

const UNIT_NAMES: Record<keyof Duration, string[]> = {
  minutes: ['m', 'min', 'minute', 'minutes'],
  hours: ['h', 'hr', 'hour', 'hours'],
  days: ['d', 'day', 'days'],
  weeks: ['w', 'wk', 'week', 'weeks'],
  months: ['mo', 'mon', 'month', 'months'],
  years: ['y', 'yr', 'year', 'years'],
  seconds: ['s', 'sec', 'second', 'seconds'],
};

const UNIT_NAME_TO_KEY: Record<string, keyof Duration> = {};
for (const [key, names] of Object.entries(UNIT_NAMES)) {
  for (const name of names) {
    UNIT_NAME_TO_KEY[name.toLowerCase()] = key as keyof Duration;
  }
}

const SHORTCUT_PATTERN = Object.keys(DURATION_SHORTCUTS_REVERSED).join('|');
const FULL_NAME_PATTERN = Object.values(UNIT_NAMES)
  .flat()
  .sort((a, b) => b.length - a.length)
  .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');

const DURATION_SHORTCUT_REGEX = new RegExp(`^(\\d+)\\s*(${SHORTCUT_PATTERN})$`, 'i');
const DURATION_FULL_REGEX = new RegExp(`^(\\d+)\\s+(${FULL_NAME_PATTERN})\\s*$`, 'i');

export function generateDurationShortcut(duration: Duration): string {
  const keys = Object.keys(duration) as (keyof Duration)[];
  if (keys.length !== 1) return '';
  const key = keys[0];
  const value = duration[key];
  return `${value}${DURATION_SHORTCUTS[key]}`;
}

export function parseTextDurationShortcut(text: string): Duration | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  const shortcutMatch = trimmed.match(DURATION_SHORTCUT_REGEX);
  if (shortcutMatch) {
    const [_, value, shortcut] = shortcutMatch;
    const unit = DURATION_SHORTCUTS_REVERSED[shortcut.toLowerCase()];
    if (unit) {
      return {[unit]: Number.parseInt(value, 10)};
    }
  }

  const fullMatch = trimmed.match(DURATION_FULL_REGEX);
  if (fullMatch) {
    const [_, value, unitName] = fullMatch;
    const normalizedUnitName = unitName.toLowerCase().trim();
    const unit = UNIT_NAME_TO_KEY[normalizedUnitName];
    if (unit) {
      return {[unit]: Number.parseInt(value, 10)};
    }
  }

  return undefined;
}

const dateSplitterRefex = /[-\u2013]/;
const yearRegex = /\d{4}/;

function hasYearInText(text: string): boolean {
  return yearRegex.test(text);
}

export function parseTextInterval(text: string): NormalizedInterval | undefined {
  const durationShortcut = parseTextDurationShortcut(text);
  if (durationShortcut) return intervalToNowFromDuration(durationShortcut);
  const textDates = text.split(dateSplitterRefex).map((token) => token.trim());
  if (textDates.length !== 2) return;

  const startText = textDates[0];
  const endText = textDates[1];
  const startHasYear = hasYearInText(startText);
  const endHasYear = hasYearInText(endText);

  const start = new Date(startText);
  const end = new Date(endText);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return;

  const now = new Date();
  const currentYear = now.getFullYear();

  if (!startHasYear && !endHasYear) {
    start.setFullYear(currentYear);
    end.setFullYear(currentYear);
  } else if (!startHasYear) {
    start.setFullYear(end.getFullYear());
  } else if (!endHasYear) {
    end.setFullYear(currentYear);
  }

  if (end < start) {
    if (end.getFullYear() < currentYear) {
      end.setFullYear(currentYear);
    }

    const endYear = end.getFullYear();
    start.setFullYear(endYear - 1);
  }

  if (end < start) {
    return {start: end, end: start};
  }

  return {start, end};
}
