import {Icon} from 'components/icon';
import {useState} from 'react';
import {cn} from 'utils/cn';
import type {QueryToken, QueryValue} from './types';

export interface QueryBuilderTokenProps {
  token: QueryToken;
  isEditing: boolean;
  onClick: () => void;
  onDelete: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  inputValue?: string;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: React.ClipboardEvent) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  hasSyntaxError?: boolean;
}

function renderValue(v: QueryValue) {
  if (v.isNegated) {
    return <span className="text-background-accent-warning-base">-{v.value}</span>;
  }
  return <span className="text-foreground-neutral-base">{v.value}</span>;
}

function renderValues(compact: boolean, values: QueryValue[]) {
  if (values.length === 0) return null;

  if (compact && values.length > 1) {
    return (
      <span className="text-sm">
        {renderValue(values[0])}
        <span className="text-foreground-neutral-base ml-4">+{values.length - 1}</span>
      </span>
    );
  }

  return values.map((v, i) => (
    <span key={`${v.value}-${v.isNegated}-${i}`} className="text-sm">
      {i > 0 && <span className="mx-2 text-background-accent-purple-base text-xs">,</span>}
      {renderValue(v)}
    </span>
  ));
}

export function QueryBuilderToken({
  token,
  isEditing,
  onClick,
  onDelete,
  inputRef,
  inputValue,
  onInputChange,
  onKeyDown,
  onPaste,
  onFocus,
  onBlur,
  hasSyntaxError,
}: QueryBuilderTokenProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const hasMultipleValues = token.values.length >= 2;

  if (!isEditing) {
    return (
      <div className="relative">
        <button
          onClick={onClick}
          onMouseEnter={() => (hasMultipleValues || token.isWildcard) && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={cn(
            'flex gap-2 items-center justify-center px-8 py-2 rounded-6 shrink-0',
            'hover:bg-background-button-transparent-hover transition-colors',
            token.isWildcard
              ? 'bg-background-accent-purple-base/15'
              : 'bg-background-button-transparent-base',
          )}
          type="button"
        >
          <span className="text-sm text-foreground-neutral-base">{token.key}</span>
          <span className="text-sm text-background-accent-purple-base">{token.operator}</span>
          {token.isWildcard ? (
            <span className="text-sm text-background-accent-purple-base">*</span>
          ) : (
            renderValues(true, token.values)
          )}
        </button>
        {showTooltip && hasMultipleValues && !token.isWildcard && (
          <div className="absolute left-0 top-full mt-1 z-20 bg-background-neutral-base border border-border-neutral-base-component rounded-6 px-8 py-6 shadow-tooltip whitespace-nowrap">
            <p className="text-xs text-foreground-neutral-subtle mb-4">
              {token.values.length} values:
            </p>
            <div className="flex flex-col gap-2">
              {token.values.map((v, i) => (
                <span key={`${v.value}-${v.isNegated}-${i}`} className="text-xs">
                  {i > 0 && <span className="mr-4 text-background-accent-purple-base">,</span>}
                  <span
                    className={
                      v.isNegated
                        ? 'text-background-accent-warning-base'
                        : 'text-foreground-neutral-base'
                    }
                  >
                    {v.isNegated ? '-' : ''}
                    {v.value}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
        {showTooltip && token.isWildcard && (
          <div className="absolute left-0 top-full mt-1 z-20 bg-background-neutral-base border border-border-neutral-base-component rounded-6 px-8 py-6 shadow-tooltip whitespace-nowrap">
            <p className="text-xs text-foreground-neutral-subtle">Matches any value</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center relative rounded-bl-6 rounded-tl-6 shrink-0">
      <div className="absolute border border-border-highlights-interactive inset-0 pointer-events-none rounded-6" />
      <div className="flex items-center overflow-clip rounded-6 shadow-border-interactive-with-active">
        <div
          className={cn(
            'flex gap-2 items-center justify-center px-8 py-2 rounded-bl-6 rounded-tl-6 flex-wrap',
            token.isWildcard
              ? 'bg-background-accent-purple-base/15'
              : 'bg-background-button-transparent-base',
          )}
        >
          <span className="text-sm text-foreground-neutral-base">{token.key}</span>
          <span className="text-sm text-background-accent-purple-base">{token.operator}</span>
          {renderValues(false, token.values)}
          {token.values.length > 0 && (
            <span className="text-xs text-background-accent-purple-base">,</span>
          )}
          {inputRef && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue || ''}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onFocus={onFocus}
              onBlur={onBlur}
              className={cn(
                'text-sm bg-transparent outline-none w-[1ch]',
                hasSyntaxError ? 'text-foreground-highlight-error' : 'text-foreground-neutral-base',
              )}
              style={{width: inputValue ? `${Math.max(1, inputValue.length)}ch` : '1ch'}}
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </div>
        <button
          onClick={onDelete}
          className="bg-background-accent-error-base relative rounded-br-6 rounded-tr-6 shrink-0 size-24 hover:bg-background-accent-error-strong transition-colors"
          type="button"
        >
          <Icon
            name="closeLine"
            className="size-16 text-foreground-neutral-base absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        </button>
      </div>
    </div>
  );
}
