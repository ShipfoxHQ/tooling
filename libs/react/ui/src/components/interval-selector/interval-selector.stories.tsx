import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {type IntervalSelection, IntervalSelector} from './interval-selector';
import type {IntervalOption} from './interval-selector.utils';
import {calendarIntervals as defaultCalendarIntervals} from './interval-selector.utils';

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
        value={value}
        onValueChange={setValue}
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
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-8">
      <div className="text-sm text-foreground-neutral-subtle">
        <strong>Absolute Mode:</strong> Fixed date range selection (e.g., "Jan 1 - Jan 15"). The
        interval stays the same regardless of when you refresh the page.
      </div>
      <IntervalSelector
        selection={selection}
        onSelectionChange={setSelection}
        value={value}
        onValueChange={setValue}
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
    value: '1d',
    onValueChange: () => undefined,
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
    value: undefined,
    onValueChange: () => undefined,
  },
  render: () => (
    <div className="w-screen h-screen p-16">
      <AbsoluteIntervalSelector />
    </div>
  ),
};

function CustomIntervalsSelector() {
  const [value, setValue] = useState<string | undefined>('1h');
  const [selection, setSelection] = useState<IntervalSelection>({
    type: 'relative',
    duration: {hours: 1},
  });

  const customPastIntervals: IntervalOption[] = [
    {
      value: '15m',
      duration: {minutes: 15},
      label: 'Last 15 Minutes',
      shortcut: '15m',
      type: 'past',
    },
    {value: '1h', duration: {hours: 1}, label: 'Last Hour', shortcut: '1h', type: 'past'},
    {value: '6h', duration: {hours: 6}, label: 'Last 6 Hours', shortcut: '6h', type: 'past'},
    {value: '24h', duration: {hours: 24}, label: 'Last 24 Hours', shortcut: '24h', type: 'past'},
    {value: '3d', duration: {days: 3}, label: 'Last 3 Days', shortcut: '3d', type: 'past'},
    {value: '1w', duration: {weeks: 1}, label: 'Last Week', shortcut: '1w', type: 'past'},
    {value: '2w', duration: {weeks: 2}, label: 'Last 2 Weeks', shortcut: '2w', type: 'past'},
    {value: '1mo', duration: {months: 1}, label: 'Last Month', shortcut: '1mo', type: 'past'},
  ];

  const calendarIntervals = defaultCalendarIntervals.map((opt) => {
    if (opt.value === 'today') {
      return {...opt, label: 'Today (So Far)'};
    }
    if (opt.value === 'yesterday') {
      return {...opt, label: 'Full Yesterday'};
    }
    return opt;
  });

  return (
    <div className="space-y-8">
      <div className="text-sm text-foreground-neutral-subtle">
        <strong>Custom Intervals:</strong> This is useful for internationalization, branding, or
        context-specific options.
      </div>
      <IntervalSelector
        selection={selection}
        onSelectionChange={setSelection}
        value={value}
        onValueChange={setValue}
        pastIntervals={customPastIntervals}
        calendarIntervals={calendarIntervals}
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
    value: '1h',
    onValueChange: () => undefined,
  },
  render: () => (
    <div className="w-screen h-screen p-16">
      <CustomIntervalsSelector />
    </div>
  ),
};
