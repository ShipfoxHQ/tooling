/**
 * Generic Table Wrapper Component
 *
 * A reusable wrapper for dashboard tables with header, search, and actions.
 */

import type {ColumnDef, VisibilityState} from '@tanstack/react-table';
import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {SearchInline} from 'components/search/search-inline';
import {DataTable} from 'components/table/data-table';
import {Header as TypographyHeader} from 'components/typography';
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
   * Search query value
   */
  searchQuery?: string;
  /**
   * Search input change handler
   */
  onSearchChange?: (value: string) => void;
  /**
   * Search clear handler
   */
  onSearchClear?: () => void;
  /**
   * Search placeholder text
   * @default 'Search...'
   */
  searchPlaceholder?: string;
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
   * Additional header actions
   */
  headerActions?: ReactNode;
  /**
   * Show default search and column action
   * @default true
   */
  showDefaultActions?: boolean;
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
 *   searchQuery={searchQuery}
 *   onSearchChange={setSearchQuery}
 *   columnVisibility={columnVisibility}
 *   onColumnVisibilityChange={updateColumnVisibility}
 * />
 * ```
 */
export function TableWrapper<TData, TValue>({
  title,
  columns,
  data,
  searchQuery = '',
  onSearchChange,
  onSearchClear,
  searchPlaceholder = 'Search...',
  columnVisibility,
  onColumnVisibilityChange,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 50, 100],
  showSelectedCount = false,
  onRowClick,
  emptyState,
  headerActions,
  showDefaultActions = true,
  className,
  ...props
}: TableWrapperProps<TData, TValue>) {
  return (
    <div className={cn('rounded-t-8 overflow-hidden', className)} {...props}>
      {/* Table Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-0 p-12 border-t border-x border-border-neutral-base rounded-t-8 bg-background-neutral-base">
        {typeof title === 'string' ? (
          <TypographyHeader variant="h3" className="text-foreground-neutral-base">
            {title}
          </TypographyHeader>
        ) : (
          title
        )}

        {/* Actions */}
        {(showDefaultActions || headerActions) && (
          <div className="flex items-center gap-8 md:gap-16 w-full md:w-auto">
            {showDefaultActions && (
              <>
                <SearchInline
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  onClear={() => onSearchClear?.()}
                  className="flex-1 md:w-240"
                />
                <Button variant="secondary" aria-label="Insert column left" className="shrink-0">
                  <Icon
                    name="insertColumnLeft"
                    className="size-16 text-foreground-neutral-subtle"
                  />
                </Button>
              </>
            )}
            {headerActions}
          </div>
        )}
      </div>

      {/* Data Table */}
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
        className="rounded-t-none"
      />
    </div>
  );
}
