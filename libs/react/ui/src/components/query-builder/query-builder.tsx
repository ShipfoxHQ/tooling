import {Badge} from 'components/badge';
import {Icon} from 'components/icon';
import {Input} from 'components/input';
import {Popover, PopoverContent, PopoverTrigger} from 'components/popover';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';
import {QueryBuilderSuggestions} from './query-builder-suggestions';
import type {QueryBuilderSuggestion} from './use-query-builder';
import {useQueryBuilder} from './use-query-builder';

export interface QueryBuilderProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  /**
   * Current query string value
   */
  value?: string;
  /**
   * Callback when query value changes
   */
  onValueChange?: (value: string) => void;
  /**
   * Callback when query is executed/changed (for running queries)
   */
  onQueryChange?: (query: string) => void;
  /**
   * Available suggestions for autocomplete
   */
  suggestions?: QueryBuilderSuggestion[];
  /**
   * Placeholder text for the input
   */
  placeholder?: string;
  /**
   * Container element for popover positioning
   */
  container?: HTMLElement | null;
  /**
   * Additional class name
   */
  className?: string;
  /**
   * Additional class name for input
   */
  inputClassName?: string;
}

export function QueryBuilder({
  value = '',
  onValueChange,
  onQueryChange,
  suggestions = [],
  placeholder = 'Add filter...',
  container,
  className,
  inputClassName,
}: QueryBuilderProps) {
  const {
    isFocused,
    popoverOpen,
    textEditMode,
    inputValue,
    highlightedIndex,
    isShiftPressed,
    isAltPressed,
    currentProperty,
    filteredSuggestions,
    queryAST,
    inputRef,
    handleFocus,
    handleBlur,
    handleInputChange,
    handleKeyDown,
    handleSuggestionSelect,
    handleRemoveFilterProperty,
    handleToggleTextEditMode,
    setPopoverOpen,
  } = useQueryBuilder({
    value,
    onValueChange,
    suggestions,
    onQueryChange,
  });

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={(open) => {
        if (open) {
          setPopoverOpen(true);
        } else if (!isFocused) {
          setPopoverOpen(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <div className={cn('relative flex-1', className)}>
          <div
            className={cn(
              'flex flex-wrap items-center gap-4 p-8 min-h-40 rounded-6 border',
              'bg-background-field-base',
              'border-border-neutral-base-component',
              'hover:bg-background-field-hover',
              'focus-within:border-border-interactive-with-active focus-within:bg-background-field-hover',
              'transition-colors',
            )}
          >
            {/* Filter pills */}
            {queryAST.filters.map((filter) => (
              <Badge
                key={filter.property}
                variant="neutral"
                size="xs"
                radius="rounded"
                iconRight="close"
                onIconRightClick={(e) => {
                  e.stopPropagation();
                  // Remove entire filter
                  handleRemoveFilterProperty(filter.property);
                }}
                iconRightAriaLabel={`Remove ${filter.property} filter`}
                className={cn(
                  'flex items-center gap-4',
                  filter.values.some((v) => v.negated) && 'border-foreground-danger-base',
                )}
              >
                <span className="font-medium">{filter.property}:</span>
                <span>
                  {filter.values.map((filterValue, idx) => (
                    <span key={`${filter.property}:${filterValue.value}:${idx}`}>
                      {filterValue.negated && (
                        <span className="text-foreground-danger-base">-</span>
                      )}
                      {filterValue.value}
                      {idx < filter.values.length - 1 && (
                        <span className="text-foreground-neutral-muted">, </span>
                      )}
                    </span>
                  ))}
                </span>
              </Badge>
            ))}

            {/* Input field */}
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={isFocused ? handleInputChange : undefined}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              readOnly={!isFocused && !textEditMode}
              placeholder={queryAST.filters.length === 0 ? placeholder : ''}
              iconLeft={
                <Icon
                  name="searchLine"
                  className="size-16 text-foreground-neutral-muted shrink-0"
                />
              }
              iconRight={
                <button
                  type="button"
                  onClick={handleToggleTextEditMode}
                  className="shrink-0 cursor-pointer rounded-4 p-2 hover:bg-background-button-transparent-hover transition-colors"
                  aria-label={textEditMode ? 'Exit text edit mode' : 'Enter text edit mode'}
                >
                  <Icon
                    name={textEditMode ? 'close' : 'fileEditLine'}
                    className="size-16 text-foreground-neutral-muted"
                  />
                </button>
              }
              className={cn(
                'flex-1 min-w-120 border-0 bg-transparent p-0 shadow-none focus-visible:shadow-none',
                'placeholder:text-foreground-neutral-muted',
                inputClassName,
              )}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-(--radix-popover-trigger-width) md:w-auto p-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (
            inputRef.current &&
            (inputRef.current.contains(target) || target.closest('[data-radix-popover-trigger]'))
          )
            return;
          setPopoverOpen(false);
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          setPopoverOpen(false);
          inputRef.current?.blur();
        }}
        container={container}
      >
        {popoverOpen && filteredSuggestions.length > 0 && (
          <QueryBuilderSuggestions
            suggestions={filteredSuggestions}
            highlightedIndex={highlightedIndex}
            onSelect={handleSuggestionSelect}
            isShiftPressed={isShiftPressed}
            isAltPressed={isAltPressed}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
