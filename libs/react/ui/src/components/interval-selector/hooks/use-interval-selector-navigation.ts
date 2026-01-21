import {useCallback, useEffect, useMemo, useRef} from 'react';
import type {IntervalSelection, IntervalSuggestion, RelativeSuggestion} from '../types';

interface UseIntervalSelectorNavigationProps {
  relativeSuggestions: RelativeSuggestion[];
  intervalSuggestions: IntervalSuggestion[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  popoverOpen: boolean;
  calendarOpen: boolean;
  handleOpenCalendar: () => void;
  onSelect: (selection: IntervalSelection) => void;
}

export function useIntervalSelectorNavigation({
  relativeSuggestions,
  intervalSuggestions,
  highlightedIndex,
  setHighlightedIndex,
  popoverOpen,
  calendarOpen,
  handleOpenCalendar,
  onSelect,
}: UseIntervalSelectorNavigationProps) {
  const highlightedIndexRef = useRef(highlightedIndex);

  useEffect(() => {
    highlightedIndexRef.current = highlightedIndex;
  }, [highlightedIndex]);

  const allNavigableItems = useMemo(
    () => [
      ...relativeSuggestions,
      ...intervalSuggestions,
      {type: 'calendar' as const, label: 'Select from calendar'},
    ],
    [relativeSuggestions, intervalSuggestions],
  );

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      handleConfirmInput: () => void,
      closeAll: () => void,
    ) => {
      if (popoverOpen && !calendarOpen) {
        const items = allNavigableItems;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const currentIndex = highlightedIndexRef.current;
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          setHighlightedIndex(nextIndex);
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const currentIndex = highlightedIndexRef.current;
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          setHighlightedIndex(nextIndex);
          return;
        }

        if (e.key === 'Enter') {
          const currentIndex = highlightedIndexRef.current;
          if (currentIndex >= 0 && currentIndex < items.length) {
            e.preventDefault();
            const item = items[currentIndex];
            if (item.type === 'calendar') {
              handleOpenCalendar();
            } else {
              onSelect(item);
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
      }
    },
    [
      popoverOpen,
      calendarOpen,
      allNavigableItems,
      setHighlightedIndex,
      handleOpenCalendar,
      onSelect,
    ],
  );

  return {
    allNavigableItems,
    handleKeyDown,
  };
}
