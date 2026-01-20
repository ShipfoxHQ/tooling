import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {endOfDay, startOfDay, startOfMonth, startOfWeek, startOfYear} from 'date-fns';
import {
  getCalendarInterval,
  getCalendarIntervals,
  getDurationFromCalendarInterval,
} from '../calendar';

describe('interval-selector-calendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getCalendarInterval', () => {
    it('should return today interval', () => {
      const result = getCalendarInterval('today');
      expect(result).toBeDefined();
      expect(result?.start).toEqual(startOfDay(new Date()));
      expect(result?.end).toEqual(new Date());
    });

    it('should return yesterday interval', () => {
      const result = getCalendarInterval('yesterday');
      expect(result).toBeDefined();
      const yesterday = new Date('2026-01-19T12:00:00Z');
      expect(result?.start).toEqual(startOfDay(yesterday));
      expect(result?.end).toEqual(endOfDay(yesterday));
    });

    it('should return week-to-date interval', () => {
      const result = getCalendarInterval('week-to-date');
      expect(result).toBeDefined();
      expect(result?.start).toEqual(startOfWeek(new Date(), {weekStartsOn: 1}));
      expect(result?.end).toEqual(new Date());
    });

    it('should return month-to-date interval', () => {
      const result = getCalendarInterval('month-to-date');
      expect(result).toBeDefined();
      expect(result?.start).toEqual(startOfMonth(new Date()));
      expect(result?.end).toEqual(new Date());
    });

    it('should return year-to-date interval', () => {
      const result = getCalendarInterval('year-to-date');
      expect(result).toBeDefined();
      expect(result?.start).toEqual(startOfYear(new Date()));
      expect(result?.end).toEqual(new Date());
    });

    it('should return undefined for invalid value', () => {
      const result = getCalendarInterval('invalid');
      expect(result).toBeUndefined();
    });
  });

  describe('getCalendarIntervals', () => {
    it('should return all calendar intervals', () => {
      const intervals = getCalendarIntervals();
      expect(intervals.length).toBeGreaterThan(0);
      expect(intervals.every((i) => i.type === 'calendar')).toBe(true);
    });

    it('should include all expected interval types', () => {
      const intervals = getCalendarIntervals();
      const values = intervals.map((i) => i.value);
      expect(values).toContain('today');
      expect(values).toContain('yesterday');
      expect(values).toContain('week-to-date');
      expect(values).toContain('month-to-date');
      expect(values).toContain('year-to-date');
    });

    it('should have shortcuts for all intervals', () => {
      const intervals = getCalendarIntervals();
      expect(intervals.every((i) => i.shortcut.length > 0)).toBe(true);
    });
  });

  describe('getDurationFromCalendarInterval', () => {
    it('should return duration for yesterday (1 day)', () => {
      const yesterday = getCalendarInterval('yesterday');
      expect(yesterday).toBeDefined();
      if (yesterday) {
        const result = getDurationFromCalendarInterval(yesterday);
        expect(result).toEqual({days: 1});
      }
    });

    it('should return undefined for today (not a fixed duration)', () => {
      const today = getCalendarInterval('today');
      expect(today).toBeDefined();
      if (today) {
        const result = getDurationFromCalendarInterval(today);
        expect(result).toBeUndefined();
      }
    });

    it('should return undefined for intervals that do not match calendar intervals', () => {
      const interval = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T11:00:00Z'),
      };
      const result = getDurationFromCalendarInterval(interval);
      expect(result).toBeUndefined();
    });
  });
});
