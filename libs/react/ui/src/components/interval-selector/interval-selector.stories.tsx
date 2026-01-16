import type {Meta, StoryObj} from '@storybook/react';
import type {NormalizedInterval} from 'date-fns';
import {useState} from 'react';
import {intervalToNowFromDuration} from 'utils/date';
import {IntervalSelector} from './interval-selector';
import {findOptionValueForInterval} from './interval-selector.utils';

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

const DEFAULT_INTERVAL = intervalToNowFromDuration({days: 7});

function ControlledIntervalSelector() {
  const [interval, setInterval] = useState<NormalizedInterval>(DEFAULT_INTERVAL);
  const [intervalValue, setIntervalValue] = useState<string | undefined>(() =>
    findOptionValueForInterval(DEFAULT_INTERVAL),
  );

  return (
    <IntervalSelector
      interval={interval}
      onIntervalChange={(newInterval) => {
        setInterval(newInterval);
        setIntervalValue(findOptionValueForInterval(newInterval));
      }}
      value={intervalValue}
      onValueChange={setIntervalValue}
      className="w-[75vw] md:w-350"
    />
  );
}

export const Default: Story = {
  args: {
    interval: DEFAULT_INTERVAL,
    onIntervalChange: () => undefined,
  },
  render: () => (
    <div className="w-screen h-screen">
      <ControlledIntervalSelector />
    </div>
  ),
};
