import {Badge} from 'components/Badge';
import {Button} from 'components/Button';
import {Calendar} from 'components/Calendar';
import {Icon} from 'components/Icon';
import {Popover, PopoverAnchor, PopoverContent} from 'components/Popover';
import {type NormalizedInterval, endOfDay, startOfDay} from 'date-fns';
import {useState} from 'react';
import type {DateRange} from 'react-day-picker';
import {formatDateTimeRange} from 'utils';

export interface CalendarSelectorProps {
  setInterval: (interval: NormalizedInterval) => void;
  setInputValue: (value: string) => void;
}

export function CalendarSelector({setInterval, setInputValue}: CalendarSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<DateRange | undefined>(undefined);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <Button
          variant="ghost"
          className="justify-start gap-2"
          aria-label="Select from calendar..."
          onClick={() => {
            setIsOpen(true);
          }}
        >
          <Badge variant="gray">
            <Icon icon="calendar" />
          </Badge>
          Select from calendar...
        </Button>
      </PopoverAnchor>
      <PopoverContent className="w-[496px] p-1">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={(newSelected) => {
            setSelected(newSelected);
            if (!newSelected?.from || !newSelected?.to) return;
            const newInterval = {
              start: startOfDay(newSelected.from),
              end: endOfDay(newSelected.to),
            };
            setInterval(newInterval);
            setInputValue(formatDateTimeRange(newInterval));
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
