import {Slider} from 'components/slider';
import {useCallback, useState} from 'react';
import {formatDuration} from '../../../utils/format/duration';
import type {ShipQLFieldDef} from './types';

const DEFAULT_MAX_NS = 60_000_000_000; // 60s
const STEP_NS = 1_000_000_000; // 1s

interface DurationSuggestionContentProps {
  field: ShipQLFieldDef;
  onCommit: (rawToken: string) => void;
}

export function DurationSuggestionContent({field, onCommit}: DurationSuggestionContentProps) {
  const min = field.min ?? 0;
  const max = field.max ?? DEFAULT_MAX_NS;
  const [value, setValue] = useState<[number, number]>([min, max]);

  const handleValueChange = useCallback(
    (v: number[]) => {
      setValue([v[0] ?? min, v[1] ?? max]);
    },
    [min, max],
  );

  const handleValueCommit = useCallback(
    (v: number[]) => {
      const minNs = v[0] ?? min;
      const maxNs = v[1] ?? max;
      const minS = Math.round(minNs / STEP_NS);
      const maxS = Math.round(maxNs / STEP_NS);
      onCommit(`__raw__${field.name}:[${minS}s TO ${maxS}s] `);
    },
    [field.name, min, max, onCommit],
  );

  return (
    <div className="px-8 py-6 flex flex-col gap-8">
      <div className="flex justify-between text-xs text-foreground-neutral-subtle select-none">
        <span>{formatDuration({nanoseconds: value[0]})}</span>
        <span>{formatDuration({nanoseconds: value[1]})}</span>
      </div>
      <Slider
        min={min}
        max={max}
        value={value}
        step={STEP_NS}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
        onPointerDown={(e) => e.preventDefault()}
      />
    </div>
  );
}
