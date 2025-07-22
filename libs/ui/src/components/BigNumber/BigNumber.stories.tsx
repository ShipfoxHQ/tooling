import type {Meta, StoryObj} from '@storybook/react';
import {BigNumber} from './BigNumber';

const meta: Meta<typeof BigNumber> = {
  title: 'Molecules/BigNumber/BigNumber',
  component: BigNumber,
  argTypes: {
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

type Story = StoryObj<typeof BigNumber>;

export const Playground: Story = {
  args: {
    value: 3.2,
    format: (value) => `${value}%`,
    secondaryValue: -4.3,
    secondaryFormat: (value) => `${value} pp`,
    secondaryStatus: 'error',
  },
};
