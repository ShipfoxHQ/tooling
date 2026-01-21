import {intervalToDuration} from 'date-fns';
import {
  generateDurationShortcut,
  humanizeDurationToNow,
  intervalToNowFromDuration,
  parseTextDurationShortcut,
  parseTextInterval,
} from 'utils/date';
import {formatDateTime, formatDateTimeRange} from 'utils/format/date';
import type {IntervalSelection} from '../types';

export function formatSelectionForInput(selection: IntervalSelection): string {
  const interval =
    selection.type === 'relative'
      ? intervalToNowFromDuration(selection.duration)
      : selection.interval;
  return `${formatDateTime(interval.start)}\u2009\u2013\u2009${formatDateTime(interval.end)}`;
}

interface FormatSelectionParams {
  selection: IntervalSelection;
  inputValue: string;
  isFocused: boolean;
}

export function formatSelection({selection, isFocused, inputValue}: FormatSelectionParams): string {
  if (isFocused) return inputValue;
  if (selection.type === 'relative') return humanizeDurationToNow(selection.duration);
  return formatDateTimeRange(selection.interval);
}

interface FormatShortcutParams {
  selection: IntervalSelection;
  inputValue: string;
  isFocused: boolean;
}

export function formatShortcut({selection, inputValue, isFocused}: FormatShortcutParams): string {
  const inputShortcut = parseTextDurationShortcut(inputValue);
  const inputInterval = parseTextInterval(inputValue);
  if (isFocused && inputShortcut) return generateDurationShortcut(inputShortcut);
  if (isFocused && inputInterval)
    return generateDurationShortcut(intervalToDuration(inputInterval));
  if (isFocused) return '-';
  if (selection.type === 'relative') return generateDurationShortcut(selection.duration);
  return generateDurationShortcut(intervalToDuration(selection.interval));
}
