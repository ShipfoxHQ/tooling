import {cn} from 'utils/cn';
import type {DropdownItem} from '../hooks';

interface QueryBuilderDropdownItemProps {
  item: DropdownItem;
  isHighlighted: boolean;
  onSelect: (value: string) => void;
  onMouseDown: (value: string) => void;
}

export function QueryBuilderDropdownItem({
  item,
  isHighlighted,
  onSelect,
  onMouseDown,
}: QueryBuilderDropdownItemProps) {
  if (item.type === 'section-header') {
    return (
      <div className="w-full flex items-end px-6 shrink-0 h-24">
        <span className="text-xs text-foreground-neutral-subtle font-medium uppercase tracking-wider">
          {item.label}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(item.value)}
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(item.value);
      }}
      className={cn(
        'w-full flex items-center justify-between gap-12 px-8 py-6 text-left',
        'hover:bg-background-button-transparent-hover transition-colors',
        isHighlighted && 'bg-background-button-transparent-hover',
      )}
    >
      <div className="flex gap-12 items-center flex-1 min-w-0">
        {item.icon}
        <span
          className={cn(
            'text-sm flex-1 truncate',
            item.isValueType && !item.selected
              ? 'text-foreground-neutral-subtle'
              : 'text-foreground-neutral-base',
          )}
        >
          {item.label}
        </span>
      </div>
      {item.conflictHint ? (
        <span className="text-xs text-foreground-highlight-error font-medium">
          {item.conflictHint}
        </span>
      ) : item.count !== undefined ? (
        <span className="text-xs text-foreground-neutral-subtle font-mono tabular-nums">
          {item.count}
        </span>
      ) : null}
    </button>
  );
}
