import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {Icon, type IconName} from 'components/icon';
import type {ComponentProps, ReactNode} from 'react';
import {cn} from 'utils/cn';

// Breadcrumb Root
const breadcrumbVariants = cva('flex items-center gap-4', {
  variants: {
    theme: {
      muted: '',
      subtle: '',
    },
  },
  defaultVariants: {
    theme: 'muted',
  },
});

export type BreadcrumbProps = ComponentProps<'nav'> &
  VariantProps<typeof breadcrumbVariants> & {
    children: ReactNode;
  };

export function Breadcrumb({className, theme, children, ...props}: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn(breadcrumbVariants({theme}), className)} {...props}>
      {children}
    </nav>
  );
}

// Breadcrumb Item
const breadcrumbItemVariants = cva('flex items-center gap-4', {
  variants: {
    theme: {
      muted: 'text-foreground-neutral-muted',
      subtle: 'text-foreground-neutral-subtle',
    },
    state: {
      default: 'cursor-pointer',
      current: 'cursor-default text-foreground-neutral-base',
      disabled: 'cursor-not-allowed opacity-50',
    },
  },
  defaultVariants: {
    theme: 'muted',
    state: 'default',
  },
});

export type BreadcrumbItemProps = ComponentProps<'span'> &
  VariantProps<typeof breadcrumbItemVariants> & {
    asChild?: boolean;
    icon?: IconName;
    showDropdown?: boolean;
    onDropdownClick?: () => void;
    dropdownAriaLabel?: string;
  };

export function BreadcrumbItem({
  className,
  theme,
  state,
  asChild = false,
  children,
  icon,
  showDropdown = false,
  onDropdownClick,
  dropdownAriaLabel,
  ...props
}: BreadcrumbItemProps) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      className={cn(
        breadcrumbItemVariants({theme, state}),
        'text-xs font-medium leading-20',
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="size-16" />}
      <span className="overflow-ellipsis overflow-hidden">{children}</span>
      {showDropdown && (
        <button
          type="button"
          onClick={onDropdownClick}
          className="inline-flex items-center justify-center transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500"
          aria-label={dropdownAriaLabel || 'Open dropdown'}
        >
          <Icon name="expandUpDownLine" className="size-16" />
        </button>
      )}
    </Comp>
  );
}

// Breadcrumb Link
export type BreadcrumbLinkProps = Omit<ComponentProps<'a'>, 'href'> &
  VariantProps<typeof breadcrumbItemVariants> & {
    href?: string;
    icon?: IconName;
    showDropdown?: boolean;
    onDropdownClick?: () => void;
    dropdownAriaLabel?: string;
  };

export function BreadcrumbLink({
  className,
  theme,
  state = 'default',
  href,
  children,
  icon,
  showDropdown = false,
  onDropdownClick,
  dropdownAriaLabel,
  ...props
}: BreadcrumbLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        breadcrumbItemVariants({theme, state}),
        'text-xs font-medium leading-20 hover:text-foreground-neutral-base transition-colors',
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="size-16" />}
      <span className="overflow-ellipsis overflow-hidden">{children}</span>
      {showDropdown && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDropdownClick?.();
          }}
          className="inline-flex items-center justify-center transition-colors hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500"
          aria-label={dropdownAriaLabel || 'Open dropdown'}
        >
          <Icon name="expandUpDownLine" className="size-16" />
        </button>
      )}
    </a>
  );
}

// Breadcrumb Separator
const breadcrumbSeparatorVariants = cva('flex items-center justify-center shrink-0', {
  variants: {
    theme: {
      muted: 'text-foreground-neutral-muted',
      subtle: 'text-foreground-neutral-subtle',
    },
  },
  defaultVariants: {
    theme: 'muted',
  },
});

export type BreadcrumbSeparatorProps = ComponentProps<'span'> &
  VariantProps<typeof breadcrumbSeparatorVariants> & {
    children?: ReactNode;
  };

export function BreadcrumbSeparator({
  className,
  theme,
  children = '/',
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        breadcrumbSeparatorVariants({theme}),
        'text-xs font-medium leading-20',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Breadcrumb Page (Current page, non-interactive)
export type BreadcrumbPageProps = Omit<ComponentProps<'span'>, 'aria-current'> &
  VariantProps<typeof breadcrumbItemVariants> & {
    icon?: IconName;
  };

export function BreadcrumbPage({className, theme, children, icon, ...props}: BreadcrumbPageProps) {
  return (
    <span
      aria-current="page"
      className={cn(
        breadcrumbItemVariants({theme, state: 'current'}),
        'text-xs font-medium leading-20',
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} className="size-16" />}
      <span className="overflow-ellipsis overflow-hidden">{children}</span>
    </span>
  );
}

// Breadcrumb Ellipsis (for collapsed items)
type BreadcrumbEllipsisButtonProps = Omit<ComponentProps<'button'>, 'onClick'> &
  VariantProps<typeof breadcrumbItemVariants> & {
    onClick: () => void;
  };

type BreadcrumbEllipsisSpanProps = ComponentProps<'span'> &
  VariantProps<typeof breadcrumbItemVariants> & {
    onClick?: never;
  };

export type BreadcrumbEllipsisProps = BreadcrumbEllipsisButtonProps | BreadcrumbEllipsisSpanProps;

export function BreadcrumbEllipsis({className, theme, onClick, ...props}: BreadcrumbEllipsisProps) {
  const isInteractive = Boolean(onClick);

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          breadcrumbItemVariants({theme}),
          'text-xs font-medium leading-20 hover:text-foreground-neutral-base transition-colors',
          className,
        )}
        aria-label="Show more breadcrumb items"
        {...(props as ComponentProps<'button'>)}
      >
        ...
      </button>
    );
  }

  return (
    <span
      className={cn(breadcrumbItemVariants({theme}), 'text-xs font-medium leading-20', className)}
      aria-hidden="true"
      {...(props as ComponentProps<'span'>)}
    >
      ...
    </span>
  );
}
