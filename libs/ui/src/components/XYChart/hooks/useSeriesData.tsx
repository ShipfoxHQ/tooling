import {scaleOrdinal} from '@visx/scale';
import {ThemeContext, TooltipContext} from '@visx/xychart';
import chroma from 'chroma-js';
import {useCallback, useContext, useMemo} from 'react';
import {getColor} from 'utils';
import type {Series} from '../XYChart';

// biome-ignore lint/suspicious/noExplicitAny: only compatibility method with library
export type DefaultAccessor = (data: any) => number | Date;

export function useSeriesData({
  series,
  defaultXAccessor,
  defaultYAccessor,
}: {
  series: Series[];
  defaultXAccessor?: DefaultAccessor;
  defaultYAccessor?: DefaultAccessor;
}) {
  const theme = useContext(ThemeContext);
  const tooltipContext = useContext(TooltipContext);

  const seriesKeys = series.map((item) => item.key);
  const colorScale = useMemo(
    () =>
      scaleOrdinal({
        domain: seriesKeys,
        range: theme.colors,
      }),
    [seriesKeys, theme.colors],
  );

  const getSeriesByKey = useCallback(
    (key: string) => {
      const seriesConfig = series.find((item) => item.key === key);
      if (!seriesConfig) throw new Error(`Can not find configuration for series ${key}`);
      return seriesConfig;
    },
    [series],
  );

  const getXAccessor = useCallback(
    (key: string) => {
      const seriesConfig = getSeriesByKey(key);
      const xAccessor = seriesConfig.xAccessor ?? defaultXAccessor;
      if (!xAccessor)
        throw new Error(
          'Chart is missing xAccessor. It should be defined at the chart or series level',
        );
      return xAccessor;
    },
    [getSeriesByKey, defaultXAccessor],
  );

  const getYAccessor = useCallback(
    (key: string) => {
      const seriesConfig = getSeriesByKey(key);
      const yAccessor = seriesConfig.yAccessor ?? defaultYAccessor;
      if (!yAccessor)
        throw new Error(
          'Chart is missing yAccessor. It should be defined at the chart or series level',
        );
      return yAccessor;
    },
    [getSeriesByKey, defaultYAccessor],
  );

  const isSeriesMuted = useCallback(
    (key: string, index?: number) => {
      if (!tooltipContext) return false;
      const {tooltipOpen, tooltipData} = tooltipContext;
      if (!tooltipOpen || !tooltipData) return false;
      if (!tooltipData.nearestDatum) return false;
      const isSeries = key === tooltipData.nearestDatum.key;
      if (typeof index !== 'number') return !isSeries;
      const isIndex = index === tooltipData.nearestDatum.index;
      return !isSeries || !isIndex;
    },
    [tooltipContext],
  );

  const colorAccessor = useCallback(
    (key: string, index?: number) => {
      const item = getSeriesByKey(key);
      const colorStr = item.color ? getColor(`ds-${item.color}-800`) : colorScale(key);
      let color = chroma(colorStr);
      const muted = isSeriesMuted(key, index);
      if (muted) color = color.alpha(0.5);
      return color.hex();
    },
    [colorScale, isSeriesMuted, getSeriesByKey],
  );

  const surfaceColorAccessor = useCallback(
    (key: string) => {
      const item = getSeriesByKey(key);
      const colorStr = item.color ? getColor(item.color) : colorScale(key);
      let color = chroma(colorStr).alpha(0.75);
      const muted = isSeriesMuted(key);
      if (muted) color = color.alpha(0.25);
      return color.hex();
    },
    [colorScale, isSeriesMuted, getSeriesByKey],
  );

  const showSeriesGlyphs = useMemo(() => series.every((item) => item.type !== 'bar'), [series]);

  return {
    getXAccessor,
    getYAccessor,
    getSeriesByKey,
    colorAccessor,
    surfaceColorAccessor,
    showSeriesGlyphs,
    isSeriesMuted,
  };
}
