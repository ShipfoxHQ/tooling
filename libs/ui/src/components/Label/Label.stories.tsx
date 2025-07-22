import type {Meta, StoryObj} from '@storybook/react';
import {Label} from './Label';

const meta: Meta<typeof Label> = {
  title: 'Atoms/Label',
  component: Label,
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Playground: Story = {
  args: {
    children: 'Accept terms and conditions',
  },
};
