import {Calendar} from 'components/calendar';
import {format} from 'date-fns';
import {useCallback, useState} from 'react';
import type {DateRange} from 'react-day-picker';
import {intervalToNowFromDuration} from 'utils/date';
import type {IntervalSelection} from './interval-selector';

interface IntervalSelectorCalendarProps {
  selection: IntervalSelection;
  onSelect: (range: DateRange | undefined) => void;
}

export function IntervalSelectorCalendar({selection, onSelect}: IntervalSelectorCalendarProps) {
  const interval =
    selection.type === 'interval'
      ? selection.interval
      : intervalToNowFromDuration(selection.duration);

  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: interval.start,
    to: interval.end,
  });

  const handleSelect = useCallback(
    (nextRange: DateRange | undefined, selectedDay: Date | undefined) => {
      setSelectedRange((range) => {
        if (range?.from && range?.to && selectedDay) {
          const newRange = {from: selectedDay, to: undefined};
          onSelect(newRange);
          return newRange;
        }
        if (nextRange?.from && nextRange?.to) {
          onSelect({from: nextRange.from, to: nextRange.to});
        } else {
          onSelect(nextRange);
        }
        return nextRange;
      });
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
