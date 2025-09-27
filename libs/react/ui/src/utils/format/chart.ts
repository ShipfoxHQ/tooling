import {formatDateTime, formatTimeSeriesTick} from './date';
import {formatNumber, formatNumberCompact} from './number';

export function formatAxisTick(value: unknown) {
  if (value instanceof Date) return formatTimeSeriesTick(value);
  if (typeof value !== 'number')
    throw new Error(`Expecting value to be a number, got ${typeof value}`);
  return formatNumberCompact(value);
}

export function formatTooltipLabel(value: unknown) {
  if (value instanceof Date) return formatDateTime(value);
  if (typeof value !== 'number')
    throw new Error(`Expecting value to be a number, got ${typeof value}`);
  return formatNumber(value);
}
