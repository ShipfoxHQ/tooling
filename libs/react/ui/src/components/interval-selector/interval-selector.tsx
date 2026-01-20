import {Input} from 'components/input';
import {Kbd} from 'components/kbd';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import {cn} from 'utils/cn';
import {useIntervalSelector} from './hooks/use-interval-selector';
import {IntervalSelectorCalendar} from './interval-selector-calendar';
import {IntervalSelectorSuggestions} from './interval-selector-suggestions';
import type {IntervalSelection, IntervalSuggestion, RelativeSuggestion} from './types';
import {defaultIntervalSuggestions, defaultRelativeSuggestions} from './utils';

export interface IntervalSelectorProps {
  selection: IntervalSelection;
  onSelectionChange: (selection: IntervalSelection) => void;
  container?: HTMLElement | null;
  className?: string;
  inputClassName?: string;
  relativeSuggestions?: RelativeSuggestion[];
  intervalSuggestions?: IntervalSuggestion[];
}

export function IntervalSelector({
  selection,
  onSelectionChange,
  container,
  className,
  inputClassName,
  relativeSuggestions = defaultRelativeSuggestions,
  intervalSuggestions = defaultIntervalSuggestions,
}: IntervalSelectorProps) {
  const {
    onSelect,
    isFocused,
    popoverOpen,
    calendarOpen,
    displayValue,
    shortcutValue,
    highlightedIndex,
    isInvalid,
    shouldShake,
    inputRef,
    handleFocus,
    handleBlur,
    handleMouseDown,
    handleMouseUp,
    handleInputChange,
    handleKeyDown,
    handleOpenCalendar,
    setPopoverOpen,
    closeAll,
  } = useIntervalSelector({
    selection,
    onSelectionChange,
    relativeSuggestions,
    intervalSuggestions,
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
            iconLeft={<Kbd className="h-16 shrink-0 min-w-36">{shortcutValue}</Kbd>}
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
          <IntervalSelectorCalendar onSelect={onSelect} />
        ) : popoverOpen ? (
          <IntervalSelectorSuggestions
            relativeSuggestions={relativeSuggestions}
            intervalSuggestions={intervalSuggestions}
            onSelect={onSelect}
            onOpenCalendar={handleOpenCalendar}
            highlightedIndex={highlightedIndex}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
