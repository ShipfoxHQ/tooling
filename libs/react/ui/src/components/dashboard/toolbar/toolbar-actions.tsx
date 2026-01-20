/**
 * Toolbar Actions Component
 *
 * Contains filter, search, and view controls for dashboard tables.
 */

import type {ComponentProps, ReactNode} from 'react';
import {QueryBuilder} from 'components/query-builder';
import {cn} from 'utils/cn';
import {useDashboardContext} from '../context';
import {FilterButton} from './filter-button';
import {ViewDropdown} from './view-dropdown';

export interface ToolbarActionsProps extends Omit<ComponentProps<'div'>, 'children'> {
  /**
   * Show filter button
   * @default true
   */
  showFilter?: boolean;
  /**
   * Show search input
   * @default true
   */
  showSearch?: boolean;
  /**
   * Show view dropdown
   * @default true
   */
  showView?: boolean;
  /**
   * Search placeholder text
   * @default 'Search...'
   */
  searchPlaceholder?: string;
  /**
   * Additional custom actions
   */
  children?: ReactNode;
}

/**
 * Toolbar Actions
 *
 * Provides filter, search, and column visibility controls.
 * Automatically connects to DashboardContext for state management.
 *
 * @example
 * ```tsx
 * <ToolbarActions />
 * ```
 *
 * @example With custom actions
 * ```tsx
 * <ToolbarActions>
 *   <Button>Custom Action</Button>
 * </ToolbarActions>
 * ```
 */
export function ToolbarActions({
  showFilter = true,
  showSearch = true,
  showView = true,
  searchPlaceholder = 'Try: job name, status, pipeline...',
  className,
  children,
  ...props
}: ToolbarActionsProps) {
  const {searchQuery, setSearchQuery, resourceType, setResourceType, columns, setColumns} =
    useDashboardContext();

  return (
    <div className={cn('flex items-start md:items-center gap-8 md:gap-12', className)} {...props}>
      {showFilter && <FilterButton value={resourceType} onValueChange={setResourceType} />}
      {showSearch && (
        <QueryBuilder
          value={searchQuery}
          onValueChange={setSearchQuery}
          onQueryChange={setSearchQuery}
          placeholder={searchPlaceholder}
          suggestions={[]}
        />
      )}
      {showView && <ViewDropdown columns={columns} onColumnsChange={setColumns} />}
      {children}
    </div>
  );
}
