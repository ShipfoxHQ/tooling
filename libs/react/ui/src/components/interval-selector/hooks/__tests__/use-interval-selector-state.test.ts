import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {act, renderHook} from '@testing-library/react';
import type {IntervalOption} from '../../interval-selector.utils';
import {useIntervalSelectorState} from '../use-interval-selector-state';

describe('useIntervalSelectorState', () => {
  const mockCalendarIntervals: IntervalOption[] = [
    {value: 'today', label: 'Today', shortcut: '0h', type: 'calendar'},
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default state', () => {
    const {result} = renderHook(() =>
      useIntervalSelectorState({
        calendarIntervals: mockCalendarIntervals,
      }),
    );

    expect(result.current.isFocused).toBe(false);
    expect(result.current.popoverOpen).toBe(false);
    expect(result.current.calendarOpen).toBe(false);
    expect(result.current.inputValue).toBe('');
    expect(result.current.selectedLabel).toBeUndefined();
    expect(result.current.highlightedIndex).toBe(-1);
    expect(result.current.detectedShortcut).toBeUndefined();
    expect(result.current.confirmedShortcut).toBeUndefined();
    expect(result.current.isInvalid).toBe(false);
    expect(result.current.shouldShake).toBe(false);
  });

  it('should resolve function-based calendar intervals', () => {
    const calendarIntervalsFn = () => mockCalendarIntervals;
    const {result} = renderHook(() =>
      useIntervalSelectorState({
        calendarIntervals: calendarIntervalsFn,
      }),
    );

    expect(result.current.resolvedCalendarIntervals).toEqual(mockCalendarIntervals);
  });

  it('should resolve array-based calendar intervals', () => {
    const {result} = renderHook(() =>
      useIntervalSelectorState({
        calendarIntervals: mockCalendarIntervals,
      }),
    );

    expect(result.current.resolvedCalendarIntervals).toEqual(mockCalendarIntervals);
  });

  it('should update state setters', () => {
    const {result} = renderHook(() =>
      useIntervalSelectorState({
        calendarIntervals: mockCalendarIntervals,
      }),
    );

    act(() => {
      result.current.setIsFocused(true);
    });
    expect(result.current.isFocused).toBe(true);

    act(() => {
      result.current.setPopoverOpen(true);
    });
    expect(result.current.popoverOpen).toBe(true);

    act(() => {
      result.current.setCalendarOpen(true);
    });
    expect(result.current.calendarOpen).toBe(true);

    act(() => {
      result.current.setInputValue('test');
    });
    expect(result.current.inputValue).toBe('test');

    act(() => {
      result.current.setSelectedLabel('Test Label');
    });
    expect(result.current.selectedLabel).toBe('Test Label');

    act(() => {
      result.current.setHighlightedIndex(2);
    });
    expect(result.current.highlightedIndex).toBe(2);

    act(() => {
      result.current.setDetectedShortcut('5m');
    });
    expect(result.current.detectedShortcut).toBe('5m');

    act(() => {
      result.current.setConfirmedShortcut('1h');
    });
    expect(result.current.confirmedShortcut).toBe('1h');

    act(() => {
      result.current.setIsInvalid(true);
    });
    expect(result.current.isInvalid).toBe(true);

    act(() => {
      result.current.setShouldShake(true);
    });
    expect(result.current.shouldShake).toBe(true);
  });

  it('should maintain refs across renders', () => {
    const {result, rerender} = renderHook(() =>
      useIntervalSelectorState({
        calendarIntervals: mockCalendarIntervals,
      }),
    );

    const initialInputRef = result.current.inputRef;
    const initialSelectedValueRef = result.current.selectedValueRef;

    result.current.selectedValueRef.current = 'test-value';

    rerender();

    expect(result.current.inputRef).toBe(initialInputRef);
    expect(result.current.selectedValueRef).toBe(initialSelectedValueRef);
    expect(result.current.selectedValueRef.current).toBe('test-value');
  });
});
