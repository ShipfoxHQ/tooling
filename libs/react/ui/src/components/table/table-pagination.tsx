import type {Table} from '@tanstack/react-table';
import {Text} from 'components/typography';
import type {ComponentProps} from 'react';
import {useRef} from 'react';
import {Button} from '../button';
import {Icon} from '../icon';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../select/select';
import {TableCell, TableFooter, TableRow} from './table';

/**
 * Props for the {@link TablePagination} component.
 *
 * Provides pagination controls for data tables, including page navigation,
 * page size selection, and row count displays.
 *
 * @typeParam TData - The shape of the row data in the table.
 */
interface TablePaginationProps<TData> extends ComponentProps<'tfoot'> {
  /**
   * The TanStack Table instance that manages the table state and behavior.
   *
   * This is typically created using `useReactTable` from `@tanstack/react-table`.
   * The table instance provides access to pagination state, row data, and methods
   * for controlling pagination (e.g., `setPageSize`, `nextPage`, `previousPage`).
   *
   * @see {@link https://tanstack.com/table/latest/docs/api/core/table TanStack Table API}
   */
  table: Table<TData>;
  /**
   * Array of page size options to display in the page size selector.
   * When provided, a dropdown will be rendered allowing users to change the number of rows per page.
   *
   * @default [10, 20, 50, 100]
   * @example
   * ```tsx
   * <TablePagination table={table} pageSizeOptions={[10, 25, 50]} />
   * ```
   */
  pageSizeOptions?: number[];
  /**
   * When `true`, displays the count of selected rows instead of pagination range.
   *
   * - If `true`: Shows "X of Y row(s) selected" where X is the number of selected rows
   * - If `false`: Shows "A — B of C results" where A-B is the current page range
   *
   * This is useful when row selection is enabled and you want to give users feedback
   * on how many rows they have selected.
   *
   * @default false
   * @example
   * ```tsx
   * <TablePagination table={table} showSelectedCount={true} />
   * // Displays: "5 of 100 row(s) selected"
   * ```
   */
  showSelectedCount?: boolean;
  /**
   * Optional scoped container element for select dropdown portal.
   *
   * When provided, the select dropdown will be rendered inside this container
   * instead of the document body. This is useful for scoped CSS styling.
   *
   * @example
   * ```tsx
   * const {scopedContainer} = useScopedContainer();
   * <TablePagination table={table} scopedContainer={scopedContainer} />
   * ```
   */
  scopedContainer?: HTMLElement | null;
}

export function TablePagination<TData>({
  table,
  className,
  pageSizeOptions = [10, 20, 50, 100],
  showSelectedCount = false,
  scopedContainer,
  ...props
}: TablePaginationProps<TData>) {
  const paginationRef = useRef<HTMLTableSectionElement>(null);
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const startRow = totalRows === 0 ? 0 : currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1;
  const endRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <TableFooter ref={paginationRef} className={className} {...props}>
      <TableRow className="hover:bg-transparent border-b-0">
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
              <div className="flex items-center gap-8">
                <Text size="sm" className="text-foreground-neutral-muted">
                  Rows per page
                </Text>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-28 w-80" size="small">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent container={scopedContainer ?? undefined}>
                    {pageSizeOptions.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
