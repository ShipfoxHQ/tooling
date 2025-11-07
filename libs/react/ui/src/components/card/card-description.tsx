import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export type CardDescriptionProps = ComponentProps<'p'>;

export function CardDescription({className, children, ...props}: CardDescriptionProps) {
  return (
    <p
      className={cn(
        'text-xs leading-20 text-foreground-neutral-subtle max-w-250 sm:max-w-fit line-clamp-3',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
