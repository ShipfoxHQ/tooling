import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {formatSelection, formatSelectionForInput, formatShortcut} from './format';

process.env.TZ = 'UTC';

describe('interval-selector-format', () => {
  const now = new Date('2026-01-19T17:45:00Z');

  beforeEach(() => {
    vi.useFakeTimers({now});
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatSelection', () => {
    it('should show the selected interval in human readable format by default', () => {
      const interval = {
        start: new Date('2026-01-19T00:00:00Z'),
        end: new Date('2026-01-19T01:00:00Z'),
      };
      const result = formatSelection({
        selection: {type: 'interval', interval},
        isFocused: false,
        inputValue: '',
      });
      expect(result).toBe('Jan 19, 12:00 AM \u2013 Jan 19, 1:00 AM');
    });

    it('should show the selected duration in human readable format by default', () => {
      const duration = {hours: 1};
      const result = formatSelection({
        selection: {type: 'relative', duration},
        isFocused: false,
        inputValue: '',
      });
      expect(result).toBe('Past 1 hour');
    });

    it('should show the input value when focused', () => {
      const interval = {
        start: new Date('2026-01-19T00:00:00Z'),
        end: new Date('2026-01-19T01:00:00Z'),
      };
      const result = formatSelection({
        selection: {type: 'interval', interval},
        isFocused: true,
        inputValue: 'Hello world',
      });
      expect(result).toBe('Hello world');
    });
  });

  describe('formatSelectionForInput', () => {
    it('should format the selected interval as a full date range', () => {
      const interval = {
        start: new Date('2026-01-19T00:00:00Z'),
        end: new Date('2026-01-19T01:00:00Z'),
      };
      const result = formatSelectionForInput({type: 'interval', interval});
      expect(result).toBe('Jan 19, 2026, 12:00 AM\u2009\u2013\u2009Jan 19, 2026, 1:00 AM');
    });

    it('should format the selected duration as a full date range relative to now', () => {
      const duration = {hours: 1};
      const result = formatSelectionForInput({type: 'relative', duration});
      expect(result).toBe('Jan 19, 2026, 4:45 PM\u2009\u2013\u2009Jan 19, 2026, 5:45 PM');
    });
  });

  describe('formatShortcut', () => {
    it('should format the selected duration for shortcut', () => {
      const duration = {hours: 1};
      const result = formatShortcut({
        selection: {type: 'relative', duration},
        inputValue: '',
        isFocused: false,
      });
      expect(result).toBe('1h');
    });

    it('should format the selected duration for shortcut when the input is not focused and the value is a duration shortcut', () => {
      const duration = {hours: 1};
      const result = formatShortcut({
        selection: {type: 'relative', duration},
        inputValue: '5d',
        isFocused: false,
      });
      expect(result).toBe('1h');
    });

    it('should format the selected duration for shortcut when the input is focused', () => {
      const duration = {hours: 1};
      const result = formatShortcut({
        selection: {type: 'relative', duration},
        inputValue: '5d',
        isFocused: true,
      });
      expect(result).toBe('5d');
    });

    it('should return "-" when the input value is not a duration shortcut', () => {
      const result = formatShortcut({
        selection: {
          type: 'interval',
          interval: {
            start: new Date('2026-01-19T00:00:00Z'),
            end: new Date('2026-01-19T01:00:00Z'),
          },
        },
        inputValue: 'Hello world',
        isFocused: false,
      });
      expect(result).toBe('-');
    });
  });
});
