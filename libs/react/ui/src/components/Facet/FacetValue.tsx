import type {CheckedState} from '@radix-ui/react-checkbox';
import {Checkbox} from 'components/Checkbox';
import {Label} from 'components/Label';
import {Typography} from 'components/Typography';
import type {HTMLAttributes} from 'react';
import {cn, formatNumberCompact} from 'utils';

export interface FacetValueData {
  value: string | null;
  label: string;
  count?: number | bigint;
  isSelected: boolean;
  isOnlyValueSelected: boolean;
}

export interface FacetValueSelectors {
  onCheckedChange?: (state: CheckedState) => void;
  onInclude: (facetId: string, value: string | null) => void;
  onExclude: (facetId: string, value: string | null) => void;
  onSelect: (facetId: string, value: string | null | undefined) => void;
}

export interface FacetValueProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'>,
    FacetValueData,
    FacetValueSelectors {
  facetId: string;
}

export function FacetValue({
  facetId,
  value,
  label,
  count,
  className,
  onCheckedChange: _onCheckedChange,
  onSelect,
  onInclude,
  onExclude,
  isSelected,
  isOnlyValueSelected,
  ...props
}: FacetValueProps) {
  function onCheckedChange(state: CheckedState) {
    _onCheckedChange?.(state);
    if (state === true) onInclude(facetId, value);
    if (state === false) onExclude(facetId, value);
  }

  function onClick() {
    onSelect(facetId, isOnlyValueSelected ? undefined : value);
  }

  const id = `${facetId}_${value}`;

  return (
    <div
      className={cn(
        'group flex flex-row flex-nowrap items-center p-1 hover:bg-surface-hover hover:text-gray-1000',
        className,
      )}
      {...props}
    >
      <Checkbox id={id} className="mr-1" onCheckedChange={onCheckedChange} checked={isSelected} />
      <Label
        htmlFor={id}
        className="min-w-0 flex-1 cursor-pointer overflow-hidden text-ellipsis text-nowrap"
      >
        {label}
      </Label>
      {count !== undefined ? (
        <Typography variant="muted" className="ml-1 group-hover:hidden">
          {formatNumberCompact(count)}
        </Typography>
      ) : null}
      <button className="ml-1 hidden text-sm group-hover:block" onClick={onClick} type="button">
        {isOnlyValueSelected ? 'All' : 'Only'}
      </button>
    </div>
  );
}
