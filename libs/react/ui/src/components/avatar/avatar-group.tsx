import {cva, type VariantProps} from 'class-variance-authority';
import {type ComponentProps, isValidElement, type ReactElement} from 'react';
import {cn} from 'utils/cn';
import {Avatar, type AvatarProps} from './avatar';

const avatarGroupVariants = cva('flex items-start', {
  variants: {
    size: {
      '3xs': '-space-x-4',
      '2xs': '-space-x-4',
      xs: '-space-x-4',
      sm: '-space-x-4',
      md: '-space-x-4',
      lg: '-space-x-6',
      xl: '-space-x-6',
      '2xl': '-space-x-12',
      '3xl': '-space-x-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const avatarGroupOverflowVariants = cva(
  'flex shrink-0 items-center justify-center rounded-full bg-background-components-base text-foreground-neutral-subtle font-medium ring-1 ring-border-neutral-base-component ring-offset-1 ring-offset-background-neutral-base shadow-button-neutral',
  {
    variants: {
      size: {
        '3xs': 'size-[18px] text-[10px] leading-[10px]',
        '2xs': 'size-[20px] text-[11px] leading-[11px]',
        xs: 'size-[24px] text-xs leading-4',
        sm: 'size-[28px] text-xs leading-5',
        md: 'size-[32px] text-sm leading-5',
        lg: 'size-[36px] text-sm leading-5',
        xl: 'size-[40px] text-base leading-6',
        '2xl': 'size-[80px] text-2xl leading-8',
        '3xl': 'size-[120px] text-4xl leading-[56px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type AvatarGroupItem = AvatarProps | ReactElement<typeof Avatar>;

type AvatarGroupProps = ComponentProps<'div'> &
  VariantProps<typeof avatarGroupVariants> & {
    avatars: AvatarGroupItem[];
    maxVisible?: number;
    radius?: AvatarProps['radius'];
  };

export function AvatarGroup({
  className,
  size = 'md',
  avatars,
  maxVisible,
  radius = 'full',
  ...props
}: AvatarGroupProps) {
  const visibleCount =
    maxVisible !== undefined ? Math.min(maxVisible, avatars.length) : avatars.length;
  const visibleAvatars = avatars.slice(0, visibleCount);
  const overflowCount = avatars.length - visibleCount;

  const renderAvatar = (avatar: AvatarGroupItem, index: number): ReactElement => {
    if (isValidElement(avatar)) {
      return (
        <div key={index} className="relative" style={{zIndex: index + 1}}>
          {avatar}
        </div>
      );
    }

    const avatarProps = avatar as AvatarProps;
    return (
      <Avatar
        key={index}
        {...avatarProps}
        size={size}
        radius={radius}
        className={cn('relative', avatarProps.className)}
        style={{zIndex: index + 1, ...avatarProps.style}}
      />
    );
  };

  return (
    <div className={cn(avatarGroupVariants({size}), className)} data-slot="avatar-group" {...props}>
      {visibleAvatars.map((avatar, index) => renderAvatar(avatar, index))}
      {overflowCount > 0 && (
        <div
          className={cn(
            'relative',
            avatarGroupOverflowVariants({size}),
            radius === 'rounded' ? 'rounded-6' : 'rounded-full',
          )}
          style={{zIndex: visibleCount + 1}}
        >
          +{overflowCount}
        </div>
      )}
    </div>
  );
}
