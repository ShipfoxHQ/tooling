import type {HTMLAttributes} from 'react';
import {cn} from 'utils';
import {SheetClose} from './SheetClose';

export type SheetActionsProps = HTMLAttributes<HTMLDivElement>;

export function SheetActions({children, className, ...props}: SheetActionsProps) {
  return (
    <div className={cn(['flex flex-row gap-2'])} {...props}>
      {children}
      <SheetClose />
    </div>
  );
}
