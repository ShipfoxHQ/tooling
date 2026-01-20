import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {Kbd} from 'components/kbd';
import {Label} from 'components/label';
import {useEffect, useRef} from 'react';
import {cn} from 'utils/cn';
import type {QueryBuilderSuggestion} from './use-query-builder';

interface QueryBuilderSuggestionsProps {
  suggestions: QueryBuilderSuggestion[];
  highlightedIndex: number;
  onSelect: (suggestion: QueryBuilderSuggestion) => void;
  isShiftPressed: boolean;
  isAltPressed: boolean;
}

export function QueryBuilderSuggestions({
  suggestions,
  highlightedIndex,
  onSelect,
  isShiftPressed,
  isAltPressed,
}: QueryBuilderSuggestionsProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (highlightedIndex >= 0 && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlightedIndex]);

  // Group suggestions by property
  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      if (!acc[suggestion.property]) {
        acc[suggestion.property] = [];
      }
      acc[suggestion.property].push(suggestion);
      return acc;
    },
    {} as Record<string, QueryBuilderSuggestion[]>,
  );

  const propertyKeys = Object.keys(groupedSuggestions);
  let itemIndex = 0;

  if (suggestions.length === 0) {
    return (
      <div className="p-16 text-sm text-foreground-neutral-subtle text-center">
        No suggestions available
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Mode indicator */}
      {(isShiftPressed || isAltPressed) && (
        <div className="px-12 py-8 border-b border-border-neutral-base-component bg-background-neutral-subtle">
          <div className="flex items-center gap-8 text-xs text-foreground-neutral-subtle">
            {isShiftPressed && (
              <span className="flex items-center gap-4">
                <Kbd className="h-16">Shift</Kbd>
                <span>AND mode</span>
              </span>
            )}
            {isAltPressed && (
              <span className="flex items-center gap-4">
                <Kbd className="h-16">Alt</Kbd>
                <span>Negate</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Suggestions grouped by property */}
      <div className="max-h-300 overflow-y-auto">
        {propertyKeys.map((property) => {
          const propertySuggestions = groupedSuggestions[property];

          return (
            <div key={property} className="flex flex-col">
              {propertyKeys.length > 1 && (
                <div className="px-12 py-8 border-b border-border-neutral-base-component">
                  <Label className="text-xs leading-20 text-foreground-neutral-subtle uppercase select-none">
                    {property}
                  </Label>
                </div>
              )}
              <div className="flex flex-col gap-4 p-4">
                {propertySuggestions.map((suggestion) => {
                  const currentItemIndex = itemIndex++;
                  const isHighlighted = highlightedIndex === currentItemIndex;
                  const isNegated = suggestion.negated || false;

                  return (
                    <Button
                      key={`${suggestion.property}:${suggestion.value}`}
                      ref={(el) => {
                        itemRefs.current[currentItemIndex] = el;
                      }}
                      type="button"
                      variant="transparent"
                      onClick={() => onSelect(suggestion)}
                      className={cn(
                        'w-full text-foreground-neutral-subtle justify-start gap-8',
                        isHighlighted && 'bg-background-button-transparent-hover',
                      )}
                    >
                      {isNegated ? (
                        <Icon
                          name="subtractLine"
                          className="size-16 shrink-0 text-foreground-danger-base"
                        />
                      ) : (
                        <Icon
                          name="chevronRight"
                          className="size-16 shrink-0 text-foreground-neutral-muted"
                        />
                      )}
                      <span className="flex-1 text-left">{suggestion.label}</span>
                      {suggestion.count !== undefined && (
                        <span className="text-xs text-foreground-neutral-muted">
                          {suggestion.count}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyboard shortcuts footer */}
      <div className="px-12 py-8 border-t border-border-neutral-base-component bg-background-neutral-subtle">
        <div className="flex flex-wrap items-center gap-12 text-xs text-foreground-neutral-subtle">
          <div className="flex items-center gap-4">
            <span>Negate</span>
            <Kbd className="h-16">Alt</Kbd>
          </div>
          <div className="flex items-center gap-4">
            <span>Navigate</span>
            <Kbd className="h-16">↓</Kbd>
            <Kbd className="h-16">↑</Kbd>
          </div>
          <div className="flex items-center gap-4">
            <span>Select</span>
            <Kbd className="h-16">↵</Kbd>
          </div>
          <div className="flex items-center gap-4">
            <span>Next tag</span>
            <Kbd className="h-16">Tab</Kbd>
          </div>
          <div className="flex items-center gap-4">
            <span>Done</span>
            <Kbd className="h-16">Esc</Kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
