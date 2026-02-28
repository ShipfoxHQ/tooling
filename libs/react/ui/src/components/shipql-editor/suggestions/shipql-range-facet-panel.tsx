import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {Slider} from 'components/slider';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {cn} from 'utils/cn';
import type {RangeFacetConfig} from './types';

const RECENT_MAX = 5;

const INPUT_CLASSES =
  'w-40 shrink-0 rounded-4 border border-border-neutral-base-component bg-background-field-base shadow-button-neutral transition-[color,box-shadow] outline-none px-4 py-2 text-center text-xs text-foreground-neutral-base focus-visible:shadow-border-interactive-with-active [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';

function getRecentKey(facetName: string): string {
  return `shipql-range-recent-${facetName}`;
}

function loadRecent(facetName: string): string[] {
  try {
    const raw = localStorage.getItem(getRecentKey(facetName));
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveRecent(facetName: string, value: string): void {
  const existing = loadRecent(facetName).filter((v) => v !== value);
  const next = [value, ...existing].slice(0, RECENT_MAX);
  try {
    localStorage.setItem(getRecentKey(facetName), JSON.stringify(next));
  } catch {
    // ignore storage errors
  }
}

function clearRecent(facetName: string): void {
  try {
    localStorage.removeItem(getRecentKey(facetName));
  } catch {
    // ignore storage errors
  }
}

interface PresetRowProps {
  value: string;
  onClick: (value: string) => void;
  isRecent?: boolean;
}

function PresetRow({value, onClick, isRecent}: PresetRowProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-12 rounded-none px-8 py-6 h-28 text-left transition-colors duration-75 cursor-pointer',
        'hover:bg-background-button-transparent-hover',
      )}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick(value);
      }}
    >
      <Icon
        name={isRecent ? 'timeLine' : 'arrowRightLongFill'}
        className="size-16 shrink-0 text-foreground-neutral-subtle"
      />
      <span className="flex-1 truncate text-sm text-foreground-neutral-subtle">{value}</span>
    </button>
  );
}

export interface ShipQLRangeFacetPanelProps {
  facetName: string;
  config: RangeFacetConfig;
  onApply: (value: string) => void;
  isSelectingRef: React.RefObject<boolean>;
}

export function ShipQLRangeFacetPanel({
  facetName,
  config,
  onApply,
  isSelectingRef,
}: ShipQLRangeFacetPanelProps) {
  const absMin = Number(config.min);
  const absMax = Number(config.max);

  const [sliderValues, setSliderValues] = useState<[number, number]>([absMin, absMax]);
  const [recentValues, setRecentValues] = useState<string[]>(() => loadRecent(facetName));

  // Local string state for inputs so mid-edit typing isn't clamped
  const [minText, setMinText] = useState(String(absMin));
  const [maxText, setMaxText] = useState(String(absMax));

  const [lo, hi] = sliderValues;

  // Keep input text in sync when slider moves
  useEffect(() => {
    setMinText(String(lo));
  }, [lo]);
  useEffect(() => {
    setMaxText(String(hi));
  }, [hi]);

  // Hold dropdown open for any pointer interaction inside the panel
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const onDown = () => {
      isSelectingRef.current = true;
    };
    const onUp = () => {
      // Small delay so the blur handler fires first and sees isSelectingRef=true
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 150);
    };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isSelectingRef]);

  const addLabel = useMemo(() => {
    if (lo === absMin && hi === absMax) return `Add ">=${lo},<=${hi}"`;
    if (lo === absMin) return `Add "<=${hi}"`;
    if (hi === absMax) return `Add ">=${lo}"`;
    return `Add ">=${lo},<=${hi}"`;
  }, [lo, hi, absMin, absMax]);

  const buildValue = useCallback(() => {
    if (lo === absMin && hi === absMax) return `[${lo} TO ${hi}]`;
    if (lo === absMin) return `<=${hi}`;
    if (hi === absMax) return `>=${lo}`;
    return `[${lo} TO ${hi}]`;
  }, [lo, hi, absMin, absMax]);

  const handleApplyRange = useCallback(() => {
    const value = buildValue();
    saveRecent(facetName, value);
    setRecentValues(loadRecent(facetName));
    onApply(value);
  }, [buildValue, facetName, onApply]);

  const handlePreset = useCallback(
    (preset: string) => {
      saveRecent(facetName, preset);
      setRecentValues(loadRecent(facetName));
      onApply(preset);
    },
    [facetName, onApply],
  );

  const handleClearRecent = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      clearRecent(facetName);
      setRecentValues([]);
    },
    [facetName],
  );

  // Commit min input on blur or Enter
  const commitMin = useCallback(() => {
    const v = Number(minText);
    if (!Number.isNaN(v)) {
      const clamped = Math.min(Math.max(v, absMin), hi);
      setSliderValues([clamped, hi]);
      setMinText(String(clamped));
    } else {
      setMinText(String(lo));
    }
  }, [minText, absMin, hi, lo]);

  // Commit max input on blur or Enter
  const commitMax = useCallback(() => {
    const v = Number(maxText);
    if (!Number.isNaN(v)) {
      const clamped = Math.max(Math.min(v, absMax), lo);
      setSliderValues([lo, clamped]);
      setMaxText(String(clamped));
    } else {
      setMaxText(String(hi));
    }
  }, [maxText, absMax, lo, hi]);

  return (
    <div ref={panelRef} className="flex flex-col">
      {/* Header */}
      <div className="flex w-full items-center px-8 h-30 shrink-0 border-b border-border-neutral-base-component">
        <span className="text-xs font-normal uppercase text-foreground-neutral-muted">
          {facetName}
        </span>
      </div>

      {/* Slider row */}
      <div className="p-8 space-y-2">
        <div className="flex items-center gap-12">
          <input
            type="number"
            value={minText}
            onChange={(e) => setMinText(e.target.value)}
            onBlur={commitMin}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitMin();
            }}
            className={INPUT_CLASSES}
          />
          <Slider
            className="flex-1"
            min={absMin}
            max={absMax}
            value={sliderValues}
            onValueChange={(vals) => {
              const newLo = vals[0];
              const newHi = vals[1];
              if (newLo !== undefined && newHi !== undefined) {
                setSliderValues([newLo, newHi]);
              }
            }}
          />
          <input
            type="number"
            value={maxText}
            onChange={(e) => setMaxText(e.target.value)}
            onBlur={commitMax}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitMax();
            }}
            className={INPUT_CLASSES}
          />
        </div>
        <Button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleApplyRange();
          }}
          variant="secondary"
          size="sm"
          className="mt-6 w-full justify-start shadow-none rounded-4!"
          iconLeft="addLine"
        >
          {addLabel}
        </Button>
      </div>

      {/* Presets */}
      {(recentValues.length > 0 || (config.presets && config.presets.length > 0)) && (
        <div className="border-t border-border-neutral-base-component">
          {recentValues.length > 0 && (
            <>
              <div className="flex w-full items-center px-8 h-30 shrink-0">
                <span className="flex-1 text-xs font-normal uppercase text-foreground-neutral-muted">
                  Recent
                </span>
                <Button
                  type="button"
                  variant="transparentMuted"
                  size="xs"
                  onMouseDown={handleClearRecent}
                >
                  Clear
                </Button>
              </div>
              {recentValues.slice(0, 3).map((v) => (
                <PresetRow key={v} value={v} onClick={handlePreset} isRecent />
              ))}
            </>
          )}
          {config.presets && config.presets.length > 0 && (
            <>
              <div className="flex w-full items-center px-8 h-30 shrink-0">
                <span className="text-xs font-normal uppercase text-foreground-neutral-muted">
                  Common
                </span>
              </div>
              {config.presets.map((v) => (
                <PresetRow key={v} value={v} onClick={handlePreset} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
