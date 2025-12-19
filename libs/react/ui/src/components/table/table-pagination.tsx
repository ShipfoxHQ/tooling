import type {Table} from '@tanstack/react-table';
import {Text} from 'components/typography';
import type {ComponentProps} from 'react';
import {Button} from '../button';
import {Icon} from '../icon';
import {TableCell, TableFooter, TableRow} from './table';

interface TablePaginationProps<TData> extends ComponentProps<'tfoot'> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  showSelectedCount?: boolean;
}

export function TablePagination<TData>({
  table,
  className,
  showSelectedCount = false,
  ...props
}: TablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <TableFooter className={className} {...props}>
      <TableRow className="hover:bg-transparent">
        <TableCell
          colSpan={table.getAllColumns().length}
          className="group-hover/row:bg-transparent"
        >
          <div className="flex items-center justify-between gap-16">
            <div className="flex items-center gap-16">
              {showSelectedCount && (
                <Text size="sm" className="text-foreground-neutral-muted">
                  {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s) selected
                </Text>
              )}
              {!showSelectedCount && (
                <Text size="sm" className="text-foreground-neutral-muted">
                  {startRow} — {endRow} of {totalRows} results
                </Text>
              )}
            </div>

            <div className="flex items-center">
              <Button
                variant="transparent"
                size="xs"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="h-32 w-32 p-0"
                aria-label="Go to first page"
              >
                <Icon name="arrowLeftDoubleLine" className="size-16" />
              </Button>
              <Button
                variant="transparent"
                size="xs"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-32 px-12"
                aria-label="Go to previous page"
              >
                Prev
              </Button>
              <Button
                variant="transparent"
                size="xs"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-32 px-12"
                aria-label="Go to next page"
              >
                Next
              </Button>
              <Button
                variant="transparent"
                size="xs"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="h-32 w-32 p-0"
                aria-label="Go to last page"
              >
                <Icon name="arrowRightDoubleLine" className="size-16" />
              </Button>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}
