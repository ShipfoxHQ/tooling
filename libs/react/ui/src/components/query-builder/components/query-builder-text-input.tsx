import {Icon} from 'components/icon';

interface QueryBuilderTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onToggleMode: () => void;
  error: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function QueryBuilderTextInput({
  value,
  onChange,
  onKeyDown,
  onToggleMode,
  error,
  inputRef,
}: QueryBuilderTextInputProps) {
  return (
    <div className="w-full">
      <div className="bg-background-field-base h-32 relative rounded-6 transition-shadow shadow-border-interactive-with-active w-full flex">
        <div className="flex-1 flex items-center gap-8 px-8 py-6 overflow-hidden">
          <Icon name="searchLine" className="size-16 shrink-0 text-foreground-neutral-base" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="status:success + pipeline:build..."
            className="flex-1 leading-20 text-foreground-neutral-base placeholder:text-foreground-neutral-subtle text-sm bg-transparent outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="shrink-0 flex items-center px-8 text-xs text-foreground-neutral-subtle border-l border-border-neutral-base-component">
          ↵ Apply · Esc Revert
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMode();
          }}
          className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center border-l border-border-neutral-base-component hover:bg-background-button-transparent-hover rounded-r-6"
          title="Switch to builder mode"
          type="button"
          aria-label="Switch to builder mode"
        >
          <Icon name="gridLine" className="size-14" />
        </button>
      </div>
      {error && <div className="mt-4 text-xs text-red-500">{error}</div>}
    </div>
  );
}
