import {Input} from 'components/input';
import {Kbd} from 'components/kbd';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import type {Duration, NormalizedInterval} from 'date-fns';
import {cn} from 'utils/cn';
import {useIntervalSelector} from './hooks/use-interval-selector';
import type {IntervalOption} from './interval-selector.utils';
import {getCalendarIntervals, PAST_INTERVALS} from './interval-selector.utils';
import {IntervalSelectorCalendar} from './interval-selector-calendar';
import {IntervalSelectorSuggestions} from './interval-selector-suggestions';

export type IntervalSelection =
  | {
      type: 'relative';
      duration: Duration;
    }
  | {
      type: 'interval';
      interval: NormalizedInterval;
    };

export interface IntervalSelectorProps {
  selection: IntervalSelection;
  onSelectionChange: (selection: IntervalSelection) => void;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  container?: HTMLElement | null;
  className?: string;
  inputClassName?: string;
  pastIntervals?: IntervalOption[];
  calendarIntervals?: IntervalOption[] | (() => IntervalOption[]);
}

export function IntervalSelector({
  selection,
  onSelectionChange,
  value,
  onValueChange,
  container,
  className,
  inputClassName,
  pastIntervals = PAST_INTERVALS,
  calendarIntervals = getCalendarIntervals,
}: IntervalSelectorProps) {
  const {
    isFocused,
    popoverOpen,
    calendarOpen,
    displayValue,
    highlightedIndex,
    displayShortcut,
    isInvalid,
    shouldShake,
    inputRef,
    handleFocus,
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleInputChange,
    handleKeyDown,
    handleOptionSelect,
    handleCalendarSelect,
    handleOpenCalendar,
    setPopoverOpen,
    closeAll,
    resolvedCalendarIntervals,
  } = useIntervalSelector({
    selection,
    onSelectionChange,
    value,
    onValueChange,
    pastIntervals,
    calendarIntervals,
  });

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={(open) => {
        if (open) {
          setPopoverOpen(true);
        } else if (!isFocused && !calendarOpen) {
          setPopoverOpen(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <div className={cn('relative', className, shouldShake && 'animate-shake')}>
          <Input
            ref={inputRef}
            value={displayValue}
            onChange={isFocused ? handleInputChange : undefined}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onKeyDown={handleKeyDown}
            readOnly={!isFocused}
            aria-invalid={isInvalid && isFocused}
            iconLeft={<Kbd className="h-16 shrink-0 min-w-36">{displayShortcut}</Kbd>}
            className={cn('w-full pl-50', inputClassName)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-(--radix-popover-trigger-width) md:w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (
            inputRef.current &&
            (inputRef.current.contains(target) || target.closest('[data-radix-popover-trigger]'))
          )
            return;
          closeAll();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          closeAll();
        }}
        container={container}
      >
        {calendarOpen ? (
          <IntervalSelectorCalendar onSelect={handleCalendarSelect} />
        ) : popoverOpen ? (
          <IntervalSelectorSuggestions
            pastIntervals={pastIntervals}
            calendarIntervals={resolvedCalendarIntervals}
            onSelect={handleOptionSelect}
            onOpenCalendar={handleOpenCalendar}
            highlightedIndex={highlightedIndex}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
