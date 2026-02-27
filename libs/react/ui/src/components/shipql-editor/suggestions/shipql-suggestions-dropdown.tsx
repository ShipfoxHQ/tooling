import {PopoverContent} from 'components/popover';
import {ScrollArea} from 'components/scroll-area';
import {useCallback, useEffect, useRef} from 'react';
import {DurationSuggestionContent} from './duration-suggestion-content';
import {ShipQLSuggestionItem} from './shipql-suggestion-item';
import type {SuggestionItem} from './types';

interface ShipQLSuggestionsDropdownProps {
  items: SuggestionItem[];
  selectedIndex: number;
  isSelectingRef: React.RefObject<boolean>;
  onSelect: (value: string) => void;
}

export function ShipQLSuggestionsDropdown({
  items,
  selectedIndex,
  isSelectingRef,
  onSelect,
}: ShipQLSuggestionsDropdownProps) {
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = itemRefs.current[selectedIndex];
    if (el) el.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  }, [selectedIndex]);

  const handleMouseDown = useCallback(
    (value: string) => {
      isSelectingRef.current = true;
      onSelect(value);
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 150);
    },
    [isSelectingRef, onSelect],
  );

  if (items.length === 0) return null;

  return (
    <PopoverContent
      align="start"
      sideOffset={4}
      className="p-0 w-(--radix-popover-trigger-width)"
      onOpenAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={(e) => {
        if (isSelectingRef.current) e.preventDefault();
      }}
      onPointerDownOutside={(e) => {
        if (isSelectingRef.current) e.preventDefault();
      }}
    >
      <div className="flex flex-col overflow-hidden rounded-10 bg-background-neutral-base shadow-tooltip max-h-[min(70vh,320px)] min-h-0">
        <ScrollArea className="flex-1 min-h-0 overflow-y-auto scrollbar">
          <div className="flex flex-col">
            {items.map((item, index) => {
              if (item.type === 'duration-range' && item.rangeField) {
                return (
                  <DurationSuggestionContent
                    key={item.value}
                    field={item.rangeField}
                    onCommit={handleMouseDown}
                  />
                );
              }
              return (
                <ShipQLSuggestionItem
                  key={item.value}
                  item={item}
                  isHighlighted={selectedIndex === index}
                  onMouseDown={handleMouseDown}
                  itemRef={(el) => {
                    itemRefs.current[index] = el;
                  }}
                />
              );
            })}
          </div>
        </ScrollArea>
        <div className="shrink-0 border-t border-border-neutral-base-component flex items-center px-8 py-4">
          <span className="text-xs text-foreground-neutral-muted select-none">
            <span className="font-medium">↵</span> or <span className="font-medium">Tab</span> to
            select
          </span>
          <span className="text-xs text-foreground-neutral-muted select-none ml-auto">
            <span className="font-medium">↑↓</span> to navigate
          </span>
        </div>
      </div>
    </PopoverContent>
  );
}
