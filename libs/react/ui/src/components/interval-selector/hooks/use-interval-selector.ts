import type {NormalizedInterval} from 'date-fns';
import {useCallback, useEffect} from 'react';
import type {DateRange as DayPickerDateRange} from 'react-day-picker';
import {intervalToNowFromDuration} from 'utils/date';
import type {IntervalSelection, IntervalSelectorProps} from '../interval-selector';
import {
  findOption,
  formatIntervalDisplay,
  getCalendarInterval,
  getLabelForValue,
  type IntervalOption,
} from '../interval-selector.utils';
import {useIntervalSelectorInput} from './use-interval-selector-input';
import {useIntervalSelectorNavigation} from './use-interval-selector-navigation';
import {useIntervalSelectorSelection} from './use-interval-selector-selection';
import {useIntervalSelectorShortcut} from './use-interval-selector-shortcut';
import {useIntervalSelectorState} from './use-interval-selector-state';

export interface UseIntervalSelectorProps
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

  const state = useIntervalSelectorState();

  const shortcut = useIntervalSelectorShortcut({
    pastIntervals,
    calendarIntervals,
  });

  const selectionLogic = useIntervalSelectorSelection({
    pastIntervals,
    calendarIntervals,
    getShortcutFromValue: shortcut.getShortcutFromValue,
    detectShortcutFromInterval: shortcut.detectShortcutFromInterval,
    setSelectedLabel: state.setSelectedLabel,
    setConfirmedShortcut: state.setConfirmedShortcut,
    selectedValueRef: state.selectedValueRef,
  });

  const triggerShakeAnimation = useCallback(() => {
    state.setIsInvalid(true);
    state.setShouldShake(true);
    if (state.shakeTimeoutRef.current) {
      clearTimeout(state.shakeTimeoutRef.current);
    }
    state.shakeTimeoutRef.current = setTimeout(() => {
      state.setShouldShake(false);
      state.shakeTimeoutRef.current = null;
    }, 500);
  }, [state]);

  const closeInputAndPopover = useCallback(() => {
    state.setIsFocused(false);
    state.setPopoverOpen(false);
    state.inputRef.current?.blur();
  }, [state]);

  const closeAll = useCallback(() => {
    closeInputAndPopover();
    state.setCalendarOpen(false);
    state.setHighlightedIndex(-1);
  }, [closeInputAndPopover, state]);

  const emitSelection = useCallback(
    (newSelection: IntervalSelection) => {
      onSelectionChange(newSelection);
    },
    [onSelectionChange],
  );

  const inputHandlers = useIntervalSelectorInput({
    pastIntervals,
    inputValue: state.inputValue,
    setInputValue: state.setInputValue,
    setDetectedShortcut: state.setDetectedShortcut,
    setConfirmedShortcut: state.setConfirmedShortcut,
    setIsInvalid: state.setIsInvalid,
    setSelectedLabel: state.setSelectedLabel,
    setHighlightedIndex: state.setHighlightedIndex,
    selectedValueRef: state.selectedValueRef,
    detectShortcutFromInput: shortcut.detectShortcutFromInput,
    applyIntervalDetection: selectionLogic.applyIntervalDetection,
    emitSelection,
    onValueChange,
    triggerShakeAnimation,
    closeInputAndPopover,
  });

  const handleOptionSelect = useCallback(
    (optionValue: string, label: string) => {
      state.selectedValueRef.current = optionValue;
      state.setSelectedLabel(label);
      state.isSelectingRef.current = true;
      state.setDetectedShortcut(undefined);
      state.setConfirmedShortcut(shortcut.getShortcutFromValue(optionValue));
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
    },
    [
      state,
      shortcut,
      pastIntervals,
      onValueChange,
      emitSelection,
      closeInputAndPopover,
      calendarIntervals,
    ],
  );

  const navigation = useIntervalSelectorNavigation({
    pastIntervals,
    calendarIntervals,
    highlightedIndex: state.highlightedIndex,
    setHighlightedIndex: state.setHighlightedIndex,
    popoverOpen: state.popoverOpen,
    calendarOpen: state.calendarOpen,
    handleOpenCalendar: () => state.setCalendarOpen(true),
    handleOptionSelect,
  });

  const displayValue = state.isFocused
    ? state.inputValue
    : value && findOption(value, pastIntervals, calendarIntervals)
      ? (state.selectedLabel ??
        getLabelForValue(value, pastIntervals, calendarIntervals) ??
        formatIntervalDisplay(currentInterval, false))
      : (state.selectedLabel ?? formatIntervalDisplay(currentInterval, false));

  const handleFocus = useCallback(() => {
    state.setIsFocused(true);
    state.setPopoverOpen(true);
    state.setInputValue(formatIntervalDisplay(currentInterval, true));
    state.setHighlightedIndex(-1);
    state.setIsInvalid(false);
    requestAnimationFrame(() => {
      state.inputRef.current?.select();
    });
  }, [state, currentInterval]);

  const handleMouseDown = useCallback(() => {
    state.isMouseDownOnInputRef.current = true;
  }, [state]);

  const handleMouseUp = useCallback(() => {
    setTimeout(() => {
      state.isMouseDownOnInputRef.current = false;
    });
  }, [state]);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (relatedTarget?.closest('[role="dialog"]')) {
        return;
      }
      if (state.isMouseDownOnInputRef.current) {
        requestAnimationFrame(() => {
          state.inputRef.current?.focus();
        });
        return;
      }
      state.setIsFocused(false);
      state.setDetectedShortcut(undefined);
      if (!state.calendarOpen) {
        state.setPopoverOpen(false);
      }
    },
    [state],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      navigation.handleKeyDown(e, inputHandlers.handleConfirmInput, closeAll);
    },
    [navigation, inputHandlers.handleConfirmInput, closeAll],
  );

  const handleCalendarSelect = useCallback(
    (range: DayPickerDateRange | undefined) => {
      if (!range?.from || !range.to) return;
      const calendarInterval = {start: range.from, end: range.to};
      state.isSelectingRef.current = true;
      selectionLogic.applyIntervalDetection(calendarInterval);
      emitSelection({
        type: 'interval',
        interval: calendarInterval,
      });
      closeAll();
    },
    [state, selectionLogic, emitSelection, closeAll],
  );

  useEffect(() => {
    if (!state.isFocused && !state.isSelectingRef.current) {
      const explicitValue = formatIntervalDisplay(currentInterval, true);
      state.setInputValue(explicitValue);
      state.setDetectedShortcut(undefined);

      if (
        (value && selectionLogic.updateSelectionFromValue(value)) ||
        selectionLogic.updateSelectionFromRef()
      ) {
        return;
      }

      selectionLogic.updateSelectionFromInterval(currentInterval);
    }
  }, [
    currentInterval,
    state.isFocused,
    state.isSelectingRef,
    value,
    selectionLogic.updateSelectionFromValue,
    selectionLogic.updateSelectionFromRef,
    selectionLogic.updateSelectionFromInterval,
    state.setInputValue,
    state.setDetectedShortcut,
  ]);

  useEffect(() => {
    return () => {
      state.isSelectingRef.current = false;
      if (state.shakeTimeoutRef.current) {
        clearTimeout(state.shakeTimeoutRef.current);
      }
      state.isMouseDownOnInputRef.current = false;
    };
  }, [state.isSelectingRef, state.shakeTimeoutRef, state.isMouseDownOnInputRef]);

  const displayShortcut = state.detectedShortcut ?? state.confirmedShortcut ?? '-';

  return {
    isFocused: state.isFocused,
    popoverOpen: state.popoverOpen,
    calendarOpen: state.calendarOpen,
    inputValue: state.inputValue,
    displayValue,
    highlightedIndex: state.highlightedIndex,
    displayShortcut,
    isInvalid: state.isInvalid,
    shouldShake: state.shouldShake,
    inputRef: state.inputRef,
    handleFocus,
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleInputChange: inputHandlers.handleInputChange,
    handleKeyDown,
    handleOptionSelect,
    handleCalendarSelect,
    handleOpenCalendar: () => state.setCalendarOpen(true),
    setPopoverOpen: state.setPopoverOpen,
    setIsFocused: state.setIsFocused,
    closeAll,
    calendarIntervals,
  };
}
