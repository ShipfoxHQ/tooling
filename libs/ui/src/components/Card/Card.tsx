import {type ComponentProps, type HTMLAttributes, forwardRef} from 'react';
import {cn} from 'utils';

export type CardProps = ComponentProps<typeof Card>;

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => (
    <div
      ref={ref}
      className={cn('rounded-md border bg-background-secondary', className)}
      {...props}
    />
  ),
);
Card.displayName = 'Card';
