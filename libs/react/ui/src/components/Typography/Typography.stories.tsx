import type {Meta, StoryObj} from '@storybook/react';
import {Typography, type TypographyProps} from './Typography';

const variants = [
  'text',
  'h4',
  'h3',
  'h2',
  'h1',
  'small',
  'large',
  'muted',
  'lead',
  'quote',
  'code',
] as const;

const meta: Meta<typeof Typography> = {
  title: 'Atoms/Typography',
  component: Typography,
  argTypes: {
    variant: {
      options: variants,
      control: {type: 'select'},
    },
    as: {
      control: {type: 'text'},
    },
  },
};
export default meta;

type Story = StoryObj<typeof Typography>;

export const Playground: Story = {
  args: {
    variant: 'text',
    children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  },
};

function TypographyVariants({variant}: {variant: TypographyProps['variant']}) {
  return (
    <div>
      <Typography variant="h3" className="mb-2">
        {variant}
      </Typography>
      <Typography key={variant} variant={variant}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit
      </Typography>
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {variants.map((variant) => (
        <TypographyVariants key={variant} variant={variant} />
      ))}
    </div>
  ),
};
