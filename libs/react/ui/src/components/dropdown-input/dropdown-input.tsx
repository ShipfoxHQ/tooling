import {Button} from 'components/button';
import {Input} from 'components/input';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import type {ComponentProps} from 'react';
import {type ReactNode, useCallback, useEffect, useRef} from 'react';
import {cn} from 'utils/cn';

export type DropdownInputItem<T = unknown> = {
  id: string | number;
  label: string;
  value: T;
};

type InputBaseProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'onSelect'>;

export type DropdownInputProps<T = unknown> = InputBaseProps & {
  value: string;
  onValueChange: (value: string) => void;
  onSelect?: (item: DropdownInputItem<T>) => void;
  items: DropdownInputItem<T>[];
  emptyPlaceholder?: string | ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  focusedIndex: number;
  onFocusedIndexChange: (index: number) => void;
  selectedItem?: DropdownInputItem<T> | null;
  dropdownClassName?: string;
  contactSupportHref?: string;
};

export function DropdownInput<T = unknown>({
  value,
  onValueChange,
  onSelect,
  items = [],
  emptyPlaceholder,
  open,
  onOpenChange,
  focusedIndex,
  onFocusedIndexChange,
  selectedItem,
  dropdownClassName,
  className,
  contactSupportHref = '#',
  ...inputProps
}: DropdownInputProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isDisabled = Boolean(inputProps.disabled);
  const hasResults = items.length > 0;
  const shouldShowDropdown = open && !isDisabled;

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (isDisabled) {
        if (!nextOpen) onOpenChange(false);
        return;
      }
      onOpenChange(nextOpen);
    },
    [isDisabled, onOpenChange],
  );

  const handleSelect = useCallback(
    (item: DropdownInputItem<T>) => {
      onValueChange(item.label);
      onSelect?.(item);
      onOpenChange(false);
      inputRef.current?.blur();
    },
    [onValueChange, onOpenChange, onSelect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onValueChange(e.target.value);
      onFocusedIndexChange(-1);
      if (!open && !isDisabled) {
        onOpenChange(true);
      }
    },
    [onValueChange, onFocusedIndexChange, open, isDisabled, onOpenChange],
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!shouldShowDropdown || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onFocusedIndexChange(focusedIndex < items.length - 1 ? focusedIndex + 1 : 0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        onFocusedIndexChange(focusedIndex > 0 ? focusedIndex - 1 : items.length - 1);
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        const item = items[focusedIndex];
        if (item) {
          handleSelect(item);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange(false);
      }
    },
    [shouldShowDropdown, items, focusedIndex, onFocusedIndexChange, handleSelect, onOpenChange],
  );

  const handleInputBlur = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      const activeElement = document.activeElement;
      const popoverContent = activeElement?.closest('[data-radix-popper-content-wrapper]');
      if (!popoverContent) {
        onOpenChange(false);
      }
    }, 200);
  }, [onOpenChange]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({block: 'nearest'});
    }
  }, [focusedIndex]);

  const handlePointerDownOutside = useCallback(
    (e: {target: EventTarget | null; preventDefault: () => void}) => {
      const target = e.target as HTMLElement;
      if (target && popoverContentRef.current?.contains(target)) {
        e.preventDefault();
      }
    },
    [],
  );

  return (
    <Popover open={shouldShowDropdown} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Input
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            onFocus={() => {
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
                blurTimeoutRef.current = null;
              }
              if (!open && !isDisabled && value.length > 0 && hasResults) {
                onOpenChange(true);
              }
            }}
            className={className}
            {...inputProps}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className={cn(
          'w-(--radix-popover-trigger-width) rounded-8 bg-background-components-base p-4 shadow-tooltip',
          dropdownClassName,
        )}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={handlePointerDownOutside}
        onInteractOutside={handlePointerDownOutside}
      >
        <div
          ref={popoverContentRef}
          className="max-h-200 overflow-y-auto overscroll-contain scrollbar"
          onWheel={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {hasResults ? (
            <div className="flex flex-col gap-4 p-4">
              <div className="p-4 text-xs leading-20 text-foreground-neutral-muted">
                Select a repository
              </div>
              {items.map((item: DropdownInputItem<T>, index) => {
                const isSelected = selectedItem?.id === item.id;
                const isFocused = focusedIndex === index;

                return (
                  <Button
                    key={item.id}
                    type="button"
                    variant="transparent"
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    onClick={() => handleSelect(item)}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => onFocusedIndexChange(index)}
                    className={cn(
                      '!px-8 w-full text-left text-foreground-neutral-subtle',
                      (isSelected || isFocused) &&
                        'bg-background-components-hover text-foreground-neutral-base',
                    )}
                  >
                    <span className="flex-1 truncate">{item.label}</span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-xs leading-20 text-foreground-neutral-muted">
              {emptyPlaceholder ? emptyPlaceholder : null}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
