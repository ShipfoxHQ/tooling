import type {Meta, StoryObj} from '@storybook/react';
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

function ControlledIntervalSelector() {
  const [interval, setInterval] = useState(() => intervalToNowFromDuration({hours: 1}));
  const [value, setValue] = useState(() => findOptionValueForInterval(interval) || '1h');

  return (
    <IntervalSelector
      interval={interval}
      onIntervalChange={(newInterval) => {
        setInterval(newInterval);
        setValue(findOptionValueForInterval(newInterval) || 'custom');
      }}
      value={value}
      onValueChange={setValue}
    />
  );
}

export const Default: Story = {
  args: {
    interval: intervalToNowFromDuration({hours: 1}),
    onIntervalChange: () => undefined,
  },
  render: () => <ControlledIntervalSelector />,
};
