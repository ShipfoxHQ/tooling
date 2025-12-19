import type {Meta, StoryObj} from '@storybook/react';
import type {ColumnDef} from '@tanstack/react-table';
import {Search, SearchContent, SearchOverlay, SearchTrigger} from 'components/search';
import {Header, Text} from 'components/typography';
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
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={jobColumns.slice(0, 4)} data={jobsData.slice(0, 5)} pagination={false} />
    </div>
  ),
};

export const WithPagination: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable
        columns={jobColumns}
        data={jobsData}
        pagination={true}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />
    </div>
  ),
};

export const EmptyState: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={jobColumns} data={[]} pagination={true} emptyState={<JobsEmptyState />} />
    </div>
  ),
};

export const UserTable: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <DataTable columns={userColumns} data={users} pagination={false} />
    </div>
  ),
};

export const CompactTable: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
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
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = useMemo(
      () => jobsData.filter((job) => job.name.toLowerCase().includes(searchQuery.toLowerCase())),
      [searchQuery],
    );

    return (
      <div className="w-full min-h-screen bg-background-neutral-background p-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12 sm:gap-0 p-12 border-t border-x border-border-neutral-base rounded-t-8 rounded-b-none bg-background-neutral-base">
          <Header variant="h3" className="text-foreground-neutral-base">
            Jobs overview
          </Header>

          <div className="flex items-center gap-12 sm:gap-16 w-full sm:w-auto">
            <SearchInline
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              className="flex-1 sm:w-240"
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
    );
  },
};

export const WithSearchModal: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-12 sm:gap-0 p-12 border-t border-x border-border-neutral-base rounded-t-8 rounded-b-none bg-background-neutral-base">
            <Header variant="h3" className="text-foreground-neutral-base">
              Jobs Breakdown
            </Header>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-12 sm:gap-16 w-full sm:w-auto">
              {selectedJob && (
                <Button
                  variant="transparentMuted"
                  size="sm"
                  onClick={handleClearSelection}
                  className="text-foreground-neutral-muted gap-4 w-full sm:w-auto justify-center sm:justify-start"
                  iconRight="closeLine"
                >
                  Clear filter
                </Button>
              )}
              <Search open={open} onOpenChange={setOpen} shortcutKey="meta+k" shouldFilter={false}>
                <SearchTrigger placeholder="Filter jobs..." className="w-full sm:w-280" />
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
            pageSizeOptions={[10, 25, 50]}
            className="rounded-t-none"
          />
        </div>
      );
    }

    return <SearchModalDemo />;
  },
};

export const WithRowSelection: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'extraLarge',
    },
  },
  render: () => (
    <div className="w-full min-h-screen bg-background-neutral-background p-24">
      <div className="space-y-16">
        <div>
          <Header variant="h3" className="text-foreground-neutral-base mb-8">
            Selectable Rows
          </Header>
          <Text size="sm" className="text-foreground-neutral-muted">
            Use the checkboxes to select rows. The pagination footer shows the count of selected
            rows.
          </Text>
        </div>
        <DataTable
          columns={jobColumns}
          data={jobsData}
          pagination={true}
          pageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
          showSelectedCount={true}
        />
      </div>
    </div>
  ),
};
