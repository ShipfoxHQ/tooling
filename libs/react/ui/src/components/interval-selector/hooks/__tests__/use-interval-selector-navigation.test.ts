import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {act, renderHook} from '@testing-library/react';
import type {IntervalOption} from '../../interval-selector.utils';
import {useIntervalSelectorNavigation} from '../use-interval-selector-navigation';

describe('useIntervalSelectorNavigation', () => {
  const mockPastIntervals: IntervalOption[] = [
    {value: '5m', label: 'Past 5 Minutes', shortcut: '5m', type: 'past', duration: {minutes: 5}},
    {value: '1h', label: 'Past 1 Hour', shortcut: '1h', type: 'past', duration: {hours: 1}},
  ];

  const mockCalendarIntervals: IntervalOption[] = [
    {value: 'today', label: 'Today', shortcut: '0h', type: 'calendar'},
  ];

  const mockProps = {
    pastIntervals: mockPastIntervals,
    resolvedCalendarIntervals: mockCalendarIntervals,
    highlightedIndex: -1,
    setHighlightedIndex: vi.fn(),
    popoverOpen: true,
    calendarOpen: false,
    handleOpenCalendar: vi.fn(),
    handleOptionSelect: vi.fn(),
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

      const items = result.current.getAllNavigableItems();

      expect(items).toHaveLength(4);
      expect(items[0]).toEqual(mockPastIntervals[0]);
      expect(items[1]).toEqual(mockPastIntervals[1]);
      expect(items[2]).toEqual(mockCalendarIntervals[0]);
      expect(items[3]).toEqual({
        value: '__calendar__',
        label: 'Select from calendar',
        type: 'custom',
      });
    });
  });

  describe('handleKeyDown', () => {
    it('should navigate down with ArrowDown', () => {
      const {result} = renderHook(() => useIntervalSelectorNavigation(mockProps));

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'ArrowDown',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
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

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'ArrowUp',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
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

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'ArrowDown',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
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

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'ArrowUp',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
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

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'Enter',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
      });

      expect(mockProps.handleOptionSelect).toHaveBeenCalledWith('5m', 'Past 5 Minutes');
    });

    it('should open calendar when calendar option is selected', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorNavigation({
          ...mockProps,
          highlightedIndex: 3,
        }),
      );

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'Enter',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
      });

      expect(mockProps.handleOpenCalendar).toHaveBeenCalled();
    });

    it('should call handleConfirmInput on Enter when popover closed', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorNavigation({
          ...mockProps,
          popoverOpen: false,
        }),
      );

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'Enter',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
      });

      expect(handleConfirmInput).toHaveBeenCalled();
    });

    it('should close all on Escape', () => {
      const {result} = renderHook(() => useIntervalSelectorNavigation(mockProps));

      const handleConfirmInput = vi.fn();
      const closeAll = vi.fn();

      act(() => {
        result.current.handleKeyDown(
          {
            key: 'Escape',
            preventDefault: vi.fn(),
          } as unknown as React.KeyboardEvent<HTMLInputElement>,
          handleConfirmInput,
          closeAll,
        );
      });

      expect(closeAll).toHaveBeenCalled();
    });
  });
});
