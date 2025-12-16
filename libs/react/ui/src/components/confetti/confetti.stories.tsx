import type {Meta, StoryObj} from '@storybook/react';
import {Confetti, ConfettiButton} from './confetti';

const meta = {
  title: 'Components/Confetti',
  component: Confetti,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Confetti>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex h-400 w-600 items-center justify-center rounded-16 bg-background-subtle-base">
      <ConfettiButton>Click for Confetti!</ConfettiButton>
    </div>
  ),
};

export const WithOptions: Story = {
  render: () => (
    <div className="flex h-400 w-600 items-center justify-center rounded-16 bg-background-subtle-base">
      <ConfettiButton
        options={{
          particleCount: 150,
          spread: 60,
          colors: ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3'],
        }}
      >
        Custom Confetti Button
      </ConfettiButton>
    </div>
  ),
};
