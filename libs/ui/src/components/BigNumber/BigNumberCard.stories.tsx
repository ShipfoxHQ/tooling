import type {Meta, StoryObj} from '@storybook/react';
import {BigNumberCard} from './BigNumberCard';

const meta: Meta<typeof BigNumberCard> = {
  title: 'Molecules/BigNumber/BigNumberCard',
  component: BigNumberCard,
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
    value: {
      control: {type: 'number'},
    },
    status: {
      control: {type: 'radio'},
      options: ['success', 'warning', 'error', undefined],
    },
    secondaryValue: {
      control: {type: 'number'},
    },
    secondaryStatus: {
      control: {type: 'radio'},
      options: ['success', 'warning', 'error', undefined],
    },
  },
};
export default meta;

type Story = StoryObj<typeof BigNumberCard>;

export const Playground: Story = {
  args: {
    title: 'Some numbers',
    description: 'These numbers are very important',
    isLoading: false,
    value: 3.2,
    format: (value) => `${value}%`,
    secondaryValue: -4.3,
    secondaryFormat: (value) => `${value} pp`,
    secondaryStatus: 'error',
  },
};
