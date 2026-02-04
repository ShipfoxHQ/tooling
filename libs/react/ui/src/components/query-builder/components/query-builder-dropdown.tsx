import {Label} from 'components/label';
import {PopoverContent} from 'components/popover';
import {ScrollArea} from 'components/scroll-area';
import {useCallback} from 'react';
import {cn} from 'utils/cn';
import {DurationSlider} from '../duration-slider';
import type {DropdownItem} from '../hooks';
import type {QueryToken} from '../types';
import {calculateDropdownPosition, parseInput} from '../utils/suggestions';
import {QueryBuilderDropdownItem} from './query-builder-dropdown-item';
import {QueryBuilderFooter} from './query-builder-footer';
import {QueryBuilderSyntaxHelp} from './query-builder-syntax-help';

interface QueryBuilderDropdownProps {
  showDropdown: boolean;
  showSyntaxHelp: boolean;
  syntaxError: {message: string} | null;
  editingToken: QueryToken | null;
  inputValue: string;
  durationRange: [number, number];
  selectedDropdownIndex: number;
  dropdownItems: DropdownItem[];
  inputRef: React.RefObject<HTMLInputElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  container?: HTMLElement | null;
  isSelectingRef: React.MutableRefObject<boolean>;
  onSelect: (value: string) => void;
  onDurationRangeChange: (range: [number, number], hasInputError?: boolean) => void;
  onToggleSyntaxHelp: () => void;
  onEscape: () => void;
  getDropdownHeader: () => string;
}

export function QueryBuilderDropdown({
  showSyntaxHelp,
  syntaxError,
  editingToken,
  inputValue,
  durationRange,
  selectedDropdownIndex,
  dropdownItems,
  inputRef,
  containerRef,
  container,
  isSelectingRef,
  onSelect,
  onDurationRangeChange,
  onToggleSyntaxHelp,
  onEscape,
  getDropdownHeader,
}: QueryBuilderDropdownProps) {
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

  return (
    <PopoverContent
      align="start"
      sideOffset={4}
      className="w-[--radix-popover-trigger-width] p-0 min-w-260 max-w-380"
      onOpenAutoFocus={(e) => e.preventDefault()}
      onEscapeKeyDown={(e) => {
        e.preventDefault();
        onEscape();
      }}
      onInteractOutside={handleInteractOutside}
      onPointerDownOutside={handlePointerDownOutside}
      container={container}
      style={{
        left: `${calculateDropdownPosition(inputRef, containerRef)}px`,
      }}
    >
      <div className="flex flex-col bg-background-neutral-base rounded-10 overflow-hidden shadow-tooltip">
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
            min={0}
            max={3600000}
          />
        )}

        {dropdownItems.length > 0 ? (
          <ScrollArea className="max-h-300">
            <div className="flex flex-col">
              {dropdownItems.map((item, index) => (
                <QueryBuilderDropdownItem
                  key={item.value}
                  item={item}
                  isHighlighted={selectedDropdownIndex === index}
                  onSelect={onSelect}
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
              syntaxError ? 'bg-red-500/8' : 'bg-purple-500/3',
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
        />
      </div>
    </PopoverContent>
  );
}
