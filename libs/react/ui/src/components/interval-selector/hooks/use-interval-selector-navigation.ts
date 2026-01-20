import {useCallback, useEffect, useRef} from 'react';
import type {IntervalOption} from '../interval-selector.utils';

interface UseIntervalSelectorNavigationProps {
  pastIntervals: IntervalOption[];
  calendarIntervals: IntervalOption[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  popoverOpen: boolean;
  calendarOpen: boolean;
  handleOpenCalendar: () => void;
  handleOptionSelect: (value: string, label: string) => void;
}

export function useIntervalSelectorNavigation({
  pastIntervals,
  calendarIntervals,
  highlightedIndex,
  setHighlightedIndex,
  popoverOpen,
  calendarOpen,
  handleOpenCalendar,
  handleOptionSelect,
}: UseIntervalSelectorNavigationProps) {
  const highlightedIndexRef = useRef(highlightedIndex);

  useEffect(() => {
    highlightedIndexRef.current = highlightedIndex;
  }, [highlightedIndex]);

  const getAllNavigableItems = useCallback(() => {
    return [
      ...pastIntervals,
      ...calendarIntervals,
      {value: '__calendar__', label: 'Select from calendar', type: 'custom' as const},
    ];
  }, [pastIntervals, calendarIntervals]);

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      handleConfirmInput: () => void,
      closeAll: () => void,
    ) => {
      if (popoverOpen && !calendarOpen) {
        const items = getAllNavigableItems();

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
      }
    },
    [
      popoverOpen,
      calendarOpen,
      getAllNavigableItems,
      setHighlightedIndex,
      handleOpenCalendar,
      handleOptionSelect,
    ],
  );

  return {
    getAllNavigableItems,
    handleKeyDown,
  };
}
