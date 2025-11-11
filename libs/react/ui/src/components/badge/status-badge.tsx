import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';
import {type BadgeVariant, badgeVariants} from './badge';

export type StatusBadgeProps = ComponentProps<'span'> & {
  variant?: BadgeVariant;
  dotClassName?: string;
};

type StatusVariant = 'neutral' | 'info' | 'feature' | 'success' | 'warning' | 'error';

const dotVariantStyles: Record<StatusVariant, string> = {
  neutral: 'bg-tag-neutral-icon',
  info: 'bg-tag-blue-icon',
  feature: 'bg-tag-purple-icon',
  success: 'bg-tag-success-icon',
  warning: 'bg-tag-warning-icon',
  error: 'bg-tag-error-icon',
};

export function StatusBadge({
  className,
  variant = 'neutral',
  children,
  dotClassName,
  ...props
}: StatusBadgeProps) {
  const variantKey = variant ?? 'neutral';
  return (
    <span
      className={cn(badgeVariants({variant, size: '2xs', radius: 'default'}), 'gap-6', className)}
      {...props}
    >
      <span
        className={cn('size-8.5 rounded-2 shrink-0', dotVariantStyles[variantKey], dotClassName)}
      />
      {children}
    </span>
  );
}
