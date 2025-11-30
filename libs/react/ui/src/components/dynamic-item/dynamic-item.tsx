import type {ReactNode} from 'react';
import {cn} from 'utils/cn';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  type ItemProps,
  ItemTitle,
} from '../item/item';

export type DynamicItemProps = Omit<ItemProps, 'variant' | 'children' | 'title'> & {
  variant?: 'default' | 'neutral';
  leftElement?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  rightElement?: ReactNode;
  contentClassName?: string;
};

export function DynamicItem({
  className,
  variant = 'default',
  leftElement,
  title,
  description,
  action,
  rightElement,
  contentClassName,
  ...props
}: DynamicItemProps) {
  const hasLeftSide = Boolean(leftElement);
  const hasRightSide = Boolean(rightElement);
  const hasContent = Boolean(title || description || action);

  return (
    <Item variant={variant} className={className} {...props}>
      <div
        className={cn(
          'relative flex flex-col sm:flex-row justify-center items-center gap-16 min-h-64 px-12 py-12',
          contentClassName,
        )}
      >
        {hasLeftSide && (
          <ItemMedia className={cn('self-center sm:self-start pt-2')}>{leftElement}</ItemMedia>
        )}

        {hasContent && (
          <ItemContent className="text-center sm:text-left">
            {title ? typeof title === 'string' ? <ItemTitle>{title}</ItemTitle> : title : null}
            {description ? (
              typeof description === 'string' ? (
                <ItemDescription>{description}</ItemDescription>
              ) : (
                description
              )
            ) : null}
            {action && (
              <ItemActions className={cn('mt-8 flex flex-wrap items-center gap-16')}>
                {action}
              </ItemActions>
            )}
          </ItemContent>
        )}

        {hasRightSide && (
          <ItemActions className="self-center sm:ml-auto">{rightElement}</ItemActions>
        )}
      </div>
    </Item>
  );
}
