/**
 * Jobs Page Component
 *
 * Refactored jobs page using DashboardContext and generic components.
 */

import {jobColumns} from 'components/table/table.stories.columns';
import {jobsData} from 'components/table/table.stories.data';
import {useMemo} from 'react';
import {useDashboardContext} from '../context';
import {TableWrapper} from '../table';
import {PageToolbar} from '../toolbar';

/**
 * Jobs Page
 *
 * Simple jobs page with table showing job breakdown.
 * Uses DashboardContext for state management and generic reusable components.
 *
 * @example
 * ```tsx
 * <DashboardProvider>
 *   <JobsPage />
 * </DashboardProvider>
 * ```
 */
export function JobsPage() {
  const {
    searchQuery,
    setSearchQuery,
    timePeriod,
    setTimePeriod,
    lastUpdated,
    columnVisibility,
    updateColumnVisibility,
  } = useDashboardContext();

  // Filter data based on search query
  const filteredData = useMemo(
    () => jobsData.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Page Toolbar */}
      <PageToolbar
        title="Jobs"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        lastUpdated={lastUpdated}
      />

      {/* Main Content - Responsive padding and spacing */}
      <div className="flex-1 px-12 pb-12 pt-4 md:px-24 md:pb-24 bg-background-neutral-base overflow-auto">
        {/* Jobs Table */}
        <TableWrapper
          title="Jobs breakdown"
          columns={jobColumns}
          data={filteredData}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={updateColumnVisibility}
        />
      </div>
    </div>
  );
}
