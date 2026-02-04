import {Icon} from 'components/icon';
import {cn} from 'utils/cn';
import {QueryBuilderToken} from '../query-builder-token';
import type {SyntaxError as QuerySyntaxError, QueryToken} from '../types';

interface QueryBuilderInputProps {
  tokens: QueryToken[];
  inputValue: string;
  editingTokenId: string | null;
  isFocused: boolean;
  syntaxError: QuerySyntaxError | null;
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onFocus: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInputAreaClick: (e: React.MouseEvent) => void;
  onTokenClick: (token: QueryToken) => void;
  onTokenDelete: (tokenId: string) => void;
  onClearAll: () => void;
  onToggleTextMode: () => void;
  onEditingTokenClick: () => void;
  onEditingTokenKeyDown: (e: React.KeyboardEvent) => void;
}

export function QueryBuilderInput({
  tokens,
  inputValue,
  editingTokenId,
  isFocused,
  syntaxError,
  placeholder,
  inputRef,
  containerRef: _containerRef,
  onInputChange,
  onKeyDown,
  onPaste,
  onFocus,
  onBlur,
  onInputAreaClick,
  onTokenClick,
  onTokenDelete,
  onClearAll,
  onToggleTextMode,
  onEditingTokenClick,
  onEditingTokenKeyDown,
}: QueryBuilderInputProps) {
  return (
    <fieldset
      aria-label="Query builder input"
      className={cn(
        'border-0 p-0 m-0 min-w-0 bg-background-field-base h-32 relative rounded-6 transition-shadow flex w-full cursor-text',
        isFocused ? 'shadow-border-interactive-with-active' : 'shadow-border-interactive-base',
      )}
      onClick={onInputAreaClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onInputAreaClick(e as unknown as React.MouseEvent<HTMLFieldSetElement>);
        }
      }}
    >
      <div
        className={cn(
          'flex-1 flex flex-row items-center rounded-l-inherit h-full',
          tokens.length > 0 ? 'overflow-x-auto scrollbar overflow-y-hidden' : '',
        )}
      >
        <div
          className={cn(
            'flex gap-8 items-center px-8 py-6 h-full',
            tokens.length > 0 ? 'shrink-0' : 'w-full',
          )}
        >
          <Icon name="searchLine" className="size-16 shrink-0 text-foreground-neutral-subtle" />

          <div className={cn('flex gap-6 items-center', tokens.length > 0 ? 'shrink-0' : '')}>
            {tokens.map((token) => (
              <QueryBuilderToken
                key={token.id}
                token={token}
                isEditing={editingTokenId === token.id}
                onClick={() => onTokenClick(token)}
                onDelete={() => onTokenDelete(token.id)}
                {...(editingTokenId === token.id
                  ? {
                      inputRef,
                      inputValue: inputValue ?? '',
                      onInputChange,
                      onKeyDown,
                      onPaste,
                      onFocus,
                      onBlur,
                      hasSyntaxError: !!syntaxError,
                    }
                  : {})}
              />
            ))}
          </div>

          {editingTokenId ? (
            <input
              type="text"
              tabIndex={0}
              aria-label="Add new filter"
              value=""
              readOnly
              className="flex-1 min-w-40 h-full cursor-text bg-transparent outline-none"
              onFocus={onEditingTokenClick}
              onKeyDown={onEditingTokenKeyDown}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={inputValue ?? ''}
              onChange={onInputChange}
              onKeyDown={onKeyDown}
              onPaste={onPaste}
              onFocus={onFocus}
              onBlur={onBlur}
              placeholder={placeholder}
              className={cn(
                'font-normal leading-20 min-h-px not-italic placeholder:text-foreground-neutral-subtle text-sm bg-transparent outline-none',
                tokens.length === 0 ? 'flex-1' : 'basis-0 grow min-w-120',
                syntaxError ? 'text-foreground-highlight-error' : 'text-foreground-neutral-base',
              )}
              autoComplete="off"
              spellCheck={false}
            />
          )}
        </div>
      </div>
      {tokens.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClearAll();
          }}
          className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center border-l border-border-neutral-base-component hover:bg-background-button-transparent-hover"
          title="Clear all filters"
          type="button"
          aria-label="Clear all filters"
        >
          <Icon name="closeLine" className="size-16" />
        </button>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleTextMode();
        }}
        className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center border-l border-border-neutral-base-component hover:bg-background-button-transparent-hover rounded-r-6"
        title="Switch to text mode"
        type="button"
        aria-label="Switch to text mode"
      >
        <Icon name="editLine" className="size-16" />
      </button>
    </fieldset>
  );
}
