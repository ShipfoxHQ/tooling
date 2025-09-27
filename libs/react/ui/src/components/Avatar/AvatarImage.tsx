import * as AvatarPrimitive from '@radix-ui/react-avatar';
import {type ComponentPropsWithoutRef, type ElementRef, forwardRef} from 'react';
import {cn} from 'utils';

export const AvatarImage = forwardRef<
  ElementRef<typeof AvatarPrimitive.Image>,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({className, ...props}, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;
