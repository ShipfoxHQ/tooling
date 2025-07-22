import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from 'components/Typography';
import {Badge} from './Badge';

const variants = [
  'gray',
  'blue',
  'purple',
  'amber',
  'red',
  'pink',
  'green',
  'teal',
  'inverted',
  'gray-subtle',
  'blue-subtle',
  'purple-subtle',
  'amber-subtle',
  'red-subtle',
  'pink-subtle',
  'green-subtle',
  'teal-subtle',
] as const;

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  argTypes: {
    variant: {
      options: variants,
      control: {type: 'select'},
    },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {
  args: {
    children: '2d',
    variant: 'gray',
  },
};

export const Variants: Story = {
  args: {
    children: '2d',
  },
  render: ({variant: _, ...args}) => (
    <div className="mb-8">
      {variants.map((variant) => (
        <>
          <Typography key={variant} variant="h3" className="mb-2">
            {variant}
          </Typography>
          <Badge key={variant} variant={variant} {...args} />
        </>
      ))}
    </div>
  ),
};
