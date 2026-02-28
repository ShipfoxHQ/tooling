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

  return (
    <button
      ref={itemRef}
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(item.value);
      }}
      className={cn(
        'flex w-full items-center gap-12 rounded-none px-8 py-6 h-24 text-left transition-colors duration-75 cursor-pointer',
        isHighlighted
          ? 'bg-background-button-transparent-hover'
          : 'hover:bg-background-button-transparent-hover',
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-12">
        {item.icon}
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
          {isNegated ? `-${item.label}` : item.label}
        </span>
      </div>
      {isHighlighted && (
        <span className="shrink-0 text-xs text-foreground-neutral-muted font-medium select-none">
          ↵
        </span>
      )}
    </button>
  );
}
