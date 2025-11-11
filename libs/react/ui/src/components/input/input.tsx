import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export const inputVariants = cva('', {
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

type InputProps = Omit<ComponentProps<'input'>, 'size'> & VariantProps<typeof inputVariants>;

export function Input({className, type, variant, size, ...props}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'placeholder:text-foreground-neutral-muted w-full min-w-0 rounded-6 px-8 text-sm leading-20 text-foreground-neutral-base shadow-button-neutral transition-[color,box-shadow] outline-none',
        'hover:bg-background-field-hover',
        'selection:bg-background-accent-neutral-soft selection:text-foreground-neutral-on-inverted',
        'file:text-foreground-neutral-base file:inline-flex file:font-medium',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-background-neutral-disabled disabled:shadow-none disabled:text-foreground-neutral-disabled',
        'focus-visible:shadow-border-interactive-with-active',
        'aria-invalid:shadow-border-error',
        inputVariants({variant, size}),
        className,
      )}
      {...props}
    />
  );
}
