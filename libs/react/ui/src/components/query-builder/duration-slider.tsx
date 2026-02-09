import {Input} from 'components/input';
import {Slider} from 'components/slider';
import {useEffect, useRef, useState} from 'react';
import {formatDuration, parseDuration} from './utils';

export interface DurationSliderProps {
  value: [number, number];
  onChange: (value: [number, number], hasInputError?: boolean) => void;
  onCommit?: (value: [number, number], hasInputError?: boolean) => void;
  min?: number;
  max?: number;
}

export function DurationSlider({
  value,
  onChange,
  onCommit,
  min = 0,
  max = 3600000,
}: DurationSliderProps) {
  const [minInputText, setMinInputText] = useState(
    value[0] === min ? '' : formatDuration(value[0]),
  );
  const [maxInputText, setMaxInputText] = useState(
    value[1] === max ? '' : formatDuration(value[1]),
  );
  const [minInputError, setMinInputError] = useState(false);
  const [maxInputError, setMaxInputError] = useState(false);
  const [sliderKey, setSliderKey] = useState(0);
  const lastSliderValueRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    setMinInputText(value[0] === min ? '' : formatDuration(value[0]));
    setMaxInputText(value[1] === max ? '' : formatDuration(value[1]));
    setMinInputError(false);
    setMaxInputError(false);
    const fromSlider =
      lastSliderValueRef.current !== null &&
      value[0] === lastSliderValueRef.current[0] &&
      value[1] === lastSliderValueRef.current[1];
    if (fromSlider) {
      return;
    }
    setSliderKey((k) => k + 1);
  }, [value, min, max]);

  const handleMinBlur = () => {
    const val = minInputText.trim();
    if (!val) {
      onChange([min, value[1]], maxInputError);
      setMinInputError(false);
    } else {
      const ms = parseDuration(val);
      if (ms !== null && ms >= 0 && ms < value[1]) {
        onChange([ms, value[1]], maxInputError);
        setMinInputError(false);
      } else {
        setMinInputError(true);
        onChange(value, true);
      }
    }
  };

  const handleMaxBlur = () => {
    const val = maxInputText.trim();
    if (!val) {
      onChange([value[0], max], minInputError);
      setMaxInputError(false);
    } else {
      const ms = parseDuration(val);
      if (ms !== null && ms > value[0] && ms <= max) {
        onChange([value[0], ms], minInputError);
        setMaxInputError(false);
      } else {
        setMaxInputError(true);
        onChange(value, true);
      }
    }
  };

  const handleSliderChange = (v: number[]) => {
    lastSliderValueRef.current = [v[0], v[1]];
    setMinInputText(v[0] === min ? '' : formatDuration(v[0]));
    setMaxInputText(v[1] === max ? '' : formatDuration(v[1]));
    setMinInputError(false);
    setMaxInputError(false);
    onChange([v[0], v[1]], false);
  };

  const handleSliderCommit = (v: number[]) => {
    lastSliderValueRef.current = [v[0], v[1]];
    onChange([v[0], v[1]], false);
    onCommit?.([v[0], v[1]], false);
    setMinInputError(false);
    setMaxInputError(false);
  };

  return (
    <div className="px-12 py-8 border-b border-border-neutral-base-component bg-background-neutral-subtle">
      <div className="flex items-center gap-8">
        <div className="w-36 shrink-0">
          <Input
            type="text"
            value={minInputText}
            onChange={(e) => setMinInputText(e.target.value)}
            onBlur={handleMinBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="—"
            size="small"
            aria-invalid={minInputError}
            className="text-center text-xs"
          />
        </div>
        <Slider
          key={sliderKey}
          value={value}
          onValueChange={handleSliderChange}
          onValueCommit={handleSliderCommit}
          min={min}
          max={max}
          step={1000}
          className="flex-1 min-w-0"
        />
        <div className="w-36 shrink-0">
          <Input
            type="text"
            value={maxInputText}
            onChange={(e) => setMaxInputText(e.target.value)}
            onBlur={handleMaxBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="—"
            size="small"
            aria-invalid={maxInputError}
            className="text-center text-xs"
          />
        </div>
      </div>
    </div>
  );
}
