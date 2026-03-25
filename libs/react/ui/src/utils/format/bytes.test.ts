import {describe, expect, it} from '@shipfox/vitest/vi';
import {formatBytes} from './bytes';

describe('formatBytes', () => {
  it('returns — for non-numeric input', () => {
    expect(formatBytes('abc')).toBe('—');
    expect(formatBytes('')).toBe('—');
  });

  it('formats bytes', () => {
    expect(formatBytes('0')).toBe('0 B');
    expect(formatBytes('512')).toBe('512 B');
    expect(formatBytes('1023')).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatBytes('1024')).toBe('1.0 KB');
    expect(formatBytes('2048')).toBe('2.0 KB');
    expect(formatBytes('1536')).toBe('1.5 KB');
  });

  it('formats megabytes', () => {
    expect(formatBytes('1048576')).toBe('1.0 MB');
    expect(formatBytes('10485760')).toBe('10.0 MB');
  });

  it('formats gigabytes', () => {
    expect(formatBytes('1073741824')).toBe('1.0 GB');
  });
});
