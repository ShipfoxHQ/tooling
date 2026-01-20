import type {Duration} from 'date-fns';

export type IntervalOptionType = 'past' | 'calendar' | 'custom';

export interface IntervalOption {
  value: string;
  label: string;
  shortcut: string;
  type: IntervalOptionType;
  duration?: Duration;
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

export const RECENT_THRESHOLD_MS = 60000;
export const INTERVAL_MATCH_TOLERANCE_MS = 60000;
export const DEFAULT_TOLERANCE = 0.05;
export const MS_PER_SECOND = 1000;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const DAYS_PER_WEEK = 7;
export const MS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND;
export const MS_PER_WEEK = DAYS_PER_WEEK * MS_PER_DAY;
export const WEEK_STARTS_ON_MONDAY = 1;
