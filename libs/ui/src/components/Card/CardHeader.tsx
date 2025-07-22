import {type ComponentProps, type HTMLAttributes, forwardRef} from 'react';
import {cn} from 'utils';

export type CardHeaderProps = ComponentProps<typeof CardHeader>;

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-4', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';
