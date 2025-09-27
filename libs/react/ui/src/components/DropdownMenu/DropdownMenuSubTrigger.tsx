import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {Icon} from 'components/Icon';
import {type ComponentPropsWithoutRef, type ElementRef, forwardRef} from 'react';
import {cn} from 'utils';

export const DropdownMenuSubTrigger = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({className, inset, children, ...props}, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-xs px-2 py-1.5 text-sm outline-hidden focus:bg-surface-hover focus:text-gray-1000 data-[state=open]:bg-surface-active data-[state=open]:text-gray-1000',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <Icon icon="chevronRight" className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
