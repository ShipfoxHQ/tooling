import type {Meta, StoryObj} from '@storybook/react';
import {addHours, format, getHours, setDate, setMonth, setYear, startOfDay} from 'date-fns';
import {type Series, XYChart} from './XYChart';

interface Data {
  x: number;
  y: number;
}

const basicSeries: Series[] = [
  {
    key: 'fr',
    label: 'France',
    data: [
      {x: 0, y: 12},
      {x: 20, y: 27},
      {x: 40, y: 65},
      {x: 60, y: 43},
      {x: 80, y: 76},
      {x: 100, y: 50},
    ],
  },
  {
    key: 'de',
    label: 'Germany',
    data: [
      {x: 0, y: 68},
      {x: 20, y: 55},
      {x: 40, y: 48},
      {x: 60, y: 53},
      {x: 80, y: 44},
      {x: 100, y: 37},
    ],
  },
  {
    key: 'es',
    label: 'Spain',
    data: [
      {x: 0, y: 87},
      {x: 20, y: 76},
      {x: 40, y: 85},
      {x: 60, y: 93},
      {x: 80, y: 78},
      {x: 100, y: 89},
    ],
  },
  {
    key: 'us',
    label: 'USA',
    data: [
      {x: 0, y: 43},
      {x: 20, y: 65},
      {x: 40, y: 34},
      {x: 60, y: 64},
      {x: 80, y: 42},
      {x: 100, y: 11},
    ],
    xAccessor: (data: {a: number; b: number}) => data.a,
    yAccessor: (data: {a: number; b: number}) => data.b,
  },
];

const meta: Meta<typeof XYChart> = {
  title: 'Molecules/XYChart/XYChart',
  component: XYChart,
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof XYChart>;

export const Basic: Story = {
  render: () => (
    <div style={{width: '100%', height: '500px'}}>
      <XYChart
        series={basicSeries}
        defaultXAccessor={(data: Data) => data.x}
        defaultYAccessor={(data: Data) => data.y}
        tooltipProps={{
          xLabelFormatter: (value: number) => `${value} years old`,
          yLabelFormatter: (value: number) => `${value} potatoes`,
        }}
      />
    </div>
  ),
};

const baseDate = startOfDay(setDate(setMonth(setYear(new Date(), 2024), 3), 13));

const timeSeries: Series[] = [
  {
    key: 'rb',
    label: 'Failed Ruby tests',
    color: 'pink',
    data: [
      {x: baseDate, y: 12},
      {x: addHours(baseDate, 4), y: 27},
      {x: addHours(baseDate, 8), y: 65},
      {x: addHours(baseDate, 12), y: 43},
      {x: addHours(baseDate, 16), y: 76},
      {x: addHours(baseDate, 20), y: 50},
      {x: addHours(baseDate, 24), y: 43},
      {x: addHours(baseDate, 28), y: 32},
    ],
  },
  {
    key: 'js',
    label: 'Failed JavaScript tests',
    color: 'purple',
    data: [
      {x: baseDate, y: 68},
      {x: addHours(baseDate, 4), y: 55},
      {x: addHours(baseDate, 8), y: 48},
      {x: addHours(baseDate, 12), y: 53},
      {x: addHours(baseDate, 16), y: 44},
      {x: addHours(baseDate, 20), y: 37},
      {x: addHours(baseDate, 24), y: 22},
      {x: addHours(baseDate, 28), y: 24},
    ],
  },
  {
    key: 'py',
    label: 'Failed Python tests',
    color: 'teal',
    data: [
      {x: baseDate, y: 87},
      {x: addHours(baseDate, 4), y: 76},
      {x: addHours(baseDate, 8), y: 85},
      {x: addHours(baseDate, 12), y: 93},
      {x: addHours(baseDate, 16), y: 78},
      {x: addHours(baseDate, 20), y: 89},
      {x: addHours(baseDate, 24), y: 93},
      {x: addHours(baseDate, 28), y: 77},
    ],
  },
];

export const TimeSeries: Story = {
  render: () => (
    <div style={{width: '100%', height: '500px'}}>
      <XYChart
        series={timeSeries}
        defaultXAccessor={(data: Data) => data.x}
        defaultYAccessor={(data: Data) => data.y}
        chartProps={{
          xScale: {
            type: 'time',
          },
        }}
        tooltipProps={{
          yLabelFormatter: (value: number) => `${value}%`,
        }}
      />
    </div>
  ),
};

const barSeries: Series[] = [
  {
    key: 'rb',
    type: 'bar',
    label: 'Failed Ruby tests',
    data: [
      {x: baseDate, y: 12},
      {x: addHours(baseDate, 4), y: 27},
      {x: addHours(baseDate, 8), y: 65},
      {x: addHours(baseDate, 12), y: 43},
      {x: addHours(baseDate, 16), y: 76},
      {x: addHours(baseDate, 20), y: 50},
      {x: addHours(baseDate, 24), y: 43},
      {x: addHours(baseDate, 28), y: 32},
    ],
  },
  {
    key: 'js',
    type: 'bar',
    label: 'Failed JavaScript tests',
    data: [
      {x: baseDate, y: 68},
      {x: addHours(baseDate, 4), y: 55},
      {x: addHours(baseDate, 8), y: 48},
      {x: addHours(baseDate, 12), y: 53},
      {x: addHours(baseDate, 16), y: 44},
      {x: addHours(baseDate, 20), y: 37},
      {x: addHours(baseDate, 24), y: 22},
      {x: addHours(baseDate, 28), y: 24},
    ],
  },
  {
    key: 'py',
    type: 'bar',
    label: 'Failed Python tests',
    data: [
      {x: baseDate, y: 87},
      {x: addHours(baseDate, 4), y: 76},
      {x: addHours(baseDate, 8), y: 85},
      {x: addHours(baseDate, 12), y: 93},
      {x: addHours(baseDate, 16), y: 78},
      {x: addHours(baseDate, 20), y: 89},
      {x: addHours(baseDate, 24), y: 93},
      {x: addHours(baseDate, 28), y: 77},
    ],
  },
];

export const BarChart: Story = {
  render: () => (
    <div style={{width: '100%', height: '500px'}}>
      <XYChart
        series={barSeries}
        defaultXAccessor={(data: Data) => data.x}
        defaultYAccessor={(data: Data) => data.y}
        chartProps={{
          xScale: {
            type: 'band',
          },
        }}
        tooltipProps={{
          yLabelFormatter: (value: number) => `${value}%`,
        }}
        xAxisProps={{
          tickFormat(value) {
            if (getHours(value) === 0) {
              return format(value, 'MMM dd');
            }
            return format(value, 'HH:mm');
          },
        }}
      />
    </div>
  ),
};

const barStackSeries: Series[] = [
  {
    key: 'success',
    type: 'barStack',
    label: 'Passed tests',
    color: 'green',
    data: [
      {x: baseDate, y: 12},
      {x: addHours(baseDate, 4), y: 27},
      {x: addHours(baseDate, 8), y: 65},
      {x: addHours(baseDate, 12), y: 43},
      {x: addHours(baseDate, 16), y: 76},
      {x: addHours(baseDate, 20), y: 50},
      {x: addHours(baseDate, 24), y: 43},
      {x: addHours(baseDate, 28), y: 32},
    ],
  },
  {
    key: 'skipped',
    type: 'barStack',
    label: 'Skipped tests',
    color: 'amber',
    data: [
      {x: baseDate, y: 68},
      {x: addHours(baseDate, 4), y: 55},
      {x: addHours(baseDate, 8), y: 48},
      {x: addHours(baseDate, 12), y: 53},
      {x: addHours(baseDate, 16), y: 44},
      {x: addHours(baseDate, 20), y: 37},
      {x: addHours(baseDate, 24), y: 22},
      {x: addHours(baseDate, 28), y: 24},
    ],
  },
  {
    key: 'failed',
    type: 'barStack',
    label: 'Failed tests',
    color: 'red',
    data: [
      {x: baseDate, y: 87},
      {x: addHours(baseDate, 4), y: 76},
      {x: addHours(baseDate, 8), y: 85},
      {x: addHours(baseDate, 12), y: 93},
      {x: addHours(baseDate, 16), y: 78},
      {x: addHours(baseDate, 20), y: 89},
      {x: addHours(baseDate, 24), y: 93},
      {x: addHours(baseDate, 28), y: 77},
    ],
  },
];

export const BarStackChart: Story = {
  render: () => (
    <div style={{width: '100%', height: '500px'}}>
      <XYChart
        series={barStackSeries}
        defaultXAccessor={(data: Data) => data.x}
        defaultYAccessor={(data: Data) => data.y}
        chartProps={{
          xScale: {
            type: 'band',
          },
        }}
        tooltipProps={{
          yLabelFormatter: (value: number) => `${value}%`,
        }}
        xAxisProps={{
          tickFormat(value) {
            if (getHours(value) === 0) {
              return format(value, 'MMM dd');
            }
            return format(value, 'HH:mm');
          },
        }}
      />
    </div>
  ),
};

const areaSeries: Series[] = [
  {
    key: 'failed',
    type: 'area',
    label: 'Failed tests',
    data: [
      {x: baseDate, y: 87},
      {x: addHours(baseDate, 4), y: 76},
      {x: addHours(baseDate, 8), y: 85},
      {x: addHours(baseDate, 12), y: 93},
      {x: addHours(baseDate, 16), y: 78},
      {x: addHours(baseDate, 20), y: 89},
      {x: addHours(baseDate, 24), y: 93},
      {x: addHours(baseDate, 28), y: 77},
    ],
  },
  {
    key: 'success',
    type: 'area',
    label: 'Passed tests',
    data: [
      {x: baseDate, y: 12},
      {x: addHours(baseDate, 4), y: 27},
      {x: addHours(baseDate, 8), y: 65},
      {x: addHours(baseDate, 12), y: 43},
      {x: addHours(baseDate, 16), y: 76},
      {x: addHours(baseDate, 20), y: 50},
      {x: addHours(baseDate, 24), y: 43},
      {x: addHours(baseDate, 28), y: 32},
    ],
  },
  {
    key: 'skipped',
    type: 'area',
    label: 'Skipped tests',
    data: [
      {x: baseDate, y: 68},
      {x: addHours(baseDate, 4), y: 55},
      {x: addHours(baseDate, 8), y: 48},
      {x: addHours(baseDate, 12), y: 53},
      {x: addHours(baseDate, 16), y: 44},
      {x: addHours(baseDate, 20), y: 37},
      {x: addHours(baseDate, 24), y: 22},
      {x: addHours(baseDate, 28), y: 24},
    ],
  },
];

export const AreaChart: Story = {
  render: () => (
    <div style={{width: '100%', height: '500px'}}>
      <XYChart
        series={areaSeries}
        defaultXAccessor={(data: Data) => data.x}
        defaultYAccessor={(data: Data) => data.y}
        chartProps={{
          xScale: {
            type: 'time',
          },
        }}
        tooltipProps={{
          yLabelFormatter: (value: number) => `${value}%`,
        }}
      />
    </div>
  ),
};

const areaStackSeries: Series[] = [
  {
    key: 'success',
    type: 'areaStack',
    label: 'Passed tests',
    data: [
      {x: baseDate, y: 12},
      {x: addHours(baseDate, 4), y: 27},
      {x: addHours(baseDate, 8), y: 65},
      {x: addHours(baseDate, 12), y: 43},
      {x: addHours(baseDate, 16), y: 76},
      {x: addHours(baseDate, 20), y: 50},
      {x: addHours(baseDate, 24), y: 43},
      {x: addHours(baseDate, 28), y: 32},
    ],
  },
  {
    key: 'skipped',
    type: 'areaStack',
    label: 'Skipped tests',
    data: [
      {x: baseDate, y: 68},
      {x: addHours(baseDate, 4), y: 55},
      {x: addHours(baseDate, 8), y: 48},
      {x: addHours(baseDate, 12), y: 53},
      {x: addHours(baseDate, 16), y: 44},
      {x: addHours(baseDate, 20), y: 37},
      {x: addHours(baseDate, 24), y: 22},
      {x: addHours(baseDate, 28), y: 24},
    ],
  },
  {
    key: 'failed',
    type: 'areaStack',
    label: 'Failed tests',
    data: [
      {x: baseDate, y: 87},
      {x: addHours(baseDate, 4), y: 76},
      {x: addHours(baseDate, 8), y: 85},
      {x: addHours(baseDate, 12), y: 93},
      {x: addHours(baseDate, 16), y: 78},
      {x: addHours(baseDate, 20), y: 89},
      {x: addHours(baseDate, 24), y: 93},
      {x: addHours(baseDate, 28), y: 77},
    ],
  },
];

export const AreaStackChart: Story = {
  render: () => (
    <div style={{width: '100%', height: '500px'}}>
      <XYChart
        series={areaStackSeries}
        defaultXAccessor={(data: Data) => data.x}
        defaultYAccessor={(data: Data) => data.y}
        chartProps={{
          xScale: {
            type: 'time',
          },
        }}
        tooltipProps={{
          yLabelFormatter: (value: number) => `${value}%`,
        }}
      />
    </div>
  ),
};
