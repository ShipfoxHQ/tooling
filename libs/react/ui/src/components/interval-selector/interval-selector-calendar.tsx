import {Calendar} from 'components/calendar';
import {endOfDay, format} from 'date-fns';
import {useCallback, useState} from 'react';
import type {DateRange} from 'react-day-picker';

interface IntervalSelectorCalendarProps {
  onSelect: (range: DateRange | undefined) => void;
}

export function IntervalSelectorCalendar({onSelect}: IntervalSelectorCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  const handleSelect = useCallback(
    (_: DateRange | undefined, selectedDay: Date | undefined) => {
      if (!selectedDay) return setSelectedRange(undefined);
      if (!selectedRange) return setSelectedRange({from: selectedDay, to: undefined});
      onSelect({from: selectedRange.from, to: endOfDay(selectedDay)});
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
