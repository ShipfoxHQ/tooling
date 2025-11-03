import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {
  generateDurationShortcut,
  intervalToNowFromDuration,
  parseTextDurationShortcut,
} from './date';

describe('date utils', () => {
  const now = new Date('2024-03-20T17:45:00Z');

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
        start: new Date('2024-03-18T17:45:00Z'),
        end: new Date('2024-03-20T17:45:00Z'),
      });
    });

    it('should return the interval for days rounded, when the options is given', () => {
      const result = intervalToNowFromDuration({days: 2}, {attemptRounding: true});
      expect(result).toEqual({
        start: new Date('2024-03-18T00:00:00Z'),
        end: new Date('2024-03-20T23:59:59.999Z'),
      });
    });

    it('should not round the hours intervals, even when the options is given', () => {
      const result = intervalToNowFromDuration({hours: 48}, {attemptRounding: true});
      expect(result).toEqual({
        start: new Date('2024-03-18T17:45:00Z'),
        end: new Date('2024-03-20T17:45:00Z'),
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
});
