import type {Meta, StoryObj} from '@storybook/react';
import {Code, Header} from 'components/typography';
import {Textarea} from './textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: {control: 'text'},
    disabled: {control: 'boolean'},
    'aria-invalid': {control: 'boolean'},
    rows: {control: 'number'},
    cols: {control: 'number'},
  },
  args: {
    placeholder: 'Type something…',
    disabled: false,
    'aria-invalid': false,
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

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

              <Textarea {...args} variant={variant} size={size} />
            </div>

            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Hover
              </Code>

              <Textarea {...args} className="hover" variant={variant} size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Active
              </Code>

              <Textarea
                {...args}
                className="active"
                defaultValue="The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog."
                variant={variant}
                size={size}
              />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Focus
              </Code>

              <Textarea {...args} className="focus" variant={variant} size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Disabled
              </Code>

              <Textarea {...args} disabled variant={variant} size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Invalid
              </Code>

              <Textarea {...args} aria-invalid variant={variant} size={size} />
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

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Rows: 2
        </Code>
        <Textarea {...args} rows={2} />
      </div>
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Rows: 4 (default)
        </Code>
        <Textarea {...args} rows={4} />
      </div>
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Rows: 6
        </Code>
        <Textarea {...args} rows={6} />
      </div>
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Rows: 10
        </Code>
        <Textarea {...args} rows={10} />
      </div>
    </div>
  ),
};

export const DesignMock: Story = {
  render: () => {
    const variants = [
      {key: 'base', label: 'Primary'},
      {key: 'component', label: 'Secondary'},
    ] as const;
    const states = [
      {name: 'Default', props: {}},
      {name: 'Hover', props: {className: 'hover'}},
      {name: 'Focus', props: {className: 'focus'}},
      {name: 'Filled', props: {defaultValue: 'Placeholder'}},
      {name: 'Filled Hover', props: {defaultValue: 'Placeholder', className: 'hover'}},
      {name: 'Disabled', props: {disabled: true}},
      {name: 'Error', props: {'aria-invalid': true}},
    ] as const;

    return (
      <div className="flex flex-col gap-32 pb-64 pt-32 px-32">
        <Header variant="h3" className="text-foreground-neutral-subtle">
          TEXT AREA
        </Header>
        <div className="flex flex-row gap-32">
          {variants.map((variant) => (
            <div key={variant.key} className="flex flex-col gap-32">
              {states.map((state) => (
                <div key={state.name} className="flex flex-col gap-8">
                  <Code variant="label" className="text-foreground-neutral-subtle">
                    Size=Base (32), State={state.name}, Color={variant.label}
                  </Code>
                  <div className="w-[280px]">
                    <Textarea
                      placeholder="Placeholder"
                      variant={variant.key}
                      size="base"
                      rows={2}
                      {...state.props}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  },
};

DesignMock.parameters = {
  pseudo: {
    hover: '.hover',
    focusVisible: '.focus',
  },
};

