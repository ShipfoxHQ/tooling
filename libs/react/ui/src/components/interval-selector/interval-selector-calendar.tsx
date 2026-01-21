import {Calendar} from 'components/calendar';
import {endOfDay, format} from 'date-fns';
import {useCallback, useState} from 'react';
import type {DateRange} from 'react-day-picker';
import type {IntervalSelection} from './types';

interface IntervalSelectorCalendarProps {
  onSelect: (selection: IntervalSelection) => void;
}

export function IntervalSelectorCalendar({onSelect}: IntervalSelectorCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  const handleSelect = useCallback(
    (_: DateRange | undefined, selectedDay: Date | undefined) => {
      if (!selectedDay) return setSelectedRange(undefined);
      if (!selectedRange?.from) return setSelectedRange({from: selectedDay, to: undefined});
      onSelect({
        type: 'interval',
        interval: {start: selectedRange.from, end: endOfDay(selectedDay)},
      });
      return setSelectedRange(undefined);
    },
    [onSelect, selectedRange],
  );

  return (
    <Calendar
      mode="range"
      selected={selectedRange}
      onSelect={handleSelect}
      numberOfMonths={1}
      formatters={{
        formatWeekdayName: (date) => format(date, 'EEEEE'),
      }}
      disabled={{
        after: new Date(),
      }}
      classNames={{
        nav: 'flex items-center gap-4 absolute top-16 left-0 w-full z-10',
      }}
    />
  );
}
