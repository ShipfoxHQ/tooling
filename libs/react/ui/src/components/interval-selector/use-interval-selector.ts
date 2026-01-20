import type {NormalizedInterval} from 'date-fns';
import {differenceInDays, differenceInHours, differenceInMinutes} from 'date-fns';
import {useCallback, useEffect, useRef, useState} from 'react';
import type {DateRange as DayPickerDateRange} from 'react-day-picker';
import {intervalToNowFromDuration, parseTextInterval} from 'utils/date';
import type {IntervalSelection, IntervalSelectorProps} from './interval-selector';
import {
  detectShortcutFromCalendarInterval,
  findOption,
  findOptionByInterval,
  formatIntervalDisplay,
  getCalendarInterval,
  getLabelForValue,
  type IntervalOption,
  parseRelativeTimeShortcut,
} from './interval-selector.utils';

interface UseIntervalSelectorProps
  extends Pick<
    IntervalSelectorProps,
    'selection' | 'onSelectionChange' | 'value' | 'onValueChange'
  > {
  pastIntervals: IntervalOption[];
  calendarIntervals: IntervalOption[];
}

export function useIntervalSelector({
  selection,
  onSelectionChange,
  value,
  onValueChange,
  pastIntervals,
  calendarIntervals,
}: UseIntervalSelectorProps) {
  const currentInterval: NormalizedInterval =
    selection.type === 'interval'
      ? selection.interval
      : intervalToNowFromDuration(selection.duration);
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
  const isMouseDownOnInputRef = useRef(false);

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
      const label = getLabelForValue(val, pastIntervals, calendarIntervals);
      if (label) {
        setSelectedLabel(label);
        selectedValueRef.current = val;
        setConfirmedShortcut(getShortcutFromValue(val));
        return true;
      }
      return false;
    },
    [getShortcutFromValue, pastIntervals, calendarIntervals],
  );

  const updateSelectionFromRef = useCallback(() => {
    if (!selectedValueRef.current) return false;
    const option = findOption(selectedValueRef.current, pastIntervals, calendarIntervals);
    if (option) {
      setSelectedLabel(option.label);
      setConfirmedShortcut(getShortcutFromValue(option.value));
      return true;
    }
    clearSelectionState();
    return false;
  }, [getShortcutFromValue, clearSelectionState, pastIntervals, calendarIntervals]);

  const updateSelectionFromInterval = useCallback(
    (int: NormalizedInterval) => {
      const matchingOption = findOptionByInterval(int, pastIntervals, calendarIntervals);
      if (matchingOption) {
        setSelectedLabel(matchingOption.label);
        selectedValueRef.current = matchingOption.value;
        setConfirmedShortcut(getShortcutFromValue(matchingOption.value));
      } else {
        applyIntervalDetection(int);
      }
    },
    [getShortcutFromValue, applyIntervalDetection, pastIntervals, calendarIntervals],
  );

  const emitSelection = useCallback(
    (newSelection: IntervalSelection) => {
      onSelectionChange(newSelection);
    },
    [onSelectionChange],
  );

  const getAllNavigableItems = () => {
    return [
      ...pastIntervals,
      ...calendarIntervals,
      {value: '__calendar__', label: 'Select from calendar', type: 'custom' as const},
    ];
  };

  const displayValue = isFocused
    ? inputValue
    : value && findOption(value, pastIntervals, calendarIntervals)
      ? (selectedLabel ??
        getLabelForValue(value, pastIntervals, calendarIntervals) ??
        formatIntervalDisplay(currentInterval, false))
      : (selectedLabel ?? formatIntervalDisplay(currentInterval, false));

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
      const explicitValue = formatIntervalDisplay(currentInterval, true);
      setInputValue(explicitValue);
      setDetectedShortcut(undefined);

      if (value && updateSelectionFromValue(value)) {
        return;
      }

      if (updateSelectionFromRef()) {
        return;
      }

      updateSelectionFromInterval(currentInterval);
    }
  }, [
    currentInterval,
    isFocused,
    value,
    updateSelectionFromValue,
    updateSelectionFromRef,
    updateSelectionFromInterval,
  ]);

  const handleFocus = () => {
    setIsFocused(true);
    setPopoverOpen(true);
    setInputValue(formatIntervalDisplay(currentInterval, true));
    setHighlightedIndex(-1);
    setIsInvalid(false);
    requestAnimationFrame(() => {
      inputRef.current?.select();
    });
  };

  const handleMouseDown = () => {
    isMouseDownOnInputRef.current = true;
  };

  const handleMouseUp = () => {
    setTimeout(() => {
      isMouseDownOnInputRef.current = false;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('[role="dialog"]')) {
      return;
    }
    if (isMouseDownOnInputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
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
      emitSelection({
        type: 'relative',
        duration: parsedShortcut.duration,
      });
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
      const calendarResult = detectShortcutFromCalendarInterval(parsedInterval);
      if (calendarResult?.value) {
        onValueChange?.(calendarResult.value);
      } else {
        onValueChange?.(undefined);
      }
      applyIntervalDetection(parsedInterval);
      emitSelection({
        type: 'interval',
        interval: parsedInterval,
      });
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

    const option = findOption(optionValue, pastIntervals, calendarIntervals);
    if (option) {
      if (option.type === 'calendar') {
        const calendarInterval = getCalendarInterval(optionValue);
        if (calendarInterval) {
          emitSelection({
            type: 'interval',
            interval: calendarInterval,
          });
        }
      } else if (option.duration) {
        emitSelection({
          type: 'relative',
          duration: option.duration,
        });
      }
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

    emitSelection({
      type: 'interval',
      interval: calendarInterval,
    });

    if (range.to) {
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
      isMouseDownOnInputRef.current = false;
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
    handleMouseDown,
    handleMouseUp,
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
