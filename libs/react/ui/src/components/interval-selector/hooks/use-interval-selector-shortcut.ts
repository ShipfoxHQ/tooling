import type {NormalizedInterval} from 'date-fns';
import {differenceInDays, differenceInHours, differenceInMinutes} from 'date-fns';
import {useCallback} from 'react';
import {parseTextInterval} from 'utils/date';
import {
  detectShortcutFromCalendarInterval,
  findOption,
  findOptionByInterval,
  type IntervalOption,
  parseRelativeTimeShortcut,
} from '../interval-selector.utils';

interface UseIntervalSelectorShortcutProps {
  pastIntervals: IntervalOption[];
  calendarIntervals: IntervalOption[];
}

export function useIntervalSelectorShortcut({
  pastIntervals,
  calendarIntervals,
}: UseIntervalSelectorShortcutProps) {
  const getShortcutFromValue = useCallback(
    (value: string): string | undefined => {
      const option = findOption(value, pastIntervals, calendarIntervals);
      if (option?.shortcut) {
        return option.shortcut;
      }
      const parsedShortcut = parseRelativeTimeShortcut(value);
      return parsedShortcut?.shortcut;
    },
    [pastIntervals, calendarIntervals],
  );

  const detectShortcutFromInterval = useCallback(
    (interval: NormalizedInterval) => {
      const matchingOption = findOptionByInterval(interval, pastIntervals, calendarIntervals);
      if (matchingOption?.shortcut) {
        return {
          shortcut: matchingOption.shortcut,
          label: matchingOption.label,
          value: matchingOption.value,
        };
      }

      const days = Math.abs(differenceInDays(interval.end, interval.start));
      const hours = Math.abs(differenceInHours(interval.end, interval.start));
      const minutes = Math.abs(differenceInMinutes(interval.end, interval.start));

      const durationString =
        days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : minutes > 0 ? `${minutes}m` : '-';
      const parsedShortcut = parseRelativeTimeShortcut(durationString);

      if (parsedShortcut) {
        return {
          shortcut: parsedShortcut.shortcut,
          label: parsedShortcut.label,
          value: undefined,
        };
      }

      return {shortcut: undefined, label: undefined, value: undefined};
    },
    [pastIntervals, calendarIntervals],
  );

  const detectShortcutFromInput = useCallback(
    (inputValue: string): string | undefined => {
      const parsedShortcut = parseRelativeTimeShortcut(inputValue);
      if (parsedShortcut) {
        return parsedShortcut.shortcut;
      }

      const parsedInterval = parseTextInterval(inputValue);
      if (parsedInterval) {
        const calendarResult = detectShortcutFromCalendarInterval(parsedInterval);
        if (calendarResult) {
          return calendarResult.shortcut ?? undefined;
        }
        const {shortcut} = detectShortcutFromInterval(parsedInterval);
        return shortcut;
      }

      return undefined;
    },
    [detectShortcutFromInterval],
  );

  return {
    getShortcutFromValue,
    detectShortcutFromInterval,
    detectShortcutFromInput,
  };
}
