import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {
  addDays,
  addYears,
  endOfDay,
  type NormalizedInterval,
  startOfDay,
  subHours,
  subYears,
} from 'date-fns';
import {formatDateTimeRange} from './date';

describe('Format - Date', () => {
  describe('formatDateTimeRange', () => {
    const now = new Date('2024-03-21T00:45:00Z');
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
      const result = formatDateTimeRange(interval, {timeZone: 'America/Los_Angeles'});
      expect(result).toEqual('Mar 20, 4:45 PM – Mar 20, 5:45 PM');
    });

    it('displays the date for the second day if not on same day (en-US)', () => {
      interval.end = addDays(interval.end, 1);
      const result = formatDateTimeRange(interval, {timeZone: 'America/Los_Angeles'});
      expect(result).toEqual('Mar 20, 4:45 PM – Mar 21, 5:45 PM');
    });

    it('displays the year for the second day if not on same day (en-US)', () => {
      interval.end = addYears(interval.end, 1);
      const result = formatDateTimeRange(interval, {timeZone: 'America/Los_Angeles'});
      expect(result).toEqual('Mar 20, 2024, 4:45 PM – Mar 20, 2025, 5:45 PM');
    });

    it('displays the year when the dates are both in another year (en-US)', () => {
      interval.start = subYears(interval.start, 1);
      interval.end = subYears(interval.end, 1);
      const result = formatDateTimeRange(interval, {timeZone: 'America/Los_Angeles'});
      expect(result).toEqual('Mar 20, 2023, 4:45 PM – Mar 20, 2023, 5:45 PM');
    });

    it('does not display time when interval if full days', () => {
      const startUTC = new Date('2024-03-19T00:00:00Z');
      const endUTC = new Date('2024-03-21T00:00:00Z');
      interval.start = startOfDay(startUTC);
      interval.end = endOfDay(endUTC);
      const result = formatDateTimeRange(interval, {timeZone: 'America/Los_Angeles'});
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        month: 'short',
        day: 'numeric',
      });
      const expected = formatter.formatRange(interval.start, interval.end);
      expect(result).toEqual(expected);
    });
  });
});
