import {Icon, type IconName} from 'components/icon';
import {Text} from 'components/typography';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export interface EmptyStateProps extends ComponentProps<'div'> {
  icon?: IconName;
  title?: string;
  description?: string;
  variant?: 'default' | 'compact';
}

export function EmptyState({
  icon = 'fileDamageLine',
  title,
  description,
  variant = 'default',
  className,
  ...props
}: EmptyStateProps) {
  const containerClasses =
    variant === 'compact'
      ? 'flex flex-col gap-10 items-center justify-center'
      : 'flex flex-col items-center justify-center gap-12 py-48';

  const iconContainerClasses =
    variant === 'compact'
      ? 'size-32 rounded-6 bg-background-neutral-base border border-border-neutral-strong flex items-center justify-center p-8'
      : 'size-32 rounded-6 bg-transparent border border-border-neutral-strong flex items-center justify-center';

  const iconSize = variant === 'compact' ? 'size-20' : 'size-16';

  return (
    <div className={cn(containerClasses, className)} {...props}>
      <div className={iconContainerClasses}>
        <Icon
          name={icon}
          className={cn(iconSize, 'text-foreground-neutral-subtle')}
          color="var(--foreground-neutral-subtle, #a1a1aa)"
        />
      </div>
      <div className={cn('text-center', variant === 'default' && 'space-y-4')}>
        {title && (
          <Text
            size="sm"
            className={
              variant === 'compact'
                ? 'text-foreground-neutral-subtle'
                : 'text-foreground-neutral-base'
            }
          >
            {title}
          </Text>
        )}
        {description && (
          <Text size="xs" className="text-foreground-neutral-muted">
            {description}
          </Text>
        )}
      </div>
    </div>
  );
}
