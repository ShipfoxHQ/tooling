import {Select, SelectTrigger, SelectValue} from 'components/select';
import type {NormalizedInterval} from 'date-fns';
import {useState} from 'react';
import type {DateRange as DayPickerDateRange} from 'react-day-picker';
import {cn} from 'utils/cn';
import {intervalToNowFromDuration} from 'utils/date';
import {formatDateTimeRange} from 'utils/format/date';
import {findOption} from './interval-selector.utils';
import {IntervalSelectorContent} from './interval-selector-content';

export interface IntervalSelectorProps {
  interval: NormalizedInterval;
  onIntervalChange: (interval: NormalizedInterval) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  container?: HTMLElement | null;
  className?: string;
  triggerClassName?: string;
}

export function IntervalSelector({
  interval,
  onIntervalChange,
  value,
  onValueChange,
  container,
  className,
  triggerClassName,
}: IntervalSelectorProps) {
  const [selectOpen, setSelectOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const intervalDisplay = formatDateTimeRange(interval);

  const handleOptionSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    const option = findOption(selectedValue);

    if (option?.duration) {
      const newInterval = intervalToNowFromDuration(option.duration);
      onIntervalChange(newInterval);
      setSelectOpen(false);
    }
  };

  const handleCalendarSelect = (range: DayPickerDateRange | undefined) => {
    if (range?.from && range?.to) {
      onIntervalChange({start: range.from, end: range.to});
      onValueChange?.('custom');
    }
  };

  return (
    <div className={cn('relative', className)}>
      <Select
        value={value}
        onValueChange={handleOptionSelect}
        open={selectOpen}
        onOpenChange={(open) => {
          if (!open && calendarOpen) return;
          setSelectOpen(open);
        }}
      >
        <SelectTrigger className={cn('w-full', triggerClassName)}>
          <SelectValue>{intervalDisplay}</SelectValue>
        </SelectTrigger>

        <IntervalSelectorContent
          interval={interval}
          onCalendarSelect={handleCalendarSelect}
          calendarOpen={calendarOpen}
          setCalendarOpen={setCalendarOpen}
          container={container}
        />
      </Select>
    </div>
  );
}
