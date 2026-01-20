import type {NormalizedInterval} from 'date-fns';
import {useCallback} from 'react';
import {
  detectShortcutFromCalendarInterval,
  findOption,
  findOptionByInterval,
  getLabelForValue,
  type IntervalOption,
} from '../interval-selector.utils';

interface UseIntervalSelectorSelectionProps {
  pastIntervals: IntervalOption[];
  resolvedCalendarIntervals: IntervalOption[];
  getShortcutFromValue: (value: string) => string | undefined;
  detectShortcutFromInterval: (interval: NormalizedInterval) => {
    shortcut?: string;
    label?: string;
    value?: string;
  };
  setSelectedLabel: (label: string | undefined) => void;
  setConfirmedShortcut: (shortcut: string | undefined) => void;
  selectedValueRef: React.RefObject<string | undefined>;
}

export function useIntervalSelectorSelection({
  pastIntervals,
  resolvedCalendarIntervals,
  getShortcutFromValue,
  detectShortcutFromInterval,
  setSelectedLabel,
  setConfirmedShortcut,
  selectedValueRef,
}: UseIntervalSelectorSelectionProps) {
  const clearSelectionState = useCallback(() => {
    setSelectedLabel(undefined);
    selectedValueRef.current = undefined;
    setConfirmedShortcut(undefined);
  }, [setSelectedLabel, setConfirmedShortcut, selectedValueRef]);

  const applyIntervalDetection = useCallback(
    (interval: NormalizedInterval) => {
      const calendarResult = detectShortcutFromCalendarInterval(interval);
      if (calendarResult) {
        setConfirmedShortcut(calendarResult.shortcut ?? undefined);
        setSelectedLabel(calendarResult.label);
        selectedValueRef.current = calendarResult.value ?? undefined;
        return;
      }

      const {shortcut, label, value} = detectShortcutFromInterval(interval);
      if (shortcut) {
        setConfirmedShortcut(shortcut);
        setSelectedLabel(label ?? undefined);
        selectedValueRef.current = value ?? undefined;
      } else {
        clearSelectionState();
      }
    },
    [
      detectShortcutFromInterval,
      clearSelectionState,
      setSelectedLabel,
      setConfirmedShortcut,
      selectedValueRef,
    ],
  );

  const updateSelectionFromValue = useCallback(
    (val: string) => {
      const label = getLabelForValue(val, pastIntervals, resolvedCalendarIntervals);
      if (label) {
        setSelectedLabel(label);
        selectedValueRef.current = val;
        setConfirmedShortcut(getShortcutFromValue(val));
        return true;
      }
      return false;
    },
    [
      getShortcutFromValue,
      pastIntervals,
      resolvedCalendarIntervals,
      setSelectedLabel,
      setConfirmedShortcut,
      selectedValueRef,
    ],
  );

  const updateSelectionFromRef = useCallback(() => {
    if (!selectedValueRef.current) return false;
    const option = findOption(selectedValueRef.current, pastIntervals, resolvedCalendarIntervals);
    if (option) {
      setSelectedLabel(option.label);
      setConfirmedShortcut(getShortcutFromValue(option.value));
      return true;
    }
    clearSelectionState();
    return false;
  }, [
    getShortcutFromValue,
    clearSelectionState,
    pastIntervals,
    resolvedCalendarIntervals,
    setSelectedLabel,
    setConfirmedShortcut,
    selectedValueRef,
  ]);

  const updateSelectionFromInterval = useCallback(
    (int: NormalizedInterval) => {
      const matchingOption = findOptionByInterval(int, pastIntervals, resolvedCalendarIntervals);
      if (matchingOption) {
        setSelectedLabel(matchingOption.label);
        selectedValueRef.current = matchingOption.value;
        setConfirmedShortcut(getShortcutFromValue(matchingOption.value));
      } else {
        applyIntervalDetection(int);
      }
    },
    [
      getShortcutFromValue,
      applyIntervalDetection,
      pastIntervals,
      resolvedCalendarIntervals,
      setSelectedLabel,
      setConfirmedShortcut,
      selectedValueRef,
    ],
  );

  return {
    clearSelectionState,
    applyIntervalDetection,
    updateSelectionFromValue,
    updateSelectionFromRef,
    updateSelectionFromInterval,
  };
}
