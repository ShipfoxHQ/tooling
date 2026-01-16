/**
 * Shared types for dashboard components
 */

import type {VisibilityState} from '@tanstack/react-table';
import type {NormalizedInterval} from 'date-fns';

/**
 * View column configuration for table visibility control
 */
export interface ViewColumn {
  id: string;
  label: string;
  visible: boolean;
}

/**
 * Filter option configuration
 */
export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

/**
 * Resource type option
 */
export type ResourceType = 'ci-pipeline' | 'ci-jobs' | 'ci-steps' | 'runners' | 'suite' | 'cases';

/**
 * Dashboard context state
 */
export interface DashboardState {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Time interval
  interval: NormalizedInterval;
  setInterval: (interval: NormalizedInterval) => void;
  intervalValue: string | undefined;
  setIntervalValue: (value: string | undefined) => void;

  // Last updated timestamp
  lastUpdated: string;
  setLastUpdated: (timestamp: string) => void;

  // Column visibility
  columns: ViewColumn[];
  setColumns: (columns: ViewColumn[]) => void;
  columnVisibility: VisibilityState;
  updateColumnVisibility: (visibility: VisibilityState) => void;

  // Filters
  filters: FilterOption[];
  setFilters: (filters: FilterOption[]) => void;

  // Active sidebar item
  activeSidebarItem: string;
  setActiveSidebarItem: (itemId: string) => void;

  // Resource type
  resourceType: ResourceType;
  setResourceType: (type: ResourceType) => void;
}
