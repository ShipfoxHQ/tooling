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
  onClose: () => void;
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
  onClose,
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

    const isWrapping = prevIndex >= 0 && Math.abs(selectedIndex - prevIndex) > items.length / 2;
    // When wrapping bottom→top the header is safe to include (it's just above the
    // first item). When wrapping top→bottom we skip the header because it sits far
    // above the last item and pinning to it would push the actual item off-screen.
    const isWrappingToBottom = isWrapping && selectedIndex > prevIndex;
    const isGoingForward =
      (selectedIndex > prevIndex && !isWrapping) || (isWrapping && !isWrappingToBottom);

    if (!isWrappingToBottom && isPrecededByHeader) {
      const headerEl = itemRefs.current[selectedIndex - 1] ?? itemRefs.current[selectedIndex];
      // Going forward / wrapping to top: pin the header to the top so the selected
      // item below it is visible. Going backward: nearest is enough because the
      // header is above and scrolling up will bring it into view at the top edge.
      const block = isGoingForward ? 'start' : 'nearest';
      if (headerEl) headerEl.scrollIntoView({behavior: 'smooth', block});
    } else {
      const el = itemRefs.current[selectedIndex];
      if (el) el.scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
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
      }, 0);
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
        if (isSelectingRef.current) {
          e.preventDefault();
          return;
        }
        onClose();
      }}
      onPointerDownOutside={(e) => {
        if (isSelectingRef.current) {
          e.preventDefault();
          return;
        }
        onClose();
      }}
    >
      {popoverContent}
    </PopoverContent>
  );
}
