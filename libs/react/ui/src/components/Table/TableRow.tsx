import {type HTMLAttributes, forwardRef} from 'react';
import {cn} from '../../utils/cn';

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({className, ...props}, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-surface-hover hover:text-gray-1000 data-[state=selected]:bg-surface-active',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';
