import {describe, expect, it} from '@shipfox/vitest/vi';
import {formatDuration} from './duration';

describe('formatDuration', () => {
  it('returns a ns precision string', () => {
    expect(formatDuration({nanoseconds: 100})).toBe('100 ns');
  });

  it('returns a μs precision string', () => {
    expect(formatDuration({nanoseconds: 31000})).toBe('31 μs');
    expect(formatDuration({microseconds: 31})).toBe('31 μs');
  });

  it('returns a ms precision string', () => {
    expect(formatDuration({nanoseconds: 567000000})).toBe('567 ms');
    expect(formatDuration({milliseconds: 567})).toBe('567 ms');
  });

  it('returns a s precision string', () => {
    expect(formatDuration({nanoseconds: 43000000000})).toBe('43 s');
    expect(formatDuration({seconds: 43})).toBe('43 s');
  });

  it('returns a min precision string', () => {
    expect(formatDuration({nanoseconds: 180000000000})).toBe('3 min');
    expect(formatDuration({minutes: 3})).toBe('3 min');
  });

  it('returns a h precision string', () => {
    expect(formatDuration({nanoseconds: 3600000000000})).toBe('1 h');
    expect(formatDuration({hours: 1})).toBe('1 h');
  });

  it('returns a d precision string', () => {
    expect(formatDuration({nanoseconds: 86400000000000})).toBe('1 d');
    expect(formatDuration({days: 1})).toBe('1 d');
  });

  it('returns a w precision string', () => {
    expect(formatDuration({nanoseconds: 604800000000000})).toBe('1 w');
    expect(formatDuration({weeks: 1})).toBe('1 w');
  });

  it('returns a mo precision string', () => {
    expect(formatDuration({nanoseconds: 2592000000000000})).toBe('1 mo');
    expect(formatDuration({months: 1})).toBe('1 mo');
  });

  it('returns a y precision string', () => {
    expect(formatDuration({nanoseconds: 31536000000000000})).toBe('1 y');
    expect(formatDuration({years: 1})).toBe('1 y');
  });

  it('rounds to one digit', () => {
    expect(formatDuration({nanoseconds: 31567})).toBe('31.6 μs');
    expect(formatDuration({microseconds: 31, nanoseconds: 567})).toBe('31.6 μs');
  });
});
