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
    <div className="flex flex-col gap-32">
      {sizeOptions.map((size) => (
        <table key={size} className="w-fit border-separate border-spacing-x-32 border-spacing-y-16">
          <thead>
            <tr>
              <th>{size}</th>
              <th>Default</th>
              <th>Hover</th>
              <th>Active</th>
              <th>Focus</th>
              <th>Disabled</th>
            </tr>
          </thead>
          <tbody>
            {variantOptions.map((variant) => (
              <tr key={variant}>
                <td>
                  <Code variant="label" className="text-foreground-neutral-subtle">
                    {variant}
                  </Code>
                </td>
                <td>
                  <Button {...args} variant={variant} size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} className="hover" size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} className="active" size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} className="focus" size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} disabled size={size}>
                    Click me
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  ),
};

Variants.parameters = {
  pseudo: {
    hover: '.hover',
    active: '.active',
    focusVisible: '.focus',
  },
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
