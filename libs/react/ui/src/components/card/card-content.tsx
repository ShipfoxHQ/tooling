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
  contentClassName?: string;
};

export function CardContent({
  className,
  variant,
  leftElement,
  title,
  description,
  action,
  rightElement,
  contentClassName,
  ...props
}: CardContentProps) {
  const hasLeftSide = Boolean(leftElement);
  const hasRightSide = Boolean(rightElement);
  const hasContent = Boolean(title || description || action);

  return (
    <Card variant={variant} className={className} {...props}>
      <div
        className={cn(
          'relative flex flex-col sm:flex-row justify-center items-center gap-16 min-h-64 px-12 py-12',
          contentClassName,
        )}
      >
        {hasLeftSide && (
          <div
            className={cn(
              'flex shrink-0 items-center justify-center self-center sm:self-start pt-2',
            )}
          >
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
