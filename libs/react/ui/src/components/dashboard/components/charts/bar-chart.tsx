import type {ComponentProps} from 'react';
import {useState} from 'react';
import {
  Bar,
  type BarProps,
  CartesianGrid,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {cn} from 'utils/cn';
import {ChartTooltipContent} from './chart-tooltip';
import {type ChartColor, chartColors, chartColorsList} from './colors';

export type RechartsBarChartProps = ComponentProps<typeof RechartsBarChart>;

export interface BarChartBar extends Omit<BarProps, 'dataKey'> {
  dataKey: string;
  name?: string;
  color?: ChartColor;
}

export interface BarChartProps {
  data: RechartsBarChartProps['data'];
  bars: BarChartBar[];
  syncId?: RechartsBarChartProps['syncId'];
  height?: number;
  xAxis?: {
    dataKey?: string;
    tickFormatter?: (value: string) => string;
    hide?: boolean;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
  };
  yAxis?: {
    domain?: [number, number];
    ticks?: number[];
    hide?: boolean;
  };
  grid?: {
    vertical?: boolean;
    horizontal?: boolean;
  };
  tooltip?: {
    labelFormatter?: (label: string) => string;
  };
  className?: string;
  title?: string;
  barRadius?: [number, number, number, number];
  maxBarSize?: number;
}

export function BarChart({
  data,
  bars,
  height = 200,
  xAxis,
  yAxis,
  grid,
  tooltip,
  className,
  title,
  barRadius = [2, 2, 0, 0],
  maxBarSize = 8,
}: BarChartProps) {
  const [hoveredDataKey, setHoveredDataKey] = useState<string | undefined>(undefined);

  return (
    <div
      className={cn(
        'p-12 rounded-8 bg-background-neutral-base border border-border-neutral-base',
        className,
      )}
    >
      {title && <p className="text-sm font-medium text-foreground-neutral-base mb-12">{title}</p>}
      <div style={{height}}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{top: 8, right: 8, left: -20, bottom: 0}}>
            {!xAxis?.hide && (
              <XAxis
                dataKey={xAxis?.dataKey ?? 'label'}
                axisLine={false}
                tickLine={false}
                tick={{fill: 'var(--foreground-neutral-muted)', fontSize: 12}}
                tickFormatter={xAxis?.tickFormatter}
                interval={xAxis?.interval ?? 'preserveStartEnd'}
              />
            )}
            {!yAxis?.hide && (
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{fill: 'var(--foreground-neutral-muted)', fontSize: 12}}
                domain={yAxis?.domain}
                ticks={yAxis?.ticks}
              />
            )}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-neutral-base)"
              vertical={grid?.vertical ?? false}
              horizontal={grid?.horizontal ?? true}
            />
            <Tooltip
              cursor={{fill: 'var(--background-neutral-hover)'}}
              content={(props) => {
                if (!props.active) return null;
                return (
                  <ChartTooltipContent
                    active={props.active}
                    label={props.label}
                    payload={props.payload}
                    hoveredDataKey={hoveredDataKey}
                    labelFormatter={tooltip?.labelFormatter}
                  />
                );
              }}
            />
            {bars.map((bar, index) => {
              const defaultColor = bar.color
                ? chartColors[bar.color]
                : chartColorsList[index % chartColorsList.length];
              const fillOpacity = hoveredDataKey ? (hoveredDataKey === bar.dataKey ? 1 : 0.25) : 1;

              const {dataKey, name, ...restBar} = bar;
              return (
                <Bar
                  key={dataKey}
                  dataKey={dataKey}
                  name={name ?? dataKey}
                  fill={defaultColor}
                  fillOpacity={fillOpacity}
                  radius={barRadius}
                  maxBarSize={maxBarSize}
                  onMouseEnter={() => setHoveredDataKey(dataKey)}
                  onMouseLeave={() => setHoveredDataKey(undefined)}
                  isAnimationActive={false}
                  {...restBar}
                />
              );
            })}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
