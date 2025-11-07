import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export type CardTitleProps = ComponentProps<'h3'>;

export function CardTitle({className, children, ...props}: CardTitleProps) {
  return (
    <h3
      className={cn(
        'text-sm font-medium leading-20 text-foreground-neutral-base truncate',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}
