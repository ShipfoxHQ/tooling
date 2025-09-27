import {Slider} from 'components/Slider';
import {Typography} from 'components/Typography';
import type {ReactNode} from 'react';

export interface RangeFacetContentProps {
  id: string;
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  format?: (value: number) => ReactNode;
  onValueChange?: (facetId: string, value: [number, number]) => void;
  onValueCommit?: (facetId: string, value: [number, number]) => void;
}

export function RangeFacetContent({
  id,
  min,
  max,
  value,
  step,
  format,
  onValueChange,
  onValueCommit,
}: RangeFacetContentProps) {
  return (
    <div className="w-full flex-col gap-2">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col justify-start">
          <Typography>Min</Typography>
          <Typography>{format ? format(value[0]) : value[0]}</Typography>
        </div>
        <div className="flex flex-col justify-end">
          <Typography className="text-right">Max</Typography>
          <Typography className="text-right">{format ? format(value[1]) : value[1]}</Typography>
        </div>
      </div>
      <Slider
        min={min}
        max={max}
        value={value}
        step={step}
        onValueChange={(newValue) => onValueChange?.(id, newValue as [number, number])}
        onValueCommit={(newValue) => onValueCommit?.(id, newValue as [number, number])}
        onLostPointerCapture={() => onValueCommit?.(id, value)}
      />
    </div>
  );
}
