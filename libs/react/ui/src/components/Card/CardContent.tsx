import {type ComponentProps, type HTMLAttributes, forwardRef} from 'react';
import {cn} from 'utils';

export type CardContentProps = ComponentProps<typeof CardContent>;

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => (
    <div ref={ref} className={cn('p-4 pt-0', className)} {...props} />
  ),
);
CardContent.displayName = 'CardContent';
