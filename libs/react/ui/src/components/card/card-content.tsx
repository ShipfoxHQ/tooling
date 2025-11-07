import type {ReactNode} from 'react';
import {cn} from 'utils/cn';
import type {CardProps} from './card';
import {Card} from './card';
import {CardAction} from './card-action';
import {CardDescription} from './card-description';
import {CardTitle} from './card-title';

export type CardContentProps = Omit<CardProps, 'children' | 'title'> & {
  leftElement?: ReactNode;
  title?: ReactNode;
  description?: string;
  action?: ReactNode;
  rightElement?: ReactNode;
  padding?: string;
  align?: 'center' | 'start';
};

export function CardContent({
  className,
  variant,
  leftElement,
  title,
  description,
  action,
  rightElement,
  padding,
  align = 'center',
  ...props
}: CardContentProps) {
  const hasLeftSide = Boolean(leftElement);
  const hasRightSide = Boolean(rightElement);
  const hasContent = Boolean(title || description || action);

  const defaultPadding = 'px-12 py-12';
  const paddingClass = padding ?? defaultPadding;

  const alignClass = align === 'start' ? 'self-start' : 'self-center';

  return (
    <Card variant={variant} className={className} {...props}>
      <div
        className={cn(
          'relative flex items-center gap-16',
          paddingClass,
          'flex-col sm:flex-row',
          'min-h-64',
        )}
      >
        {hasLeftSide && (
          <div className={cn('flex shrink-0 items-center justify-center', alignClass)}>
            {leftElement}
          </div>
        )}

        {hasContent && (
          <div className="flex min-w-0 flex-1 flex-col gap-4 text-center sm:text-left">
            {title && typeof title === 'string' ? <CardTitle>{title}</CardTitle> : title}
            {description && <CardDescription>{description}</CardDescription>}
            {action && <CardAction>{action}</CardAction>}
          </div>
        )}

        {hasRightSide && (
          <div className="flex shrink-0 items-center justify-center sm:ml-auto">{rightElement}</div>
        )}
      </div>
    </Card>
  );
}
