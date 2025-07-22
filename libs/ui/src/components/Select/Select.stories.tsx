import type {Meta, StoryObj} from '@storybook/react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from './index';

const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Playground: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  ),
};
