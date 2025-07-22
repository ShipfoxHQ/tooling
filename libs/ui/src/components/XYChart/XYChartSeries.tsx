import {AreaSeries, AreaStack, BarGroup, BarSeries, BarStack, LineSeries} from '@visx/xychart';
import type {ComponentProps} from 'react';
import {type DefaultAccessor, useSeriesData} from './hooks';

export type SeriesType = 'line' | 'bar' | 'barStack' | 'area' | 'areaStack';

type SeriesOmitted = 'key' | 'dataKey' | 'xAccessor' | 'yAccessor';

type LineSeriesProps = Omit<ComponentProps<typeof LineSeries>, SeriesOmitted> & {
  type?: 'line';
};

type BarSeriesProps = Omit<ComponentProps<typeof BarSeries>, SeriesOmitted> & {
  type: 'bar' | 'barStack';
};

type AreaSeriesProps = Omit<ComponentProps<typeof AreaSeries>, SeriesOmitted> & {
  type: 'area' | 'areaStack';
};

export type Series = (LineSeriesProps | BarSeriesProps | AreaSeriesProps) & {
  label?: string;
  xAccessor?: DefaultAccessor;
  yAccessor?: DefaultAccessor;
  key: string;
  color?: 'gray' | 'blue' | 'purple' | 'amber' | 'red' | 'pink' | 'green' | 'teal' | 'gray-alpha';
};

export type XYChartSeriesProps = {
  series: Series[];
  /** Default xAccessor for Data */
  defaultXAccessor?: DefaultAccessor;
  /** Default yAccessor for Data */
  defaultYAccessor?: DefaultAccessor;
};

export function XYChartSeries({series, defaultXAccessor, defaultYAccessor}: XYChartSeriesProps) {
  const {getXAccessor, getYAccessor, colorAccessor, surfaceColorAccessor} = useSeriesData({
    series,
    defaultXAccessor,
    defaultYAccessor,
  });

  const seriesMap = series.reduce(
    (acc, item) => {
      const type = item.type || 'line';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    },
    {} as Record<SeriesType, Series[]>,
  );

  return (
    <>
      {seriesMap.area?.map((item) => {
        if (item.type !== 'area') throw new Error(`Series "type" must be "area" [${item.type}]`);
        const {data, key, type, ...props} = item;
        return (
          <AreaSeries
            key={key}
            dataKey={key}
            data={data}
            xAccessor={getXAccessor(key)}
            yAccessor={getYAccessor(key)}
            fill={surfaceColorAccessor(key)}
            stroke={colorAccessor(key)}
            {...props}
          />
        );
      })}

      {seriesMap.areaStack && (
        <AreaStack>
          {seriesMap.areaStack.map((item) => {
            if (item.type !== 'areaStack')
              throw new Error(`Series "type" must be "areaStack" [${item.type}]`);
            const {data, key, type, ...props} = item;
            return (
              <AreaSeries
                key={key}
                dataKey={key}
                data={data}
                xAccessor={getXAccessor(key)}
                yAccessor={getYAccessor(key)}
                fill={surfaceColorAccessor(key)}
                stroke={colorAccessor(key)}
                {...props}
              />
            );
          })}
        </AreaStack>
      )}

      {seriesMap.barStack && (
        <BarStack>
          {seriesMap.barStack.map((item) => {
            if (item.type !== 'barStack')
              throw new Error(`Series "type" must be "barStack" [${item.type}]`);
            const {data, key, type, ...props} = item;
            return (
              <BarSeries
                key={key}
                dataKey={key}
                data={data}
                xAccessor={getXAccessor(key)}
                yAccessor={getYAccessor(key)}
                colorAccessor={(_, i) => colorAccessor(key, i)}
                {...props}
              />
            );
          })}
        </BarStack>
      )}

      {seriesMap.bar && (
        <BarGroup>
          {seriesMap.bar.map((item) => {
            if (item.type !== 'bar') throw new Error(`Series "type" must be "bar" [${item.type}]`);
            const {data, key, type, ...props} = item;
            return (
              <BarSeries
                key={key}
                dataKey={key}
                data={data}
                xAccessor={getXAccessor(key)}
                yAccessor={getYAccessor(key)}
                colorAccessor={(_, i) => colorAccessor(key, i)}
                {...props}
              />
            );
          })}
        </BarGroup>
      )}

      {seriesMap.line?.map((item) => {
        if (item.type !== 'line' && item.type)
          throw new Error(`Series "type" must be "line" [${item.type}]`);
        const {data, key, type, ...props} = item;
        return (
          <LineSeries
            key={key}
            dataKey={key}
            data={data}
            xAccessor={getXAccessor(key)}
            yAccessor={getYAccessor(key)}
            colorAccessor={() => colorAccessor(key)}
            {...props}
          />
        );
      })}
    </>
  );
}
