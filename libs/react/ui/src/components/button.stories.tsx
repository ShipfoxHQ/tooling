import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {Button} from './button';

const variantOptions = [
  'primary',
  'secondary',
  'danger',
  'transparent',
  'transparentMuted',
] as const;
const sizeOptions = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: variantOptions,
    },
    size: {
      control: 'select',
      options: sizeOptions,
    },
    asChild: {control: 'boolean'},
  },
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'md',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-16">
      {variantOptions.map((variant) => (
        <div key={variant}>
          <Code variant="label" className="text-foreground-neutral-subtle">
            {variant}
          </Code>
          <Button {...args} variant={variant}>
            Click me
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-16">
      {variantOptions.map((variant) => (
        <div key={variant}>
          <Code variant="label" className="text-foreground-neutral-subtle">
            {variant}
          </Code>
          <Button {...args} variant={variant} disabled>
            Click me
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-16">
      {sizeOptions.map((size) => (
        <div key={size}>
          <Code variant="label" className="text-foreground-neutral-subtle">
            {size}
          </Code>
          <Button {...args} size={size}>
            Click me
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Icons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-16">
      <div>
        <Button {...args} iconLeft="google">
          Click me
        </Button>
      </div>
      <div>
        <Button {...args} iconRight="microsoft">
          Click me
        </Button>
      </div>
      <div>
        <Button {...args} iconLeft="google" iconRight="microsoft">
          Click me
        </Button>
      </div>
    </div>
  ),
};
