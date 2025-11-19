import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {Icon, type IconName} from 'components/icon';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export const buttonVariants = cva(
  'rounded-6 inline-flex items-center justify-center whitespace-nowrap transition-colors disabled:pointer-events-none shrink-0 outline-none',
  {
    variants: {
      variant: {
        primary:
          'bg-background-button-inverted-default text-foreground-contrast-primary shadow-button-inverted hover:bg-background-button-inverted-hover active:bg-background-button-inverted-pressed focus-visible:shadow-button-inverted-focus disabled:bg-background-neutral-disabled disabled:text-foreground-neutral-disabled disabled:shadow-none',
        secondary:
          'bg-background-button-neutral-default text-foreground-neutral-base shadow-button-neutral hover:bg-background-button-neutral-hover active:bg-background-button-neutral-pressed disabled:bg-background-neutral-disabled focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled disabled:shadow-none',
        danger:
          'bg-background-button-danger-default text-foreground-neutral-on-color shadow-button-danger hover:bg-background-button-danger-hover active:bg-background-button-danger-pressed focus-visible:shadow-button-danger-focus disabled:bg-background-neutral-disabled disabled:text-foreground-neutral-disabled disabled:shadow-none',
        success:
          'bg-background-button-success-default text-foreground-neutral-on-color shadow-button-success hover:bg-background-button-success-hover active:bg-background-button-success-pressed focus-visible:shadow-button-success-focus disabled:bg-background-neutral-disabled disabled:text-foreground-neutral-disabled disabled:shadow-none',
        transparent:
          'bg-background-button-transparent-default text-foreground-neutral-base hover:bg-background-button-transparent-hover active:bg-background-button-transparent-pressed focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled',
        transparentMuted:
          'bg-background-button-transparent-default text-foreground-neutral-muted hover:bg-background-button-transparent-hover active:bg-background-button-transparent-pressed focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled',
      },
      size: {
        '2xs': 'h-20 px-6 text-xs gap-4',
        xs: 'h-24 px-6 text-xs gap-4',
        sm: 'h-28 px-8 text-sm gap-6',
        md: 'h-32 px-10 text-md gap-8',
        lg: 'h-36 px-12 text-lg gap-8',
        xl: 'h-40 px-12 text-xl gap-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

const spinnerSizeMap: Record<NonNullable<VariantProps<typeof buttonVariants>['size']>, string> = {
  '2xs': 'size-10',
  xs: 'size-10',
  sm: 'size-12',
  md: 'size-14',
  lg: 'size-16',
  xl: 'size-18',
};

export function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  iconLeft,
  iconRight,
  isLoading = false,
  disabled,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    iconLeft?: IconName;
    iconRight?: IconName;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  const spinnerSize =
    spinnerSizeMap[(size ?? 'md') as NonNullable<VariantProps<typeof buttonVariants>['size']>];

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({variant, size, className}))}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-live={isLoading ? 'polite' : undefined}
      {...props}
    >
      {isLoading ? (
        <Icon name="spinner" className={spinnerSize} />
      ) : (
        iconLeft && <Icon name={iconLeft} />
      )}
      {children}
      {iconRight && <Icon name={iconRight} />}
    </Comp>
  );
}
