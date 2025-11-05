import {cva, type VariantProps} from 'class-variance-authority';
import {type ComponentProps, isValidElement, type ReactElement, useCallback, useMemo} from 'react';
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

/**
 * Render prop for wrapping each avatar item (e.g., with tooltip).
 * @param avatar - The rendered avatar element
 * @param index - The index of the avatar in the group
 * @param item - The original avatar item (props or element)
 * @returns The wrapped avatar element
 */
export type AvatarGroupRenderItem = (
  avatar: ReactElement,
  index: number,
  item: AvatarGroupItem,
) => ReactElement;

type AvatarGroupProps = ComponentProps<'div'> &
  VariantProps<typeof avatarGroupVariants> & {
    avatars: AvatarGroupItem[];
    maxVisible?: number;
    radius?: AvatarProps['radius'];
    renderItem?: AvatarGroupRenderItem;
    animateOnHover?: boolean;
  };

export function AvatarGroup({
  className,
  size = 'md',
  avatars,
  maxVisible,
  radius = 'full',
  renderItem,
  animateOnHover = false,
  ...props
}: AvatarGroupProps) {
  const normalizedSize = size ?? 'md';

  const {visibleCount, visibleAvatars, overflowCount} = useMemo(() => {
    const count = maxVisible !== undefined ? Math.min(maxVisible, avatars.length) : avatars.length;
    return {
      visibleCount: count,
      visibleAvatars: avatars.slice(0, count),
      overflowCount: avatars.length - count,
    };
  }, [avatars, maxVisible]);

  const renderAvatar = useCallback(
    (avatar: AvatarGroupItem, index: number): ReactElement => {
      let renderedAvatar: ReactElement;

      if (isValidElement(avatar)) {
        renderedAvatar = (
          <div key={index} className="relative" style={{zIndex: index + 1}}>
            {avatar}
          </div>
        );
      } else {
        const avatarProps = avatar as AvatarProps;
        renderedAvatar = (
          <Avatar
            key={index}
            {...avatarProps}
            size={normalizedSize}
            radius={radius}
            animateOnHover={animateOnHover}
            className={cn('relative', avatarProps.className)}
            style={{zIndex: index + 1, ...avatarProps.style}}
          />
        );
      }

      if (renderItem) {
        return renderItem(renderedAvatar, index, avatar);
      }

      return renderedAvatar;
    },
    [normalizedSize, radius, renderItem, animateOnHover],
  );

  return (
    <div
      className={cn(avatarGroupVariants({size: normalizedSize}), className)}
      data-slot="avatar-group"
      {...props}
    >
      {visibleAvatars.map((avatar, index) => renderAvatar(avatar, index))}
      {overflowCount > 0 && (
        <div
          className={cn(
            'relative',
            avatarGroupOverflowVariants({size: normalizedSize}),
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
