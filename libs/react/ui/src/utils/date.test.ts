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
  });

  describe('parseTextInterval', () => {
    it('should return undefined for invalid input', () => {
      expect(parseTextInterval('invalid')).toBeUndefined();
      expect(parseTextInterval('Jan 1')).toBeUndefined();
      expect(parseTextInterval('invalid - invalid')).toBeUndefined();
    });

    it('should handle duration shortcuts', () => {
      const result = parseTextInterval('5m');
      expect(result).toBeDefined();
      if (!result) return;
      expect(result.end.getTime()).toBeLessThanOrEqual(now.getTime());
      expect(result.start.getTime()).toBeLessThan(result.end.getTime());
    });

    it('should assign years correctly when dates lack years', () => {
      const result1 = parseTextInterval('Jan 1 - Jan 15');
      expect(result1).toBeDefined();
      if (result1) {
        expect(result1.start.getFullYear()).toBe(2026);
        expect(result1.end.getFullYear()).toBe(2026);
        expect(result1.end.getTime()).toBeGreaterThanOrEqual(result1.start.getTime());
      }

      const result2 = parseTextInterval('Jan 1 - Jan 15 2025');
      expect(result2).toBeDefined();
      if (result2) {
        expect(result2.start.getFullYear()).toBe(2025);
        expect(result2.end.getFullYear()).toBe(2025);
      }

      const result3 = parseTextInterval('Jan 1 2025 - Jan 15');
      expect(result3).toBeDefined();
      if (result3) {
        expect(result3.end.getFullYear()).toBe(2026);
      }
    });

    it('should fix invalid intervals where end < start', () => {
      const result1 = parseTextInterval('Dec 25 - Jan 5');
      expect(result1).toBeDefined();
      if (result1) {
        expect(result1.end.getFullYear()).toBe(2026);
        expect(result1.start.getFullYear()).toBe(2025);
        expect(result1.end.getTime()).toBeGreaterThan(result1.start.getTime());
      }

      const result2 = parseTextInterval('Jan 7 2027 - Jan 6 2024');
      expect(result2).toBeDefined();
      if (result2) {
        expect(result2.end.getFullYear()).toBe(2026);
        expect(result2.start.getFullYear()).toBe(2025);
        expect(result2.end.getTime()).toBeGreaterThan(result2.start.getTime());
      }

      const result3 = parseTextInterval('Jan 7 2027 - Jan 6 2025');
      expect(result3).toBeDefined();
      if (result3) {
        expect(result3.end.getFullYear()).toBe(2026);
        expect(result3.start.getFullYear()).toBe(2025);
        expect(result3.end.getTime()).toBeGreaterThan(result3.start.getTime());
      }

      const result4 = parseTextInterval('Jan 15 2026 - Jan 1 2026');
      expect(result4).toBeDefined();
      if (result4) {
        expect(result4.end.getFullYear()).toBe(2026);
        expect(result4.start.getFullYear()).toBe(2025);
        expect(result4.end.getTime()).toBeGreaterThan(result4.start.getTime());
      }
    });

    it('should handle valid intervals correctly', () => {
      const result1 = parseTextInterval('Jan 1 2026 - Jan 15 2026');
      expect(result1).toBeDefined();
      if (result1) {
        expect(result1.end.getTime()).toBeGreaterThanOrEqual(result1.start.getTime());
      }

      const result2 = parseTextInterval('Jan 1 2025 - Jan 15 2026');
      expect(result2).toBeDefined();
      if (result2) {
        expect(result2.end.getTime()).toBeGreaterThan(result2.start.getTime());
      }
    });

    it('should handle edge cases', () => {
      const result1 = parseTextInterval('Jan 1 2026 – Jan 15 2026');
      expect(result1).toBeDefined();
      if (result1) {
        expect(result1.end.getTime()).toBeGreaterThanOrEqual(result1.start.getTime());
      }

      const result2 = parseTextInterval('Jan 1 2026 12:00 AM - Jan 15 2026 11:59 PM');
      expect(result2).toBeDefined();
      if (result2) {
        expect(result2.end.getTime()).toBeGreaterThanOrEqual(result2.start.getTime());
      }

      const result3 = parseTextInterval('  Jan 1 2026  -  Jan 15 2026  ');
      expect(result3).toBeDefined();
      if (result3) {
        expect(result3.end.getTime()).toBeGreaterThanOrEqual(result3.start.getTime());
      }
    });

    it('should always ensure end >= start for various invalid combinations', () => {
      const testCases = [
        'Jan 7 2027 - Jan 6 2025',
        'Dec 31 2026 - Jan 1 2026',
        'Jan 20 2026 - Jan 19 2026',
        'Jan 1 2027 - Dec 31 2024',
      ];

      testCases.forEach((testCase) => {
        const result = parseTextInterval(testCase);
        expect(result).toBeDefined();
        if (!result) return;
        expect(result.end.getTime()).toBeGreaterThanOrEqual(result.start.getTime());
      });
    });
  });
});
