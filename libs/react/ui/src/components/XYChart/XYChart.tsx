import {ParentSize} from '@visx/responsive';
import {Axis, XYChart as ChartPrimitive, Grid, ThemeProvider} from '@visx/xychart';
import {useChartsTheme} from 'hooks/useChartsTheme';
import type {ComponentProps, HTMLAttributes} from 'react';
import {cn, formatAxisTick} from 'utils';
import {type Series, XYChartSeries, type XYChartSeriesProps} from './XYChartSeries';
import {XYChartTooltip, type XYChartTooltipProps} from './XYChartTooltip';

export type {Series};

export type XYChartProps = HTMLAttributes<HTMLDivElement> &
  Omit<XYChartSeriesProps, 'isSeriesMuted'> & {
    chartProps?: Partial<ComponentProps<typeof ChartPrimitive>>;
    xAxisProps?: Partial<ComponentProps<typeof Axis>>;
    yAxisProps?: Partial<ComponentProps<typeof Axis>>;
    gridProps?: Partial<ComponentProps<typeof Grid>>;
    tooltipProps?: Partial<XYChartTooltipProps>;
    title?: string;
    description?: string;
    isLoading?: boolean;
  };

export function XYChart({
  series,
  xAxisProps,
  yAxisProps,
  gridProps,
  chartProps,
  tooltipProps,
  defaultXAccessor,
  defaultYAccessor,
  className,
  title,
  description,
  isLoading,
  ...props
}: XYChartProps) {
  const {theme} = useChartsTheme();
  return (
    <div className={cn('h-full w-full', className)} {...props}>
      <ThemeProvider theme={theme}>
        <ParentSize>
          {({width, height}) => (
            <ChartPrimitive
              width={width}
              height={height}
              xScale={{type: 'linear'}}
              yScale={{type: 'linear'}}
              margin={{
                top: 16,
                right: 8,
                bottom: 32,
                left: 64,
              }}
              {...chartProps}
            >
              <Axis
                orientation="bottom"
                tickFormat={formatAxisTick}
                numTicks={Math.floor(width / 100)}
                {...xAxisProps}
              />
              <Axis
                orientation="left"
                tickFormat={formatAxisTick}
                numTicks={Math.floor(height / 50)}
                {...yAxisProps}
              />
              <Grid columns={false} {...gridProps} />
              <XYChartSeries
                series={series}
                defaultXAccessor={defaultXAccessor}
                defaultYAccessor={defaultYAccessor}
              />
              <XYChartTooltip
                defaultXAccessor={defaultXAccessor}
                defaultYAccessor={defaultYAccessor}
                series={series}
                {...tooltipProps}
              />
            </ChartPrimitive>
          )}
        </ParentSize>
      </ThemeProvider>
    </div>
  );
}
