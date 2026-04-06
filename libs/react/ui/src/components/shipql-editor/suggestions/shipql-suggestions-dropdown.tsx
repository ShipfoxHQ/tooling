import {PopoverContent} from 'components/popover';
import {ScrollArea} from 'components/scroll-area';
import {Skeleton} from 'components/skeleton';
import {useCallback, useEffect, useRef} from 'react';
import {ShipQLRangeFacetPanel} from './shipql-range-facet-panel';
import {ShipQLSuggestionItem} from './shipql-suggestion-item';
import {ShipQLSuggestionsFooter, type SyntaxHintMode} from './shipql-suggestions-footer';
import type {SuggestionItem} from './types';

interface ShipQLSuggestionsDropdownProps {
  items: SuggestionItem[];
  selectedIndex: number;
  isSelectingRef: React.RefObject<boolean>;
  onSelect: (value: string) => void;
  isLoading?: boolean;
  isNegated: boolean;
  onToggleNegate: (negated: boolean) => void;
  showValueActions: boolean;
  showSyntaxHelp: boolean;
  onToggleSyntaxHelp: () => void;
  isError?: boolean;
  syntaxHintMode: SyntaxHintMode;
}

export function ShipQLSuggestionsDropdown({
  items,
  selectedIndex,
  isSelectingRef,
  onSelect,
  isLoading,
  isNegated,
  onToggleNegate,
  showValueActions,
  showSyntaxHelp,
  onToggleSyntaxHelp,
  isError,
  syntaxHintMode,
}: ShipQLSuggestionsDropdownProps) {
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const prevSelectedIndexRef = useRef<number>(-1);

  useEffect(() => {
    const prevIndex = prevSelectedIndexRef.current;
    prevSelectedIndexRef.current = selectedIndex;

    const prevItem = items[selectedIndex - 1];
    const isPrecededByHeader =
      prevItem?.type === 'section-header' || prevItem?.type === 'facet-context';

    // Scroll to the preceding header only when navigating forward without wrapping.
    // A large index jump means we wrapped around the list, in which case we should
    // scroll to the item itself so it is always visible.
    const isWrapping = prevIndex >= 0 && Math.abs(selectedIndex - prevIndex) > items.length / 2;
    const isForwardWithoutWrap = selectedIndex > prevIndex && !isWrapping;

    const scrollTarget =
      isForwardWithoutWrap && isPrecededByHeader
        ? (itemRefs.current[selectedIndex - 1] ?? itemRefs.current[selectedIndex])
        : itemRefs.current[selectedIndex];
    if (scrollTarget) scrollTarget.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  }, [selectedIndex, items]);

  // Shift key toggles negation while dropdown is visible
  useEffect(() => {
    if (!showValueActions) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') onToggleNegate(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') onToggleNegate(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [showValueActions, onToggleNegate]);

  // Reset negation when showValueActions turns off
  useEffect(() => {
    if (!showValueActions) onToggleNegate(false);
  }, [showValueActions, onToggleNegate]);

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

  const firstItem = items.length === 1 ? items[0] : undefined;
  const rangeItem =
    firstItem?.type === 'range-slider' && firstItem.facetName && firstItem.rangeFacetConfig
      ? (firstItem as Required<Pick<SuggestionItem, 'facetName' | 'rangeFacetConfig'>> &
          SuggestionItem)
      : null;

  const popoverContent = rangeItem ? (
    <div className="flex flex-col overflow-hidden rounded-8 bg-background-neutral-base shadow-tooltip">
      <ScrollArea className="flex-1 min-h-0 overflow-y-auto scrollbar">
        <ShipQLRangeFacetPanel
          facetName={rangeItem.facetName}
          config={rangeItem.rangeFacetConfig}
          isSelectingRef={isSelectingRef}
          onApply={onSelect}
        />
      </ScrollArea>
      <ShipQLSuggestionsFooter
        showValueActions={false}
        showSyntaxHelp={showSyntaxHelp}
        onToggleSyntaxHelp={onToggleSyntaxHelp}
        isError={isError}
        syntaxHintMode="range"
      />
    </div>
  ) : (
    <div className="flex flex-col overflow-hidden rounded-8 bg-background-neutral-base shadow-tooltip max-h-[min(70vh,400px)] min-h-0">
      <ScrollArea className="flex-1 min-h-0 overflow-y-auto scrollbar">
        <div className="flex flex-col">
          {isLoading && items.length === 0 ? (
            <div className="px-8 py-6 flex items-center">
              <Skeleton className="w-60 h-20" />
            </div>
          ) : items.length === 0 ? (
            <div className="px-8 py-6 text-sm text-foreground-neutral-muted">
              No suggestions found
            </div>
          ) : (
            items.map((item, index) => (
              <ShipQLSuggestionItem
                key={item.value}
                item={item}
                isHighlighted={selectedIndex === index}
                isNegated={isNegated && showValueActions}
                onMouseDown={handleMouseDown}
                itemRef={(el) => {
                  itemRefs.current[index] = el;
                }}
              />
            ))
          )}
        </div>
      </ScrollArea>
      <ShipQLSuggestionsFooter
        showValueActions={showValueActions}
        showSyntaxHelp={showSyntaxHelp}
        onToggleSyntaxHelp={onToggleSyntaxHelp}
        isError={isError}
        syntaxHintMode={syntaxHintMode}
      />
    </div>
  );

  return (
    <PopoverContent
      align="start"
      sideOffset={4}
      className="p-0 w-(--radix-popover-trigger-width) rounded-8"
      onOpenAutoFocus={(e) => e.preventDefault()}
      onInteractOutside={(e) => {
        if (isSelectingRef.current) e.preventDefault();
      }}
      onPointerDownOutside={(e) => {
        if (isSelectingRef.current) e.preventDefault();
      }}
    >
      {popoverContent}
    </PopoverContent>
  );
}
