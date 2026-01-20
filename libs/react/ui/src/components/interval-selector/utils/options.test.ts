import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {subMinutes} from 'date-fns';
import {intervalToNowFromDuration} from 'utils/date';
import {getCalendarIntervals} from './calendar';
import {
  findOption,
  findOptionByInterval,
  findOptionValueForInterval,
  getLabelForValue,
} from './options';

describe('interval-selector-options', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-20T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('findOption', () => {
    it('should find option by value in past intervals', () => {
      const result = findOption('5m');
      expect(result).toBeDefined();
      expect(result?.value).toBe('5m');
      expect(result?.label).toBe('Past 5 Minutes');
    });

    it('should find option by value in calendar intervals', () => {
      const result = findOption('today');
      expect(result).toBeDefined();
      expect(result?.value).toBe('today');
      expect(result?.type).toBe('calendar');
    });

    it('should return undefined for non-existent value', () => {
      const result = findOption('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should work with custom interval arrays', () => {
      const customIntervals = [
        {value: 'custom', label: 'Custom', shortcut: 'c', type: 'custom' as const},
      ];
      const result = findOption('custom', [], customIntervals);
      expect(result).toBeDefined();
      expect(result?.value).toBe('custom');
    });
  });

  describe('getLabelForValue', () => {
    it('should return label for valid value', () => {
      const result = getLabelForValue('1h');
      expect(result).toBe('Past 1 Hour');
    });

    it('should return undefined for invalid value', () => {
      const result = getLabelForValue('invalid');
      expect(result).toBeUndefined();
    });

    it('should return undefined for undefined value', () => {
      const result = getLabelForValue(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('findOptionByInterval', () => {
    it('should find past interval option by matching interval', () => {
      const interval = intervalToNowFromDuration({minutes: 5});
      const result = findOptionByInterval(interval);
      expect(result).toBeDefined();
      expect(result?.value).toBe('5m');
    });

    it('should find calendar interval option by matching interval', () => {
      const today = getCalendarIntervals().find((i) => i.value === 'today');
      expect(today).toBeDefined();
    });

    it('should return undefined for non-matching interval', () => {
      const interval = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T10:07:00Z'),
      };
      const result = findOptionByInterval(interval);
      expect(result).toBeUndefined();
    });
  });

  describe('findOptionValueForInterval', () => {
    it('should return value for recent matching interval', () => {
      const interval = {
        start: subMinutes(new Date(), 5),
        end: new Date(),
      };
      const result = findOptionValueForInterval(interval);
      expect(result).toBe('5m');
    });

    it('should return undefined for non-recent interval', () => {
      const interval = {
        start: new Date('2026-01-20T10:00:00Z'),
        end: new Date('2026-01-20T11:00:00Z'),
      };
      const result = findOptionValueForInterval(interval);
      expect(result).toBeUndefined();
    });

    it('should return undefined for interval that does not match any option', () => {
      const interval = {
        start: subMinutes(new Date(), 7),
        end: new Date(),
      };
      const result = findOptionValueForInterval(interval);
      expect(result).toBeUndefined();
    });
  });
});
