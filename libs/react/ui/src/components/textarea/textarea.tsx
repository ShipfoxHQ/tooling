import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export const textareaVariants = cva('', {
  variants: {
    variant: {
      base: 'bg-background-field-base',
      component: 'bg-background-field-component',
    },
    size: {
      base: 'py-6',
      small: 'py-4',
    },
  },
  defaultVariants: {
    variant: 'base',
    size: 'base',
  },
});

type TextareaProps = Omit<ComponentProps<'textarea'>, 'size'> &
  VariantProps<typeof textareaVariants>;

export function Textarea({className, variant, size, ...props}: TextareaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'textarea-resize-custom placeholder:text-foreground-neutral-muted w-full min-w-0 rounded-6 px-8 pr-24 text-sm leading-20 text-foreground-neutral-base shadow-border-base transition-[color,box-shadow] outline-none',
        'hover:bg-background-field-hover',
        'selection:bg-background-accent-neutral-soft selection:text-foreground-neutral-on-inverted',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-background-neutral-disabled disabled:shadow-none disabled:text-foreground-neutral-disabled',
        'focus-visible:shadow-border-interactive-with-active',
        'aria-invalid:shadow-border-error',
        textareaVariants({variant, size}),
        className,
      )}
      {...props}
    />
  );
}
