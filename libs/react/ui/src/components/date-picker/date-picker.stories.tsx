import type {Meta, StoryObj} from '@storybook/react';
import {subDays} from 'date-fns';
import {useState} from 'react';
import {
  type DateRange,
  DateTimeRangePicker,
} from '../date-time-range-picker/date-time-range-picker';
import {DatePicker} from './date-picker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

// ========== Single Date Picker Stories ==========

export const SingleDate: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>();
    return (
      <DatePicker
        date={date}
        onDateSelect={setDate}
        onClear={() => setDate(undefined)}
        placeholder="DD/MM/YYYY"
      />
    );
  },
};

export const SingleDateWithValue: Story = {
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date('2023-11-10'));
    return (
      <DatePicker
        date={date}
        onDateSelect={setDate}
        onClear={() => setDate(undefined)}
        placeholder="DD/MM/YYYY"
      />
    );
  },
};

// ========== Date Range Picker Stories ==========

export const DateRange_Default: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    return (
      <DateTimeRangePicker
        dateRange={dateRange}
        onDateRangeSelect={setDateRange}
        onClear={() => setDateRange(undefined)}
        placeholder="DD/MM/YYYY - DD/MM/YYYY"
      />
    );
  },
};

export const DateRange_WithValue: Story = {
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      start: new Date('2023-11-10'),
      end: new Date('2023-12-10'),
    });
    return (
      <DateTimeRangePicker
        dateRange={dateRange}
        onDateRangeSelect={setDateRange}
        onClear={() => setDateRange(undefined)}
        placeholder="DD/MM/YYYY - DD/MM/YYYY"
      />
    );
  },
};

// ========== All States Overview ==========

export const AllStates: Story = {
  render: () => {
    const now = new Date();
    const past = subDays(now, 30);
    return (
      <div className="flex flex-col gap-32 p-32">
        {/* Single Date Picker */}
        <div>
          <h3 className="text-lg font-semibold mb-16 text-foreground-neutral-base">
            Single Date Picker
          </h3>
          <div className="flex flex-col gap-16">
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">DEFAULT</p>
              <DatePicker placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">FILLED</p>
              <DatePicker
                date={new Date('2023-11-10')}
                onClear={() => {
                  /* noop for demo */
                }}
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">ERROR</p>
              <DatePicker
                date={new Date('2023-11-10')}
                onClear={() => {
                  /* noop for demo */
                }}
                state="error"
                placeholder="DD/MM/YYYY"
              />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">DISABLED</p>
              <DatePicker placeholder="DD/MM/YYYY" state="disabled" />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">SMALL</p>
              <DatePicker size="small" placeholder="DD/MM/YYYY" />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">
                COMPONENT VARIANT
              </p>
              <DatePicker variant="component" placeholder="DD/MM/YYYY" />
            </div>
          </div>
        </div>

        {/* Date Range Picker */}
        <div>
          <h3 className="text-lg font-semibold mb-16 text-foreground-neutral-base">
            Date Range Picker
          </h3>
          <div className="flex flex-col gap-16">
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">DEFAULT</p>
              <DateTimeRangePicker placeholder="DD/MM/YYYY - DD/MM/YYYY" />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">FILLED</p>
              <DateTimeRangePicker
                dateRange={{start: past, end: now}}
                onClear={() => {
                  /* noop for demo */
                }}
                placeholder="DD/MM/YYYY - DD/MM/YYYY"
              />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">ERROR</p>
              <DateTimeRangePicker
                dateRange={{start: past, end: now}}
                onClear={() => {
                  /* noop for demo */
                }}
                state="error"
                placeholder="DD/MM/YYYY - DD/MM/YYYY"
              />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">DISABLED</p>
              <DateTimeRangePicker placeholder="DD/MM/YYYY - DD/MM/YYYY" state="disabled" />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">SMALL</p>
              <DateTimeRangePicker size="small" placeholder="DD/MM/YYYY - DD/MM/YYYY" />
            </div>
            <div>
              <p className="text-xs text-foreground-neutral-subtle mb-8 font-mono">
                COMPONENT VARIANT
              </p>
              <DateTimeRangePicker variant="component" placeholder="DD/MM/YYYY - DD/MM/YYYY" />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
