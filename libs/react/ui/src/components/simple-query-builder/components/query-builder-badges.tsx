import type {QueryBadge} from '../conversion';
import {QueryBuilderBadge} from './query-builder-badge';

export interface QueryBuilderBadgesProps {
  badges: QueryBadge[];
  onRemove: (badge: QueryBadge) => void;
}

export function QueryBuilderBadges({badges, onRemove}: QueryBuilderBadgesProps) {
  if (badges.length === 0) return null;
  return (
    <>
      {badges.map((badge) => (
        <QueryBuilderBadge key={badge.id} badge={badge} onRemove={onRemove} />
      ))}
    </>
  );
}
