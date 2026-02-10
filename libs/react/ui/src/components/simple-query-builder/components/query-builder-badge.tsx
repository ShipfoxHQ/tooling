import {Button} from 'components/button';
import {cn} from 'utils/cn';
import type {QueryBadge} from '../conversion';

export interface QueryBuilderBadgeProps {
  badge: QueryBadge;
  onRemove: (badge: QueryBadge) => void;
  className?: string;
}

export function QueryBuilderBadge({badge, onRemove, className}: QueryBuilderBadgeProps) {
  const prefix = badge.type === 'facet' && badge.methodology === 'exclude' ? '-' : '';
  const label = badge.type === 'facet' ? `${prefix}${badge.facetId}:` : '';

  return (
    <div className={cn('group flex items-center rounded-6 overflow-hidden shrink-0', className)}>
      <Button
        type="button"
        variant="secondary"
        size="xs"
        className="flex gap-2 rounded-l-6 rounded-r-none! px-8! py-1!"
        aria-label={badge.type === 'facet' ? `${badge.facetId} filter` : 'Free text filter'}
      >
        <span className="text-sm text-foreground-neutral-base">{label}</span>
        <span className="text-sm text-background-accent-purple-base">{badge.displayValue}</span>
      </Button>
      <Button
        type="button"
        variant="danger"
        size="xs"
        iconLeft="closeLine"
        aria-label={badge.type === 'facet' ? `Remove ${badge.facetId}` : 'Remove free text'}
        className={cn(
          'bg-background-highlight-interactive! p-0! min-w-0! h-24! w-0! overflow-hidden! opacity-0! shadow-none!',
          'group-hover:w-24! group-hover:opacity-100!',
          'rounded-l-none! rounded-r-6! transition-[width,opacity] duration-200 ease-out',
        )}
        onClick={() => onRemove(badge)}
      />
    </div>
  );
}
