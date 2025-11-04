import {cva, type VariantProps} from 'class-variance-authority';
import {Icon} from 'components/icon';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

const alertVariants = cva(
  'relative w-full rounded-6 px-16 py-12 text-sm flex gap-12 items-start border',
  {
    variants: {
      variant: {
        default:
          'bg-background-components-base text-foreground-neutral-base border-tag-neutral-border',
        info: 'bg-tag-blue-bg text-foreground-neutral-base border-tag-blue-border',
        success: 'bg-tag-success-bg text-foreground-neutral-base border-tag-success-border',
        warning: 'bg-tag-warning-bg text-foreground-neutral-base border-tag-warning-border',
        destructive: 'bg-tag-error-bg text-foreground-neutral-base border-tag-error-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const alertLineVariants = cva('w-4 self-stretch rounded-full', {
  variants: {
    variant: {
      default: 'bg-tag-neutral-icon',
      info: 'bg-tag-blue-icon',
      success: 'bg-tag-success-icon',
      warning: 'bg-tag-warning-icon',
      destructive: 'bg-tag-error-icon',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const closeIconVariants = cva('w-16 h-16', {
  variants: {
    variant: {
      default: 'text-tag-neutral-icon',
      info: 'text-tag-blue-icon',
      success: 'text-tag-success-icon',
      warning: 'text-tag-warning-icon',
      destructive: 'text-tag-error-icon',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type AlertProps = ComponentProps<'div'> & VariantProps<typeof alertVariants>;

function Alert({className, variant, children, ...props}: AlertProps) {
  return (
    <div className="w-full flex items-start gap-4">
      <div data-slot="alert-line" className={cn(alertLineVariants({variant}))} aria-hidden="true" />
      <div
        data-slot="alert"
        role="alert"
        className={cn(alertVariants({variant}), className)}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function AlertContent({className, ...props}: ComponentProps<'div'>) {
  return <div data-slot="alert-content" className={cn('flex-1 min-w-0', className)} {...props} />;
}

function AlertTitle({className, ...props}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn('font-medium text-sm leading-20 text-foreground-neutral-base mb-4', className)}
      {...props}
    />
  );
}

function AlertDescription({className, ...props}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'text-xs leading-20 text-foreground-neutral-base [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  );
}

function AlertActions({className, ...props}: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-actions"
      className={cn('flex items-center gap-8 mt-8', className)}
      {...props}
    />
  );
}

function AlertAction({className, ...props}: ComponentProps<'button'>) {
  return (
    <button
      data-slot="alert-action"
      type="button"
      className={cn(
        'bg-transparent border-none p-0 cursor-pointer text-xs font-medium leading-20 text-foreground-neutral-base hover:text-foreground-neutral-subtle transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-background-accent-blue-base focus-visible:ring-offset-2',
        className,
      )}
      {...props}
    />
  );
}

function AlertClose({
  className,
  variant = 'default',
  ...props
}: ComponentProps<'button'> & VariantProps<typeof closeIconVariants>) {
  return (
    <button
      data-slot="alert-close"
      type="button"
      className={cn(
        'absolute cursor-pointer top-12 right-12 rounded-4 p-4 bg-transparent border-none text-foreground-neutral-muted hover:text-foreground-neutral-base hover:bg-background-components-hover transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-background-accent-blue-base focus-visible:ring-offset-2',
        className,
      )}
      aria-label="Close"
      {...props}
    >
      <Icon name="close" className={cn(closeIconVariants({variant}))} />
    </button>
  );
}

export {Alert, AlertContent, AlertTitle, AlertDescription, AlertActions, AlertAction, AlertClose};
