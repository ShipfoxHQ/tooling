import {useCallback, useMemo} from 'react';
import type {IntervalSelection, IntervalSuggestion, RelativeSuggestion} from '../types';

interface UseIntervalSelectorNavigationProps {
  relativeSuggestions: RelativeSuggestion[];
  intervalSuggestions: IntervalSuggestion[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  popoverOpen: boolean;
  calendarOpen: boolean;
  onOpenCalendar: () => void;
  onSelect: (selection: IntervalSelection) => void;
}

export function useIntervalSelectorNavigation({
  relativeSuggestions,
  intervalSuggestions,
  highlightedIndex,
  setHighlightedIndex,
  popoverOpen,
  calendarOpen,
  onOpenCalendar,
  onSelect,
}: UseIntervalSelectorNavigationProps) {
  const allNavigableItems = useMemo(
    () => [
      ...relativeSuggestions,
      ...intervalSuggestions,
      {type: 'calendar' as const, label: 'Select from calendar'},
    ],
    [relativeSuggestions, intervalSuggestions],
  );

  const canNavigate = popoverOpen && !calendarOpen;
  const currentIndex = highlightedIndex;
  const isNavigating = canNavigate && currentIndex >= 0 && currentIndex < allNavigableItems.length;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!canNavigate) return;

      const items = allNavigableItems;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        setHighlightedIndex(nextIndex);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        setHighlightedIndex(nextIndex);
        return;
      }

      if (e.key === 'Enter' && isNavigating) {
        e.preventDefault();
        const item = items[currentIndex];
        if (item.type === 'calendar') {
          onOpenCalendar();
        } else {
          onSelect(item);
        }
        return;
      }
    },
    [
      canNavigate,
      isNavigating,
      currentIndex,
      allNavigableItems,
      setHighlightedIndex,
      onOpenCalendar,
      onSelect,
    ],
  );

  return {allNavigableItems, onKeyDown, isNavigating};
}
