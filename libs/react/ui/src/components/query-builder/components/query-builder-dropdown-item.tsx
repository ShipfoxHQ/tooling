import {Button} from 'components/button';
import {cn} from 'utils/cn';
import type {DropdownItem} from '../hooks';

interface QueryBuilderDropdownItemProps {
  item: DropdownItem;
  isHighlighted: boolean;
  onMouseDown: (value: string) => void;
}

export function QueryBuilderDropdownItem({
  item,
  isHighlighted,
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
    <Button
      variant="transparent"
      size="xs"
      onMouseDown={(e) => {
        e.preventDefault();
        onMouseDown(item.value);
      }}
      className={cn(
        'w-full rounded-none h-24 gap-12 px-8 py-6 text-left',
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
    </Button>
  );
}
