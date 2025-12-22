import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {SearchInline} from 'components/search/search-inline';
import {DataTable} from 'components/table/data-table';
import {jobColumns} from 'components/table/table.stories.columns';
import {jobsData} from 'components/table/table.stories.data';
import {Header as TypographyHeader} from 'components/typography';
import {useMemo, useState} from 'react';

export function JobsContent() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(
    () => jobsData.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery],
  );

  return (
    <div className="min-h-[calc(100vh-48px)] p-12 md:p-24 bg-background-neutral-base">
      <div className="rounded-t-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12 md:gap-0 p-12 border-t border-x border-border-neutral-base rounded-t-8 bg-background-neutral-base">
          <TypographyHeader variant="h3" className="text-foreground-neutral-base">
            Jobs breakdown
          </TypographyHeader>

          <div className="flex items-center gap-8 md:gap-16 w-full md:w-auto">
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
          </div>
        </div>

        <DataTable
          columns={jobColumns}
          data={filteredData}
          pagination={true}
          pageSize={10}
          pageSizeOptions={[10, 20, 50, 100]}
          className="rounded-t-none"
        />
      </div>
    </div>
  );
}
