import {Label} from 'components/label';
import {PopoverContent} from 'components/popover';
import {ScrollArea} from 'components/scroll-area';
import {useCallback} from 'react';
import {cn} from 'utils/cn';
import {useQueryBuilderContext} from '../context';
import {DurationSlider} from '../duration-slider';
import {useDropdownPosition} from '../hooks/use-dropdown-position';
import {parseInput} from '../utils/suggestions';
import {QueryBuilderDropdownItem} from './query-builder-dropdown-item';
import {QueryBuilderFooter} from './query-builder-footer';
import {QueryBuilderSyntaxHelp} from './query-builder-syntax-help';

export function QueryBuilderDropdown() {
  const {
    showSyntaxHelp,
    syntaxError,
    editingToken,
    inputValue,
    durationRange,
    selectedDropdownIndex,
    dropdownItems,
    inputRef,
    containerRef,
    editingTokenAnchorRef,
    container,
    isSelectingRef,
    onDropdownSelect,
    onDurationRangeChange,
    onDurationRangeCommit,
    onToggleSyntaxHelp,
    onEscape,
    getDropdownHeader,
  } = useQueryBuilderContext();

  const handleMouseDown = useCallback(
    (value: string) => {
      isSelectingRef.current = true;
      onDropdownSelect(value);
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 150);
    },
    [isSelectingRef, onDropdownSelect],
  );

  const handleInteractOutside = useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;
      if (isSelectingRef.current || inputRef.current?.contains(target)) {
        e.preventDefault();
      }
    },
    [isSelectingRef, inputRef],
  );

  const handlePointerDownOutside = useCallback(
    (e: Event) => {
      const target = e.target as HTMLElement;
      if (isSelectingRef.current || inputRef.current?.contains(target)) {
        e.preventDefault();
      }
    },
    [isSelectingRef, inputRef],
  );

  const position = useDropdownPosition(editingToken, editingTokenAnchorRef, inputRef, containerRef);

  return (
    <PopoverContent
      align="start"
      sideOffset={4}
      className="w-[--radix-popover-trigger-width] p-0"
      onOpenAutoFocus={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => {
        e.preventDefault();
        onEscape();
      }}
      onInteractOutside={handleInteractOutside}
      onPointerDownOutside={handlePointerDownOutside}
      container={container}
      style={
        position
          ? {
              position: 'absolute',
              left: position.left,
              top: position.top,
              minWidth: '300px',
            }
          : undefined
      }
    >
      <div className="flex flex-col bg-background-neutral-base rounded-10 overflow-hidden shadow-tooltip max-h-[min(70vh,400px)] min-h-0">
        {getDropdownHeader() && (
          <div className="shrink-0 w-full px-6 pt-4 pb-2">
            <Label className="text-xs text-foreground-neutral-muted font-medium uppercase tracking-wider">
              {getDropdownHeader()}
            </Label>
          </div>
        )}

        {(editingToken?.key || parseInput(inputValue).field) === 'duration' && (
          <DurationSlider
            value={durationRange}
            onChange={onDurationRangeChange}
            onCommit={onDurationRangeCommit}
            min={0}
            max={3600000}
          />
        )}

        {dropdownItems.length > 0 ? (
          <ScrollArea className="flex-1 min-h-0 max-h-300 overflow-y-auto scrollbar">
            <div className="flex flex-col">
              {dropdownItems.map((item, index) => (
                <QueryBuilderDropdownItem
                  key={item.value}
                  item={item}
                  isHighlighted={selectedDropdownIndex === index}
                  onMouseDown={handleMouseDown}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="px-16 py-12 text-sm text-foreground-neutral-subtle text-center">
            No suggestions available
          </div>
        )}

        {showSyntaxHelp && (
          <div
            className={cn(
              'w-full border-t border-border-neutral-base-component',
              syntaxError
                ? 'bg-background-accent-error-base/8'
                : 'bg-background-accent-purple-base/3',
            )}
          >
            <QueryBuilderSyntaxHelp
              editingToken={editingToken}
              inputValue={inputValue}
              syntaxError={syntaxError}
            />
          </div>
        )}

        <QueryBuilderFooter
          showSyntaxHelp={showSyntaxHelp}
          onToggleSyntaxHelp={onToggleSyntaxHelp}
          isEditingToken={editingToken !== null}
        />
      </div>
    </PopoverContent>
  );
}
