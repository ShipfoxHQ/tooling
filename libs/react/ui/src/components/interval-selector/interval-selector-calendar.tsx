import {Calendar} from 'components/calendar';
import type {NormalizedInterval} from 'date-fns';
import {format} from 'date-fns';
import {useCallback, useState} from 'react';
import type {DateRange} from 'react-day-picker';

interface IntervalSelectorCalendarProps {
  interval: NormalizedInterval;
  onSelect: (range: DateRange | undefined) => void;
}

export function IntervalSelectorCalendar({interval, onSelect}: IntervalSelectorCalendarProps) {
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: interval.start,
    to: interval.end,
  });

  const handleSelect = useCallback(
    (range: DateRange | undefined) => {
      setSelectedRange(range);
      if (range?.from && range?.to) {
        onSelect({from: range.from, to: range.to});
      } else {
        onSelect(undefined);
      }
    },
    [onSelect],
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
