import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {Meta, StoryObj} from '@storybook/react';
import {within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

const OPEN_CALENDAR_REGEX = /open calendar/i;

const isTestEnvironment = () => typeof navigator !== 'undefined' && navigator.webdriver === true;

type StoryContext = Parameters<NonNullable<Story['play']>>[0];

async function openCalendarAndScreenshot(ctx: StoryContext, screenshotName: string): Promise<void> {
  const {canvasElement, step} = ctx;
  const canvas = within(canvasElement);
  const user = userEvent.setup();

  let triggerButton: HTMLElement | null = null;

  await step('Open the calendar popover', async () => {
    triggerButton = canvas.getByRole('button', {name: OPEN_CALENDAR_REGEX});
    await user.click(triggerButton);
  });

  await step('Wait for calendar to appear and render', async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (isTestEnvironment() && triggerButton instanceof HTMLElement) {
      triggerButton.style.display = 'none';
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  await argosScreenshot(ctx, screenshotName);
}

export const DatePickerStory: Story = {
  play: (ctx) => openCalendarAndScreenshot(ctx, 'DatePicker Calendar Open'),
  render: () => {
    const [date, setDate] = useState<Date | undefined>(new Date('2023-11-10'));
    return (
      <div className="relative flex h-600 w-500 items-center justify-center rounded-16 bg-background-subtle-base shadow-tooltip overflow-visible">
        <DatePicker
          date={date}
          onDateSelect={setDate}
          onClear={() => setDate(undefined)}
          placeholder="DD/MM/YYYY"
        />
      </div>
    );
  },
};

export const DateRangePickerStory: Story = {
  play: (ctx) => openCalendarAndScreenshot(ctx, 'DateRangePicker Calendar Open'),
  render: () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      start: new Date('2023-11-10'),
      end: new Date('2023-12-10'),
    });
    return (
      <div className="relative flex h-600 w-800 items-center justify-center rounded-16 bg-background-subtle-base shadow-tooltip overflow-visible">
        <DateTimeRangePicker
          dateRange={dateRange}
          onDateRangeSelect={setDateRange}
          onClear={() => setDateRange(undefined)}
          placeholder="DD/MM/YYYY - DD/MM/YYYY"
        />
      </div>
    );
  },
};

export const AllStates: Story = {
  render: () => {
    const now = new Date();
    const past = subDays(now, 30);
    return (
      <div className="flex flex-col gap-32 p-32">
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
