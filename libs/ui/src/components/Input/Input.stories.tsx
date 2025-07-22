import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from 'components/Typography';
import {Input, type InputProps} from './Input';

const types = [
  'text',
  'email',
  'password',
  'file',
  'tel',
  'url',
  'number',
  'search',
  'date',
  'time',
  'datetime-local',
] as const;

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
  argTypes: {
    placeholder: {
      control: {type: 'text'},
    },
    type: {
      options: types,
      control: {type: 'select'},
    },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Playground: Story = {
  args: {
    placeholder: 'Enter something',
    type: 'text',
  },
};

function InputTypes({type}: {type: InputProps['type']}) {
  return (
    <div>
      <Typography variant="h3" className="mb-2">
        {type}
      </Typography>
      <div className="flex flex-row gap-4">
        <Input type={type} placeholder="Enter something" />
      </div>
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {types.map((type) => (
        <InputTypes key={type} type={type} />
      ))}
    </div>
  ),
};

export const Icon: Story = {
  render: (...args) => (
    <div className="flex flex-col gap-8">
      <Input startIcon="magnifyingGlass" {...args} />
      <Input endIcon="moon" {...args} />
      <Input startIcon="magnifyingGlass" endIcon="moon" {...args} />
    </div>
  ),
};
