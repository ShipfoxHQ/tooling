import {Card, CardContent, CardHeader, CardTitle} from 'components/card';
import {EmptyState} from 'components/empty-state';
import {Text} from 'components/typography';
import type {ComponentProps} from 'react';
import {useState} from 'react';
import {
  Bar,
  type BarProps,
  CartesianGrid,
  type CartesianGridProps,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  type XAxisProps,
  YAxis,
  type YAxisProps,
} from 'recharts';
import {ChartTooltipContent} from './chart-tooltip';
import type {ChartColor} from './colors';
import {getChartColor, getHoverOpacity, normalizeTooltipPayload} from './utils';

export type RechartsBarChartProps = ComponentProps<typeof RechartsBarChart>;

export interface BarChartBar extends Omit<BarProps, 'dataKey'> {
  dataKey: string;
  name?: string;
  color?: ChartColor;
  hide?: boolean;
  stackId?: string;
}

export interface BarChartProps {
  data: RechartsBarChartProps['data'];
  bars: BarChartBar[];
  syncId?: RechartsBarChartProps['syncId'];
  height?: number;
  xAxis?: Pick<XAxisProps, 'dataKey' | 'tickFormatter' | 'hide' | 'interval'>;
  yAxis?: Pick<YAxisProps, 'domain' | 'ticks' | 'hide' | 'tickFormatter'>;
  grid?: Pick<CartesianGridProps, 'vertical' | 'horizontal'>;
  tooltip?: {
    labelFormatter?: (label: string) => string;
    formatter?: (value: number) => string;
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
  barRadius = [0, 0, 0, 0],
  maxBarSize = 8,
}: BarChartProps) {
  const [hoveredDataKey, setHoveredDataKey] = useState<string | undefined>(undefined);

  const visibleBars = bars.filter((bar) => !bar.hide);
  const hasData = data && data.length > 0 && visibleBars.length > 0;
  const hasNonZeroData =
    hasData &&
    data.some((item) =>
      visibleBars.some((bar) => {
        const value = item[bar.dataKey];
        return value !== undefined && value !== null && Number(value) !== 0;
      }),
    );
  const isEmpty = !hasData || !hasNonZeroData;

  return (
    <Card className={className}>
      {title && (
        <CardHeader>
          <CardTitle variant="h4">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div style={{height}} className="relative">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart
              data={isEmpty ? [] : data}
              margin={{top: 8, right: 8, left: -20, bottom: 0}}
            >
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
                  tickFormatter={yAxis?.tickFormatter}
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
                      payload={normalizeTooltipPayload(props.payload, tooltip?.formatter)}
                      hoveredDataKey={hoveredDataKey}
                      labelFormatter={tooltip?.labelFormatter}
                    />
                  );
                }}
              />
              {visibleBars.map((bar, index) => {
                const color = getChartColor(bar.color, index);
                const fillOpacity = getHoverOpacity(hoveredDataKey, bar.dataKey);

                return (
                  <Bar
                    key={bar.dataKey}
                    dataKey={bar.dataKey}
                    name={bar.name ?? bar.dataKey}
                    fill={color}
                    fillOpacity={fillOpacity}
                    radius={barRadius}
                    maxBarSize={maxBarSize}
                    onMouseEnter={() => setHoveredDataKey(bar.dataKey)}
                    onMouseLeave={() => setHoveredDataKey(undefined)}
                    isAnimationActive={false}
                    stackId={bar.stackId}
                  />
                );
              })}
            </RechartsBarChart>
          </ResponsiveContainer>
          {isEmpty && (
            <EmptyState
              icon="barChartBoxLine"
              title="Nothing here yet."
              variant="compact"
              className="absolute inset-0 z-10"
            />
          )}
        </div>
        {!isEmpty && visibleBars.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-16">
            {visibleBars.map((bar, index) => {
              const color = getChartColor(bar.color, index);
              return (
                <div key={bar.dataKey} className="flex items-center gap-6">
                  <span className="size-8 rounded-full" style={{backgroundColor: color}} />
                  <Text size="xs" className="text-foreground-neutral-subtle">
                    {bar.name ?? bar.dataKey}
                  </Text>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
