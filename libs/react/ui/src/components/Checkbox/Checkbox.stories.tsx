import type {Meta, StoryObj} from '@storybook/react';
import {Checkbox} from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  argTypes: {
    disabled: {
      type: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Playground: Story = {
  args: {
    disabled: false,
  },
};
