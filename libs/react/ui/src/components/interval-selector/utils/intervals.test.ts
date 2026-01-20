import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {subHours, subMinutes} from 'date-fns';
import {
  getDurationFromInterval,
  intervalsMatch,
  isRelativeToNow,
  isWithinTolerance,
} from './intervals';

describe('interval-selector-intervals', () => {
  describe('isWithinTolerance', () => {
    it('should return true when dates are within tolerance', () => {
      const date1 = new Date('2026-01-20T10:00:00Z');
      const date2 = new Date('2026-01-20T10:00:30Z');
      expect(isWithinTolerance(date1, date2, 60000)).toBe(true);
    });

    it('should return false when dates exceed tolerance', () => {
      const date1 = new Date('2026-01-20T10:00:00Z');
      const date2 = new Date('2026-01-20T10:02:00Z');
      expect(isWithinTolerance(date1, date2, 60000)).toBe(false);
    });

    it('should use default tolerance when not specified', () => {
      const date1 = new Date('2026-01-20T10:00:00Z');
      const date2 = new Date('2026-01-20T10:00:30Z');
      expect(isWithinTolerance(date1, date2)).toBe(true);
    });
  });

  describe('intervalsMatch', () => {
    it('should return true when intervals match within tolerance', () => {
      const interval1 = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T11:00:00Z'),
      };
      const interval2 = {
        start: new Date('2026-01-20T10:00:30Z'),
        end: new Date('2026-01-20T11:00:30Z'), // 30s difference
      };
      expect(intervalsMatch(interval1, interval2)).toBe(true);
    });

    it('should return false when intervals do not match', () => {
      const interval1 = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T11:00:00Z'),
      };
      const interval2 = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T12:00:00Z'),
      };
      expect(intervalsMatch(interval1, interval2)).toBe(false);
    });
  });

  describe('isRelativeToNow', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return true when interval ends close to now', () => {
      const interval = {
        start: new Date('2026-01-20T11:00:00Z'),
        end: new Date('2026-01-20T12:00:30Z'),
      };
      expect(isRelativeToNow(interval)).toBe(true);
    });

    it('should return false when interval ends far from now', () => {
      const interval = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T11:00:00Z'),
      };
      expect(isRelativeToNow(interval)).toBe(false);
    });

    it('should use custom tolerance when provided', () => {
      const interval = {
        start: new Date('2026-01-20T11:00:00Z'),
        end: new Date('2026-01-20T12:00:02Z'),
      };
      expect(isRelativeToNow(interval, 1000)).toBe(false);
    });
  });

  describe('getDurationFromInterval', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return duration for 5 minute interval', () => {
      const interval = {
        start: subMinutes(new Date(), 5),
        end: new Date(),
      };
      const result = getDurationFromInterval(interval);
      expect(result).toEqual({minutes: 5});
    });

    it('should return duration for 1 hour interval', () => {
      const interval = {
        start: subHours(new Date(), 1),
        end: new Date(),
      };
      const result = getDurationFromInterval(interval);
      expect(result).toEqual({hours: 1});
    });

    it('should return undefined for non-relative intervals', () => {
      const interval = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T11:00:00Z'),
      };
      const result = getDurationFromInterval(interval);
      expect(result).toBeUndefined();
    });

    it('should return undefined for intervals that do not match past intervals', () => {
      const interval = {
        start: subMinutes(new Date(), 7),
        end: new Date(),
      };
      const result = getDurationFromInterval(interval);
      expect(result).toBeUndefined();
    });
  });
});
