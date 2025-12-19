import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {Checkbox} from 'components/checkbox';
import {Icon} from 'components/icon';
import {Text} from 'components/typography';
import {type ComponentProps, useEffect, useMemo, useState} from 'react';
import {cn} from 'utils/cn';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from './table';
import {TablePagination} from './table-pagination';

/**
 * Props for the {@link DataTable} component.
 *
 * @typeParam TData - The shape of the row data.
 * @typeParam TValue - The value type used by column definitions.
 */
interface DataTableProps<TData, TValue> extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Column definitions for the table, as expected by `@tanstack/react-table`.
   *
   * These control how each field in {@link data} is rendered and interacted with.
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Array of data items to render as table rows.
   */
  data: TData[];
  /**
   * Enables client-side pagination when `true`.
   *
   * Defaults to `true`. When set to `false`, all rows are rendered in a single
   * page and the pagination controls are disabled. In that case, the
   * {@link pageSize} value is effectively ignored.
   */
  pagination?: boolean;
  /**
   * Number of rows to display per page when pagination is enabled.
   *
   * Defaults to `10`. This value is used to initialize the internal pagination
   * state and only has an effect when {@link pagination} is `true`.
   */
  pageSize?: number;
  /**
   * Array of page size options to display in the page size selector.
   * When provided, a dropdown will be rendered in the pagination footer allowing
   * users to change the number of rows per page.
   *
   * @default [10, 20, 50, 100]
   * @example
   * ```tsx
   * <DataTable columns={columns} data={data} pageSizeOptions={[5, 10, 25]} />
   * ```
   */
  pageSizeOptions?: number[];
  /**
   * When `true`, displays the count of selected rows.
   *
   * This is useful when row selection is enabled to give users feedback on how
   * many rows are currently selected.
   */
  showSelectedCount?: boolean;
  /**
   * Optional callback invoked when a table row is clicked.
   *
   * The callback receives the corresponding data item for the clicked row.
   */
  onRowClick?: (row: TData) => void;
  /**
   * React node to render when there are no rows to display.
   *
   * If not provided, the table will render without rows and without a custom
   * empty state message or placeholder.
   */
  emptyState?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = true,
  pageSize = 10,
  pageSizeOptions,
  showSelectedCount = false,
  onRowClick,
  emptyState,
  className,
  ...props
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  useEffect(() => {
    setPaginationState((prev) => ({...prev, pageSize}));
  }, [pageSize]);

  // Add selection column if showSelectedCount is enabled
  const columnsWithSelection = useMemo(() => {
    if (!showSelectedCount) {
      return columns;
    }

    const selectionColumn: ColumnDef<TData, TValue> = {
      id: 'select',
      header: ({table}) => {
        const isAllSelected = table.getIsAllPageRowsSelected();
        const isSomeSelected = table.getIsSomePageRowsSelected();
        return (
          <Checkbox
            checked={isAllSelected ? true : isSomeSelected ? 'indeterminate' : false}
            onCheckedChange={(checked) => table.toggleAllPageRowsSelected(!!checked)}
            aria-label="Select all"
          />
        );
      },
      cell: ({row}) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked) => row.toggleSelected(!!checked)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    };

    return [selectionColumn, ...columns];
  }, [columns, showSelectedCount]);

  const table = useReactTable({
    data,
    columns: columnsWithSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: showSelectedCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPaginationState,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: pagination ? paginationState : undefined,
    },
  });

  return (
    <div
      className={cn('rounded-8 border border-border-neutral-base overflow-hidden', className)}
      {...props}
    >
      <Table>
        {table.getRowModel().rows.length > 0 ? (
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        ) : null}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                data-selected={row.getIsSelected()}
                className={onRowClick ? 'cursor-pointer' : ''}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'button' : undefined}
                onKeyDown={(event) => {
                  if (!onRowClick) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onRowClick(row.original);
                  }
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="h-240 text-center">
                {emptyState || (
                  <div className="flex flex-col items-center justify-center gap-12 py-48">
                    <div className="size-32 rounded-6 bg-transparent border border-border-neutral-strong flex items-center justify-center">
                      <Icon
                        name="fileDamageLine"
                        className="size-16 text-foreground-neutral-subtle"
                        color="var(--foreground-neutral-subtle, #a1a1aa)"
                      />
                    </div>
                    <div className="text-center space-y-4">
                      <Text size="sm" className="text-foreground-neutral-base">
                        No results
                      </Text>
                      <Text size="xs" className="text-foreground-neutral-muted">
                        Looks like there are no results.
                      </Text>
                    </div>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {pagination && table.getRowModel().rows?.length > 0 && (
          <TablePagination
            table={table}
            pageSizeOptions={pageSizeOptions}
            showSelectedCount={showSelectedCount}
          />
        )}
      </Table>
    </div>
  );
}
