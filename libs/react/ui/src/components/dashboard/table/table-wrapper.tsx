/**
 * Generic Table Wrapper Component
 *
 * A reusable wrapper for dashboard tables with header, search, and actions.
 */

import type {ColumnDef, VisibilityState} from '@tanstack/react-table';
import {Card, CardAction, CardContent, CardHeader, CardTitle} from 'components/card';
import {DataTable} from 'components/table/data-table';
import type {ComponentProps, ReactNode} from 'react';
import {cn} from 'utils/cn';

export interface TableWrapperProps<TData, TValue> extends Omit<ComponentProps<'div'>, 'title'> {
  /**
   * Table title
   */
  title: ReactNode;
  /**
   * Column definitions for the table
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Data to display in the table
   */
  data: TData[];
  /**
   * Column visibility state
   */
  columnVisibility?: VisibilityState;
  /**
   * Column visibility change handler
   */
  onColumnVisibilityChange?: (visibility: VisibilityState) => void;
  /**
   * Enable pagination
   * @default true
   */
  pagination?: boolean;
  /**
   * Page size
   * @default 10
   */
  pageSize?: number;
  /**
   * Page size options
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];
  /**
   * Show selected count checkbox
   * @default false
   */
  showSelectedCount?: boolean;
  /**
   * Row click handler
   */
  onRowClick?: (row: TData) => void;
  /**
   * Empty state to display when no data
   */
  emptyState?: ReactNode;
  /**
   * Header actions to display in the card header
   */
  headerActions?: ReactNode;
  /**
   * Loading state - displays skeleton when true
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

/**
 * Generic Table Wrapper
 *
 * Provides a consistent table layout with header, search, and actions.
 * Can be used for any table in the dashboard.
 *
 * @example
 * ```tsx
 * <TableWrapper
 *   title="Jobs breakdown"
 *   columns={jobColumns}
 *   data={jobsData}
 *   headerActions={
 *     <>
 *       <SearchInline
 *         placeholder="Search..."
 *         value={searchQuery}
 *         onChange={(e) => setSearchQuery(e.target.value)}
 *       />
 *       <Button variant="secondary">Action</Button>
 *     </>
 *   }
 *   columnVisibility={columnVisibility}
 *   onColumnVisibilityChange={updateColumnVisibility}
 * />
 * ```
 */
export function TableWrapper<TData, TValue>({
  title,
  columns,
  data,
  columnVisibility,
  onColumnVisibilityChange,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  showSelectedCount = false,
  onRowClick,
  emptyState,
  headerActions,
  isLoading,
  scopedContainer,
  className,
  ...props
}: TableWrapperProps<TData, TValue>) {
  return (
    <Card className={cn('rounded-t-8 overflow-hidden p-0 gap-0 border-none', className)} {...props}>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-0 p-12 rounded-t-8 border-t border-x border-border-neutral-base">
        {typeof title === 'string' ? <CardTitle variant="h3">{title}</CardTitle> : title}

        {headerActions && (
          <CardAction className="flex items-center gap-8 md:gap-16 w-full md:w-auto">
            {headerActions}
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <DataTable
          columns={columns}
          data={data}
          pagination={pagination}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          showSelectedCount={showSelectedCount}
          onRowClick={onRowClick}
          emptyState={emptyState}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={onColumnVisibilityChange}
          scopedContainer={scopedContainer}
          className="rounded-t-none"
        />
      </CardContent>
    </Card>
  );
}
