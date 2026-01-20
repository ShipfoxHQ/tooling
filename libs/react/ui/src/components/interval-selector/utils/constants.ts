import {
  type Duration,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  type NormalizedInterval,
  type StartOfWeekOptions,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';

export interface RelativeSuggestion {
  type: 'relative';
  duration: Duration;
}

export interface IntervalSuggestion {
  label: string;
  type: 'interval';
  interval: NormalizedInterval;
}

export type Suggestion = RelativeSuggestion | IntervalSuggestion;

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

export const defaultRelativeSuggestions: RelativeSuggestion[] = [
  {duration: {minutes: 5}, type: 'relative'},
  {duration: {minutes: 15}, type: 'relative'},
  {duration: {minutes: 30}, type: 'relative'},
  {duration: {hours: 1}, type: 'relative'},
  {duration: {hours: 4}, type: 'relative'},
  {duration: {days: 1}, type: 'relative'},
  {duration: {days: 2}, type: 'relative'},
  {duration: {weeks: 1}, type: 'relative'},
  {duration: {months: 1}, type: 'relative'},
];

const WEEK_OPTIONS: StartOfWeekOptions<Date> = {weekStartsOn: 1};

const now = new Date();

export const defaultIntervalSuggestions: IntervalSuggestion[] = [
  {
    label: 'Today',
    type: 'interval',
    interval: {start: startOfDay(now), end: endOfDay(now)},
  },
  {
    label: 'Yesterday',
    type: 'interval',
    interval: {start: startOfDay(subDays(now, 1)), end: endOfDay(subDays(now, 1))},
  },
  {
    label: 'Week to Date',
    type: 'interval',
    interval: {start: startOfWeek(now, WEEK_OPTIONS), end: endOfDay(now)},
  },
  {
    label: 'Previous Week',
    type: 'interval',
    interval: {
      start: startOfWeek(subWeeks(now, 1), WEEK_OPTIONS),
      end: endOfWeek(subWeeks(now, 1), WEEK_OPTIONS),
    },
  },
  {
    label: 'Month to Date',
    type: 'interval',
    interval: {start: startOfMonth(now), end: endOfDay(now)},
  },
  {
    label: 'Previous Month',
    type: 'interval',
    interval: {start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1))},
  },
  {
    label: 'Year to Date',
    type: 'interval',
    interval: {start: startOfYear(now), end: endOfDay(now)},
  },
  {
    label: 'Previous Year',
    type: 'interval',
    interval: {start: startOfYear(subYears(now, 1)), end: endOfYear(subYears(now, 1))},
  },
];
