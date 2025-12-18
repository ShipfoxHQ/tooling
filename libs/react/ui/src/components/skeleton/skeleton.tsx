import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

type SkeletonProps = ComponentProps<'div'>;

export function Skeleton({className, ...props}: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-6 bg-background-neutral-disabled', className)}
      {...props}
    />
  );
}
