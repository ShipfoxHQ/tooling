import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from 'components/Typography';
import {Button, type ButtonProps} from './Button';

const variants = ['primary', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
const sizes = ['default', 'sm', 'lg', 'icon'] as const;

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      options: variants,
      control: {type: 'select'},
    },
    size: {
      options: sizes,
      control: {type: 'radio'},
    },
    disabled: {
      type: 'boolean',
    },
    loading: {
      type: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Playground: Story = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'default',
    disabled: false,
    loading: false,
  },
};

function ButtonVariant({variant}: {variant: ButtonProps['variant']}) {
  return (
    <div>
      <Typography variant="h3" className="mb-2">
        {variant}
      </Typography>
      <div className="flex flex-row gap-4">
        {sizes.map((size) => (
          <Button key={`${variant}_${size}`} variant={variant} size={size}>
            Click me
          </Button>
        ))}
      </div>
    </div>
  );
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {variants.map((variant) => (
        <ButtonVariant key={variant} variant={variant} />
      ))}
    </div>
  ),
};
