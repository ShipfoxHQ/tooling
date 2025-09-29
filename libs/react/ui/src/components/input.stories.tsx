import type {Meta, StoryObj} from '@storybook/react';
import {Code, Header} from 'components/typography';
import {Input} from './input';

const typeOptions = [
  'text',
  'email',
  'password',
  'number',
  'search',
  'url',
  'tel',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
  'color',
  'file',
] as const;

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: typeOptions,
    },
    placeholder: {control: 'text'},
    disabled: {control: 'boolean'},
    'aria-invalid': {control: 'boolean'},
  },
  args: {
    type: 'text',
    placeholder: 'Type something…',
    disabled: false,
    'aria-invalid': false,
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const variants = ['base', 'component'] as const;
const sizes = ['base', 'small'] as const;

export const States: Story = {
  render: (args) => (
    <div className="flex flex-col gap-32">
      {variants.map((variant) =>
        sizes.map((size) => (
          <div key={variant + size} className="flex flex-col gap-16">
            <Header variant="h3">
              {variant} {size}
            </Header>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Default
              </Code>

              <Input {...args} variant={variant} size={size} />
            </div>

            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Hover
              </Code>

              <Input {...args} className="hover" variant={variant} size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Active
              </Code>

              <Input
                {...args}
                className="active"
                defaultValue="The quick brown fox jumps over the lazy dog"
                variant={variant}
                size={size}
              />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Focus
              </Code>

              <Input {...args} className="focus" variant={variant} size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Disabled
              </Code>

              <Input {...args} disabled variant={variant} size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Invalid
              </Code>

              <Input {...args} aria-invalid variant={variant} size={size} />
            </div>
          </div>
        )),
      )}
    </div>
  ),
};

States.parameters = {
  pseudo: {
    hover: '.hover',
    active: '.active',
    focusVisible: '.focus',
  },
};

export const Types: Story = {
  render: (args) => (
    <div className="flex flex-col gap-32">
      {typeOptions.map((t) => (
        <div key={t} className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-subtle">
            {t}
          </Code>
          <Input {...args} type={t} />
        </div>
      ))}
    </div>
  ),
};
