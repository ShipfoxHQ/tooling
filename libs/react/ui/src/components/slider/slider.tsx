import * as SliderPrimitive from '@radix-ui/react-slider';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

const trackDefaults =
  'bg-background-switch-off relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4';
const rangeDefaults =
  'bg-foreground-highlight-interactive absolute select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full';
const thumbDefaults =
  "block size-8 min-w-8 min-h-8 shrink-0 select-none rounded-full border border-border-highlights-interactive bg-foreground-highlight-interactive shadow-button-neutral transition-[color,box-shadow] outline-none after:absolute after:-inset-2 after:block after:content-[''] hover:ring-2 hover:ring-background-accent-warning-base/50 focus-visible:ring-2 focus-visible:ring-background-accent-warning-base focus-visible:ring-offset-2 active:ring-2 active:ring-background-accent-warning-base/50 disabled:pointer-events-none disabled:opacity-50";

export type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
  trackClassName?: string;
  rangeClassName?: string;
  thumbClassName?: string;
};

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  trackClassName,
  rangeClassName,
  thumbClassName,
  ...props
}: SliderProps) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max];

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'data-[orientation=vertical]:min-h-40 relative flex w-full touch-none select-none items-center data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className={cn(trackDefaults, trackClassName)}>
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(rangeDefaults, rangeClassName)}
        />
      </SliderPrimitive.Track>
      {_values.map((val) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={val}
          className={cn(thumbDefaults, thumbClassName)}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export {Slider};
