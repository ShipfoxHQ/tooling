import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';
import {Icon, type IconName} from './icon/icon';

export const buttonVariants = cva(
  'rounded-[6px] inline-flex items-center justify-center whitespace-nowrap transition-colors disabled:pointer-events-none shrink-0 outline-none',
  {
    variants: {
      variant: {
        primary:
          'bg-background-button-inverted-default text-foreground-contrast-primary shadow-button-inverted hover:bg-background-button-inverted-hover active:bg-background-button-inverted-pressed focus-visible:shadow-button-inverted-focus disabled:bg-background-neutral-disabled disabled:text-foreground-neutral-disabled disabled:shadow-none',
        secondary:
          'bg-background-button-neutral-default text-foreground-neutral-base shadow-button-neutral hover:bg-background-button-neutral-hover active:bg-background-button-neutral-pressed disabled:bg-background-neutral-disabled focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled disabled:shadow-none',
        danger:
          'bg-background-button-danger-default text-foreground-neutral-on-color shadow-button-danger hover:bg-background-button-danger-hover active:bg-background-button-danger-pressed focus-visible:shadow-button-danger-focus disabled:bg-background-neutral-disabled disabled:text-foreground-neutral-disabled disabled:shadow-none',
        transparent:
          'bg-background-button-transparent-default text-foreground-neutral-base hover:bg-background-button-transparent-hover active:bg-background-button-transparent-pressed focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled',
        transparentMuted:
          'bg-background-button-transparent-default text-foreground-neutral-muted hover:bg-background-button-transparent-hover active:bg-background-button-transparent-pressed focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled',
      },
      size: {
        '2xs': 'px-6 text-xs gap-4',
        xs: 'px-6 py-2 text-xs gap-4',
        sm: 'px-8 py-4 text-sm gap-6',
        md: 'px-10 py-6 text-md gap-8',
        lg: 'px-12 py-8 text-lg gap-8',
        xl: 'px-12 py-10 text-xl gap-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  iconLeft,
  iconRight,
  ...props
}: ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    iconLeft?: IconName;
    iconRight?: IconName;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp data-slot="button" className={cn(buttonVariants({variant, size, className}))} {...props}>
      {iconLeft && <Icon name={iconLeft} />}
      {children}
      {iconRight && <Icon name={iconRight} />}
    </Comp>
  );
}
