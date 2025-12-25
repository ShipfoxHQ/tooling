import type {VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {useCallback, useRef, useState} from 'react';
import {cn} from 'utils/cn';
import {Icon} from '../icon';
import {searchInputVariants} from './search-variants';

export type SearchInlineProps = Omit<ComponentProps<'input'>, 'size'> &
  VariantProps<typeof searchInputVariants> & {
    showClearButton?: boolean;
    onClear?: () => void;
  };

export function SearchInline({
  className,
  variant,
  size,
  radius,
  value,
  onChange,
  onClear,
  showClearButton = true,
  ...props
}: SearchInlineProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  const hasValue = Boolean(inputValue);
  const isSmall = size === 'small';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    },
    [isControlled, onChange],
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }

    if (onChange && inputRef.current) {
      inputRef.current.value = '';
      const syntheticEvent = {
        target: inputRef.current,
        currentTarget: inputRef.current,
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
    onClear?.();
    inputRef.current?.focus();
  }, [isControlled, onChange, onClear]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape' && hasValue) {
        e.preventDefault();
        handleClear();
      }
    },
    [hasValue, handleClear],
  );

  return (
    <div
      data-slot="search-inline"
      className={cn(searchInputVariants({variant, size, radius}), className)}
    >
      <Icon
        name="searchLine"
        className={cn('shrink-0 text-foreground-neutral-muted', isSmall ? 'size-14' : 'size-16')}
      />
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-1 bg-transparent outline-none min-w-0',
          'text-base md:text-sm',
          'text-foreground-neutral-base',
          'placeholder:text-foreground-neutral-muted',
          'disabled:cursor-not-allowed disabled:text-foreground-neutral-disabled',
        )}
        {...props}
      />
      {showClearButton && hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'shrink-0 cursor-pointer rounded-4 p-2 -mx-2',
            'text-foreground-neutral-muted hover:text-foreground-neutral-subtle transition-colors',
          )}
          aria-label="Clear search"
        >
          <Icon name="closeLine" className="size-16" />
        </button>
      )}
    </div>
  );
}
