import type {Meta, StoryObj} from '@storybook/react';
import {endOfDay, startOfDay} from 'date-fns';
import {useState} from 'react';
import {IntervalSelector} from './interval-selector';
import type {IntervalSelection, IntervalSuggestion, RelativeSuggestion} from './types';

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
  const [selection, setSelection] = useState<IntervalSelection>({
    type: 'relative',
    duration: {days: 1},
  });

  return (
    <div className="space-y-8">
      <div className="text-sm text-foreground-neutral-subtle">
        <strong>Relative Mode:</strong> Duration-based selection (e.g., "Past 1 Day"). The interval
        updates automatically based on the current time.
      </div>
      <IntervalSelector
        selection={selection}
        onSelectionChange={setSelection}
        className="w-[75vw] md:w-350"
      />
      <div className="text-xs text-foreground-neutral-muted font-mono">
        Selection: {JSON.stringify(selection, null, 2)}
      </div>
    </div>
  );
}

function AbsoluteIntervalSelector() {
  const now = new Date();
  const [selection, setSelection] = useState<IntervalSelection>({
    type: 'interval',
    interval: {
      start: new Date(now.getFullYear(), 0, 1),
      end: new Date(now.getFullYear(), 0, 15),
    },
  });

  return (
    <div className="space-y-8">
      <div className="text-sm text-foreground-neutral-subtle">
        <strong>Absolute Mode:</strong> Fixed date range selection (e.g., "Jan 1 - Jan 15"). The
        interval stays the same regardless of when you refresh the page.
      </div>
      <IntervalSelector
        selection={selection}
        onSelectionChange={setSelection}
        className="w-[75vw] md:w-350"
      />
      <div className="text-xs text-foreground-neutral-muted font-mono">
        Selection: {JSON.stringify(selection, null, 2)}
      </div>
    </div>
  );
}

export const Relative: Story = {
  args: {
    selection: {
      type: 'relative',
      duration: {days: 1},
    },
    onSelectionChange: () => undefined,
  },
  render: () => (
    <div className="w-screen h-screen p-16">
      <RelativeIntervalSelector />
    </div>
  ),
};

export const Absolute: Story = {
  args: {
    selection: (() => {
      const now = new Date();
      return {
        type: 'interval' as const,
        interval: {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear(), 0, 15),
        },
      };
    })(),
    onSelectionChange: () => undefined,
  },
  render: () => (
    <div className="w-screen h-screen p-16">
      <AbsoluteIntervalSelector />
    </div>
  ),
};

function CustomIntervalsSelector() {
  const [selection, setSelection] = useState<IntervalSelection>({
    type: 'relative',
    duration: {hours: 1},
  });

  const customRelativeSuggestions: RelativeSuggestion[] = [
    {duration: {minutes: 15}, type: 'relative'},
    {duration: {hours: 1}, type: 'relative'},
    {duration: {hours: 6}, type: 'relative'},
    {duration: {hours: 24}, type: 'relative'},
    {duration: {days: 3}, type: 'relative'},
    {duration: {weeks: 1}, type: 'relative'},
    {duration: {weeks: 2}, type: 'relative'},
    {duration: {months: 1}, type: 'relative'},
  ];

  const customIntervalSuggestions: IntervalSuggestion[] = [
    {
      type: 'interval',
      label: "During Einstein's lifetime",
      interval: {start: startOfDay(new Date('1879-03-14')), end: endOfDay(new Date('1955-04-18'))},
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-sm text-foreground-neutral-subtle">
        <strong>Custom Intervals:</strong> This is useful for internationalization, branding, or
        context-specific options.
      </div>
      <IntervalSelector
        selection={selection}
        onSelectionChange={setSelection}
        relativeSuggestions={customRelativeSuggestions}
        intervalSuggestions={customIntervalSuggestions}
        className="w-[75vw] md:w-350"
      />
      <div className="text-xs text-foreground-neutral-muted font-mono">
        Selection: {JSON.stringify(selection, null, 2)}
      </div>
    </div>
  );
}

export const CustomIntervals: Story = {
  args: {
    selection: {
      type: 'relative',
      duration: {hours: 1},
    },
    onSelectionChange: () => undefined,
  },
  render: () => (
    <div className="w-screen h-screen p-16">
      <CustomIntervalsSelector />
    </div>
  ),
};
