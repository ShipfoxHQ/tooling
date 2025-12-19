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
import {Icon} from 'components/icon';
import {Text} from 'components/typography';
import {type ComponentProps, useState} from 'react';
import {cn} from 'utils/cn';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from './table';
import {TablePagination} from './table-pagination';

interface DataTableProps<TData, TValue> extends Omit<ComponentProps<'div'>, 'children'> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: boolean;
  pageSize?: number;
  showSelectedCount?: boolean;
  onRowClick?: (row: TData) => void;
  emptyState?: React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = true,
  pageSize = 10,
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
                className={onRowClick ? 'cursor-pointer' : ''}
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
          <TablePagination table={table} showSelectedCount={showSelectedCount} />
        )}
      </Table>
    </div>
  );
}
