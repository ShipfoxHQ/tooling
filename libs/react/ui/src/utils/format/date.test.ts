import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {
  addDays,
  addYears,
  endOfDay,
  type NormalizedInterval,
  startOfDay,
  subDays,
  subHours,
  subYears,
} from 'date-fns';
import {formatDateTimeRange} from './date';

describe('Format - Date', () => {
  describe('formatDateTimeRange', () => {
    const now = new Date('2024-03-20T17:45:00Z');
    let interval: NormalizedInterval;

    beforeEach(() => {
      interval = {
        start: subHours(now, 1),
        end: now,
      };
      vi.useFakeTimers({now});
    });

    afterEach(() => {
      vi.runOnlyPendingTimers();
      vi.useRealTimers();
    });

    it('displays only the hour of the second date if both on same day (en-US)', () => {
      const result = formatDateTimeRange(interval);
      expect(result).toEqual('Mar 20, 4:45\u2009\u2013\u20095:45\u202fPM');
    });

    it('displays the date for the second day if not on same day (en-US)', () => {
      interval.end = addDays(interval.end, 1);
      const result = formatDateTimeRange(interval);
      expect(result).toEqual('Mar 20, 4:45\u202fPM\u2009\u2013\u2009Mar 21, 5:45\u202fPM');
    });

    it('displays the year for the second day if not on same day (en-US)', () => {
      interval.end = addYears(interval.end, 1);
      const result = formatDateTimeRange(interval);
      expect(result).toEqual(
        'Mar 20, 2024, 4:45\u202fPM\u2009\u2013\u2009Mar 20, 2025, 5:45\u202fPM',
      );
    });

    it('displays the year when the dates are both in another year (en-US)', () => {
      interval.start = subYears(interval.start, 1);
      interval.end = subYears(interval.end, 1);
      const result = formatDateTimeRange(interval);
      expect(result).toEqual('Mar 20, 2023, 4:45\u2009\u2013\u20095:45\u202fPM');
    });

    it('does not display time when interval if full days', () => {
      interval.start = startOfDay(subDays(interval.start, 1));
      interval.end = endOfDay(interval.end);
      const result = formatDateTimeRange(interval);
      expect(result).toEqual('Mar 19\u2009\u2013\u200920');
    });
  });
});
