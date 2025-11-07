import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export type CardActionProps = ComponentProps<'div'>;

export function CardAction({className, children, ...props}: CardActionProps) {
  return (
    <div className={cn('mt-8 flex flex-wrap items-center gap-16', className)} {...props}>
      {children}
    </div>
  );
}
