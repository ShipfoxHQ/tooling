import {useVirtualizer} from '@tanstack/react-virtual';
import {type HTMLAttributes, useRef} from 'react';
import {cn} from 'utils';
import {FacetValue, type FacetValueData, type FacetValueSelectors} from './FacetValue';

export interface FacetListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    FacetValueSelectors {
  id: string;
  values: FacetValueData[];
}

export function FacetList({
  id,
  values,
  onInclude,
  onExclude,
  onSelect,
  className,
  ...props
}: FacetListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: values.length,
    getScrollElement: () => scrollAreaRef.current,
    estimateSize: () => 28,
    overscan: 10,
  });

  return (
    <div
      ref={scrollAreaRef}
      className={cn(['max-h-[280px] overflow-y-auto', className])}
      {...props}
    >
      <div className="relative w-full" style={{height: `${rowVirtualizer.getTotalSize()}px`}}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const value = values[virtualItem.index];
          return (
            <FacetValue
              className="absolute left-0 top-0 w-full"
              style={{
                transform: `translateY(${virtualItem.start}px)`,
              }}
              facetId={id}
              key={value.value}
              value={value.value}
              label={value.label}
              count={value.count}
              isSelected={value.isSelected}
              isOnlyValueSelected={value.isOnlyValueSelected}
              onSelect={onSelect}
              onInclude={onInclude}
              onExclude={onExclude}
            />
          );
        })}
      </div>
    </div>
  );
}
