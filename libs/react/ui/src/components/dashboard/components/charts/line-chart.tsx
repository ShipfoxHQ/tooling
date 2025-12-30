import {Card, CardContent, CardHeader, CardTitle} from 'components/card';
import {EmptyState} from 'components/empty-state';
import {Text} from 'components/typography';
import type {ComponentProps} from 'react';
import {useState} from 'react';
import {
  CartesianGrid,
  type CartesianGridProps,
  Line,
  type LineProps,
  LineChart as RechartsLineChart,
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

export type RechartsLineChartProps = ComponentProps<typeof RechartsLineChart>;

export interface LineChartLine extends Omit<LineProps, 'dataKey' | 'strokeWidth'> {
  dataKey: string;
  name?: string;
  strokeWidth?: number;
  color?: ChartColor;
  hide?: boolean;
}

export interface LineChartProps {
  data: RechartsLineChartProps['data'];
  lines: LineChartLine[];
  syncId?: RechartsLineChartProps['syncId'];
  height?: number;
  xAxis?: Pick<XAxisProps, 'dataKey' | 'tickFormatter' | 'hide'>;
  yAxis?: Pick<YAxisProps, 'domain' | 'ticks' | 'hide' | 'tickFormatter'>;
  grid?: Pick<CartesianGridProps, 'vertical' | 'horizontal'>;
  tooltip?: {
    labelFormatter?: (label: string) => string;
    formatter?: (value: number) => string;
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

  const visibleLines = lines.filter((line) => !line.hide);
  const hasData = data && data.length > 0 && visibleLines.length > 0;
  const hasNonZeroData =
    hasData &&
    data.some((item) =>
      visibleLines.some((line) => {
        const value = item[line.dataKey];
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
            <RechartsLineChart
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
              {visibleLines.map((line, index) => {
                const color = getChartColor(line.color, index);
                const strokeWidth = line.strokeWidth ?? 2;
                const strokeOpacity = getHoverOpacity(hoveredDataKey, line.dataKey);

                return (
                  <Line
                    key={line.dataKey}
                    type="monotone"
                    dataKey={line.dataKey}
                    name={line.name ?? line.dataKey}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeOpacity={strokeOpacity}
                    dot={false}
                    activeDot={{
                      r: strokeWidth * 2,
                      fill: color,
                      fillOpacity: strokeOpacity,
                      stroke: 'var(--background-neutral-base)',
                      strokeWidth,
                      strokeOpacity,
                      onMouseEnter: () => setHoveredDataKey(line.dataKey),
                      onMouseLeave: () => setHoveredDataKey(undefined),
                    }}
                    onMouseEnter={() => setHoveredDataKey(line.dataKey)}
                    onMouseLeave={() => setHoveredDataKey(undefined)}
                    isAnimationActive={false}
                  />
                );
              })}
            </RechartsLineChart>
          </ResponsiveContainer>
          {isEmpty && (
            <EmptyState
              icon="lineChartLine"
              title="Nothing here yet."
              variant="compact"
              className="absolute inset-0 z-10"
            />
          )}
        </div>
        {!isEmpty && visibleLines.length > 0 && (
          <div className="flex items-center justify-center flex-wrap gap-16">
            {visibleLines.map((line, index) => {
              const color = getChartColor(line.color, index);
              return (
                <div key={line.dataKey} className="flex items-center gap-6">
                  <span className="size-8 rounded-full" style={{backgroundColor: color}} />
                  <Text size="xs" className="text-foreground-neutral-subtle">
                    {line.name ?? line.dataKey}
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
