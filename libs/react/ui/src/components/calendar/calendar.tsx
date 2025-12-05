import {Icon} from 'components/icon';
import type {ComponentProps} from 'react';
import {DayPicker} from 'react-day-picker';
import {cn} from 'utils/cn';

export type CalendarProps = ComponentProps<typeof DayPicker>;

export function Calendar({className, classNames, showOutsideDays = true, ...props}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-16 transition-colors', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-24',
        month: 'space-y-16 relative',
        month_caption: 'flex items-center justify-center mb-8 px-4 relative h-32',
        caption_label: 'text-sm font-medium text-foreground-neutral-base',
        nav: 'flex items-center gap-4 fixed left-0 top-16 w-full z-10',
        button_previous: cn(
          'size-32 bg-transparent p-0 absolute left-16 top-0',
          'inline-flex items-center justify-center rounded-6',
          'text-foreground-neutral-base',
          'hover:bg-background-button-transparent-hover',
          'active:bg-background-button-transparent-pressed',
          'transition-colors outline-none',
          'focus-visible:shadow-border-interactive-with-active',
          'disabled:pointer-events-none disabled:opacity-50',
        ),
        button_next: cn(
          'size-32 bg-transparent p-0 absolute right-16 top-0',
          'inline-flex items-center justify-center rounded-6',
          'text-foreground-neutral-base',
          'hover:bg-background-button-transparent-hover',
          'active:bg-background-button-transparent-pressed',
          'transition-colors outline-none',
          'focus-visible:shadow-border-interactive-with-active',
          'disabled:pointer-events-none disabled:opacity-50',
        ),
        month_grid: 'w-full border-collapse mt-8',
        weekdays: 'flex mb-8',
        weekday:
          'text-foreground-neutral-subtle text-xs font-medium w-36 h-32 flex items-center justify-center',
        week: 'flex mt-4',
        day: cn(
          'relative text-center size-36 p-0 text-sm font-normal rounded-6 focus-within:relative focus-within:z-20',
        ),
        day_button: cn(
          'size-36 p-0 text-sm font-normal rounded-6',
          'inline-flex items-center justify-center',
          'hover:bg-background-button-transparent-hover',
          'focus-visible:shadow-border-interactive-with-active',
          'transition-colors outline-none',
          'aria-selected:opacity-100',
        ),
        range_start: 'day-range-start rounded-6',
        range_end: 'day-range-end rounded-6',
        selected: cn(
          'bg-foreground-highlight-interactive/80 text-foreground-contrast-primary font-medium',
          'hover:bg-foreground-highlight-interactive-hover/80 hover:text-foreground-contrast-primary',
          'focus:bg-foreground-highlight-interactive/80 focus:text-foreground-contrast-primary',
        ),
        today: cn(
          'bg-background-field-base text-foreground-neutral-base font-medium',
          'border border-border-neutral-base',
        ),
        outside: 'day-outside text-foreground-neutral-muted',
        disabled: 'text-foreground-neutral-disabled opacity-30 cursor-not-allowed',
        range_middle: cn(
          'aria-selected:bg-foreground-highlight-interactive/10 aria-selected:text-foreground-neutral-base',
          'rounded-none',
          'first:rounded-l-6 first:rounded-r-none',
          'last:rounded-r-6 last:rounded-l-none',
        ),
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({orientation}) => {
          const iconName = orientation === 'left' ? 'arrowLeftSLine' : 'arrowRightSLine';
          return <Icon name={iconName} className="size-20" />;
        },
      }}
      {...props}
    />
  );
}
