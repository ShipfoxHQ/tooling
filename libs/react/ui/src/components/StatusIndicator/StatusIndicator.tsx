import {type VariantProps, cva} from 'class-variance-authority';
import type {DetailedHTMLProps, HTMLAttributes} from 'react';
import {cn} from 'utils';

export const statusIndicatorVariants = cva('h-2 w-2 rounded-full flex flex-row justify-end', {
  variants: {
    status: {
      success: 'bg-status-success',
      failed: 'bg-status-failed',
      warning: 'bg-status-warning',
      pending: 'bg-status-neutral animate-spin',
    },
  },
  defaultVariants: {
    status: 'success',
  },
});

export type StatusIndicatorProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> &
  VariantProps<typeof statusIndicatorVariants>;

export function StatusIndicator({status, className, ...props}: StatusIndicatorProps) {
  return (
    <div className={cn(statusIndicatorVariants({status}), className)} {...props}>
      <div
        className={cn('h-full w-6/12 rounded-e-full bg-surface', {hidden: status !== 'pending'})}
      />
    </div>
  );
}
