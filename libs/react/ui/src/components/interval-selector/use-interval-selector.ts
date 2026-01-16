import type {NormalizedInterval} from 'date-fns';
import {differenceInDays, differenceInHours, differenceInMinutes} from 'date-fns';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {DateRange as DayPickerDateRange} from 'react-day-picker';
import {intervalToNowFromDuration, parseTextInterval} from 'utils/date';
import {
  CALENDAR_INTERVALS,
  detectShortcutFromCalendarInterval,
  findOption,
  findOptionByInterval,
  formatIntervalDisplay,
  getCalendarInterval,
  getLabelForValue,
  PAST_INTERVALS,
  parseRelativeTimeShortcut,
} from './interval-selector.utils';

interface UseIntervalSelectorProps {
  interval: NormalizedInterval;
  onIntervalChange: (interval: NormalizedInterval) => void;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function useIntervalSelector({
  interval,
  onIntervalChange,
  value,
  onValueChange,
}: UseIntervalSelectorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [detectedShortcut, setDetectedShortcut] = useState<string | undefined>(undefined);
  const [confirmedShortcut, setConfirmedShortcut] = useState<string | undefined>(undefined);
  const [isInvalid, setIsInvalid] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const selectedValueRef = useRef<string | undefined>(undefined);
  const isSelectingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getShortcutFromValue = useCallback((value: string): string | undefined => {
    const option = findOption(value);
    if (option?.shortcut) {
      return option.shortcut;
    }
    const parsedShortcut = parseRelativeTimeShortcut(value);
    return parsedShortcut?.shortcut;
  }, []);

  const detectShortcutFromInterval = useCallback((interval: NormalizedInterval) => {
    const matchingOption = findOptionByInterval(interval);
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
  }, []);

  const clearSelectionState = useCallback(() => {
    setSelectedLabel(undefined);
    selectedValueRef.current = undefined;
    setConfirmedShortcut(undefined);
  }, []);

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
    [detectShortcutFromInterval, clearSelectionState],
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

  const triggerShakeAnimation = useCallback(() => {
    setIsInvalid(true);
    setShouldShake(true);
    if (shakeTimeoutRef.current) {
      clearTimeout(shakeTimeoutRef.current);
    }
    shakeTimeoutRef.current = setTimeout(() => {
      setShouldShake(false);
      shakeTimeoutRef.current = null;
    }, 500);
  }, []);

  const updateSelectionFromValue = useCallback(
    (val: string) => {
      const label = getLabelForValue(val);
      if (label) {
        setSelectedLabel(label);
        selectedValueRef.current = val;
        setConfirmedShortcut(getShortcutFromValue(val));
        return true;
      }
      return false;
    },
    [getShortcutFromValue],
  );

  const updateSelectionFromRef = useCallback(() => {
    if (!selectedValueRef.current) return false;
    const option = findOption(selectedValueRef.current);
    if (option) {
      setSelectedLabel(option.label);
      setConfirmedShortcut(getShortcutFromValue(option.value));
      return true;
    }
    clearSelectionState();
    return false;
  }, [getShortcutFromValue, clearSelectionState]);

  const updateSelectionFromInterval = useCallback(
    (int: NormalizedInterval) => {
      const matchingOption = findOptionByInterval(int);
      if (matchingOption) {
        setSelectedLabel(matchingOption.label);
        selectedValueRef.current = matchingOption.value;
        setConfirmedShortcut(getShortcutFromValue(matchingOption.value));
      } else {
        setSelectedLabel(undefined);
        selectedValueRef.current = undefined;
      }
    },
    [getShortcutFromValue],
  );

  const createIntervalFromOption = useCallback(
    (optionValue: string): NormalizedInterval | undefined => {
      const option = findOption(optionValue);
      if (option?.duration) {
        return intervalToNowFromDuration(option.duration);
      }
      if (option?.type === 'calendar') {
        return getCalendarInterval(optionValue);
      }
      return undefined;
    },
    [],
  );

  const getAllNavigableItems = () => {
    return [
      ...PAST_INTERVALS,
      ...CALENDAR_INTERVALS,
      {value: '__calendar__', label: 'Select from calendar', type: 'custom' as const},
    ];
  };

  const displayValue = isFocused
    ? inputValue
    : (selectedLabel ?? formatIntervalDisplay(interval, false));

  const closeInputAndPopover = () => {
    setIsFocused(false);
    setPopoverOpen(false);
    inputRef.current?.blur();
  };

  const closeAll = () => {
    closeInputAndPopover();
    setCalendarOpen(false);
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    if (!isFocused && !isSelectingRef.current) {
      const explicitValue = formatIntervalDisplay(interval, true);
      setInputValue(explicitValue);
      setDetectedShortcut(undefined);

      if (value && updateSelectionFromValue(value)) {
        return;
      }

      if (updateSelectionFromRef()) {
        return;
      }

      updateSelectionFromInterval(interval);
    }
  }, [
    interval,
    isFocused,
    value,
    updateSelectionFromValue,
    updateSelectionFromRef,
    updateSelectionFromInterval,
  ]);

  const handleFocus = () => {
    setIsFocused(true);
    setPopoverOpen(true);
    setInputValue(formatIntervalDisplay(interval, true));
    setHighlightedIndex(-1);
    setIsInvalid(false);
    requestAnimationFrame(() => {
      inputRef.current?.select();
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('[role="dialog"]')) {
      return;
    }
    setIsFocused(false);
    setDetectedShortcut(undefined);
    if (!calendarOpen) {
      setPopoverOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const detectedShortcut = detectShortcutFromInput(newValue);
    if (detectedShortcut) {
      setDetectedShortcut(detectedShortcut);
      setIsInvalid(false);
    } else {
      setDetectedShortcut(undefined);
      if (newValue.trim()) {
        setConfirmedShortcut(undefined);
        setIsInvalid(true);
      } else {
        setConfirmedShortcut(undefined);
        setIsInvalid(false);
      }
    }

    if (selectedLabel || selectedValueRef.current) {
      setSelectedLabel(undefined);
      selectedValueRef.current = undefined;
    }
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (popoverOpen && !calendarOpen) {
      const items = getAllNavigableItems();

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        return;
      }

      if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < items.length) {
        e.preventDefault();
        const item = items[highlightedIndex];
        if (item.value === '__calendar__') {
          handleOpenCalendar();
        } else {
          handleOptionSelect(item.value, item.label);
        }
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmInput();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeAll();
    }
  };

  const handleConfirmInput = () => {
    const trimmedValue = inputValue.trim();

    const parsedShortcut = parseRelativeTimeShortcut(trimmedValue);
    if (parsedShortcut) {
      const newInterval = intervalToNowFromDuration(parsedShortcut.duration);
      onIntervalChange(newInterval);
      onValueChange?.(trimmedValue);
      setSelectedLabel(parsedShortcut.label);
      selectedValueRef.current = undefined;
      setConfirmedShortcut(parsedShortcut.shortcut);
      setDetectedShortcut(undefined);
      setIsInvalid(false);
      closeInputAndPopover();
      return;
    }

    const parsedInterval = parseTextInterval(trimmedValue);
    if (parsedInterval) {
      applyIntervalDetection(parsedInterval);
      onIntervalChange(parsedInterval);
      onValueChange?.(trimmedValue);
      if (!value) {
        selectedValueRef.current = undefined;
      }
      setDetectedShortcut(undefined);
      setIsInvalid(false);
      closeInputAndPopover();
      return;
    }

    triggerShakeAnimation();
    setDetectedShortcut(undefined);
  };

  const handleOptionSelect = (optionValue: string, label: string) => {
    selectedValueRef.current = optionValue;
    setSelectedLabel(label);
    isSelectingRef.current = true;
    setDetectedShortcut(undefined);
    setConfirmedShortcut(getShortcutFromValue(optionValue));
    onValueChange?.(optionValue);

    const newInterval = createIntervalFromOption(optionValue);
    if (newInterval) {
      onIntervalChange(newInterval);
    }

    closeInputAndPopover();
  };

  const handleCalendarSelect = (range: DayPickerDateRange | undefined) => {
    if (!range?.from) return;

    const calendarInterval = range.to
      ? {start: range.from, end: range.to}
      : {start: range.from, end: range.from};

    isSelectingRef.current = true;

    applyIntervalDetection(calendarInterval);

    onIntervalChange(calendarInterval);

    if (range.to && differenceInDays(range.to, range.from) !== 0) {
      closeAll();
    }
  };

  const handleOpenCalendar = () => {
    setCalendarOpen(true);
  };

  const displayShortcut = detectedShortcut ?? confirmedShortcut ?? '-';

  useEffect(() => {
    return () => {
      isSelectingRef.current = false;
      if (shakeTimeoutRef.current) {
        clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  return {
    isFocused,
    popoverOpen,
    calendarOpen,
    inputValue,
    displayValue,
    highlightedIndex,
    displayShortcut,
    isInvalid,
    shouldShake,
    inputRef,
    handleFocus,
    handleBlur,
    handleInputChange,
    handleKeyDown,
    handleOptionSelect,
    handleCalendarSelect,
    handleOpenCalendar,
    setPopoverOpen,
    setIsFocused,
    closeAll,
  };
}
