import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {subDays, subHours, subMonths, subYears} from 'date-fns';
import {isRelativeToNow} from './intervals';
import {detectShortcutFromCalendarInterval, parseRelativeTimeShortcut} from './shortcuts';

describe('interval-selector-shortcuts', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('parseRelativeTimeShortcut', () => {
    it('should parse minutes shortcut', () => {
      const result = parseRelativeTimeShortcut('5m');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('5m');
      expect(result?.duration).toEqual({minutes: 5});
      expect(result?.label).toBe('Past 5 Minutes');
    });

    it('should parse hours shortcut', () => {
      const result = parseRelativeTimeShortcut('2h');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('2h');
      expect(result?.duration).toEqual({hours: 2});
      expect(result?.label).toBe('Past 2 Hours');
    });

    it('should parse days shortcut', () => {
      const result = parseRelativeTimeShortcut('3d');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('3d');
      expect(result?.duration).toEqual({days: 3});
      expect(result?.label).toBe('Past 3 Days');
    });

    it('should parse weeks shortcut', () => {
      const result = parseRelativeTimeShortcut('2w');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('2w');
      expect(result?.duration).toEqual({weeks: 2});
      expect(result?.label).toBe('Past 2 Weeks');
    });

    it('should parse months shortcut', () => {
      const result = parseRelativeTimeShortcut('3mo');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('3mo');
      expect(result?.duration).toEqual({months: 3});
      expect(result?.label).toBe('Past 3 Months');
    });

    it('should convert 30-31 days to 1 month', () => {
      const result = parseRelativeTimeShortcut('30d');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('1mo');
      expect(result?.duration).toEqual({months: 1});
    });

    it('should convert 52+ weeks to 1 year', () => {
      const result = parseRelativeTimeShortcut('53w');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('1y');
      expect(result?.duration).toEqual({years: 1});
    });

    it('should return undefined for invalid input', () => {
      const result = parseRelativeTimeShortcut('invalid');
      expect(result).toBeUndefined();
    });

    it('should return undefined for empty input', () => {
      const result = parseRelativeTimeShortcut('');
      expect(result).toBeUndefined();
    });

    it('should convert days > 31 to months', () => {
      const result = parseRelativeTimeShortcut('32d');
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('1mo');
      expect(result?.duration).toEqual({months: 1});
    });

    it('should handle singular vs plural labels', () => {
      const singular = parseRelativeTimeShortcut('1h');
      const plural = parseRelativeTimeShortcut('2h');
      expect(singular?.label).toBe('Past 1 Hour');
      expect(plural?.label).toBe('Past 2 Hours');
    });
  });

  describe('detectShortcutFromCalendarInterval', () => {
    it('should return undefined for relative intervals', () => {
      const interval = {
        start: subHours(new Date(), 1),
        end: new Date(),
      };
      expect(isRelativeToNow(interval)).toBe(true);
      const result = detectShortcutFromCalendarInterval(interval);
      expect(result).toBeUndefined();
    });

    it('should detect shortcut for day-based interval', () => {
      const interval = {
        start: subDays(new Date('2026-01-20T00:00:00Z'), 1),
        end: new Date('2026-01-20T23:59:59Z'),
      };
      const result = detectShortcutFromCalendarInterval(interval);
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('1d');
    });

    it('should detect shortcut for month-based interval', () => {
      const interval = {
        start: subMonths(new Date('2026-01-20T00:00:00Z'), 1),
        end: new Date('2026-01-20T23:59:59Z'),
      };
      const result = detectShortcutFromCalendarInterval(interval);
      expect(result).toBeDefined();
      expect(result?.shortcut).toBe('1mo');
    });

    it('should return formatted label for intervals', () => {
      const interval = {
        start: new Date('2026-01-20T00:00:00Z'),
        end: new Date('2026-01-25T23:59:59Z'),
      };
      const result = detectShortcutFromCalendarInterval(interval);
      expect(result).toBeDefined();
      expect(result?.label).toBeTruthy();
      expect(typeof result?.label).toBe('string');
    });

    it('should return undefined shortcut for intervals > 1 year', () => {
      const interval = {
        start: subYears(new Date('2026-01-20T00:00:00Z'), 2),
        end: new Date('2026-01-20T23:59:59Z'),
      };
      const result = detectShortcutFromCalendarInterval(interval);
      expect(result).toBeDefined();
      expect(result?.shortcut).toBeUndefined();
    });
  });
});
