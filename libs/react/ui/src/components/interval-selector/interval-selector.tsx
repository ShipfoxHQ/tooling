import {Icon} from 'components/icon';
import {Input} from 'components/input';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import type {NormalizedInterval} from 'date-fns';
import {cn} from 'utils/cn';
import {IntervalSelectorCalendar} from './interval-selector-calendar';
import {IntervalSelectorSuggestions} from './interval-selector-suggestions';
import {useIntervalSelector} from './use-interval-selector';

export interface IntervalSelectorProps {
  interval: NormalizedInterval;
  onIntervalChange: (interval: NormalizedInterval) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  container?: HTMLElement | null;
  className?: string;
  inputClassName?: string;
}

export function IntervalSelector({
  interval,
  onIntervalChange,
  value,
  onValueChange,
  container,
  className,
  inputClassName,
}: IntervalSelectorProps) {
  const {
    isFocused,
    popoverOpen,
    calendarOpen,
    displayValue,
    highlightedIndex,
    inputRef,
    handleFocus,
    handleBlur,
    handleInputChange,
    handleKeyDown,
    handleOptionSelect,
    handleCalendarSelect,
    handleOpenCalendar,
    handleCloseCalendar,
    setPopoverOpen,
    setIsFocused,
  } = useIntervalSelector({
    interval,
    onIntervalChange,
    value,
    onValueChange,
  });

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={(open) => {
        if (!open && !isFocused && !calendarOpen) {
          setPopoverOpen(false);
        } else if (open) {
          setPopoverOpen(true);
        }
      }}
    >
      <PopoverTrigger asChild>
        <div className={cn('relative', className)}>
          <Input
            ref={inputRef}
            value={displayValue}
            onChange={isFocused ? handleInputChange : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            readOnly={!isFocused}
            iconLeft={
              <Icon name="calendar2Line" className="size-16 text-foreground-neutral-muted" />
            }
            className={cn('w-full', inputClassName)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[var(--radix-popover-trigger-width)] md:w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (e.target === inputRef.current || inputRef.current?.contains(e.target as Node)) {
            e.preventDefault();
            return;
          }
          if (calendarOpen) {
            handleCloseCalendar();
            e.preventDefault();
            return;
          }
          if (isFocused) {
            e.preventDefault();
            return;
          }
          setPopoverOpen(false);
          setIsFocused(false);
        }}
        onEscapeKeyDown={(e) => {
          if (calendarOpen) {
            handleCloseCalendar();
            e.preventDefault();
          } else {
            setPopoverOpen(false);
            setIsFocused(false);
            inputRef.current?.blur();
          }
        }}
        container={container}
      >
        {calendarOpen ? (
          <IntervalSelectorCalendar interval={interval} onSelect={handleCalendarSelect} />
        ) : popoverOpen ? (
          <IntervalSelectorSuggestions
            interval={interval}
            onSelect={handleOptionSelect}
            onOpenCalendar={handleOpenCalendar}
            highlightedIndex={highlightedIndex}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
