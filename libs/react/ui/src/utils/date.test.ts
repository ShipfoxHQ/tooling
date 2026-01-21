import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {endOfDay, startOfDay, sub} from 'date-fns';
import {
  generateDurationShortcut,
  intervalToNowFromDuration,
  parseTextDurationShortcut,
  parseTextInterval,
} from './date';

describe('date utils', () => {
  const now = new Date('2026-01-19T17:45:00Z');

  beforeEach(() => {
    vi.useFakeTimers({now});
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('intervalToNowFromDuration', () => {
    it('should return the interval for days', () => {
      const result = intervalToNowFromDuration({days: 2});
      expect(result).toEqual({
        start: new Date('2026-01-17T17:45:00Z'),
        end: new Date('2026-01-19T17:45:00Z'),
      });
    });

    it('should return the interval for days rounded, when the options is given', () => {
      const result = intervalToNowFromDuration({days: 2}, {attemptRounding: true});
      const expectedStart = startOfDay(sub(now, {days: 2}));
      const expectedEnd = endOfDay(now);
      expect(result.start.getTime()).toBe(expectedStart.getTime());
      expect(result.end.getTime()).toBe(expectedEnd.getTime());
      expect(result.end.getTime()).toBeGreaterThan(result.start.getTime());
    });

    it('should not round the hours intervals, even when the options is given', () => {
      const result = intervalToNowFromDuration({hours: 48}, {attemptRounding: true});
      expect(result).toEqual({
        start: new Date('2026-01-17T17:45:00Z'),
        end: new Date('2026-01-19T17:45:00Z'),
      });
    });
  });

  describe('parseTextDurationShortcut', () => {
    it('should parse a duration shortcut in seconds', () => {
      const result = parseTextDurationShortcut('100s');
      expect(result).toEqual({seconds: 100});
    });

    it('should parse a duration shortcut in minutes', () => {
      const result = parseTextDurationShortcut('100m');
      expect(result).toEqual({minutes: 100});
    });

    it('should parse a duration shortcut in hours', () => {
      const result = parseTextDurationShortcut('100h');
      expect(result).toEqual({hours: 100});
    });

    it('should parse a duration shortcut in days', () => {
      const result = parseTextDurationShortcut('100d');
      expect(result).toEqual({days: 100});
    });

    it('should parse a duration shortcut in weeks', () => {
      const result = parseTextDurationShortcut('100w');
      expect(result).toEqual({weeks: 100});
    });

    it('should parse a duration shortcut in months', () => {
      const result = parseTextDurationShortcut('100mo');
      expect(result).toEqual({months: 100});
    });

    it('should parse a duration shortcut in years', () => {
      const result = parseTextDurationShortcut('100y');
      expect(result).toEqual({years: 100});
    });
  });

  describe('generateDurationShortcut', () => {
    it('should generate a duration shortcut in seconds', () => {
      const result = generateDurationShortcut({seconds: 100});
      expect(result).toEqual('100s');
    });

    it('should generate a duration shortcut in minutes', () => {
      const result = generateDurationShortcut({minutes: 100});
      expect(result).toEqual('100m');
    });

    it('should generate a duration shortcut in hours', () => {
      const result = generateDurationShortcut({hours: 100});
      expect(result).toEqual('100h');
    });

    it('should generate a duration shortcut in days', () => {
      const result = generateDurationShortcut({days: 100});
      expect(result).toEqual('100d');
    });

    it('should generate a duration shortcut in weeks', () => {
      const result = generateDurationShortcut({weeks: 100});
      expect(result).toEqual('100w');
    });

    it('should generate a duration shortcut in months', () => {
      const result = generateDurationShortcut({months: 100});
      expect(result).toEqual('100mo');
    });

    it('should generate a duration shortcut in years', () => {
      const result = generateDurationShortcut({years: 100});
      expect(result).toEqual('100y');
    });

    it('should return the highest duration unit (years)', () => {
      const result = generateDurationShortcut({
        years: 1,
        months: 1,
        weeks: 1,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
      });
      expect(result).toEqual('1y');
    });

    it('should return the highest duration unit (months)', () => {
      const result = generateDurationShortcut({
        months: 1,
        weeks: 1,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
      });
      expect(result).toEqual('1mo');
    });

    it('should return the highest duration unit (weeks)', () => {
      const result = generateDurationShortcut({
        weeks: 1,
        days: 1,
        hours: 1,
        minutes: 1,
        seconds: 1,
      });
      expect(result).toEqual('1w');
    });

    it('should return the highest duration unit (days)', () => {
      const result = generateDurationShortcut({days: 1, hours: 1, minutes: 1, seconds: 1});
      expect(result).toEqual('1d');
    });

    it('should return the highest duration unit (hours)', () => {
      const result = generateDurationShortcut({hours: 1, minutes: 1, seconds: 1});
      expect(result).toEqual('1h');
    });

    it('should return the highest duration unit (minutes)', () => {
      const result = generateDurationShortcut({minutes: 1, seconds: 1});
      expect(result).toEqual('1m');
    });
  });

  describe('parseTextInterval', () => {
    it('should return undefined for invalid input', () => {
      expect(parseTextInterval('invalid')).toBeUndefined();
      expect(parseTextInterval('Jan 1')).toBeUndefined();
      expect(parseTextInterval('invalid - invalid')).toBeUndefined();
    });

    describe('year assignment when dates lack years', () => {
      const currentYear = now.getFullYear();

      it('should assign current year to both dates when neither has a year', () => {
        const result = parseTextInterval('Jan 1 - Jan 15');
        expect(result).toBeDefined();
        expect(result?.start.getFullYear()).toBe(currentYear);
        expect(result?.end.getFullYear()).toBe(currentYear);
        expect(result?.end.getTime()).toBeGreaterThanOrEqual(result?.start.getTime() ?? 0);
      });

      it('should assign end year to start when only start lacks year', () => {
        const result = parseTextInterval('Jan 1 - Jan 15 2025');
        expect(result).toBeDefined();
        expect(result?.start.getFullYear()).toBe(2025);
        expect(result?.end.getFullYear()).toBe(2025);
      });

      it('should assign current year to end when only end lacks year', () => {
        const result = parseTextInterval('Jan 1 2025 - Jan 15');
        expect(result).toBeDefined();
        expect(result?.start.getFullYear()).toBe(2025);
        expect(result?.end.getFullYear()).toBe(currentYear);
      });

      it('should preserve years when both dates have years specified', () => {
        const result = parseTextInterval('Jan 1 2025 - Jan 15 2026');
        expect(result).toBeDefined();
        expect(result?.start.getFullYear()).toBe(2025);
        expect(result?.end.getFullYear()).toBe(2026);
        expect(result?.end.getTime()).toBeGreaterThan(result?.start.getTime() ?? 0);
      });
    });

    describe('auto-fixing invalid intervals where end < start', () => {
      it('should move start to previous year when both dates lack years and end < start', () => {
        const result = parseTextInterval('Dec 25 - Jan 5');
        const currentYear = now.getFullYear();
        expect(result).toBeDefined();
        expect(result?.start.getFullYear()).toBe(currentYear - 1);
        expect(result?.end.getFullYear()).toBe(currentYear);
        expect(result?.end.getTime()).toBeGreaterThan(result?.start.getTime() ?? 0);
      });

      it('should handle time components when auto-fixing invalid intervals without years', () => {
        const result = parseTextInterval('Jan 21 12:05 PM - Jan 20 12:05 PM');
        const currentYear = now.getFullYear();
        expect(result).toBeDefined();
        expect(result?.start.getFullYear()).toBe(currentYear - 1);
        expect(result?.end.getFullYear()).toBe(currentYear);
        expect(result?.end.getTime()).toBeGreaterThan(result?.start.getTime() ?? 0);
      });

      it('should handle year boundary crossing when dates lack years (Dec 31 to Jan 1)', () => {
        const result = parseTextInterval('Dec 31 - Jan 1');
        const currentYear = now.getFullYear();
        expect(result).toBeDefined();
        expect(result?.start.getFullYear()).toBe(currentYear - 1);
        expect(result?.end.getFullYear()).toBe(currentYear);
        expect(result?.end.getTime()).toBeGreaterThan(result?.start.getTime() ?? 0);
      });
    });

    describe('invalid intervals with explicit years where end < start', () => {
      it('should return undefined when start year is greater than end year', () => {
        const result = parseTextInterval('Jan 7 2027 - Jan 6 2024');
        expect(result).toBeUndefined();
      });

      it('should return undefined when dates are in same year but end < start', () => {
        const result = parseTextInterval('Jan 7 2026 - Jan 6 2026');
        expect(result).toBeUndefined();
      });

      it('should return undefined for year boundary crossing with explicit years (Dec 31 to Jan 1)', () => {
        const result = parseTextInterval('Dec 31 2026 - Jan 1 2026');
        expect(result).toBeUndefined();
      });
    });

    describe('valid intervals', () => {
      it('should handle valid intervals within the same year', () => {
        const result = parseTextInterval('Jan 1 2026 - Jan 15 2026');
        expect(result).toBeDefined();
        expect(result?.end.getTime()).toBeGreaterThanOrEqual(result?.start.getTime() ?? 0);
      });

      it('should handle valid intervals spanning multiple years', () => {
        const result = parseTextInterval('Jan 20 2025 - Jan 15 2026');
        expect(result).toBeDefined();
        expect(result?.end.getTime()).toBeGreaterThan(result?.start.getTime() ?? 0);
      });
    });

    describe('date format variations', () => {
      it('should handle en dash separator (U+2013)', () => {
        const result = parseTextInterval('Jan 1 2026 – Jan 15 2026');
        expect(result).toBeDefined();
        expect(result?.end.getTime()).toBeGreaterThanOrEqual(result?.start.getTime() ?? 0);
      });

      it('should handle dates with time components', () => {
        const result = parseTextInterval('Jan 1 2026 12:00 AM - Jan 15 2026 11:59 PM');
        expect(result).toBeDefined();
        expect(result?.end.getTime()).toBeGreaterThanOrEqual(result?.start.getTime() ?? 0);
      });

      it('should handle extra whitespace around dates', () => {
        const result = parseTextInterval('  Jan 1 2026  -  Jan 15 2026  ');
        expect(result).toBeDefined();
        expect(result?.end.getTime()).toBeGreaterThanOrEqual(result?.start.getTime() ?? 0);
      });
    });
  });
});
