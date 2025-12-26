/**
 * Utility functions for dashboard state management
 */

import type {VisibilityState} from '@tanstack/react-table';
import type {ViewColumn} from './types';

/**
 * Default column ID to accessor key mapping
 * Maps ViewColumn IDs (kebab-case) to table column accessorKeys (camelCase)
 */
export const DEFAULT_COLUMN_ID_TO_ACCESSOR_KEY: Record<string, string> = {
  total: 'total',
  success: 'success',
  failed: 'failed',
  neutral: 'neutral',
  flaked: 'flaked',
  'failure-rate': 'failureRate',
  'flake-rate': 'flakeRate',
  repository: 'repository',
  branch: 'branch',
};

/**
 * Converts ViewColumn[] to VisibilityState format for DataTable
 *
 * @param columns - Array of ViewColumn configurations
 * @param columnMapping - Optional custom column ID to accessor key mapping
 * @returns VisibilityState object for TanStack Table
 */
export function viewColumnsToVisibilityState(
  columns: ViewColumn[],
  columnMapping: Record<string, string> = DEFAULT_COLUMN_ID_TO_ACCESSOR_KEY,
): VisibilityState {
  const visibility: VisibilityState = {};
  for (const column of columns) {
    const accessorKey = columnMapping[column.id];
    if (accessorKey) {
      visibility[accessorKey] = column.visible;
    }
  }
  return visibility;
}

/**
 * Updates ViewColumn[] based on VisibilityState changes
 *
 * @param columns - Current ViewColumn array
 * @param visibility - New VisibilityState from table
 * @param columnMapping - Optional custom column ID to accessor key mapping
 * @returns Updated ViewColumn array
 */
export function updateViewColumnsFromVisibility(
  columns: ViewColumn[],
  visibility: VisibilityState,
  columnMapping: Record<string, string> = DEFAULT_COLUMN_ID_TO_ACCESSOR_KEY,
): ViewColumn[] {
  return columns.map((col) => {
    const accessorKey = columnMapping[col.id];
    if (accessorKey && visibility[accessorKey] !== undefined) {
      return {...col, visible: visibility[accessorKey]};
    }
    return col;
  });
}
