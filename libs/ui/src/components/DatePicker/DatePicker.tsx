import {Button, type ButtonProps} from 'components/Button';
import {Calendar} from 'components/Calendar';
import {Icon} from 'components/Icon';
import {Popover, PopoverContent, PopoverTrigger} from 'components/Popover';
import {format} from 'date-fns';
import type {PropsBase, PropsSingle, PropsSingleRequired} from 'react-day-picker';
import {cn} from 'utils';

interface DatePickerProps {
  date?: Date;
  onSelect: PropsSingle['onSelect'];
  buttonProps?: Partial<ButtonProps>;
  calendarProps?: Partial<PropsBase & (PropsSingle | PropsSingleRequired)>;
}

export function DatePicker({date, onSelect, buttonProps, calendarProps}: DatePickerProps) {
  const {className: buttonClassName, ...restButtonProps} = buttonProps ?? {};
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[240px] justify-start text-left font-normal',
            !date && 'text-text-secondary',
            buttonClassName,
          )}
          {...restButtonProps}
        >
          <Icon icon="calendar" className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          required
          mode="single"
          selected={date}
          onSelect={onSelect}
          autoFocus
          {...calendarProps}
        />
      </PopoverContent>
    </Popover>
  );
}
