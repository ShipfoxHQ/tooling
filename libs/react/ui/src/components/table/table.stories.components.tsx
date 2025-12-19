/**
 * Shared components for Table stories
 */

import {Icon} from 'components/icon';
import {useSearchContext} from 'components/search/search-context';
import {
  SearchEmpty,
  SearchFooter,
  SearchGroup,
  SearchInput,
  SearchItem,
  SearchList,
} from 'components/search/search-modal';
import {Text} from 'components/typography';
import {useMemo} from 'react';
import {searchJobsData} from './table.stories.data';

/**
 * Empty state component for job tables
 */
export function JobsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-12 py-48">
      <div className="size-32 rounded-6 bg-transparent border border-border-neutral-strong flex items-center justify-center">
        <Icon
          name="shipfox"
          className="size-16 text-foreground-neutral-subtle"
          color="var(--foreground-neutral-subtle, #a1a1aa)"
        />
      </div>
      <div className="text-center space-y-4">
        <Text size="sm" className="text-foreground-neutral-base">
          No jobs yet
        </Text>
        <Text size="xs" className="text-foreground-neutral-muted">
          Import past runs or start a runner.
        </Text>
      </div>
    </div>
  );
}

/**
 * Search modal content component with job filtering
 */
export function SearchModalContent({onSelectJob}: {onSelectJob: (jobId: string) => void}) {
  const {searchValue} = useSearchContext();

  const modalFilteredData = useMemo(() => {
    if (!searchValue) {
      return searchJobsData;
    }
    const query = searchValue.toLowerCase();
    return searchJobsData.filter(
      (job) =>
        job.name.toLowerCase().includes(query) ||
        job.repository.toLowerCase().includes(query) ||
        job.branch.toLowerCase().includes(query),
    );
  }, [searchValue]);

  return (
    <>
      <SearchInput placeholder="Search by job name, repository, or branch..." />
      <SearchList>
        {modalFilteredData.length === 0 ? (
          <SearchEmpty>
            <JobsEmptyState />
          </SearchEmpty>
        ) : (
          <SearchGroup heading={searchValue ? `Results (${modalFilteredData.length})` : 'All Jobs'}>
            {modalFilteredData.map((job) => (
              <SearchItem
                key={job.id}
                value={`${job.id}-${job.name}-${job.repository}-${job.branch}`}
                icon={
                  <Icon name="gitBranchLine" className="size-16 text-foreground-neutral-subtle" />
                }
                description={`${job.repository} • ${job.branch}`}
                onSelect={() => onSelectJob(job.id)}
              >
                {job.name}
              </SearchItem>
            ))}
          </SearchGroup>
        )}
      </SearchList>
      <SearchFooter>
        <div className="flex items-center justify-between px-8 py-6">
          <Text size="xs" className="text-foreground-neutral-muted">
            Select a job to filter the table
          </Text>
          <div className="flex items-center gap-8">
            <Icon name="cornerDownLeft" className="size-14 text-foreground-neutral-muted" />
            <Text size="xs" className="text-foreground-neutral-muted">
              to select
            </Text>
          </div>
        </div>
      </SearchFooter>
    </>
  );
}
