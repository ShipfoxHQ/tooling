import type {HTMLAttributes} from 'react';
import {cn} from 'utils';

export function DropdownMenuShortcut({className, ...props}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
  );
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';
