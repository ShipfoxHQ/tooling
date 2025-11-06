import type {Meta, StoryObj} from '@storybook/react';
import {Checkbox} from 'components/checkbox';
import {Input} from 'components/input';
import {Textarea} from 'components/textarea';
import {Label} from './label';

const meta = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {control: 'text'},
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

export const WithCheckbox: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" placeholder="Enter your message" />
    </div>
  ),
};

export const Required: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Label htmlFor="required-field">
        Required Field <span className="text-foreground-error">*</span>
      </Label>
      <Input id="required-field" type="text" placeholder="This field is required" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Label htmlFor="disabled-field" className="opacity-50">
        Disabled Field
      </Label>
      <Input id="disabled-field" type="text" placeholder="Disabled input" disabled />
    </div>
  ),
};
