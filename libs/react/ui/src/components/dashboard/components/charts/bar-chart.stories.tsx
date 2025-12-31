import type {Meta, StoryObj} from '@storybook/react';
import {BarChart, type BarChartProps} from './bar-chart';

const meta = {
  title: 'Components/Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  {label: 'Jan', value1: 100, value2: 80, value3: 120},
  {label: 'Feb', value1: 150, value2: 130, value3: 140},
  {label: 'Mar', value1: 200, value2: 180, value3: 160},
  {label: 'Apr', value1: 180, value2: 200, value3: 180},
  {label: 'May', value1: 250, value2: 220, value3: 200},
  {label: 'Jun', value1: 300, value2: 280, value3: 240},
];

export const Default: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [
      {dataKey: 'value1', name: 'Series 1'},
      {dataKey: 'value2', name: 'Series 2'},
      {dataKey: 'value3', name: 'Series 3'},
    ],
    height: 200,
  } satisfies BarChartProps,
};

export const WithTitle: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [
      {dataKey: 'value1', name: 'Revenue'},
      {dataKey: 'value2', name: 'Expenses'},
    ],
    height: 200,
    title: 'Monthly Comparison',
  } satisfies BarChartProps,
};

export const SingleBar: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [{dataKey: 'value1', name: 'Total Sales'}],
    height: 200,
    title: 'Sales Over Time',
  } satisfies BarChartProps,
};

export const CustomColors: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [
      {dataKey: 'value1', name: 'Blue Series', color: 'blue'},
      {dataKey: 'value2', name: 'Green Series', color: 'green'},
      {dataKey: 'value3', name: 'Orange Series', color: 'orange'},
    ],
    height: 200,
    title: 'Custom Colored Bars',
  } satisfies BarChartProps,
};

export const StackedBars: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [
      {dataKey: 'value1', name: 'Series 1', stackId: 'stack'},
      {dataKey: 'value2', name: 'Series 2', stackId: 'stack'},
      {dataKey: 'value3', name: 'Series 3', stackId: 'stack'},
    ],
    height: 200,
    title: 'Stacked Bars',
  } satisfies BarChartProps,
};

export const RoundedBars: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [
      {dataKey: 'value1', name: 'Series 1'},
      {dataKey: 'value2', name: 'Series 2'},
    ],
    height: 200,
    barRadius: [4, 4, 0, 0],
    title: 'Rounded Top Corners',
  } satisfies BarChartProps,
};

export const HiddenBars: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [
      {dataKey: 'value1', name: 'Visible Series'},
      {dataKey: 'value2', name: 'Hidden Series', hide: true},
      {dataKey: 'value3', name: 'Another Visible Series'},
    ],
    height: 200,
    title: 'With Hidden Bars',
  } satisfies BarChartProps,
};

export const CustomFormatter: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: sampleData,
    bars: [
      {dataKey: 'value1', name: 'Sales'},
      {dataKey: 'value2', name: 'Profit'},
    ],
    height: 200,
    tooltip: {
      formatter: (value) => `$${value.toLocaleString()}`,
      labelFormatter: (label) => `Month: ${label}`,
    },
    yAxis: {
      tickFormatter: (value) => `$${value}`,
    },
    title: 'Formatted Values',
  } satisfies BarChartProps,
};

export const EmptyState: Story = {
  render: (args) => (
    <div className="w-400">
      <BarChart {...args} />
    </div>
  ),
  args: {
    data: [],
    bars: [{dataKey: 'value1', name: 'Series 1'}],
    height: 200,
    title: 'Duration distribution',
  } satisfies BarChartProps,
};
