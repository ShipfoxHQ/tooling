import type {Meta, StoryObj} from '@storybook/react';
import type {NormalizedInterval} from 'date-fns';
import {useState} from 'react';
import {intervalToNowFromDuration} from 'utils/date';
import {IntervalSelector} from './interval-selector';
import {findOption, getCalendarInterval} from './interval-selector.utils';

const meta = {
  title: 'Components/IntervalSelector',
  component: IntervalSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IntervalSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

function RelativeIntervalSelector() {
  const [value, setValue] = useState<string | undefined>('1d');
  const [interval, setInterval] = useState<NormalizedInterval>(() =>
    intervalToNowFromDuration({days: 1}),
  );

  return (
    <IntervalSelector
      interval={interval}
      onIntervalChange={(newInterval) => {
        setInterval(newInterval);
      }}
      value={value}
      onValueChange={(newValue) => {
        setValue(newValue);
        if (!newValue) return;

        const option = findOption(newValue);
        const newInterval = option?.duration
          ? intervalToNowFromDuration(option.duration)
          : option?.type === 'calendar'
            ? getCalendarInterval(newValue)
            : undefined;

        if (newInterval) setInterval(newInterval);
      }}
      className="w-[75vw] md:w-350"
    />
  );
}

function AbsoluteIntervalSelector() {
  const now = new Date();
  const absoluteInterval: NormalizedInterval = {
    start: new Date(now.getFullYear(), 0, 1),
    end: new Date(now.getFullYear(), 0, 15),
  };
  const [interval, setInterval] = useState<NormalizedInterval>(absoluteInterval);
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <IntervalSelector
      interval={interval}
      onIntervalChange={(newInterval) => {
        setInterval(newInterval);
      }}
      value={value}
      onValueChange={setValue}
      className="w-[75vw] md:w-350"
    />
  );
}

export const Relative: Story = {
  args: {
    interval: intervalToNowFromDuration({days: 1}),
    onIntervalChange: () => undefined,
    value: '1d',
    onValueChange: (_value: string) => undefined,
  },
  render: () => (
    <div className="w-screen h-screen p-16">
      <RelativeIntervalSelector />
    </div>
  ),
};

export const Absolute: Story = {
  args: {
    interval: (() => {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 0, 15),
      };
    })(),
    onIntervalChange: () => undefined,
    value: undefined,
    onValueChange: (_value: string) => undefined,
  },
  render: () => (
    <div className="w-screen h-screen p-16">
      <AbsoluteIntervalSelector />
    </div>
  ),
};
