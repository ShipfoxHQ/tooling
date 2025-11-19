import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {IconButton} from './icon-button';

const variantOptions = ['primary', 'transparent'] as const;
const sizeOptions = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const;
const radiusOptions = ['rounded', 'full'] as const;

const meta = {
  title: 'Components/Button/IconButton',
  component: IconButton,
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
    radius: {
      control: 'select',
      options: radiusOptions,
    },
    muted: {control: 'boolean'},
    asChild: {control: 'boolean'},
  },
  args: {
    icon: 'addLine',
    variant: 'primary',
    size: 'md',
    radius: 'rounded',
    muted: false,
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-32">
      {sizeOptions.map((size) => (
        <div key={size} className="flex flex-col gap-16">
          <Code variant="label" className="text-foreground-neutral-subtle">
            Size: {size}
          </Code>
          {radiusOptions.map((radius) => (
            <table
              key={radius}
              className="w-fit border-separate border-spacing-x-32 border-spacing-y-16"
            >
              <thead>
                <tr>
                  <th>{radius}</th>
                  <th>Default</th>
                  <th>Hover</th>
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
                      <IconButton
                        {...args}
                        icon="addLine"
                        aria-label="Add"
                        variant={variant}
                        size={size}
                        radius={radius}
                      />
                    </td>
                    <td>
                      <IconButton
                        {...args}
                        icon="addLine"
                        aria-label="Add"
                        variant={variant}
                        className="hover"
                        size={size}
                        radius={radius}
                      />
                    </td>
                    <td>
                      <IconButton
                        {...args}
                        icon="addLine"
                        aria-label="Add"
                        variant={variant}
                        className="focus"
                        size={size}
                        radius={radius}
                      />
                    </td>
                    <td>
                      <IconButton
                        {...args}
                        icon="addLine"
                        aria-label="Add"
                        variant={variant}
                        disabled
                        size={size}
                        radius={radius}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      ))}
    </div>
  ),
};

Variants.parameters = {
  pseudo: {
    hover: '.hover',
    focusVisible: '.focus',
  },
};

export const Muted: Story = {
  render: (args) => (
    <div className="flex flex-col gap-16">
      <div className="flex gap-16 items-center">
        <Code variant="label">Normal:</Code>
        <IconButton {...args} icon="addLine" aria-label="Add" />
        <IconButton {...args} icon="addLine" aria-label="Add" variant="transparent" />
      </div>
      <div className="flex gap-16 items-center">
        <Code variant="label">Muted:</Code>
        <IconButton {...args} icon="addLine" aria-label="Add" muted />
        <IconButton {...args} icon="addLine" aria-label="Add" variant="transparent" muted />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: ({children: _children, ...args}) => (
    <div className="flex flex-col gap-16">
      <div className="flex gap-16 items-center">
        <Code variant="label">Rounded:</Code>
        {sizeOptions.map((size) => (
          <IconButton
            {...args}
            key={size}
            icon="addLine"
            aria-label="Add"
            size={size}
            radius="rounded"
          />
        ))}
      </div>
      <div className="flex gap-16 items-center">
        <Code variant="label">Full:</Code>
        {sizeOptions.map((size) => (
          <IconButton
            {...args}
            key={size}
            icon="addLine"
            aria-label="Add"
            size={size}
            radius="full"
          />
        ))}
      </div>
    </div>
  ),
};

export const Loading: Story = {
  render: ({children: _children, ...args}) => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-16">
        <Code variant="label">Loading by Size:</Code>
        <div className="flex gap-16 items-center">
          {sizeOptions.map((size) => (
            <div key={size} className="flex flex-col gap-8 items-center">
              <Code variant="label" className="text-foreground-neutral-subtle text-xs">
                {size}
              </Code>
              <IconButton {...args} icon="addLine" aria-label="Loading" size={size} isLoading />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-16">
        <Code variant="label">Loading by Variant:</Code>
        <div className="flex gap-16 items-center">
          {variantOptions.map((variant) => (
            <div key={variant} className="flex flex-col gap-8 items-center">
              <Code variant="label" className="text-foreground-neutral-subtle text-xs">
                {variant}
              </Code>
              <IconButton
                {...args}
                icon="addLine"
                aria-label="Loading"
                variant={variant}
                isLoading
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-16">
        <Code variant="label">Normal vs Loading:</Code>
        <div className="flex gap-16 items-center">
          <IconButton {...args} icon="addLine" aria-label="Add" />
          <IconButton {...args} icon="addLine" aria-label="Loading" isLoading />
        </div>
      </div>
    </div>
  ),
};
