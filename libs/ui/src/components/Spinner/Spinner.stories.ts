import type {Meta, StoryObj} from '@storybook/react';
import {Spinner} from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  tags: ['autodocs'],
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};
