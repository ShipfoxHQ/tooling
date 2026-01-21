import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {Kbd} from 'components/kbd';
import {Label} from 'components/label';
import {useEffect, useRef} from 'react';
import {cn} from 'utils/cn';
import {generateDurationShortcut, humanizeDurationToNow} from 'utils/date';
import type {IntervalSelection, IntervalSuggestion, RelativeSuggestion} from './types';

interface IntervalSelectorSuggestionsProps {
  relativeSuggestions: RelativeSuggestion[];
  intervalSuggestions: IntervalSuggestion[];
  onSelect: (selection: IntervalSelection) => void;
  onOpenCalendar: () => void;
  highlightedIndex: number;
}

export function IntervalSelectorSuggestions({
  relativeSuggestions,
  intervalSuggestions,
  onSelect,
  onOpenCalendar,
  highlightedIndex,
}: IntervalSelectorSuggestionsProps) {
  const pastIntervalsStartIndex = 0;
  const calendarIntervalsStartIndex = relativeSuggestions.length;
  const calendarButtonIndex = calendarIntervalsStartIndex + intervalSuggestions.length;

  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 p-4">
        {relativeSuggestions.map((option, index) => {
          const itemIndex = pastIntervalsStartIndex + index;
          const isHighlighted = highlightedIndex === itemIndex;
          const shortcut = generateDurationShortcut(option.duration);
          const label = humanizeDurationToNow(option.duration);
          return (
            <Button
              key={shortcut}
              ref={(el) => {
                itemRefs.current[itemIndex] = el;
              }}
              type="button"
              variant="transparent"
              onClick={() => onSelect(option)}
              className={cn(
                'w-full text-foreground-neutral-subtle justify-start',
                isHighlighted && 'bg-background-button-transparent-hover',
              )}
            >
              <Kbd className="h-16 shrink-0 min-w-36">{shortcut}</Kbd>
              <span>{label}</span>
            </Button>
          );
        })}
      </div>

      <div className="border-t border-border-neutral-base-component flex flex-col gap-4 p-4">
        <Label className="px-8 py-4 text-xs leading-20 text-foreground-neutral-subtle select-none">
          Calendar Time
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {intervalSuggestions.map((option, index) => {
            const itemIndex = calendarIntervalsStartIndex + index;
            const isHighlighted = highlightedIndex === itemIndex;
            return (
              <Button
                key={option.label}
                ref={(el) => {
                  itemRefs.current[itemIndex] = el;
                }}
                type="button"
                variant="transparent"
                onClick={() => onSelect(option)}
                className={cn(
                  'w-full text-foreground-neutral-subtle justify-start',
                  isHighlighted && 'bg-background-button-transparent-hover',
                )}
              >
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border-neutral-base-component p-4">
        <Button
          ref={(el) => {
            itemRefs.current[calendarButtonIndex] = el;
          }}
          type="button"
          variant="transparent"
          onClick={onOpenCalendar}
          className={cn(
            'w-full text-foreground-neutral-subtle justify-start',
            highlightedIndex === calendarButtonIndex && 'bg-background-button-transparent-hover',
          )}
        >
          <Icon name="calendar2Line" className="size-16 shrink-0" />
          <span>Select from calendar</span>
        </Button>
      </div>
    </div>
  );
}
