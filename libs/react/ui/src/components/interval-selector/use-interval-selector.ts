import type {NormalizedInterval} from 'date-fns';
import {differenceInDays} from 'date-fns';
import {useEffect, useRef, useState} from 'react';
import type {DateRange as DayPickerDateRange} from 'react-day-picker';
import {intervalToNowFromDuration, parseTextInterval} from 'utils/date';
import {
  CALENDAR_INTERVALS,
  findOption,
  findOptionByInterval,
  formatIntervalDisplay,
  getCalendarInterval,
  getLabelForValue,
  PAST_INTERVALS,
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
  const selectedValueRef = useRef<string | undefined>(undefined);
  const isSelectingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const closeAll = () => {
    setPopoverOpen(false);
    setIsFocused(false);
    setCalendarOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const closeInputAndPopover = () => {
    setIsFocused(false);
    setPopoverOpen(false);
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (!isFocused && !isSelectingRef.current) {
      const explicitValue = formatIntervalDisplay(interval, true);
      setInputValue(explicitValue);

      if (value) {
        const label = getLabelForValue(value);
        if (label) {
          setSelectedLabel(label);
          selectedValueRef.current = value;
          return;
        }
      }

      if (selectedValueRef.current) {
        const option = findOption(selectedValueRef.current);
        if (option) {
          setSelectedLabel(option.label);
          return;
        }
        selectedValueRef.current = undefined;
        setSelectedLabel(undefined);
      }

      const matchingOption = findOptionByInterval(interval);
      if (matchingOption) {
        setSelectedLabel(matchingOption.label);
        selectedValueRef.current = matchingOption.value;
      } else {
        setSelectedLabel(undefined);
        selectedValueRef.current = undefined;
      }
    }
  }, [interval, isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
    setPopoverOpen(true);
    setInputValue(formatIntervalDisplay(interval, true));
    setHighlightedIndex(-1);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('[role="dialog"]')) {
      return;
    }
    setIsFocused(false);
    if (!calendarOpen) {
      setPopoverOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
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
        setHighlightedIndex((prev) => {
          if (prev < items.length - 1) {
            return prev + 1;
          }
          return 0;
        });
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev > 0) {
            return prev - 1;
          }
          return items.length - 1;
        });
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < items.length) {
          const item = items[highlightedIndex];
          if (item.value === '__calendar__') {
            handleOpenCalendar();
          } else {
            handleOptionSelect(item.value, item.label);
          }
          return;
        }
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmInput();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeAll();
      setHighlightedIndex(-1);
    }
  };

  const handleConfirmInput = () => {
    const trimmedValue = inputValue.trim();
    const parsedInterval = parseTextInterval(trimmedValue);
    if (parsedInterval) {
      onIntervalChange(parsedInterval);
      onValueChange?.(trimmedValue);
      setSelectedLabel(undefined);
      selectedValueRef.current = undefined;
      closeInputAndPopover();
      return;
    }
    setInputValue(formatIntervalDisplay(interval, true));
  };

  const handleOptionSelect = (optionValue: string, label: string) => {
    selectedValueRef.current = optionValue;
    setSelectedLabel(label);
    isSelectingRef.current = true;
    onValueChange?.(optionValue);

    const option = findOption(optionValue);
    if (option?.duration) {
      const newInterval = intervalToNowFromDuration(option.duration);
      onIntervalChange(newInterval);
    } else if (option?.type === 'calendar') {
      const calendarInterval = getCalendarInterval(optionValue);
      if (calendarInterval) {
        onIntervalChange(calendarInterval);
      }
    }

    closeInputAndPopover();
  };

  useEffect(() => {
    return () => {
      isSelectingRef.current = false;
    };
  }, []);

  const handleCalendarSelect = (range: DayPickerDateRange | undefined) => {
    if (range?.from && range?.to) {
      const daysDiff = differenceInDays(range.to, range.from);
      if (daysDiff !== 0) {
        onIntervalChange({start: range.from, end: range.to});
        setSelectedLabel(undefined);
        selectedValueRef.current = undefined;
        closeAll();
      } else {
        onIntervalChange({start: range.from, end: range.to});
        setSelectedLabel(undefined);
        selectedValueRef.current = undefined;
      }
    } else if (range?.from) {
      onIntervalChange({start: range.from, end: range.from});
      setSelectedLabel(undefined);
      selectedValueRef.current = undefined;
    }
  };

  const handleOpenCalendar = () => {
    setCalendarOpen(true);
  };

  const handleCloseCalendar = () => {
    closeAll();
  };

  return {
    isFocused,
    popoverOpen,
    calendarOpen,
    inputValue,
    displayValue,
    highlightedIndex,
    inputRef,
    handleFocus,
    handleBlur,
    handleInputChange,
    handleKeyDown,
    handleOptionSelect,
    handleCalendarSelect,
    handleOpenCalendar,
    handleCloseCalendar,
    setPopoverOpen,
    setIsFocused,
    setCalendarOpen,
  };
}
