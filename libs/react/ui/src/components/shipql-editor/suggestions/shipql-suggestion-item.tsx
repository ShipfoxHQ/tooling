import {cn} from '../../../utils/cn';
import type {SuggestionItem} from './types';

interface ShipQLSuggestionItemProps {
  item: SuggestionItem;
  isHighlighted: boolean;
  onMouseDown: (value: string) => void;
  itemRef?: (el: HTMLButtonElement | null) => void;
}

export function ShipQLSuggestionItem({
  item,
  isHighlighted,
  onMouseDown,
  itemRef,
}: ShipQLSuggestionItemProps) {
  if (item.type === 'section-header') {
    return (
      <div className="flex w-full items-end px-6 h-24 shrink-0">
        <span className="text-xs font-medium uppercase tracking-wider text-foreground-neutral-subtle">
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
        'flex w-full items-center gap-12 rounded-none px-8 py-6 h-24 text-left',
        'transition-colors duration-75',
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
            item.selected ? 'text-foreground-neutral-base' : 'text-foreground-neutral-subtle',
          )}
        >
          {item.label}
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
