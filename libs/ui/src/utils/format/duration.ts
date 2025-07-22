import type {Duration as BaseDuration} from 'date-fns';
import {formatNumber} from './number';

export interface Duration extends BaseDuration {
  milliseconds?: number | bigint;
  microseconds?: number | bigint;
  nanoseconds?: number | bigint;
}

interface Unit {
  key: keyof Duration;
  symbol: string;
  ns: number;
}

const units: Unit[] = [
  {
    key: 'years',
    symbol: 'y',
    ns: 365 * 24 * 60 * 60 * 1000 * 1000 * 1000,
  },
  {
    key: 'months',
    symbol: 'mo',
    ns: 30 * 24 * 60 * 60 * 1000 * 1000 * 1000,
  },
  {
    key: 'weeks',
    symbol: 'w',
    ns: 7 * 24 * 60 * 60 * 1000 * 1000 * 1000,
  },
  {
    key: 'days',
    symbol: 'd',
    ns: 24 * 60 * 60 * 1000 * 1000 * 1000,
  },
  {
    key: 'hours',
    symbol: 'h',
    ns: 60 * 60 * 1000 * 1000 * 1000,
  },
  {
    key: 'minutes',
    symbol: 'min',
    ns: 60 * 1000 * 1000 * 1000,
  },
  {
    key: 'seconds',
    symbol: 's',
    ns: 1000 * 1000 * 1000,
  },
  {
    key: 'milliseconds',
    symbol: 'ms',
    ns: 1000 * 1000,
  },
  {
    key: 'microseconds',
    symbol: 'μs',
    ns: 1000,
  },
  {
    key: 'nanoseconds',
    symbol: 'ns',
    ns: 1,
  },
];

/** Format a duration in nanoseconds to a human readable string */
export function formatDuration(duration: Duration): string {
  const nanoseconds = Object.entries(duration).reduce((acc, [key, value]) => {
    const unit = units.find((u) => u.key === key);
    if (!unit) throw new Error(`Received unknown duration unit: ${key}`);
    return acc + Number(value) * unit.ns;
  }, 0);

  for (const unit of units) {
    const value = nanoseconds / unit.ns;
    if (value >= 1) return `${formatNumber(value, {maximumFractionDigits: 1})} ${unit.symbol}`;
  }
  return `${formatNumber(nanoseconds, {maximumFractionDigits: 1})} ns`;
}
