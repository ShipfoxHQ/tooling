import type {Meta, StoryObj} from '@storybook/react';
import {EmptyState} from './empty-state';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="w-400">
      <EmptyState {...args} />
    </div>
  ),
  args: {},
};

export const CustomContent: Story = {
  render: (args) => (
    <div className="w-400">
      <EmptyState {...args} />
    </div>
  ),
  args: {
    icon: 'shipfox',
    title: 'No jobs yet',
    description: 'Import past runs or start a runner.',
  },
};

export const Compact: Story = {
  render: (args) => (
    <div className="w-400 h-200 relative">
      <EmptyState {...args} />
    </div>
  ),
  args: {
    icon: 'lineChartLine',
    title: 'Nothing here yet.',
    variant: 'compact',
  },
};

export const NoDescription: Story = {
  render: (args) => (
    <div className="w-400">
      <EmptyState {...args} />
    </div>
  ),
  args: {
    title: 'No data available',
    description: undefined,
  },
};

export const NoTitle: Story = {
  render: (args) => (
    <div className="w-400">
      <EmptyState {...args} />
    </div>
  ),
  args: {
    title: undefined,
    description: 'This is a description without a title.',
  },
};
