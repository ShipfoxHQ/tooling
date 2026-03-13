import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {Slider} from 'components/slider';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {cn} from 'utils/cn';
import type {RangeFacetConfig} from './types';

const RECENT_MAX = 5;

const RANGE_BRACKET_RE = /^\[(\S+)\s+TO\s+(\S+)\]$/;
const RANGE_OP_RE = /^([<>]=?)(.+)$/;

function formatRangeDisplay(raw: string, fmt: (n: number) => string): string {
  const bracketMatch = RANGE_BRACKET_RE.exec(raw);
  if (bracketMatch) {
    const min = Number(bracketMatch[1]);
    const max = Number(bracketMatch[2]);
    if (!Number.isNaN(min) && !Number.isNaN(max)) return `[${fmt(min)} TO ${fmt(max)}]`;
  }
  const opMatch = RANGE_OP_RE.exec(raw);
  if (opMatch) {
    const v = Number(opMatch[2]);
    if (!Number.isNaN(v)) return `${opMatch[1]}${fmt(v)}`;
  }
  return raw;
}

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
  displayValue?: string;
  onClick: (value: string) => void;
  isRecent?: boolean;
  isHighlighted?: boolean;
  rowRef?: (el: HTMLButtonElement | null) => void;
}

function PresetRow({
  value,
  displayValue,
  onClick,
  isRecent,
  isHighlighted,
  rowRef,
}: PresetRowProps) {
  return (
    <button
      ref={rowRef}
      type="button"
      className={cn(
        'flex w-full items-center gap-12 rounded-none px-8 py-6 h-28 text-left transition-colors duration-75 cursor-pointer',
        isHighlighted
          ? 'bg-background-button-transparent-hover'
          : 'hover:bg-background-button-transparent-hover',
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
      <span className="flex-1 truncate text-sm text-foreground-neutral-subtle">
        {displayValue ?? value}
      </span>
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
  const fmt = config.format ?? String;

  const [sliderValues, setSliderValues] = useState<[number, number]>([absMin, absMax]);
  const [recentValues, setRecentValues] = useState<string[]>(() => loadRecent(facetName));
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(-1);
  const selectedPresetIndexRef = useRef(-1);
  selectedPresetIndexRef.current = selectedPresetIndex;
  const presetRowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Local string state for inputs so mid-edit typing isn't clamped
  const [minText, setMinText] = useState(fmt(absMin));
  const [maxText, setMaxText] = useState(fmt(absMax));
  const [isEditingMin, setIsEditingMin] = useState(false);
  const [isEditingMax, setIsEditingMax] = useState(false);

  const [lo, hi] = sliderValues;

  // Keep input text in sync when slider moves (only when not actively editing)
  useEffect(() => {
    if (!isEditingMin) setMinText(fmt(lo));
  }, [lo, fmt, isEditingMin]);
  useEffect(() => {
    if (!isEditingMax) setMaxText(fmt(hi));
  }, [hi, fmt, isEditingMax]);

  const commitMin = useCallback(
    (text: string) => {
      setIsEditingMin(false);
      const n = Number(text);
      if (!Number.isNaN(n)) {
        const clamped = Math.max(absMin, Math.min(n, hi));
        setSliderValues([clamped, hi]);
      }
      setMinText(fmt(lo));
    },
    [absMin, hi, lo, fmt],
  );

  const commitMax = useCallback(
    (text: string) => {
      setIsEditingMax(false);
      const n = Number(text);
      if (!Number.isNaN(n)) {
        const clamped = Math.max(lo, Math.min(n, absMax));
        setSliderValues([lo, clamped]);
      }
      setMaxText(fmt(hi));
    },
    [absMax, lo, hi, fmt],
  );

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
    if (lo === absMin && hi === absMax) return `Add ">=${fmt(lo)},<=${fmt(hi)}"`;
    if (lo === absMin) return `Add "<=${fmt(hi)}"`;
    if (hi === absMax) return `Add ">=${fmt(lo)}"`;
    return `Add ">=${fmt(lo)},<=${fmt(hi)}"`;
  }, [lo, hi, absMin, absMax, fmt]);

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

  // Build flat list of navigable preset values (recent + common)
  const navigableItems = useMemo(() => {
    const items: string[] = [];
    for (const v of recentValues.slice(0, 3)) items.push(v);
    if (config.presets) {
      for (const v of config.presets) items.push(v);
    }
    return items;
  }, [recentValues, config.presets]);

  // Keyboard navigation for preset/recent items (capture phase to fire before Lexical)
  useEffect(() => {
    if (navigableItems.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is editing min/max inputs
      if (document.activeElement instanceof HTMLInputElement) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPresetIndex((prev) => (prev + 1 >= navigableItems.length ? 0 : prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        e.stopPropagation();
        setSelectedPresetIndex((prev) => (prev - 1 < 0 ? navigableItems.length - 1 : prev - 1));
      } else if (e.key === 'Enter') {
        const idx = selectedPresetIndexRef.current;
        if (idx < 0) return;
        e.preventDefault();
        e.stopPropagation();
        const value = navigableItems[idx];
        if (value) handlePreset(value);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [navigableItems, handlePreset]);

  // Scroll selected preset into view
  useEffect(() => {
    const el = presetRowRefs.current[selectedPresetIndex];
    if (el) el.scrollIntoView({behavior: 'smooth', block: 'nearest'});
  }, [selectedPresetIndex]);

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
            type="text"
            className={INPUT_CLASSES}
            value={minText}
            onChange={(e) => {
              setIsEditingMin(true);
              setMinText(e.target.value);
            }}
            onBlur={(e) => commitMin(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            onFocus={() => {
              setIsEditingMin(true);
              setMinText(String(lo));
            }}
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
            type="text"
            className={INPUT_CLASSES}
            value={maxText}
            onChange={(e) => {
              setIsEditingMax(true);
              setMaxText(e.target.value);
            }}
            onBlur={(e) => commitMax(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            onFocus={() => {
              setIsEditingMax(true);
              setMaxText(String(hi));
            }}
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
              {recentValues.slice(0, 3).map((v, i) => (
                <PresetRow
                  key={v}
                  value={v}
                  displayValue={formatRangeDisplay(v, fmt)}
                  onClick={handlePreset}
                  isRecent
                  isHighlighted={selectedPresetIndex === i}
                  rowRef={(el) => {
                    presetRowRefs.current[i] = el;
                  }}
                />
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
              {config.presets.map((v, i) => {
                const idx = recentValues.slice(0, 3).length + i;
                return (
                  <PresetRow
                    key={v}
                    value={v}
                    displayValue={formatRangeDisplay(v, fmt)}
                    onClick={handlePreset}
                    isHighlighted={selectedPresetIndex === idx}
                    rowRef={(el) => {
                      presetRowRefs.current[idx] = el;
                    }}
                  />
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
