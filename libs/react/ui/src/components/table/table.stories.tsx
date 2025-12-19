import type {Meta, StoryObj} from '@storybook/react';
import type {ColumnDef} from '@tanstack/react-table';
import {Search, SearchContent, SearchOverlay, SearchTrigger} from 'components/search';
import {Header} from 'components/typography';
import {useMemo, useState} from 'react';
import {Button} from '../button';
import {Icon} from '../icon';
import {SearchInline} from '../search/search-inline';
import {DataTable} from './data-table';
import {jobColumns, searchJobColumns, userColumns} from './table.stories.columns';
import {JobsEmptyState, SearchModalContent} from './table.stories.components';
import {type JobData, jobsData, searchJobsData, users} from './table.stories.data';

const meta = {
  title: 'Components/Table',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Simple: Story = {
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={jobColumns.slice(0, 4)} data={jobsData.slice(0, 5)} pagination={false} />
    </div>
  ),
};

export const WithPagination: Story = {
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={jobColumns} data={jobsData} pagination={true} pageSize={10} />
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={jobColumns} data={[]} pagination={true} emptyState={<JobsEmptyState />} />
    </div>
  ),
};

export const UserTable: Story = {
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={userColumns} data={users} pagination={false} />
    </div>
  ),
};

export const SortableTable: Story = {
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={userColumns} data={users} pagination={false} />
    </div>
  ),
};

export const CompactTable: Story = {
  render: () => {
    const compactColumns: ColumnDef<JobData>[] = [
      jobColumns[0], // name
      jobColumns[1], // total
      jobColumns[6], // failureRate
    ];

    return (
      <div className="w-full min-h-screen bg-background-neutral-background p-24">
        <DataTable columns={compactColumns} data={jobsData.slice(0, 5)} pagination={false} />
      </div>
    );
  },
};

export const JobsOverview: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(
      () => jobsData.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase())),
      [searchQuery],
    );

    return (
      <div className="w-full min-h-screen bg-background-neutral-background p-24">
        <div className="flex items-center justify-between p-12 border-t border-x border-border-neutral-base rounded-t-8 rounded-b-none bg-background-neutral-base">
          <Header variant="h3" className="text-foreground-neutral-base">
            Jobs overview
          </Header>

          <div className="flex items-center justify-between gap-16">
            <SearchInline
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              className="w-240"
            />
            <Button variant="secondary" aria-label="Insert column left">
              <Icon name="insertColumnLeft" className="size-16 text-foreground-neutral-subtle" />
            </Button>
          </div>
        </div>

        <DataTable
          columns={jobColumns}
          data={filteredData}
          pagination={true}
          pageSize={10}
          className="rounded-t-none"
        />
      </div>
    );
  },
};

export const WithSearchModal: Story = {
  render: () => {
    function SearchModalDemo() {
      const [open, setOpen] = useState(false);
      const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

      const filteredData = useMemo(
        () =>
          selectedJobId ? searchJobsData.filter((job) => job.id === selectedJobId) : searchJobsData,
        [selectedJobId],
      );

      const selectedJob = useMemo(
        () => (selectedJobId ? searchJobsData.find((job) => job.id === selectedJobId) : null),
        [selectedJobId],
      );

      const handleSelectJob = (jobId: string) => {
        setSelectedJobId(jobId);
        setOpen(false);
      };

      const handleClearSelection = () => {
        setSelectedJobId(null);
      };

      return (
        <div className="w-full min-h-screen bg-background-neutral-background p-24">
          <div className="flex items-center justify-between p-12 border-t border-x border-border-neutral-base rounded-t-8 rounded-b-none bg-background-neutral-base">
            <Header variant="h3" className="text-foreground-neutral-base">
              Jobs Breakdown
            </Header>

            <div className="flex items-center gap-16">
              {selectedJob && (
                <Button
                  variant="transparentMuted"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-foreground-neutral-muted gap-4"
                  iconRight="closeLine"
                >
                  Clear filter
                </Button>
              )}
              <Search open={open} onOpenChange={setOpen} shortcutKey="meta+k" shouldFilter={false}>
                <SearchTrigger placeholder="Filter jobs..." className="w-280" />
                <SearchOverlay />
                <SearchContent>
                  <SearchModalContent onSelectJob={handleSelectJob} />
                </SearchContent>
              </Search>
            </div>
          </div>

          <DataTable
            columns={searchJobColumns}
            data={filteredData}
            pagination={true}
            pageSize={10}
            className="rounded-t-none"
          />
        </div>
      );
    }

    return <SearchModalDemo />;
  },
};
