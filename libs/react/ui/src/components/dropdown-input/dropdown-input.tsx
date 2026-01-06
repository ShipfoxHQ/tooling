import {useQuery} from '@tanstack/react-query';
import type {VariantProps} from 'class-variance-authority';
import {Icon} from 'components/icon';
import {Input, type inputVariants} from 'components/input';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import type {ComponentProps} from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {cn} from 'utils/cn';
import {debounce} from 'utils/debounce';

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
  value?: string;
  onValueChange?: (value: string) => void;
  onSelect?: (item: DropdownInputItem<T>) => void;
  queryFn: (query: string) => Promise<DropdownInputItem<T>[]>;
  queryKey: string;
  debounceMs?: number;
  minQueryLength?: number;
  emptyPlaceholder?: string;
  renderItem?: (item: DropdownInputItem<T>) => React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedItem?: DropdownInputItem<T> | null;
  dropdownClassName?: string;
};

export function DropdownInput<T = unknown>({
  value: controlledValue,
  onValueChange,
  onSelect,
  queryFn,
  queryKey,
  debounceMs = 300,
  minQueryLength = 1,
  emptyPlaceholder = 'No results found',
  renderItem,
  open: controlledOpen,
  onOpenChange,
  selectedItem,
  dropdownClassName,
  className,
  ...inputProps
}: DropdownInputProps<T>) {
  const [internalValue, setInternalValue] = useState('');
  const [internalOpen, setInternalOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      onOpenChange ? onOpenChange(newOpen) : setInternalOpen(newOpen);
    },
    [onOpenChange],
  );

  const setValue = useCallback(
    (newValue: string) => {
      onValueChange ? onValueChange(newValue) : setInternalValue(newValue);
    },
    [onValueChange],
  );

  const debouncedSetQuery = useMemo(
    () =>
      debounce((query: string) => {
        setDebouncedQuery(query);
      }, debounceMs),
    [debounceMs],
  );

  useEffect(() => {
    if (value.length >= minQueryLength) {
      debouncedSetQuery(value);
    } else {
      setDebouncedQuery('');
    }
  }, [value, minQueryLength, debouncedSetQuery]);

  const {
    data: items = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [queryKey, debouncedQuery],
    queryFn: () => queryFn(debouncedQuery),
    enabled: debouncedQuery.length >= minQueryLength,
    staleTime: 5 * 60 * 1000,
  });

  const hasStableQuery = debouncedQuery.length >= minQueryLength;
  const isSearching = isLoading || isFetching;
  const hasResults = items.length > 0;

  useEffect(() => {
    const isValueSelected = selectedItem && selectedItem.label === value;
    if (hasStableQuery && !isSearching && value.length > 0 && !isValueSelected) {
      setOpen(true);
      setFocusedIndex(-1);
    } else if (!hasStableQuery || value.length === 0 || isValueSelected) {
      setOpen(false);
      setFocusedIndex(-1);
    }
  }, [hasStableQuery, isSearching, value, selectedItem, setOpen]);

  const handleSelect = useCallback(
    (item: DropdownInputItem<T>) => {
      setValue(item.label);
      onSelect?.(item);
      setOpen(false);
      inputRef.current?.blur();
    },
    [setValue, setOpen, onSelect],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setFocusedIndex(-1);
    },
    [setValue],
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

  const shouldShowDropdown = open && hasStableQuery && !isSearching;

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!shouldShowDropdown || items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
      } else if (e.key === 'Enter' && focusedIndex >= 0) {
        e.preventDefault();
        const item = items[focusedIndex];
        if (item) {
          handleSelect(item);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        inputRef.current?.blur();
      }
    },
    [shouldShowDropdown, items, focusedIndex, handleSelect, setOpen],
  );

  const handleInputBlur = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      const activeElement = document.activeElement;
      const popoverContent = activeElement?.closest('[data-radix-popper-content-wrapper]');
      if (!popoverContent) {
        setOpen(false);
      }
    }, 200);
  }, [setOpen]);

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
    <Popover open={shouldShowDropdown} onOpenChange={setOpen}>
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
                const itemContent = renderItem ? renderItem(item) : item.label;

                return (
                  <button
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={cn(
                      'flex items-center gap-8 rounded-4 px-8 py-6 text-left text-sm leading-20',
                      'text-foreground-neutral-subtle outline-none transition-colors',
                      'hover:bg-background-components-hover hover:text-foreground-neutral-base',
                      'focus:bg-background-components-hover focus:text-foreground-neutral-base',
                      (isSelected || isFocused) &&
                        'bg-background-components-hover text-foreground-neutral-base',
                    )}
                  >
                    <span className="flex-1 truncate">{itemContent}</span>
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
