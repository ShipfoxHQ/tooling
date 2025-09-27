import {Tooltip as TooltipPrimitive} from '@visx/xychart';
import {Typography} from 'components/Typography';
import type {ComponentProps} from 'react';
import {formatTooltipLabel, getColor} from 'utils';
import type {XYChartSeriesProps} from './XYChartSeries';
import {useSeriesData} from './hooks';

export type XYChartTooltipProps = Partial<ComponentProps<typeof TooltipPrimitive>> &
  Pick<XYChartSeriesProps, 'series' | 'defaultXAccessor' | 'defaultYAccessor'> & {
    /** As a helper for user define the unit of the data on X axis */
    // biome-ignore lint/suspicious/noExplicitAny: only compatibility method with library found
    xLabelFormatter?: (value: any, datum: any) => string;
    /** As a helper for user define the unit of the data on Y axis */
    // biome-ignore lint/suspicious/noExplicitAny: only compatibility method with library founds
    yLabelFormatter?: (value: any, datum: any) => string;
  };

export function XYChartTooltip({
  series,
  xLabelFormatter,
  yLabelFormatter,
  defaultXAccessor,
  defaultYAccessor,
  ...props
}: XYChartTooltipProps) {
  const {getSeriesByKey, getXAccessor, getYAccessor, showSeriesGlyphs, colorAccessor} =
    useSeriesData({
      series,
      defaultXAccessor,
      defaultYAccessor,
    });
  return (
    <TooltipPrimitive
      snapTooltipToDatumX
      snapTooltipToDatumY
      showSeriesGlyphs={showSeriesGlyphs}
      renderGlyph={({x, y, isNearestDatum, glyphStyle, key}) => {
        if (!isNearestDatum) return null;
        return (
          <circle
            cx={x}
            cy={y}
            r={6}
            fill={colorAccessor(key)}
            stroke={getColor('ds-gray-500')}
            strokeWidth={2}
            paintOrder="fill"
            {...glyphStyle}
          />
        );
      }}
      className="!p-0 shadow"
      // style={{backgroundColor: getColor('ds-background-100')}}
      renderTooltip={({tooltipData}) => {
        if (!tooltipData?.nearestDatum) return null;
        const seriesKey = tooltipData.nearestDatum.key;
        const xAccessor = getXAccessor(seriesKey);
        const yAccessor = getYAccessor(seriesKey);
        const series = getSeriesByKey(seriesKey);
        const seriesColor = colorAccessor(seriesKey);

        const xValue = xAccessor(tooltipData.nearestDatum.datum);
        const yValue = yAccessor(tooltipData.nearestDatum.datum);

        const yFormatter = yLabelFormatter ?? formatTooltipLabel;
        const xFormatter = xLabelFormatter ?? formatTooltipLabel;

        const mainValue = yFormatter(yValue, tooltipData.nearestDatum.datum);
        const secondaryValue = xFormatter(xValue, tooltipData.nearestDatum.datum);

        return (
          <div className="flex flex-col gap-1 rounded-xs border border-border bg-background-secondary p-1 shadow-md">
            <Typography variant="small" className="text-text-secondary">
              {secondaryValue}
            </Typography>
            <div className="h-px w-full bg-border" />
            <Typography variant="large" className="text-text">
              {mainValue}
            </Typography>
            <div className="flex flex-row items-center gap-1">
              <div className="h-2 w-2 rounded-xs" style={{backgroundColor: seriesColor}} />
              {series.label ? (
                <Typography variant="small" className="text-text-secondary">
                  {series.label}
                </Typography>
              ) : null}
            </div>
          </div>
        );
      }}
      {...props}
    />
  );
}
