import type {Meta, StoryObj} from '@storybook/react';
import type {Series} from './XYChart';
import {XYChartCard} from './XYChartCard';

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
      {a: 0, b: 43},
      {a: 20, b: 65},
      {a: 40, b: 34},
      {a: 60, b: 64},
      {a: 80, b: 42},
      {a: 100, b: 11},
    ],
    xAccessor: (data: {a: number; b: number}) => data.a,
    yAccessor: (data: {a: number; b: number}) => data.b,
  },
];

const meta: Meta<typeof XYChartCard> = {
  title: 'Molecules/XYChart/XYChartCard',
  component: XYChartCard,
  argTypes: {
    title: {
      control: {type: 'text'},
    },
    description: {
      control: {type: 'text'},
    },
    isLoading: {
      type: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof XYChartCard>;

export const Basic: Story = {
  args: {
    title: 'Serious chart',
    description: 'Look at these curves',
    isLoading: false,
  },
  render: (args) => (
    <div style={{width: '100%', height: '500px'}}>
      <XYChartCard
        {...args}
        series={basicSeries}
        defaultXAccessor={(data: Data) => data.x}
        defaultYAccessor={(data: Data) => data.y}
        tooltipProps={{
          yLabelFormatter: (value: number) => `${value} potatoes`,
          xLabelFormatter: (value: number) => `${value} years old`,
        }}
      />
    </div>
  ),
};
