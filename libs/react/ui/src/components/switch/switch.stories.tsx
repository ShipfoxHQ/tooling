import type {Meta, StoryObj} from '@storybook/react';
import {Label} from 'components/label';
import {Code, Header} from 'components/typography';
import {Switch} from './switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {control: 'boolean'},
    checked: {control: 'boolean'},
  },
  args: {
    size: 'md',
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-16">
        <Header variant="h4">Controlled Switch</Header>
        <Code variant="label" className="text-foreground-neutral-subtle">
          Use the controls below to change the switch state
        </Code>
        <Switch {...args} />
      </div>

      <div className="flex flex-col gap-32">
        <Header variant="h4">All States</Header>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <div key={size} className="flex flex-wrap gap-16">
            <Header variant="h4">Size: {size}</Header>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Off
              </Code>
              <Switch size={size} />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                On
              </Code>
              <Switch size={size} defaultChecked />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Disabled (Off)
              </Code>
              <Switch size={size} disabled />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Disabled (On)
              </Code>
              <Switch size={size} defaultChecked disabled />
            </div>
            <div className="flex flex-col gap-8">
              <Code variant="label" className="text-foreground-neutral-subtle">
                Focus
              </Code>
              <Switch size={size} className="focus" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    pseudo: {
      focusVisible: '.focus',
    },
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <div className="flex items-center gap-8">
        <Switch id="notifications" />
        <Label htmlFor="notifications">Enable notifications</Label>
      </div>
      <div className="flex items-center gap-8">
        <Switch id="dark-mode" defaultChecked />
        <Label htmlFor="dark-mode">Dark mode</Label>
      </div>
      <div className="flex items-center gap-8">
        <Switch id="disabled-switch" disabled />
        <Label htmlFor="disabled-switch" className="opacity-50">
          Disabled option
        </Label>
      </div>
    </div>
  ),
};
