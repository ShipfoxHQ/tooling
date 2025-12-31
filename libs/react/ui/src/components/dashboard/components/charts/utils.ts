import type {ChartTooltipContentProps} from './chart-tooltip';
import {type ChartColor, chartColors, chartColorsList} from './colors';

type RechartsPayloadItem = {
  name?: unknown;
  value?: unknown;
  dataKey?: unknown;
  color?: unknown;
};

export function normalizeTooltipPayload(
  payload: readonly RechartsPayloadItem[] | undefined,
  formatter?: (value: number) => string,
): ChartTooltipContentProps['payload'] {
  if (!payload) return undefined;

  return payload.map((p) => ({
    name: typeof p.name === 'string' ? p.name : String(p.name ?? ''),
    value: formatter
      ? formatter(Number(p.value))
      : typeof p.value === 'string' || typeof p.value === 'number'
        ? p.value
        : String(p.value ?? ''),
    dataKey:
      typeof p.dataKey === 'string' || typeof p.dataKey === 'number'
        ? p.dataKey
        : String(p.dataKey ?? ''),
    color: typeof p.color === 'string' ? p.color : undefined,
  }));
}

export function getChartColor(color: ChartColor | undefined, index: number): string {
  return color ? chartColors[color] : chartColorsList[index % chartColorsList.length];
}

export function getHoverOpacity(
  hoveredDataKey: string | undefined,
  currentDataKey: string,
): number {
  return hoveredDataKey ? (hoveredDataKey === currentDataKey ? 1 : 0.25) : 1;
}
