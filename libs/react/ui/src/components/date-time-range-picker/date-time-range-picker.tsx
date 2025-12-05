import {cva, type VariantProps} from 'class-variance-authority';
import {Calendar} from 'components/calendar';
import {Icon} from 'components/icon';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import {format} from 'date-fns';
import type {ComponentProps, ReactNode} from 'react';
import {forwardRef, useState} from 'react';
import type {DateRange as DayPickerDateRange} from 'react-day-picker';
import {cn} from 'utils/cn';

export const dateTimeRangePickerVariants = cva(
  'min-w-240 relative flex items-center rounded-6 shadow-button-neutral transition-[background-color,box-shadow] outline-none',
  {
    variants: {
      variant: {
        base: 'bg-background-field-base hover:bg-background-field-hover',
        component: 'bg-background-field-component hover:bg-background-field-component-hover',
      },
      size: {
        base: 'h-32',
        small: 'h-28',
      },
      state: {
        default: '',
        error: 'shadow-border-error',
        disabled:
          'bg-background-neutral-disabled shadow-none pointer-events-none cursor-not-allowed',
      },
    },
    defaultVariants: {
      variant: 'base',
      size: 'base',
      state: 'default',
    },
  },
);

export type DateRange = {
  start?: Date;
  end?: Date;
};

export type DateTimeRangePickerProps = Omit<ComponentProps<'input'>, 'size' | 'type'> &
  VariantProps<typeof dateTimeRangePickerVariants> & {
    dateRange?: DateRange;
    onDateRangeSelect?: (range: DateRange | undefined) => void;
    placeholder?: string;
    dateFormat?: string;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    onClear?: () => void;
    numberOfMonths?: number;
    closeOnSelect?: boolean;
  };

export const DateTimeRangePicker = forwardRef<HTMLInputElement, DateTimeRangePickerProps>(
  (
    {
      className,
      variant,
      size,
      state,
      dateRange,
      onDateRangeSelect,
      placeholder = 'DD/MM/YYYY - DD/MM/YYYY',
      dateFormat = 'dd/MM/yyyy',
      leftIcon,
      rightIcon,
      onClear,
      disabled,
      numberOfMonths = 2,
      closeOnSelect = false,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const isDisabled = disabled || state === 'disabled';
    const hasRange = dateRange?.start && dateRange?.end;
    const displayValue =
      hasRange && dateRange.start && dateRange.end
        ? `${format(dateRange.start, dateFormat)} - ${format(dateRange.end, dateFormat)}`
        : '';

    // Convert our DateRange to react-day-picker's DateRange format
    const dayPickerRange: DayPickerDateRange | undefined =
      dateRange?.start || dateRange?.end
        ? {
            from: dateRange?.start,
            to: dateRange?.end,
          }
        : undefined;

    const handleSelect = (selectedRange: DayPickerDateRange | undefined) => {
      if (selectedRange) {
        onDateRangeSelect?.({
          start: selectedRange.from,
          end: selectedRange.to,
        });
        // Only close if both dates are selected and closeOnSelect is true
        if (closeOnSelect && selectedRange.from && selectedRange.to) {
          setOpen(false);
        }
      } else {
        onDateRangeSelect?.(undefined);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear?.();
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <div
          className={cn(
            open && 'shadow-border-interactive-with-active',
            dateTimeRangePickerVariants({variant, size, state: isDisabled ? 'disabled' : state}),
            className,
          )}
        >
          {/* Calendar Icon Button */}
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={isDisabled}
              className={cn(
                'flex items-center justify-center shrink-0 transition-colors',
                size === 'small' ? 'size-28' : 'size-32',
                isDisabled && 'text-foreground-neutral-disabled',
              )}
              aria-label="Open calendar"
            >
              {leftIcon || (
                <Icon
                  name="calendar2Line"
                  className={cn(
                    'size-16 text-foreground-neutral-muted',
                    isDisabled && 'text-foreground-neutral-disabled',
                  )}
                />
              )}
            </button>
          </PopoverTrigger>

          {/* Divider */}
          <div className="h-full w-px bg-border-neutral-base shrink-0" />

          {/* Input Field */}
          <input
            ref={ref}
            type="text"
            disabled={isDisabled}
            placeholder={placeholder}
            value={displayValue}
            readOnly
            className={cn(
              'flex-1 min-w-0 px-8 text-sm leading-20 bg-transparent outline-none border-none cursor-pointer',
              'placeholder:text-foreground-neutral-muted',
              'text-foreground-neutral-base',
              'disabled:text-foreground-neutral-disabled disabled:cursor-not-allowed',
              size === 'small' ? 'py-4' : 'py-6',
            )}
            onClick={() => !isDisabled && setOpen(true)}
            {...props}
          />

          {/* Clear Button (shown when date range is selected) */}
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'flex items-center justify-center shrink-0 transition-colors hover:text-foreground-neutral-base',
              size === 'small' ? 'size-28' : 'size-32',
              hasRange && onClear && !isDisabled ? 'visible' : 'invisible',
            )}
            aria-label="Clear date range"
          >
            <Icon name="closeLine" className="size-16 text-foreground-neutral-muted" />
          </button>

          {/* Custom Right Icon */}
          {rightIcon && !hasRange && (
            <div
              className={cn(
                'flex items-center justify-center shrink-0',
                size === 'small' ? 'size-28' : 'size-32',
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={dayPickerRange?.from}
            selected={dayPickerRange}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DateTimeRangePicker.displayName = 'DateTimeRangePicker';
