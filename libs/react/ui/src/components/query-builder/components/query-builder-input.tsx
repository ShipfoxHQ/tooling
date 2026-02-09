import {Icon} from 'components/icon';
import {cn} from 'utils/cn';
import {useQueryBuilderContext} from '../context';
import {QueryBuilderToken} from '../query-builder-token';

export function QueryBuilderInput() {
  const {
    tokens,
    inputValue,
    editingTokenId,
    isFocused,
    syntaxError,
    placeholder,
    inputRef,
    editingTokenAnchorRef,
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
  } = useQueryBuilderContext();

  return (
    <fieldset
      aria-label="Query builder input"
      className={cn(
        'border-0 p-0 m-0 min-w-0 bg-background-field-base min-h-32 relative rounded-6 transition-shadow flex w-full cursor-text',
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
      <div className="w-32 h-32 flex items-center justify-center">
        <Icon name="searchLine" className="size-16 shrink-0 text-foreground-neutral-subtle" />
      </div>
      <div className="flex-1 flex flex-wrap items-center gap-8 py-2 min-w-0 rounded-l-inherit">
        <div
          className={cn(
            'flex gap-6 items-center flex-wrap',
            tokens.length === 0 && 'min-w-120 flex-1',
          )}
        >
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
                    anchorRef: editingTokenAnchorRef,
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
          {editingTokenId ? (
            <button
              type="button"
              tabIndex={0}
              aria-label="Add new filter"
              className="flex-1 min-w-40 min-h-20 cursor-text bg-transparent outline-none"
              onClick={onEditingTokenClick}
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
                'font-normal leading-20 min-h-20 min-w-120 not-italic placeholder:text-foreground-neutral-subtle text-sm bg-transparent outline-none',
                tokens.length === 0 ? 'flex-1' : 'grow',
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
          className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center cursor-pointer w-32 h-32"
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
        className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center cursor-pointer w-32 h-32"
        title="Switch to text mode"
        type="button"
        aria-label="Switch to text mode"
      >
        <Icon name="editLine" className="size-16" />
      </button>
    </fieldset>
  );
}
