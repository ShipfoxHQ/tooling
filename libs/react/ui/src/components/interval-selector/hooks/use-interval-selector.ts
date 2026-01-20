import {useCallback} from 'react';
import type {IntervalSelectorProps} from '../interval-selector';
import type {IntervalSelection, IntervalSuggestion, RelativeSuggestion} from '../types';
import {formatSelection, formatSelectionForInput, formatShortcut} from '../utils';
import {useIntervalSelectorInput} from './use-interval-selector-input';
import {useIntervalSelectorNavigation} from './use-interval-selector-navigation';
import {useIntervalSelectorState} from './use-interval-selector-state';

export interface UseIntervalSelectorProps
  extends Pick<IntervalSelectorProps, 'selection' | 'onSelectionChange'> {
  relativeSuggestions: RelativeSuggestion[];
  intervalSuggestions: IntervalSuggestion[];
}

export function useIntervalSelector({
  selection,
  onSelectionChange,
  relativeSuggestions,
  intervalSuggestions,
}: UseIntervalSelectorProps) {
  const state = useIntervalSelectorState();

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

  const onSelect = useCallback(
    (selection: IntervalSelection) => {
      state.isSelectingRef.current = true;
      onSelectionChange(selection);
      closeAll();
    },
    [state, onSelectionChange, closeAll],
  );

  const inputHandlers = useIntervalSelectorInput({
    inputValue: state.inputValue,
    setInputValue: state.setInputValue,
    setIsInvalid: state.setIsInvalid,
    setSelectedLabel: state.setSelectedLabel,
    setHighlightedIndex: state.setHighlightedIndex,
    selectedValueRef: state.selectedValueRef,
    triggerShakeAnimation,
    onSelect,
  });

  const displayValue = formatSelection({
    selection,
    isFocused: state.isFocused,
    inputValue: state.inputValue,
  });

  const shortcutValue = formatShortcut({selection, inputValue: state.inputValue});

  const handleFocus = useCallback(() => {
    state.setIsFocused(true);
    state.setPopoverOpen(true);
    state.setInputValue(formatSelectionForInput(selection));
    state.setHighlightedIndex(-1);
    state.setIsInvalid(false);
    requestAnimationFrame(() => {
      state.inputRef.current?.select();
    });
  }, [state, selection]);

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
      if (!state.calendarOpen) {
        state.setPopoverOpen(false);
      }
    },
    [state],
  );

  const navigation = useIntervalSelectorNavigation({
    relativeSuggestions,
    intervalSuggestions,
    highlightedIndex: state.highlightedIndex,
    setHighlightedIndex: state.setHighlightedIndex,
    popoverOpen: state.popoverOpen,
    calendarOpen: state.calendarOpen,
    handleOpenCalendar: () => state.setCalendarOpen(true),
    onSelect,
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      navigation.handleKeyDown(e, inputHandlers.handleConfirmInput, closeAll);
    },
    [navigation, inputHandlers.handleConfirmInput, closeAll],
  );

  return {
    onSelect,
    isFocused: state.isFocused,
    popoverOpen: state.popoverOpen,
    calendarOpen: state.calendarOpen,
    displayValue,
    shortcutValue,
    highlightedIndex: state.highlightedIndex,
    isInvalid: state.isInvalid,
    shouldShake: state.shouldShake,
    inputRef: state.inputRef,
    handleFocus,
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleInputChange: inputHandlers.handleInputChange,
    handleKeyDown,
    handleOpenCalendar: () => state.setCalendarOpen(true),
    setPopoverOpen: state.setPopoverOpen,
    closeAll,
  };
}
