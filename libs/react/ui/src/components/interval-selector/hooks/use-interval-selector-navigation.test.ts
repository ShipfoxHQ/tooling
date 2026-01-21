import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {act, renderHook} from '@testing-library/react';
import {endOfDay, startOfDay} from 'date-fns';
import type {IntervalSuggestion, RelativeSuggestion} from '../types';
import {useIntervalSelectorNavigation} from './use-interval-selector-navigation';

describe('useIntervalSelectorNavigation', () => {
  const mockPastIntervals: RelativeSuggestion[] = [
    {type: 'relative', duration: {minutes: 5}},
    {type: 'relative', duration: {hours: 1}},
  ];
  const mockCalendarIntervals: IntervalSuggestion[] = [
    {
      type: 'interval',
      label: 'Today',
      interval: {start: startOfDay(new Date()), end: endOfDay(new Date())},
    },
  ];

  const mockProps = {
    relativeSuggestions: mockPastIntervals,
    intervalSuggestions: mockCalendarIntervals,
    highlightedIndex: -1,
    setHighlightedIndex: vi.fn(),
    popoverOpen: true,
    calendarOpen: false,
    onOpenCalendar: vi.fn(),
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getAllNavigableItems', () => {
    it('should return all navigable items including calendar option', () => {
      const {result} = renderHook(() => useIntervalSelectorNavigation(mockProps));

      const items = result.current.allNavigableItems;

      expect(items).toHaveLength(4);
      expect(items[0]).toEqual(mockPastIntervals[0]);
      expect(items[1]).toEqual(mockPastIntervals[1]);
      expect(items[2]).toEqual(mockCalendarIntervals[0]);
      expect(items[3]).toEqual({
        type: 'calendar',
        label: 'Select from calendar',
      });
    });
  });

  describe('handleKeyDown', () => {
    it('should navigate down with ArrowDown', () => {
      const {result} = renderHook(() => useIntervalSelectorNavigation(mockProps));

      act(() => {
        result.current.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(mockProps.setHighlightedIndex).toHaveBeenCalledWith(0);
    });

    it('should navigate up with ArrowUp', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorNavigation({
          ...mockProps,
          highlightedIndex: 1,
        }),
      );

      act(() => {
        result.current.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(mockProps.setHighlightedIndex).toHaveBeenCalledWith(0);
    });

    it('should wrap around when navigating down at end', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorNavigation({
          ...mockProps,
          highlightedIndex: 3,
        }),
      );

      act(() => {
        result.current.onKeyDown({
          key: 'ArrowDown',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(mockProps.setHighlightedIndex).toHaveBeenCalledWith(0);
    });

    it('should wrap around when navigating up at start', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorNavigation({
          ...mockProps,
          highlightedIndex: 0,
        }),
      );

      act(() => {
        result.current.onKeyDown({
          key: 'ArrowUp',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(mockProps.setHighlightedIndex).toHaveBeenCalledWith(3);
    });

    it('should select highlighted item on Enter', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorNavigation({
          ...mockProps,
          highlightedIndex: 0,
        }),
      );

      act(() => {
        result.current.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(mockProps.onSelect).toHaveBeenCalledWith({type: 'relative', duration: {minutes: 5}});
    });

    it('should open calendar when calendar option is selected', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorNavigation({
          ...mockProps,
          highlightedIndex: 3,
        }),
      );

      act(() => {
        result.current.onKeyDown({
          key: 'Enter',
          preventDefault: vi.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>);
      });

      expect(mockProps.onOpenCalendar).toHaveBeenCalled();
    });
  });
});
