import {type Table as DataTableModel, type RowData, flexRender} from '@tanstack/react-table';
import {Skeleton} from 'components/Skeleton';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from 'components/Table';
import type {ComponentProps} from 'react';
import {DataTableColumnHeader} from './DataTableColumnHeader';

export type {Table as DataTableModel, RowData} from '@tanstack/react-table';

export interface DataTableProps<T extends RowData> extends ComponentProps<typeof Table> {
  table: DataTableModel<T>;
  isLoading?: boolean;
}

export function DataTable<T extends RowData>({table, isLoading, ...props}: DataTableProps<T>) {
  return (
    <Table {...props}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : <DataTableColumnHeader header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <SkeletonRows table={table} />
        ) : table.getRowCount() > 0 ? (
          <ContentRows table={table} />
        ) : (
          <NoResultRows table={table} />
        )}
      </TableBody>
    </Table>
  );
}

function ContentRows<T extends RowData>({table}: {table: DataTableModel<T>}) {
  return table.getRowModel().rows.map((row) => (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && 'selected'}
      onClick={() => row.toggleSelected(!!row.id)}
      className="cursor-pointer"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell
          key={cell.id}
          canTruncate={(cell.column.columnDef.meta as {canTruncate?: boolean})?.canTruncate}
        >
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));
}

function NoResultRows<T extends RowData>({table}: {table: DataTableModel<T>}) {
  return (
    <TableRow>
      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
        No results.
      </TableCell>
    </TableRow>
  );
}

function SkeletonRows<T extends RowData>({table}: {table: DataTableModel<T>}) {
  const pageSize = table.getState().pagination.pageSize;
  const rows = [...Array(Math.floor(pageSize) + 1).keys()];
  const columns = table.getAllColumns();
  return rows.map((row) => (
    <TableRow key={row}>
      {columns.map((column) => (
        <TableCell key={column.id}>
          <Skeleton className="h-3 w-full" />
        </TableCell>
      ))}
    </TableRow>
  ));
}
