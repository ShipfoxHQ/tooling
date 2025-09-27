import {Badge} from 'components/Badge';
import {Button, type ButtonProps} from 'components/Button';
import {Input, type InputProps} from 'components/Input';
import {Popover, PopoverAnchor, PopoverContent} from 'components/Popover';
import {type Duration, type NormalizedInterval, formatISODuration} from 'date-fns';
import {type FocusEvent, type FormEvent, useRef, useState} from 'react';
import {
  cn,
  formatDateTime,
  formatDateTimeRange,
  generateDurationShortcut,
  humanizeDurationToNow,
  intervalToNowFromDuration,
  parseTextInterval,
} from 'utils';
import {CalendarSelector} from './CalendarSelector';

const PRESET_DURATIONS: Duration[] = [
  {hours: 1},
  {hours: 6},
  {hours: 12},
  {days: 1},
  {days: 2},
  {weeks: 1},
  {months: 1},
];

interface DateTimeRangePickerProps extends InputProps {
  interval: NormalizedInterval;
  setInterval: (interval: NormalizedInterval) => void;
}

export function DateTimeRangePicker({
  interval,
  setInterval,
  className,
  onChange,
  onFocus,
  ...props
}: DateTimeRangePickerProps) {
  const [inputValue, setInputValue] = useState<string>(formatDateTimeRange(interval));
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function onDateRangeClick(duration: Duration) {
    const interval = intervalToNowFromDuration(duration);
    setInterval(interval);
    setInputValue(humanizeDurationToNow(duration));
    setIsOpen(false);
  }

  function onInputFocus(e: FocusEvent<HTMLInputElement>) {
    setInputValue(
      `${formatDateTime(interval.start)}\u2009\u2013\u2009${formatDateTime(interval.end)}`,
    );
    setIsOpen(true);
    onFocus?.(e);
  }

  function onInputBlur() {
    setInputValue(formatDateTimeRange(interval));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newInterval = parseTextInterval(inputValue);
    if (!newInterval) return;
    setInterval(newInterval);
    setIsOpen(false);
    inputRef.current?.blur();
    setInputValue(formatDateTimeRange(newInterval));
  }

  return (
    <form onSubmit={onSubmit}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverAnchor asChild>
          <Input
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            className={cn('w-[360px] justify-start text-left font-normal', className)}
            ref={inputRef}
            value={inputValue}
            placeholder="Select time range"
            onChange={(e) => {
              setInputValue(e.target.value);
              onChange?.(e);
            }}
            {...props}
          />
        </PopoverAnchor>
        <PopoverContent
          className="flex w-[360px] flex-col p-1"
          sideOffset={0}
          align="start"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
          onInteractOutside={(event) => {
            if (event.target === inputRef.current) event.preventDefault();
          }}
        >
          {PRESET_DURATIONS.map((duration) => (
            <DateRangeSelector
              key={formatISODuration(duration)}
              duration={duration}
              onClick={onDateRangeClick}
            />
          ))}
          <CalendarSelector setInterval={setInterval} setInputValue={setInputValue} />
        </PopoverContent>
      </Popover>
    </form>
  );
}

type DateRangeSelectorProps = Omit<ButtonProps, 'onClick'> & {
  duration: Duration;
  onClick: (duration: Duration) => void;
};

function DateRangeSelector({duration, onClick, ...props}: DateRangeSelectorProps) {
  const humanizedDuration = humanizeDurationToNow(duration);
  return (
    <Button
      variant="ghost"
      className="justify-start gap-2"
      aria-label={humanizedDuration}
      onClick={() => onClick(duration)}
      {...props}
    >
      <Badge variant="gray">{generateDurationShortcut(duration)}</Badge>
      {humanizedDuration}
    </Button>
  );
}
