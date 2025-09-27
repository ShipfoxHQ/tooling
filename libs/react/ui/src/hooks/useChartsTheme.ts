import {buildChartTheme} from '@visx/xychart';
import {useTheme} from 'hooks/useTheme';
import {useMemo} from 'react';
import {getColor} from 'utils';

export function useChartsTheme() {
  const {theme: mainTheme} = useTheme();

  // biome-ignore lint/correctness/useExhaustiveDependencies: must refresh on main theme change
  const theme = useMemo(
    () =>
      buildChartTheme({
        backgroundColor: getColor('ds-background-100'),
        colors: [
          getColor('ds-blue-800'),
          getColor('ds-amber-800'),
          getColor('ds-purple-800'),
          getColor('ds-green-800'),
          getColor('ds-pink-800'),
          getColor('ds-teal-800'),
          getColor('ds-pink-800'),
        ],
        gridColor: getColor('ds-gray-200'),
        gridColorDark: '',
        tickLength: 4,
        xAxisLineStyles: {
          stroke: getColor('ds-gray-400'),
        },
        xTickLineStyles: {
          stroke: getColor('ds-gray-400'),
        },
        yAxisLineStyles: {
          width: 0,
        },
        yTickLineStyles: {
          width: 0,
        },
        svgLabelBig: {
          stroke: getColor('ds-gray-900'),
        },
        svgLabelSmall: {
          stroke: getColor('ds-gray-900'),
        },
      }),
    [mainTheme],
  );
  return {theme};
}
