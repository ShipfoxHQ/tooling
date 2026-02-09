import {Icon} from 'components/icon';

interface QueryBuilderTextInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  onToggleMode: () => void;
  error: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function QueryBuilderTextInput({
  value,
  onChange,
  onKeyDown,
  onBlur,
  onToggleMode,
  error,
  inputRef,
}: QueryBuilderTextInputProps) {
  return (
    <div className="w-full">
      <div className="bg-background-field-base h-32 relative rounded-6 transition-shadow shadow-border-interactive-with-active w-full flex">
        <div className="flex-1 flex items-center gap-8 px-8 py-6 overflow-hidden">
          <Icon name="searchLine" className="size-16 shrink-0 text-foreground-neutral-subtle" />
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            placeholder="status:success + pipeline:build..."
            className="flex-1 leading-20 text-foreground-neutral-base placeholder:text-foreground-neutral-subtle text-sm bg-transparent outline-none"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleMode();
          }}
          className="shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-colors px-8 flex items-center cursor-pointer w-32 h-32"
          title="Switch to builder mode"
          type="button"
          aria-label="Switch to builder mode"
        >
          <Icon name="functionLine" className="size-16" />
        </button>
      </div>
      {error && <div className="mt-4 text-xs text-foreground-highlight-error">{error}</div>}
    </div>
  );
}
