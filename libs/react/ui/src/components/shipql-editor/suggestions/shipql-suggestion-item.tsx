import {cn} from 'utils/cn';
import type {SuggestionItem} from './types';

interface ShipQLSuggestionItemProps {
  item: SuggestionItem;
  isHighlighted: boolean;
  isNegated?: boolean;
  onMouseDown: (value: string) => void;
  itemRef?: (el: HTMLButtonElement | null) => void;
}

export function ShipQLSuggestionItem({
  item,
  isHighlighted,
  isNegated,
  onMouseDown,
  itemRef,
}: ShipQLSuggestionItemProps) {
  if (item.type === 'section-header') {
    return (
      <div className="flex w-full items-center px-8 h-30 shrink-0">
        <span className="text-xs font-normal uppercase text-foreground-neutral-muted">
          {item.label}
        </span>
      </div>
    );
  }

  const labelText = isNegated ? `-${item.label}` : item.label;
  const showRawId = typeof item.label === 'string' && item.label !== item.value;

  return (
    <button
      ref={itemRef}
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(item.value);
      }}
      className={cn(
        'flex w-full gap-12 rounded-none px-8 py-6 text-left transition-colors duration-75 cursor-pointer',
        item.description ? 'items-start' : 'items-center h-24',
        isHighlighted
          ? 'bg-background-button-transparent-hover'
          : 'hover:bg-background-button-transparent-hover',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 gap-12',
          item.description ? 'items-start' : 'items-center',
        )}
      >
        {item.icon}
        {item.description ? (
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-8">
              <span
                className={cn(
                  'flex-1 truncate text-sm',
                  isNegated
                    ? 'text-foreground-highlights-interactive'
                    : item.selected
                      ? 'text-foreground-neutral-base'
                      : 'text-foreground-neutral-subtle',
                )}
              >
                {labelText}
              </span>
              {showRawId && (
                <span className="shrink-0 max-w-[40%] truncate font-mono text-xs text-foreground-neutral-muted">
                  {item.value}
                </span>
              )}
            </div>
            <span
              title={item.description}
              className="truncate text-xs text-foreground-neutral-muted"
            >
              {item.description}
            </span>
          </div>
        ) : (
          <span
            className={cn(
              'flex-1 truncate text-sm',
              isNegated
                ? 'text-foreground-highlights-interactive'
                : item.selected
                  ? 'text-foreground-neutral-base'
                  : 'text-foreground-neutral-subtle',
            )}
          >
            {labelText}
          </span>
        )}
      </div>
      {isHighlighted && (
        <span className="shrink-0 text-xs text-foreground-neutral-muted font-medium select-none">
          ↵
        </span>
      )}
    </button>
  );
}
