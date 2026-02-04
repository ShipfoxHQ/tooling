import {Icon} from 'components/icon';
import {Kbd} from 'components/kbd';
import {cn} from 'utils/cn';

interface QueryBuilderFooterProps {
  showSyntaxHelp: boolean;
  onToggleSyntaxHelp: () => void;
}

export function QueryBuilderFooter({showSyntaxHelp, onToggleSyntaxHelp}: QueryBuilderFooterProps) {
  return (
    <div className="border-t border-border-neutral-base-component bg-background-components-base px-16 py-8">
      <div className="flex items-center justify-between gap-12">
        <div className="flex items-center gap-12">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSyntaxHelp();
            }}
            className={cn(
              'flex items-center gap-4 px-6 py-2 rounded-4 text-xs transition-colors',
              showSyntaxHelp
                ? 'bg-background-accent-purple-base/15 text-background-accent-purple-base'
                : 'text-foreground-neutral-subtle hover:text-foreground-neutral-base hover:bg-background-button-transparent-hover',
            )}
            type="button"
          >
            <Icon name="questionLine" className="size-12" />
            Syntax
          </button>
        </div>
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-8">
            <span className="text-xs text-foreground-neutral-subtle">Negate</span>
            <Kbd className="h-16 shrink-0">⌥</Kbd>
          </div>
          <div className="h-12 w-px bg-border-neutral-strong" />
          <div className="flex items-center gap-8">
            <span className="text-xs text-foreground-neutral-subtle">New tag</span>
            <Kbd className="h-16 shrink-0">Tab</Kbd>
          </div>
          <div className="h-12 w-px bg-border-neutral-strong" />
          <div className="flex items-center gap-8">
            <span className="text-xs text-foreground-neutral-subtle">Navigation</span>
            <Kbd className="size-16 shrink-0">↓</Kbd>
            <Kbd className="size-16 shrink-0">↑</Kbd>
          </div>
          <div className="h-12 w-px bg-border-neutral-strong" />
          <div className="flex items-center gap-8">
            <span className="text-xs text-foreground-neutral-subtle">Select</span>
            <Kbd className="size-16 shrink-0">↵</Kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
