import {parse, stringify} from '@shipfox/shipql-parser';
import {Icon} from 'components/icon';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {cn} from 'utils/cn';
import {QueryBuilderBadges} from './components/query-builder-badges';
import type {QueryBadge} from './conversion';
import {
  astToSelectedFacets,
  removeBadgeAndBuildFacets,
  selectedFacetsAndFreeTextToBadges,
  selectedFacetsAndFreeTextToString,
} from './conversion';
import type {SelectedFacets} from './types';

export interface SimpleQueryBuilderProps {
  value?: string;
  onQueryChange?: (query: string) => void;
  onFacetsChange?: (facets: SelectedFacets, freeText: string) => void;
  placeholder?: string;
  className?: string;
}

function safeParse(input: string): ReturnType<typeof parse> | undefined {
  try {
    const trimmed = input.trim();
    if (!trimmed) return null;
    return parse(trimmed);
  } catch {
    return undefined;
  }
}

export function SimpleQueryBuilder({
  value = '',
  onQueryChange,
  onFacetsChange,
  placeholder = 'Type ShipQL: status:success env:prod',
  className,
}: SimpleQueryBuilderProps) {
  const [inputValue, setInputValue] = useState(value);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isRawTextMode, setIsRawTextMode] = useState(false);

  const derived = useMemo(() => {
    const ast = safeParse(value);
    if (ast === undefined)
      return {facets: {} as SelectedFacets, freeText: '', termOrder: [] as string[]};
    return astToSelectedFacets(ast);
  }, [value]);

  const badges = useMemo(
    () => selectedFacetsAndFreeTextToBadges(derived.facets, derived.freeText, derived.termOrder),
    [derived.facets, derived.freeText, derived.termOrder],
  );

  const onFacetsChangeRef = useRef(onFacetsChange);
  onFacetsChangeRef.current = onFacetsChange;
  useEffect(() => {
    onFacetsChangeRef.current?.(derived.facets, derived.freeText);
  }, [derived.facets, derived.freeText]);

  useEffect(() => {
    setInputValue(value);
    setParseError(null);
  }, [value]);

  const commitInput = useCallback(() => {
    const ast = safeParse(inputValue);
    if (ast === undefined && inputValue.trim()) {
      setParseError('Invalid ShipQL');
      return;
    }
    setParseError(null);
    const nextQuery = ast === undefined || ast === null ? '' : stringify(ast);
    if (nextQuery !== value) {
      onQueryChange?.(nextQuery);
    }
  }, [inputValue, value, onQueryChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitInput();
      }
    },
    [commitInput],
  );

  const handleRemoveBadge = useCallback(
    (badge: QueryBadge) => {
      const {facets: nextFacets, freeText: nextFreeText} = removeBadgeAndBuildFacets(
        derived.facets,
        derived.freeText,
        badge,
      );
      const nextQuery = selectedFacetsAndFreeTextToString(nextFacets, nextFreeText);
      onQueryChange?.(nextQuery);
    },
    [derived.facets, derived.freeText, onQueryChange],
  );

  const handleClearAll = useCallback(() => {
    setInputValue('');
    setParseError(null);
    onQueryChange?.('');
  }, [onQueryChange]);

  return (
    <fieldset
      aria-label="Query builder input"
      className={cn(
        'border-0 p-0 m-0 min-w-0 bg-background-field-base min-h-32 relative rounded-6 transition-shadow flex w-full cursor-text shadow-border-interactive-base',
        parseError && 'shadow-border-error',
        className,
      )}
    >
      <div className="w-32 h-32 flex items-center justify-center shrink-0">
        <Icon name="searchLine" className="size-16 text-foreground-neutral-subtle" />
      </div>
      <div className="flex-1 flex flex-wrap items-center gap-8 py-2 min-w-0">
        <div
          className={cn(
            'flex gap-6 items-center flex-wrap w-full',
            !isRawTextMode && badges.length === 0 && 'min-w-120 flex-1',
          )}
        >
          {!isRawTextMode && <QueryBuilderBadges badges={badges} onRemove={handleRemoveBadge} />}
          {isRawTextMode && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setParseError(null);
              }}
              onBlur={commitInput}
              onKeyDown={handleKeyDown}
              placeholder={badges.length === 0 ? placeholder : ''}
              className={cn(
                'font-normal leading-20 min-h-20 min-w-120 not-italic placeholder:text-foreground-neutral-subtle text-sm bg-transparent outline-none',
                badges.length === 0 ? 'flex-1' : 'grow',
                parseError ? 'text-foreground-highlight-error' : 'text-foreground-neutral-base',
              )}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={!!parseError}
              aria-describedby={parseError ? 'simple-query-builder-error' : undefined}
            />
          )}
        </div>
      </div>
      {parseError && (
        <span
          id="simple-query-builder-error"
          className="text-xs text-foreground-highlight-error absolute bottom-0 left-0"
        >
          {parseError}
        </span>
      )}

      {(badges.length > 0 || value) && (
        <button
          type="button"
          onClick={handleClearAll}
          className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center cursor-pointer w-32 h-32"
          title="Clear all filters"
          aria-label="Clear all filters"
        >
          <Icon name="closeLine" className="size-16" />
        </button>
      )}

      <button
        type="button"
        onClick={() => setIsRawTextMode((prev) => !prev)}
        className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center cursor-pointer w-32 h-32"
        title={isRawTextMode ? 'Switch to chip mode' : 'Switch to text mode'}
        aria-label={isRawTextMode ? 'Switch to chip mode' : 'Switch to text mode'}
      >
        <Icon name="editLine" className="size-16" />
      </button>
    </fieldset>
  );
}
