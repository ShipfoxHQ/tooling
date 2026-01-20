import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {renderHook} from '@testing-library/react';
import {subHours, subMinutes} from 'date-fns';
import type {IntervalOption} from '../interval-selector.utils';
import {useIntervalSelectorShortcut} from './use-interval-selector-shortcut';

describe('useIntervalSelectorShortcut', () => {
  const mockPastIntervals: IntervalOption[] = [
    {value: '5m', label: 'Past 5 Minutes', shortcut: '5m', type: 'past', duration: {minutes: 5}},
    {value: '1h', label: 'Past 1 Hour', shortcut: '1h', type: 'past', duration: {hours: 1}},
  ];

  const mockCalendarIntervals: IntervalOption[] = [
    {value: 'today', label: 'Today', shortcut: '0h', type: 'calendar'},
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-19T17:45:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getShortcutFromValue', () => {
    it('should return shortcut from matching option', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      expect(result.current.getShortcutFromValue('5m')).toBe('5m');
      expect(result.current.getShortcutFromValue('1h')).toBe('1h');
    });

    it('should parse relative time shortcut when option not found', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      const shortcut = result.current.getShortcutFromValue('30m');
      expect(shortcut).toBe('30m');
    });

    it('should return undefined for invalid value', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      expect(result.current.getShortcutFromValue('invalid')).toBeUndefined();
    });
  });

  describe('detectShortcutFromInterval', () => {
    it('should detect shortcut from matching option interval', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      const now = new Date('2026-01-19T17:45:00Z');
      const interval = {
        start: subMinutes(now, 5),
        end: now,
      };

      const detected = result.current.detectShortcutFromInterval(interval);
      expect(detected.shortcut).toBe('5m');
      expect(detected.label).toBe('Past 5 Minutes');
      expect(detected.value).toBe('5m');
    });

    it('should generate shortcut from interval duration when no match', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      const now = new Date('2026-01-19T17:45:00Z');
      const interval = {
        start: subHours(now, 2),
        end: now,
      };

      const detected = result.current.detectShortcutFromInterval(interval);
      expect(detected.shortcut).toBe('2h');
      expect(detected.label).toBeDefined();
    });

    it('should return undefined shortcut for invalid interval', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      const now = new Date('2026-01-19T17:45:00Z');
      const interval = {
        start: now,
        end: now,
      };

      const detected = result.current.detectShortcutFromInterval(interval);
      expect(detected.shortcut).toBeUndefined();
    });
  });

  describe('detectShortcutFromInput', () => {
    it('should detect shortcut from relative time input', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      expect(result.current.detectShortcutFromInput('15m')).toBe('15m');
      expect(result.current.detectShortcutFromInput('3h')).toBe('3h');
    });

    it('should detect shortcut from parsed interval', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      const shortcut = result.current.detectShortcutFromInput('Jan 1 2026 - Jan 15 2026');
      expect(shortcut).toBeDefined();
    });

    it('should return undefined for invalid input', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorShortcut({
          pastIntervals: mockPastIntervals,
          resolvedCalendarIntervals: mockCalendarIntervals,
        }),
      );

      expect(result.current.detectShortcutFromInput('invalid input')).toBeUndefined();
      expect(result.current.detectShortcutFromInput('')).toBeUndefined();
    });
  });
});
