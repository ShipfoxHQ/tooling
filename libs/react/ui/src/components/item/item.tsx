import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export const itemVariants = cva('transition-all duration-150 rounded-8', {
  variants: {
    variant: {
      default:
        'bg-background-components-base text-foreground-neutral-base border border-border-neutral-base shadow-button-neutral',
      neutral:
        'bg-background-neutral-base text-foreground-neutral-base border border-border-neutral-base shadow-button-neutral',
    },
    size: {
      default: '',
      sm: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export type ItemProps = ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & {
    asChild?: boolean;
  };

export function Item({className, variant, size, asChild = false, children, ...props}: ItemProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp data-slot="item" className={cn(itemVariants({variant, size}), className)} {...props}>
      {children}
    </Comp>
  );
}

// ItemGroup
export type ItemGroupProps = ComponentProps<'div'>;

export function ItemGroup({className, children, ...props}: ItemGroupProps) {
  return (
    <div data-slot="item-group" className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  );
}

// ItemActions
export type ItemActionsProps = ComponentProps<'div'>;

export function ItemActions({className, children, ...props}: ItemActionsProps) {
  return (
    <div
      data-slot="item-actions"
      className={cn('flex shrink-0 items-center gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ItemContent
export type ItemContentProps = ComponentProps<'div'>;

export function ItemContent({className, children, ...props}: ItemContentProps) {
  return (
    <div
      data-slot="item-content"
      className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ItemDescription
export type ItemDescriptionProps = ComponentProps<'p'>;

export function ItemDescription({className, children, ...props}: ItemDescriptionProps) {
  return (
    <p
      data-slot="item-description"
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

// ItemFooter
export type ItemFooterProps = ComponentProps<'div'>;

export function ItemFooter({className, children, ...props}: ItemFooterProps) {
  return (
    <div
      data-slot="item-footer"
      className={cn('flex shrink-0 items-center gap-8 px-12 py-8', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ItemHeader
export type ItemHeaderProps = ComponentProps<'div'>;

export function ItemHeader({className, children, ...props}: ItemHeaderProps) {
  return (
    <div
      data-slot="item-header"
      className={cn('flex shrink-0 items-center gap-8 px-12 py-8', className)}
      {...props}
    >
      {children}
    </div>
  );
}

// ItemMedia
export const itemMediaVariants = cva('flex shrink-0 items-center justify-center', {
  variants: {
    variant: {
      default: '',
      icon: 'text-foreground-neutral-base',
      image: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type ItemMediaProps = ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>;

export function ItemMedia({className, variant, children, ...props}: ItemMediaProps) {
  return (
    <div data-slot="item-media" className={cn(itemMediaVariants({variant}), className)} {...props}>
      {children}
    </div>
  );
}

// ItemTitle
export type ItemTitleProps = ComponentProps<'h3'>;

export function ItemTitle({className, children, ...props}: ItemTitleProps) {
  return (
    <h3
      data-slot="item-title"
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

// ItemSeparator
export type ItemSeparatorProps = ComponentProps<'div'>;

export function ItemSeparator({className, ...props}: ItemSeparatorProps) {
  return (
    <div
      data-slot="item-separator"
      className={cn('h-px bg-border-neutral-base', className)}
      {...props}
    />
  );
}
