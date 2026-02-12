import * as SliderPrimitive from '@radix-ui/react-slider';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

const trackDefaults =
  'bg-background-switch-off relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-4 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-4';
const rangeDefaults =
  'bg-foreground-highlight-interactive absolute select-none rounded-full data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full';
const thumbDefaults =
  "relative block size-6 min-w-6 min-h-6 shrink-0 select-none rounded-full border border-border-highlights-interactive bg-foreground-highlight-interactive drop-shadow transition-[color,box-shadow] outline-none after:absolute after:-inset-2 after:block after:content-[''] ring-2 ring-white ring-offset-2 data-disabled:pointer-events-none data-disabled:opacity-50";

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
  const values = Array.isArray(value)
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
      {values.map((_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={`thumb-${index.toString()}`}
          className={cn(thumbDefaults, thumbClassName)}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export {Slider};
