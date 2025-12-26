import type {ComponentProps} from 'react';
import {useState} from 'react';
import {
  CartesianGrid,
  Line,
  type LineProps,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {cn} from 'utils/cn';
import {ChartTooltipContent} from './chart-tooltip';
import {type ChartColor, chartColors, chartColorsList} from './colors';

export type RechartsLineChartProps = ComponentProps<typeof RechartsLineChart>;

export interface LineChartLine extends Omit<LineProps, 'dataKey' | 'strokeWidth'> {
  dataKey: string;
  name?: string;
  strokeWidth?: number;
  color?: ChartColor;
}

export interface LineChartProps {
  data: RechartsLineChartProps['data'];
  lines: LineChartLine[];
  syncId?: RechartsLineChartProps['syncId'];
  height?: number;
  xAxis?: {
    dataKey?: string;
    tickFormatter?: (value: string) => string;
    hide?: boolean;
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
}

export function LineChart({
  data,
  lines,
  height = 200,
  xAxis,
  yAxis,
  grid,
  tooltip,
  className,
  title,
}: LineChartProps) {
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
          <RechartsLineChart data={data} margin={{top: 8, right: 8, left: -20, bottom: 0}}>
            {!xAxis?.hide && (
              <XAxis
                dataKey={xAxis?.dataKey ?? 'label'}
                axisLine={false}
                tickLine={false}
                tick={{fill: 'var(--foreground-neutral-muted)', fontSize: 12}}
                tickFormatter={xAxis?.tickFormatter}
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
            {lines.map((line, index) => {
              const defaultColor = line.color
                ? chartColors[line.color]
                : chartColorsList[index % chartColorsList.length];
              const strokeWidth = line.strokeWidth ?? 2;
              const strokeOpacity = hoveredDataKey
                ? hoveredDataKey === line.dataKey
                  ? 1
                  : 0.25
                : 1;

              const {dataKey, name, ...restLine} = line;
              return (
                <Line
                  key={dataKey}
                  type="monotone"
                  dataKey={dataKey}
                  name={name ?? dataKey}
                  stroke={defaultColor}
                  strokeWidth={strokeWidth}
                  strokeOpacity={strokeOpacity}
                  dot={false}
                  activeDot={{
                    r: strokeWidth * 2,
                    fill: defaultColor,
                    fillOpacity: strokeOpacity,
                    stroke: 'var(--background-neutral-base)',
                    strokeWidth,
                    strokeOpacity,
                    onMouseEnter: () => setHoveredDataKey(dataKey),
                    onMouseLeave: () => setHoveredDataKey(undefined),
                  }}
                  onMouseEnter={() => setHoveredDataKey(dataKey)}
                  onMouseLeave={() => setHoveredDataKey(undefined)}
                  isAnimationActive={false}
                  {...restLine}
                />
              );
            })}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      {lines.length > 0 && (
        <div className="flex items-center justify-center gap-16 mt-12">
          {lines.map((line, index) => {
            const color = line.color
              ? chartColors[line.color]
              : chartColorsList[index % chartColorsList.length];
            return (
              <div key={line.dataKey} className="flex items-center gap-6">
                <span className="size-8 rounded-full" style={{backgroundColor: color}} />
                <span className="text-xs text-foreground-neutral-subtle">
                  {line.name ?? line.dataKey}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
