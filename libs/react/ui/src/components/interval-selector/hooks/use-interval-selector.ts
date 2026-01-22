import type {DismissableLayerProps} from '@radix-ui/react-dismissable-layer';
import {useCallback, useRef, useState} from 'react';
import type {IntervalSelectorProps} from '../interval-selector';
import type {IntervalSelection, IntervalSuggestion, RelativeSuggestion} from '../types';
import {useIntervalSelectorNavigation} from './use-interval-selector-navigation';

export interface UseIntervalSelectorProps extends Pick<IntervalSelectorProps, 'onSelectionChange'> {
  relativeSuggestions: RelativeSuggestion[];
  intervalSuggestions: IntervalSuggestion[];
}

export function useIntervalSelector({
  onSelectionChange,
  relativeSuggestions,
  intervalSuggestions,
}: UseIntervalSelectorProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState(false);

  const isSelectingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeAll = useCallback(() => {
    setPopoverOpen(false);
    inputRef.current?.blur();
    setCalendarOpen(false);
    setHighlightedIndex(-1);
    setIsFocused(false);
  }, []);

  const onSelect = useCallback(
    (selection: IntervalSelection) => {
      isSelectingRef.current = true;
      onSelectionChange(selection);
      closeAll();
    },
    [closeAll, onSelectionChange],
  );

  const onFocus = useCallback(() => {
    setPopoverOpen(true);
    setHighlightedIndex(-1);
  }, []);

  const onBlur = useCallback(() => {
    if (!calendarOpen) setPopoverOpen(false);
  }, [calendarOpen]);

  const onOpenCalendar = useCallback(() => {
    setCalendarOpen(true);
  }, []);

  const {onKeyDown, isNavigating} = useIntervalSelectorNavigation({
    relativeSuggestions,
    intervalSuggestions,
    highlightedIndex,
    setHighlightedIndex,
    popoverOpen,
    calendarOpen,
    onOpenCalendar,
    onSelect,
  });

  const onInteractOutside = useCallback(
    (e: Parameters<Required<DismissableLayerProps>['onInteractOutside']>[0]) => {
      e.preventDefault();
      const target = e.target as HTMLElement;
      const isClickOnPopover =
        inputRef.current &&
        (inputRef.current.contains(target) || target.closest('[data-radix-popover-trigger]'));
      if (isClickOnPopover) return;
      closeAll();
    },
    [closeAll],
  );

  return {
    onSelect,
    popoverOpen,
    calendarOpen,
    highlightedIndex,
    inputRef,
    onFocus,
    onBlur,
    onKeyDown,
    onOpenCalendar,
    onChange: () => setHighlightedIndex(-1),
    onInteractOutside,
    closeAll,
    isNavigating,
    isFocused,
    setIsFocused,
  };
}
