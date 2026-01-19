/**
 * Dashboard Context Provider
 *
 * Provides centralized state management for dashboard components including
 * search, filters, column visibility, time interval, and sidebar navigation.
 */

import type {VisibilityState} from '@tanstack/react-table';
import {findOptionValueForInterval} from 'components/interval-selector';
import type {NormalizedInterval} from 'date-fns';
import {createContext, type ReactNode, useCallback, useContext, useMemo, useState} from 'react';
import {intervalToNowFromDuration} from 'utils/date';
import type {
  DashboardState,
  FilterOption,
  ResourceType,
  ResourceTypeOption,
  ViewColumn,
} from './types';
import {updateViewColumnsFromVisibility, viewColumnsToVisibilityState} from './utils';

const DashboardContext = createContext<DashboardState | undefined>(undefined);

/**
 * Default columns configuration
 */
const DEFAULT_COLUMNS: ViewColumn[] = [
  {id: 'total', label: 'Total', visible: true},
  {id: 'success', label: 'Success', visible: true},
  {id: 'failed', label: 'Failed', visible: true},
  {id: 'neutral', label: 'Neutral', visible: true},
  {id: 'flaked', label: 'Flaked', visible: true},
  {id: 'failure-rate', label: 'Failure rate', visible: true},
  {id: 'flake-rate', label: 'Flake rate', visible: true},
  {id: 'repository', label: 'Repository', visible: false},
  {id: 'branch', label: 'Branch', visible: false},
];

/**
 * Default filters configuration
 */
const DEFAULT_FILTERS: FilterOption[] = [
  {id: 'success', label: 'Success', checked: false},
  {id: 'failed', label: 'Failed', checked: false},
  {id: 'neutral', label: 'Neutral', checked: false},
  {id: 'flaked', label: 'Flaked', checked: false},
  {id: 'running', label: 'Running', checked: false},
];

export const RESOURCE_TYPES: Array<ResourceType> = [
  'ci.pipeline',
  'ci.job',
  'ci.step',
  'test.run',
  'test.suite',
  'test.case',
] as const;

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  'ci.pipeline': 'CI Pipeline',
  'ci.job': 'CI Job',
  'ci.step': 'CI Step',
  'test.run': 'Test Run',
  'test.suite': 'Test Suite',
  'test.case': 'Test Case',
};

export const RESOURCE_TYPE_OPTIONS: ResourceTypeOption[] = [
  ...RESOURCE_TYPES.map((type) => ({
    id: type,
    label: RESOURCE_TYPE_LABELS[type],
    disabled: type.startsWith('test.'),
  })),
];

/**
 * Default interval
 */
const DEFAULT_INTERVAL = intervalToNowFromDuration({days: 7});

export interface DashboardProviderProps {
  children: ReactNode;
  /**
   * Initial columns configuration
   * @default DEFAULT_COLUMNS
   */
  initialColumns?: ViewColumn[];
  /**
   * Initial filters configuration
   * @default DEFAULT_FILTERS
   */
  initialFilters?: FilterOption[];
  /**
   * Initial time interval
   * @default intervalToNowFromDuration({days: 7})
   */
  initialInterval?: NormalizedInterval;
  /**
   * Initial active sidebar item
   * @default 'reliability'
   */
  initialActiveSidebarItem?: string;
  /**
   * Initial resource type
   * @default 'ci.pipeline'
   */
  initialResourceType?: ResourceType;
  /**
   * Custom column ID to accessor key mapping
   * @default DEFAULT_COLUMN_ID_TO_ACCESSOR_KEY from utils
   */
  columnMapping?: Record<string, string>;
}

/**
 * Dashboard Provider Component
 *
 * Wraps dashboard components to provide shared state management.
 *
 * @example
 * ```tsx
 * <DashboardProvider initialInterval={intervalToNowFromDuration({days: 7})}>
 *   <AnalyticsContent />
 * </DashboardProvider>
 * ```
 */
export function DashboardProvider({
  children,
  initialColumns = DEFAULT_COLUMNS,
  initialFilters = DEFAULT_FILTERS,
  initialInterval = DEFAULT_INTERVAL,
  initialActiveSidebarItem = 'reliability',
  initialResourceType = 'ci.pipeline',
  columnMapping,
}: DashboardProviderProps) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [interval, setInterval] = useState<NormalizedInterval>(initialInterval);
  const [intervalValue, setIntervalValue] = useState<string | undefined>(() =>
    findOptionValueForInterval(initialInterval),
  );
  const [lastUpdated, setLastUpdated] = useState('13s ago');
  const [columns, setColumns] = useState<ViewColumn[]>(initialColumns);
  const [filters, setFilters] = useState<FilterOption[]>(initialFilters);
  const [activeSidebarItem, setActiveSidebarItem] = useState(initialActiveSidebarItem);
  const [resourceType, setResourceType] = useState<ResourceType>(initialResourceType);

  const handleIntervalChange = useCallback((newInterval: NormalizedInterval) => {
    setInterval(newInterval);
    const value = findOptionValueForInterval(newInterval);
    setIntervalValue(value);
  }, []);

  // Compute column visibility state
  const columnVisibility = useMemo(
    () => viewColumnsToVisibilityState(columns, columnMapping),
    [columns, columnMapping],
  );

  // Handle column visibility updates from table
  const updateColumnVisibility = useCallback(
    (visibility: VisibilityState) => {
      const updatedColumns = updateViewColumnsFromVisibility(columns, visibility, columnMapping);
      setColumns(updatedColumns);
    },
    [columns, columnMapping],
  );

  const value: DashboardState = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      interval,
      setInterval: handleIntervalChange,
      intervalValue,
      setIntervalValue,
      lastUpdated,
      setLastUpdated,
      columns,
      setColumns,
      columnVisibility,
      updateColumnVisibility,
      filters,
      setFilters,
      activeSidebarItem,
      setActiveSidebarItem,
      resourceType,
      setResourceType,
    }),
    [
      searchQuery,
      interval,
      handleIntervalChange,
      intervalValue,
      lastUpdated,
      columns,
      columnVisibility,
      updateColumnVisibility,
      filters,
      activeSidebarItem,
      resourceType,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

/**
 * Hook to access dashboard context
 *
 * @throws Error if used outside of DashboardProvider
 * @returns Dashboard state and setters
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { searchQuery, setSearchQuery } = useDashboardContext();
 *   return <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />;
 * }
 * ```
 */
export function useDashboardContext(): DashboardState {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
}
