import type {Column} from '@tanstack/react-table';
import {Icon} from 'components/icon';
import type {HTMLAttributes} from 'react';
import {cn} from 'utils/cn';
import {Button} from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';

/**
 * Props for the {@link TableColumnHeader} component.
 *
 * Defines the properties needed to render a sortable table column header
 * with interactive sorting controls.
 *
 * @typeParam TData - The shape of the row data in the table.
 * @typeParam TValue - The type of the value in this specific column.
 */
export interface TableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  /**
   * The TanStack Table column instance for this header.
   *
   * This instance provides access to column state and sorting methods.
   * It's typically obtained from the `header.column` property when mapping
   * over header groups in TanStack Table.
   *
   * The column determines:
   * - Whether sorting is enabled (`getCanSort()`)
   * - Current sort direction (`getIsSorted()`)
   * - Methods to toggle sorting (`toggleSorting()`)
   *
   * @see {@link https://tanstack.com/table/latest/docs/api/core/column TanStack Column API}
   */
  column: Column<TData, TValue>;
  /**
   * The display text for the column header.
   *
   * This is the human-readable label that appears in the table header.
   * For sortable columns, this text appears in a button with sort indicators.
   * For non-sortable columns, it renders as plain text.
   *
   * @example
   * ```tsx
   * <TableColumnHeader column={column} title="Customer Name" />
   * <TableColumnHeader column={column} title="Order Date" />
   * ```
   */
  title: string;
}

/**
 * Renders a table column header with optional sorting functionality.
 *
 * This component automatically adapts based on whether the column supports sorting:
 * - **Sortable columns**: Renders an interactive button with a dropdown menu for
 *   ascending/descending sort options and visual indicators for the current sort state
 * - **Non-sortable columns**: Renders plain text without interactive controls
 *
 * The component integrates seamlessly with TanStack Table's sorting system and
 * manages sort state through the provided column instance.
 *
 * @typeParam TData - The shape of the row data in the table.
 * @typeParam TValue - The type of the value in this specific column.
 *
 * @example
 * ```tsx
 * // In your column definitions:
 * const columns: ColumnDef<User>[] = [
 *   {
 *     accessorKey: 'name',
 *     header: ({ column }) => (
 *       <TableColumnHeader column={column} title="Name" />
 *     ),
 *     enableSorting: true,
 *   },
 *   {
 *     accessorKey: 'email',
 *     header: ({ column }) => (
 *       <TableColumnHeader column={column} title="Email" />
 *     ),
 *     enableSorting: false,
 *   },
 * ];
 * ```
 */
export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('text-xs font-medium', className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            size="xs"
            className="-ml-12 h-32 px-8 data-[state=open]:bg-background-components-hover gap-0"
          >
            <span className="text-xs font-medium text-foreground-neutral-subtle">{title}</span>
            {isSorted === 'desc' ? (
              <Icon
                name="arrowDownLongLine"
                className="ml-2 size-14 text-foreground-neutral-muted"
              />
            ) : isSorted === 'asc' ? (
              <Icon name="arrowUpLongLine" className="ml-2 size-14 text-foreground-neutral-muted" />
            ) : (
              <Icon name="arrowUpDownLine" className="ml-4 size-16 text-foreground-neutral-muted" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" size="sm">
          <DropdownMenuItem
            icon="arrowUpLongLine"
            onClick={() => column.toggleSorting(false)}
            closeOnSelect
          >
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            icon="arrowDownLongLine"
            onClick={() => column.toggleSorting(true)}
            closeOnSelect
          >
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
