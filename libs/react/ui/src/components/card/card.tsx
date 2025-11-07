import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export const cardVariants = cva('transition-all duration-150', {
  variants: {
    variant: {
      primary:
        'bg-background-components-base text-foreground-neutral-base border border-border-neutral-base shadow-button-neutral rounded-8',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export type CardProps = ComponentProps<'div'> & VariantProps<typeof cardVariants>;

export function Card({className, variant, children, ...props}: CardProps) {
  return (
    <div className={cn(cardVariants({variant}), className)} data-slot="card" {...props}>
      {children}
    </div>
  );
}
