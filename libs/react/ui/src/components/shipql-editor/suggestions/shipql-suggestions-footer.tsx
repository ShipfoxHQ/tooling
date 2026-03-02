import {Icon} from 'components/icon';
import {Kbd} from 'components/kbd';
import {cn} from 'utils/cn';

export type SyntaxHintMode = 'value' | 'range';

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

interface SyntaxHintProps {
  label: string;
  example: string;
}

function SyntaxHint({label, example}: SyntaxHintProps) {
  return (
    <span className="flex items-center gap-4 text-xs">
      <span className="text-foreground-neutral-subtle">{label}</span>
      <span className="text-tag-purple-icon">{example}</span>
    </span>
  );
}

const SYNTAX_HINTS: Record<SyntaxHintMode, SyntaxHintProps[]> = {
  value: [
    {label: 'Operators', example: '(a OR b), a AND b'},
    {label: 'Negate', example: '-a:b, NOT a:b'},
    {label: 'Wildcard', example: '*'},
  ],
  range: [
    {label: 'Range', example: '[min TO max]'},
    {label: 'Operators', example: '>=, <=, >, <, ='},
  ],
};

interface ShipQLSuggestionsFooterProps {
  showValueActions: boolean;
  showSyntaxHelp: boolean;
  onToggleSyntaxHelp: () => void;
  isError?: boolean;
  syntaxHintMode: SyntaxHintMode;
}

export function ShipQLSuggestionsFooter({
  showValueActions,
  showSyntaxHelp,
  onToggleSyntaxHelp,
  isError,
  syntaxHintMode,
}: ShipQLSuggestionsFooterProps) {
  const syntaxVisible = showSyntaxHelp || isError;
  const hints = SYNTAX_HINTS[syntaxHintMode];

  return (
    <div className="shrink-0 flex flex-col bg-background-field-base">
      {syntaxVisible && (
        <>
          <div className="border-t border-border-neutral-base-component" />
          {isError && (
            <div className="bg-background-accent-error-base/8 px-8 py-4">
              <p className="text-xs font-medium text-foreground-highlight-error">
                Invalid characters in input
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-16 gap-y-8 px-8 py-4">
            {hints.map((hint) => (
              <SyntaxHint key={hint.label} label={hint.label} example={hint.example} />
            ))}
          </div>
        </>
      )}
      <div className="border-t border-border-neutral-base-component flex items-center justify-between gap-12 px-8 py-4">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSyntaxHelp();
          }}
          className={cn(
            'flex items-center gap-4 px-6 py-2 rounded-6 text-xs font-medium transition-colors cursor-pointer',
            syntaxVisible
              ? 'text-foreground-neutral-base hover:bg-background-button-transparent-hover'
              : 'text-foreground-neutral-muted hover:text-foreground-neutral-subtle hover:bg-background-button-transparent-hover',
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
    </div>
  );
}
