import {Button} from 'components/button';
import {Calendar} from 'components/calendar';
import {Icon} from 'components/icon';
import {Kbd} from 'components/kbd';
import {SelectContent, SelectItem, SelectSeparator} from 'components/select';
import type {NormalizedInterval} from 'date-fns';
import {format} from 'date-fns';
import type {MouseEvent} from 'react';
import type {DateRange as DayPickerDateRange} from 'react-day-picker';
import {PAST_INTERVALS} from './interval-selector.utils';

interface IntervalSelectorContentProps {
  interval: NormalizedInterval;
  onCalendarSelect: (range: DayPickerDateRange | undefined) => void;
  calendarOpen: boolean;
  setCalendarOpen: (open: boolean) => void;
  container?: HTMLElement | null;
}

export function IntervalSelectorContent({
  interval,
  onCalendarSelect,
  calendarOpen,
  setCalendarOpen,
  container,
}: IntervalSelectorContentProps) {
  const handleCalendarClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCalendarOpen(true);
  };

  if (calendarOpen) {
    return (
      <SelectContent
        container={container}
        side="bottom"
        align="start"
        className="max-h-full"
        onPointerDownOutside={(event) => {
          event.preventDefault();
          setCalendarOpen(false);
        }}
      >
        <Calendar
          mode="range"
          selected={
            {
              from: interval.start,
              to: interval.end,
            } as DayPickerDateRange
          }
          onSelect={onCalendarSelect}
          numberOfMonths={1}
          formatters={{
            formatWeekdayName: (date) => format(date, 'EEEEE'),
          }}
          classNames={{
            nav: 'flex items-center gap-4 absolute top-16 left-0 w-full z-10',
          }}
        />
      </SelectContent>
    );
  }

  return (
    <SelectContent container={container} side="bottom" align="center">
      {PAST_INTERVALS.map((option) => (
        <SelectItem key={option.value} value={option.value}>
          <div className="flex items-center gap-8">
            <Kbd className="h-16">{option.shortcut}</Kbd>
            <span>{option.label}</span>
          </div>
        </SelectItem>
      ))}

      <SelectSeparator />

      <Button
        type="button"
        variant="transparent"
        onClick={handleCalendarClick}
        className="w-full text-foreground-neutral-subtle justify-start"
      >
        <Icon name="calendar2Line" className="size-16 shrink-0" />
        <span>Select from calendar</span>
      </Button>
    </SelectContent>
  );
}
