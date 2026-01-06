import type {VariantProps} from 'class-variance-authority';
import {Icon} from 'components/icon';
import {Input, type inputVariants} from 'components/input';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import type {ComponentProps} from 'react';
import {useCallback, useEffect, useMemo, useRef} from 'react';
import {cn} from 'utils/cn';

export type DropdownInputItem<T = unknown> = {
  id: string | number;
  label: string;
  value: T;
};

type BaseInputProps = Omit<ComponentProps<'input'>, 'size' | 'onSelect'> &
  VariantProps<typeof inputVariants> & {
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
  };

export type DropdownInputProps<T = unknown> = Omit<
  BaseInputProps,
  'value' | 'onChange' | 'iconRight'
> & {
  value: string;
  onValueChange: (value: string) => void;
  onSelect?: (item: DropdownInputItem<T>) => void;
  items: DropdownInputItem<T>[];
  isLoading?: boolean;
  isFetching?: boolean;
  minQueryLength?: number;
  emptyPlaceholder?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  focusedIndex: number;
  onFocusedIndexChange: (index: number) => void;
  selectedItem?: DropdownInputItem<T> | null;
  dropdownClassName?: string;
};

export function DropdownInput<T = unknown>({
  value,
  onValueChange,
  onSelect,
  items = [],
  isLoading = false,
  isFetching = false,
  minQueryLength = 1,
  emptyPlaceholder = 'No results found',
  open,
  onOpenChange,
  focusedIndex,
  onFocusedIndexChange,
  selectedItem,
  dropdownClassName,
  className,
  ...inputProps
}: DropdownInputProps<T>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const hasStableQuery = value.length >= minQueryLength;
  const isSearching = isLoading || isFetching;
  const hasResults = items.length > 0;
  const shouldShowDropdown = open && hasStableQuery && !isSearching;

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
    },
    [onValueChange, onFocusedIndexChange],
  );

  const rightIcon = useMemo(() => {
    if (selectedItem && selectedItem.label === value && value.length > 0) {
      return <Icon name="check" className="size-16 text-tag-success-icon" />;
    }
    if (isSearching && hasStableQuery) {
      return <Icon name="spinner" className="size-16 text-foreground-neutral-base" />;
    }
    return undefined;
  }, [selectedItem, isSearching, value, hasStableQuery]);

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
        inputRef.current?.blur();
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
    <Popover open={shouldShowDropdown} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Input
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            iconRight={rightIcon}
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
            <div className="flex flex-col gap-4">
              <div className="px-8 py-6 text-xs leading-20 text-foreground-neutral-muted">
                Select a repository
              </div>
              {items.map((item: DropdownInputItem<T>, index) => {
                const isSelected = selectedItem?.id === item.id;
                const isFocused = focusedIndex === index;

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => onFocusedIndexChange(index)}
                    className={cn(
                      'flex items-center gap-8 rounded-4 px-8 py-6 text-left text-sm leading-20',
                      'text-foreground-neutral-subtle outline-none transition-colors',
                      'hover:bg-background-components-hover hover:text-foreground-neutral-base',
                      'focus:bg-background-components-hover focus:text-foreground-neutral-base',
                      (isSelected || isFocused) &&
                        'bg-background-components-hover text-foreground-neutral-base',
                    )}
                  >
                    <span className="flex-1 truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-8 py-6 text-xs leading-20 text-foreground-neutral-muted">
              {emptyPlaceholder}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
