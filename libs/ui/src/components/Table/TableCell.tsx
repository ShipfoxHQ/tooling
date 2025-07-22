import {cva} from 'class-variance-authority';
import {type TdHTMLAttributes, forwardRef} from 'react';
import {cn} from '../../utils/cn';

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  canTruncate?: boolean;
}

export const cellVariants = cva(
  'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  {
    variants: {
      truncatable: {
        canTruncate: 'whitespace-nowrap break-all overflow-hidden text-ellipsis max-w-px',
        cannotTruncate: 'w-px whitespace-nowrap',
      },
    },
    defaultVariants: {
      truncatable: 'cannotTruncate',
    },
  },
);

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({className, canTruncate, ...props}, ref) => (
    <td
      ref={ref}
      className={cn(
        cellVariants({truncatable: canTruncate ? 'canTruncate' : 'cannotTruncate'}),
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = 'TableCell';
