import {Popover, PopoverContent} from 'components/popover';
import {useIntervalSelector} from './hooks/use-interval-selector';
import {IntervalSelectorCalendar} from './interval-selector-calendar';
import {IntervalSelectorInput} from './interval-selector-input';
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
    popoverOpen,
    calendarOpen,
    highlightedIndex,
    inputRef,
    isNavigating,
    isFocused,
    setIsFocused,
    onBlur,
    onFocus,
    onKeyDown,
    onChange,
    onOpenCalendar,
    closeAll,
    onInteractOutside,
  } = useIntervalSelector({
    onSelectionChange,
    relativeSuggestions,
    intervalSuggestions,
  });

  return (
    <Popover open={popoverOpen}>
      <IntervalSelectorInput
        onSelect={onSelect}
        selection={selection}
        isNavigating={isNavigating}
        className={className}
        inputClassName={inputClassName}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        inputRef={inputRef}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
      />
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-(--radix-popover-trigger-width) p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={onInteractOutside}
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
            onOpenCalendar={onOpenCalendar}
            highlightedIndex={highlightedIndex}
          />
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
