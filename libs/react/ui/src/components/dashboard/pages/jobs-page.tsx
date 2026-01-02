import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {SearchInline} from 'components/search/search-inline';
import {jobColumns} from 'components/table/table.stories.columns';
import {jobsData} from 'components/table/table.stories.data';
import {useMemo} from 'react';
import {useDashboardContext} from '../context';
import {TableWrapper} from '../table';
import {PageToolbar} from '../toolbar';

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

  const filteredData = useMemo(
    () => jobsData.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div className="flex h-full flex-col">
      <PageToolbar
        title="Jobs"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        lastUpdated={lastUpdated}
      />

      <div className="flex-1 px-12 pb-12 pt-4 md:px-24 md:pb-24 overflow-auto">
        <TableWrapper
          title="Jobs breakdown"
          columns={jobColumns}
          data={filteredData}
          headerActions={
            <>
              <SearchInline
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                className="flex-1 md:w-240"
              />
              <Button variant="secondary" aria-label="Insert column left" className="shrink-0">
                <Icon name="insertColumnLeft" className="size-16 text-foreground-neutral-subtle" />
              </Button>
            </>
          }
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={updateColumnVisibility}
        />
      </div>
    </div>
  );
}
