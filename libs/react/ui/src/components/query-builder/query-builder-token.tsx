import {Button} from 'components/button';
import {Tooltip, TooltipContent, TooltipTrigger} from 'components/tooltip';
import {useState} from 'react';
import {cn} from 'utils/cn';
import type {QueryToken, QueryValue} from './types';

export interface QueryBuilderTokenProps {
  token: QueryToken;
  isEditing: boolean;
  onClick: () => void;
  onDelete: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
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
  anchorRef,
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
    const showTokenTooltip = showTooltip && (hasMultipleValues || token.isWildcard);
    return (
      <div className="relative">
        <div className="group flex items-center rounded-6 overflow-hidden shrink-0">
          <Tooltip open={showTokenTooltip} onOpenChange={setShowTooltip} delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="xs"
                onClick={onClick}
                onMouseEnter={() => (hasMultipleValues || token.isWildcard) && setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className={cn(
                  'flex gap-2 rounded-l-6 rounded-r-none! px-8! py-1!',
                  token.isWildcard && 'bg-background-accent-purple-base/15!',
                )}
              >
                <span className="text-sm text-foreground-neutral-base">{token.key}</span>
                <span className="text-sm text-background-accent-purple-base">{token.operator}</span>
                {token.isWildcard ? (
                  <span className="text-sm text-background-accent-purple-base">*</span>
                ) : (
                  renderValues(true, token.values)
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              sideOffset={8}
              className="w-fit max-w-none px-8 py-6 whitespace-nowrap"
              animated={false}
            >
              {hasMultipleValues && !token.isWildcard ? (
                <>
                  <p className="text-xs text-foreground-neutral-subtle mb-4">
                    {token.values.length} values:
                  </p>
                  <p className="text-xs max-w-100 overflow-hidden text-wrap wrap-break-word">
                    {token.values.map((v, i) => (
                      <span key={`${v.value}-${v.isNegated}-${i}`}>
                        {i > 0 && <span className="text-background-accent-purple-base">, </span>}
                        <span
                          className={cn(
                            'whitespace-nowrap',
                            v.isNegated
                              ? 'text-background-accent-warning-base'
                              : 'text-foreground-neutral-base',
                          )}
                        >
                          {v.isNegated ? '-' : ''}
                          {v.value}
                        </span>
                      </span>
                    ))}
                  </p>
                </>
              ) : token.isWildcard ? (
                <p className="text-xs text-foreground-neutral-subtle">Matches any value</p>
              ) : null}
            </TooltipContent>
          </Tooltip>
          <Button
            variant="danger"
            size="xs"
            iconLeft="closeLine"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className={cn(
              'bg-background-highlight-interactive! p-0! min-w-0! h-24! w-0! overflow-hidden! opacity-0! shadow-none!',
              'group-hover:w-24! group-hover:opacity-100!',
              'rounded-l-none! rounded-r-6! transition-[width,opacity] duration-200 ease-out',
            )}
            aria-label="Remove filter"
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={anchorRef} className="flex items-center relative rounded-bl-6 rounded-tl-6 shrink-0">
      <div className="absolute border border-border-highlights-interactive inset-0 pointer-events-none rounded-6" />
      <div className="flex items-center overflow-clip rounded-6 shadow-tooltip">
        <div
          className={cn(
            'flex gap-2 items-center justify-center px-8 py-1 rounded-bl-6 rounded-tl-6 flex-wrap',
            token.isWildcard
              ? 'bg-background-accent-purple-base/15'
              : 'bg-background-button-neutral-default',
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
        <Button
          variant="danger"
          size="xs"
          iconLeft="closeLine"
          onClick={onDelete}
          className="bg-background-highlight-interactive! p-0! min-w-0! w-24! h-24! rounded-l-none! rounded-br-6! rounded-tr-6! shadow-none!"
          aria-label="Remove filter"
        />
      </div>
    </div>
  );
}
