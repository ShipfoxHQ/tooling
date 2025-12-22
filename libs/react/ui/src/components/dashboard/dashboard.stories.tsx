import type {Meta, StoryObj} from '@storybook/react';
import {Dashboard} from './dashboard';

const meta = {
  title: 'Dashboard/Example',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="h-screen w-full">
      <Dashboard />
    </div>
  ),
};
