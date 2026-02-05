import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {useState} from 'react';
import {Slider} from './slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    min: {control: 'number'},
    max: {control: 'number'},
    step: {control: 'number'},
    disabled: {control: 'boolean'},
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
  },
} satisfies Meta<typeof Slider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
  },
  render: (args) => (
    <div className="w-full max-w-xs">
      <Slider {...args} />
    </div>
  ),
};

export const SliderRange: Story = {
  render: (args) => (
    <div className="w-full max-w-xs">
      <Slider defaultValue={[25, 50]} max={100} step={5} {...args} />
    </div>
  ),
};

export const Controlled: Story = {
  render: function ControlledSlider(args) {
    const [value, setValue] = useState([50]);
    return (
      <div className="flex flex-col gap-16 w-full max-w-xs">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Value: {value[0]}
        </Code>
        <Slider value={value} onValueChange={setValue} max={100} step={1} {...args} />
      </div>
    );
  },
};

export const ControlledRange: Story = {
  render: function ControlledRangeSlider(args) {
    const [value, setValue] = useState([25, 75]);
    return (
      <div className="flex flex-col gap-16 w-full max-w-xs">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Range: [{value[0]}, {value[1]}]
        </Code>
        <Slider value={value} onValueChange={setValue} max={100} step={5} {...args} />
      </div>
    );
  },
};

export const Vertical: Story = {
  args: {
    defaultValue: [50],
    orientation: 'vertical',
    className: 'data-[orientation=vertical]:min-h-100',
  },
  render: (args) => (
    <div className="flex items-center gap-24">
      <div className="flex flex-col gap-8 items-center">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Single
        </Code>
        <Slider {...args} />
      </div>
      <div className="flex flex-col gap-8 items-center">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Range
        </Code>
        <Slider
          defaultValue={[25, 75]}
          orientation="vertical"
          className="data-[orientation=vertical]:min-h-100"
          max={100}
          step={5}
        />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: [30],
    disabled: true,
  },
  render: (args) => (
    <div className="flex flex-col gap-24 w-full max-w-xs">
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Single (disabled)
        </Code>
        <Slider {...args} />
      </div>
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Range (disabled)
        </Code>
        <Slider defaultValue={[20, 80]} max={100} step={5} disabled className="w-full" />
      </div>
    </div>
  ),
};
