import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {renderHook} from '@testing-library/react';
import {subHours, subMinutes} from 'date-fns';
import type {IntervalOption} from '../interval-selector.utils';
import {useIntervalSelectorSelection} from './use-interval-selector-selection';

describe('useIntervalSelectorSelection', () => {
  const mockPastIntervals: IntervalOption[] = [
    {value: '5m', label: 'Past 5 Minutes', shortcut: '5m', type: 'past', duration: {minutes: 5}},
    {value: '1h', label: 'Past 1 Hour', shortcut: '1h', type: 'past', duration: {hours: 1}},
  ];

  const mockCalendarIntervals: IntervalOption[] = [
    {value: 'today', label: 'Today', shortcut: '0h', type: 'calendar'},
  ];

  const mockGetShortcutFromValue = vi.fn((value: string) => {
    const option = [...mockPastIntervals, ...mockCalendarIntervals].find(
      (opt) => opt.value === value,
    );
    return option?.shortcut;
  });

  const mockDetectShortcutFromInterval = vi.fn(
    (
      _interval: import('date-fns').NormalizedInterval,
    ): {shortcut?: string; label?: string; value?: string} => ({
      shortcut: undefined,
      label: undefined,
      value: undefined,
    }),
  );

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-19T17:45:00Z'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should clear selection state', () => {
    const setSelectedLabel = vi.fn();
    const setConfirmedShortcut = vi.fn();
    const selectedValueRef = {current: 'test-value' as string | undefined};

    const {result} = renderHook(() =>
      useIntervalSelectorSelection({
        pastIntervals: mockPastIntervals,
        calendarIntervals: mockCalendarIntervals,
        getShortcutFromValue: mockGetShortcutFromValue,
        detectShortcutFromInterval: mockDetectShortcutFromInterval,
        setSelectedLabel,
        setConfirmedShortcut,
        selectedValueRef,
      }),
    );

    result.current.clearSelectionState();

    expect(setSelectedLabel).toHaveBeenCalledWith(undefined);
    expect(setConfirmedShortcut).toHaveBeenCalledWith(undefined);
    expect(selectedValueRef.current).toBeUndefined();
  });

  it('should update selection from value', () => {
    const setSelectedLabel = vi.fn();
    const setConfirmedShortcut = vi.fn();
    const selectedValueRef = {current: undefined as string | undefined};

    const {result} = renderHook(() =>
      useIntervalSelectorSelection({
        pastIntervals: mockPastIntervals,
        calendarIntervals: mockCalendarIntervals,
        getShortcutFromValue: mockGetShortcutFromValue,
        detectShortcutFromInterval: mockDetectShortcutFromInterval,
        setSelectedLabel,
        setConfirmedShortcut,
        selectedValueRef,
      }),
    );

    const success = result.current.updateSelectionFromValue('5m');

    expect(success).toBe(true);
    expect(setSelectedLabel).toHaveBeenCalledWith('Past 5 Minutes');
    expect(selectedValueRef.current).toBe('5m');
    expect(setConfirmedShortcut).toHaveBeenCalledWith('5m');
  });

  it('should return false when value not found', () => {
    const setSelectedLabel = vi.fn();
    const setConfirmedShortcut = vi.fn();
    const selectedValueRef = {current: undefined as string | undefined};

    const {result} = renderHook(() =>
      useIntervalSelectorSelection({
        pastIntervals: mockPastIntervals,
        calendarIntervals: mockCalendarIntervals,
        getShortcutFromValue: mockGetShortcutFromValue,
        detectShortcutFromInterval: mockDetectShortcutFromInterval,
        setSelectedLabel,
        setConfirmedShortcut,
        selectedValueRef,
      }),
    );

    const success = result.current.updateSelectionFromValue('invalid');

    expect(success).toBe(false);
    expect(setSelectedLabel).not.toHaveBeenCalled();
  });

  it('should update selection from ref', () => {
    const setSelectedLabel = vi.fn();
    const setConfirmedShortcut = vi.fn();
    const selectedValueRef = {current: '5m' as string | undefined};

    const {result} = renderHook(() =>
      useIntervalSelectorSelection({
        pastIntervals: mockPastIntervals,
        calendarIntervals: mockCalendarIntervals,
        getShortcutFromValue: mockGetShortcutFromValue,
        detectShortcutFromInterval: mockDetectShortcutFromInterval,
        setSelectedLabel,
        setConfirmedShortcut,
        selectedValueRef,
      }),
    );

    const success = result.current.updateSelectionFromRef();

    expect(success).toBe(true);
    expect(setSelectedLabel).toHaveBeenCalledWith('Past 5 Minutes');
    expect(setConfirmedShortcut).toHaveBeenCalledWith('5m');
  });

  it('should clear state when ref value not found', () => {
    const setSelectedLabel = vi.fn();
    const setConfirmedShortcut = vi.fn();
    const selectedValueRef = {current: 'invalid' as string | undefined};

    const {result} = renderHook(() =>
      useIntervalSelectorSelection({
        pastIntervals: mockPastIntervals,
        calendarIntervals: mockCalendarIntervals,
        getShortcutFromValue: mockGetShortcutFromValue,
        detectShortcutFromInterval: mockDetectShortcutFromInterval,
        setSelectedLabel,
        setConfirmedShortcut,
        selectedValueRef,
      }),
    );

    const success = result.current.updateSelectionFromRef();

    expect(success).toBe(false);
    expect(setSelectedLabel).toHaveBeenCalledWith(undefined);
    expect(setConfirmedShortcut).toHaveBeenCalledWith(undefined);
    expect(selectedValueRef.current).toBeUndefined();
  });

  it('should apply interval detection', () => {
    const setSelectedLabel = vi.fn();
    const setConfirmedShortcut = vi.fn();
    const selectedValueRef = {current: undefined as string | undefined};

    mockDetectShortcutFromInterval.mockReturnValue({
      shortcut: 'test-shortcut',
      label: 'Test Label',
      value: 'test-value',
    });

    const {result} = renderHook(() =>
      useIntervalSelectorSelection({
        pastIntervals: mockPastIntervals,
        calendarIntervals: mockCalendarIntervals,
        getShortcutFromValue: mockGetShortcutFromValue,
        detectShortcutFromInterval: mockDetectShortcutFromInterval,
        setSelectedLabel,
        setConfirmedShortcut,
        selectedValueRef,
      }),
    );

    const now = new Date('2026-01-19T17:45:00Z');
    const interval = {
      start: subHours(now, 2),
      end: now,
    };

    result.current.applyIntervalDetection(interval);

    expect(mockDetectShortcutFromInterval).toHaveBeenCalledWith(interval);
    expect(setConfirmedShortcut).toHaveBeenCalledWith('test-shortcut');
    expect(setSelectedLabel).toHaveBeenCalledWith('Test Label');
    expect(selectedValueRef.current).toBe('test-value');
  });

  it('should update selection from interval', () => {
    const setSelectedLabel = vi.fn();
    const setConfirmedShortcut = vi.fn();
    const selectedValueRef = {current: undefined as string | undefined};

    const {result} = renderHook(() =>
      useIntervalSelectorSelection({
        pastIntervals: mockPastIntervals,
        calendarIntervals: mockCalendarIntervals,
        getShortcutFromValue: mockGetShortcutFromValue,
        detectShortcutFromInterval: mockDetectShortcutFromInterval,
        setSelectedLabel,
        setConfirmedShortcut,
        selectedValueRef,
      }),
    );

    const now = new Date('2026-01-19T17:45:00Z');
    const interval = {
      start: subMinutes(now, 5),
      end: now,
    };

    result.current.updateSelectionFromInterval(interval);

    expect(setSelectedLabel).toHaveBeenCalled();
    expect(selectedValueRef.current).toBe('5m');
  });
});
