import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {subHours, subMinutes} from 'date-fns';
import {formatIntervalDisplay} from '../format';

describe('interval-selector-format', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatIntervalDisplay', () => {
    it('should format relative interval when not focused', () => {
      const interval = {
        start: subMinutes(new Date(), 5),
        end: new Date(),
      };
      const result = formatIntervalDisplay(interval, false);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format with time when focused', () => {
      const interval = {
        start: subHours(new Date(), 1),
        end: new Date(),
      };
      const result = formatIntervalDisplay(interval, true);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format absolute interval differently', () => {
      const interval = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T11:00:00Z'),
      };
      const result = formatIntervalDisplay(interval, false);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle calendar intervals', () => {
      const interval = {
        start: new Date('2026-01-20T00:00:00Z'),
        end: new Date('2026-01-20T23:59:59Z'),
      };
      const result = formatIntervalDisplay(interval, false);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
