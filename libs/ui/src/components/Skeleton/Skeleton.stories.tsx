import type {Meta, StoryObj} from '@storybook/react';
import {Skeleton} from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  argTypes: {
    className: {
      control: {type: 'text'},
    },
  },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Playground: Story = {
  args: {
    className: 'h-4 w-128',
  },
};
