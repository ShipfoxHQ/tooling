import {Icon} from 'components/icon';
import {Kbd} from 'components/kbd';
import {cn} from '../../../utils/cn';

interface FooterBadgeProps {
  label: string;
  kbd: string;
}

function FooterBadge({label, kbd}: FooterBadgeProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-4 text-xs select-none transition-colors duration-100 text-foreground-neutral-muted',
      )}
    >
      {label}
      <Kbd className="h-16 shrink-0">{kbd}</Kbd>
    </span>
  );
}

interface ShipQLSuggestionsFooterProps {
  showValueActions: boolean;
}

export function ShipQLSuggestionsFooter({showValueActions}: ShipQLSuggestionsFooterProps) {
  return (
    <div className="shrink-0 border-t border-border-neutral-base-component flex items-center justify-between gap-12 px-8 py-4 bg-background-field-base">
      <button
        onClick={(e) => {
          e.stopPropagation();
          // onToggleSyntaxHelp();
        }}
        className={cn(
          'flex items-center gap-4 px-6 py-2 rounded-4 text-xs transition-colors cursor-pointer',
          'text-foreground-neutral-muted hover:text-foreground-neutral-subtle hover:bg-background-button-transparent-hover',
          // showSyntaxHelp
          //   ? 'bg-background-accent-purple-base/15 text-background-accent-purple-base'
          //   : 'text-foreground-neutral-subtle hover:text-foreground-neutral-base hover:bg-background-button-transparent-hover',
        )}
        type="button"
      >
        <Icon name="questionLine" className="size-12" />
        Syntax
      </button>
      <div className="flex items-center gap-4">
        {showValueActions && <FooterBadge label="Negate" kbd="Shift" />}
        <FooterBadge label="New tag" kbd="Tab" />
      </div>
    </div>
  );
}
