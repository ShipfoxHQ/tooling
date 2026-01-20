import {useCallback} from 'react';
import type {IntervalOption} from '../interval-selector.utils';

interface UseIntervalSelectorNavigationProps {
  pastIntervals: IntervalOption[];
  resolvedCalendarIntervals: IntervalOption[];
  highlightedIndex: number;
  setHighlightedIndex: (index: number) => void;
  popoverOpen: boolean;
  calendarOpen: boolean;
  handleOpenCalendar: () => void;
  handleOptionSelect: (value: string, label: string) => void;
}

export function useIntervalSelectorNavigation({
  pastIntervals,
  resolvedCalendarIntervals,
  highlightedIndex,
  setHighlightedIndex,
  popoverOpen,
  calendarOpen,
  handleOpenCalendar,
  handleOptionSelect,
}: UseIntervalSelectorNavigationProps) {
  const getAllNavigableItems = useCallback(() => {
    return [
      ...pastIntervals,
      ...resolvedCalendarIntervals,
      {value: '__calendar__', label: 'Select from calendar', type: 'custom' as const},
    ];
  }, [pastIntervals, resolvedCalendarIntervals]);

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
          setHighlightedIndex(highlightedIndex < items.length - 1 ? highlightedIndex + 1 : 0);
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex(highlightedIndex > 0 ? highlightedIndex - 1 : items.length - 1);
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
    },
    [
      popoverOpen,
      calendarOpen,
      getAllNavigableItems,
      highlightedIndex,
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
