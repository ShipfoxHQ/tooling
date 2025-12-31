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
import {Card, CardContent} from 'components/card';
import {Checkbox} from 'components/checkbox';
import {EmptyState} from 'components/empty-state';
import {Skeleton} from 'components/skeleton';
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
  /**
   * Controlled column visibility state.
   *
   * When provided, the table will use this state to control which columns are visible.
   * The keys should match the column IDs or accessor keys.
   */
  columnVisibility?: VisibilityState;
  /**
   * Callback invoked when column visibility changes.
   *
   * This is only used when {@link columnVisibility} is provided as a controlled prop.
   */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /**
   * When `true`, displays a loading skeleton instead of the table.
   */
  isLoading?: boolean;
  /**
   * Optional scoped container element for dropdown portals.
   *
   * When provided, dropdowns (like pagination select) will be rendered inside this container
   * instead of the document body. This is useful for scoped CSS styling.
   */
  scopedContainer?: HTMLElement | null;
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
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  isLoading,
  scopedContainer,
  className,
  ...props
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalColumnVisibility, setInternalColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [paginationState, setPaginationState] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility;
  const setColumnVisibility = onColumnVisibilityChange
    ? (visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => {
        const newVisibility =
          typeof visibility === 'function' ? visibility(columnVisibility) : visibility;
        onColumnVisibilityChange(newVisibility);
      }
    : setInternalColumnVisibility;

  useEffect(() => {
    setPaginationState((prev) => ({...prev, pageSize, pageIndex: 0}));
  }, [pageSize]);

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
            onCheckedChange={(checked: boolean) => table.toggleAllPageRowsSelected(!!checked)}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            aria-label="Select all"
          />
        );
      },
      cell: ({row}) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(checked: boolean) => row.toggleSelected(!!checked)}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
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

  const skeletonRowCount = pageSize > 5 ? 5 : pageSize;

  if (isLoading) {
    return (
      <Card className={cn('p-0 gap-0', className)} {...props}>
        <CardContent className="rounded-8 overflow-hidden p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                {columns.map((_, idx) => (
                  <TableHead key={idx.toString()}>
                    <Skeleton className="h-16 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({length: skeletonRowCount}).map((_, rowIdx) => (
                <TableRow key={rowIdx.toString()} className="hover:bg-transparent">
                  {columns.map((_, colIdx) => (
                    <TableCell key={colIdx.toString()}>
                      <Skeleton className="h-16 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('p-0 gap-0', className)} {...props}>
      <CardContent className="rounded-8 overflow-hidden p-0">
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
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-240 text-center rounded-t-8"
                >
                  {emptyState || <EmptyState />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {pagination && table.getRowModel().rows?.length > 0 && (
            <TablePagination
              table={table}
              pageSizeOptions={pageSizeOptions}
              showSelectedCount={showSelectedCount}
              scopedContainer={scopedContainer}
            />
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
