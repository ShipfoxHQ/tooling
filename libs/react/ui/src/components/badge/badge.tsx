import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import {Icon, type IconName} from 'components/icon';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export const badgeVariants = cva(
  'inline-flex select-none items-center justify-center font-medium transition-colors shrink-0 leading-20',
  {
    variants: {
      variant: {
        neutral:
          'bg-tag-neutral-bg text-tag-neutral-text border border-tag-neutral-border hover:bg-tag-neutral-bg-hover',
        info: 'bg-tag-blue-bg text-tag-blue-text border border-tag-blue-border hover:bg-tag-blue-bg-hover',
        feature:
          'bg-tag-purple-bg text-tag-purple-text border border-tag-purple-border hover:bg-tag-purple-bg-hover',
        success:
          'bg-tag-success-bg text-tag-success-text border border-tag-success-border hover:bg-tag-success-bg-hover',
        warning:
          'bg-tag-warning-bg text-tag-warning-text border border-tag-warning-border hover:bg-tag-warning-bg-hover',
        error:
          'bg-tag-error-bg text-tag-error-text border border-tag-error-border hover:bg-tag-error-bg-hover',
      },
      size: {
        '2xs': 'h-20 px-6 text-xs gap-4',
        xs: 'h-24 px-8 text-xs gap-6',
      },
      radius: {
        default: 'rounded-6',
        rounded: 'rounded-full',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: '2xs',
      radius: 'default',
    },
  },
);

export type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

type BaseBadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

type BadgePropsWithLeftClick = BaseBadgeProps & {
  iconLeft: IconName;
  onIconLeftClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconLeftAriaLabel: string;
  iconRight?: IconName;
  onIconRightClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconRightAriaLabel?: string;
};

type BadgePropsWithRightClick = BaseBadgeProps & {
  iconRight: IconName;
  onIconRightClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconRightAriaLabel: string;
  iconLeft?: IconName;
  onIconLeftClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconLeftAriaLabel?: string;
};

type BadgePropsWithBothClicks = BaseBadgeProps & {
  iconLeft: IconName;
  onIconLeftClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconLeftAriaLabel: string;
  iconRight: IconName;
  onIconRightClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  iconRightAriaLabel: string;
};

type BadgePropsWithoutClicks = BaseBadgeProps & {
  iconLeft?: IconName;
  iconRight?: IconName;
  onIconLeftClick?: never;
  onIconRightClick?: never;
  iconLeftAriaLabel?: never;
  iconRightAriaLabel?: never;
};

export type BadgeProps =
  | BadgePropsWithLeftClick
  | BadgePropsWithRightClick
  | BadgePropsWithBothClicks
  | BadgePropsWithoutClicks;

export function Badge({
  className,
  variant,
  size,
  radius,
  asChild = false,
  children,
  iconLeft,
  iconRight,
  onIconLeftClick,
  onIconRightClick,
  iconLeftAriaLabel,
  iconRightAriaLabel,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : 'span';

  const renderIcon = (
    iconName: IconName,
    position: 'left' | 'right',
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
    ariaLabel?: string,
  ) => {
    const isInteractive = Boolean(onClick);

    if (isInteractive) {
      if (!ariaLabel) {
        // biome-ignore lint/suspicious/noConsole: Development warning for accessibility
        console.warn(
          `Badge: Missing aria-label for interactive ${position} icon. Please provide icon${position === 'left' ? 'Left' : 'Right'}AriaLabel prop.`,
        );

        return null;
      }

      return (
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center justify-center transition-colors shrink-0 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-blue-500"
          aria-label={ariaLabel}
        >
          <Icon name={iconName} className="size-12" />
        </button>
      );
    }

    return <Icon name={iconName} className="size-12" />;
  };

  return (
    <Comp className={cn(badgeVariants({variant, size, radius}), className)} {...props}>
      {iconLeft && renderIcon(iconLeft, 'left', onIconLeftClick, iconLeftAriaLabel)}
      {children}
      {iconRight && renderIcon(iconRight, 'right', onIconRightClick, iconRightAriaLabel)}
    </Comp>
  );
}
