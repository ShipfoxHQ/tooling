import {Icon} from 'components/icon';
import {
  Search,
  SearchContent,
  SearchEmpty,
  SearchFooter,
  SearchGroup,
  SearchInput,
  SearchItem,
  SearchList,
  SearchSeparator,
  SearchTrigger,
} from 'components/search';
import {useState} from 'react';
import {cn} from 'utils/cn';

export interface ToolbarSearchProps {
  /**
   * Placeholder text for the search trigger
   */
  placeholder?: string;
  /**
   * Keyboard shortcut to open the search modal
   * @default 'meta+k'
   */
  shortcutKey?: string;
  /**
   * Callback when a search item is selected
   */
  onSelect?: (value: string) => void;
  /**
   * Additional class name for the trigger
   */
  className?: string;
}

export function ToolbarSearch({
  placeholder = 'Try: job name, status, pipeline...',
  shortcutKey = 'meta+k',
  onSelect,
  className,
}: ToolbarSearchProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setOpen(false);
  };

  return (
    <div className="flex-1">
      <Search open={open} onOpenChange={setOpen} shortcutKey={shortcutKey}>
        <SearchTrigger
          placeholder={placeholder}
          size="small"
          variant="primary"
          className={cn('w-full', className)}
        />
        <SearchContent aria-describedby={undefined}>
          <SearchInput placeholder="Search for anything..." />
          <SearchList>
            <SearchEmpty>No results found.</SearchEmpty>

            <SearchGroup heading="Recent">
              <SearchItem
                icon={
                  <Icon name="gitBranchLine" className="size-16 text-foreground-neutral-subtle" />
                }
                description="CI Pipeline"
                onSelect={() => handleSelect('feat/data-processing')}
              >
                feat/data-processing
              </SearchItem>
              <SearchItem
                icon={
                  <Icon name="gitBranchLine" className="size-16 text-foreground-neutral-subtle" />
                }
                description="CI Pipeline"
                onSelect={() => handleSelect('feat/pagination-polling')}
              >
                feat/pagination-polling
              </SearchItem>
            </SearchGroup>

            <SearchSeparator />

            <SearchGroup heading="Jobs">
              <SearchItem
                icon={
                  <Icon name="settings3Line" className="size-16 text-foreground-neutral-subtle" />
                }
                description="Running"
                onSelect={() => handleSelect('build-docker-image')}
              >
                build-docker-image
              </SearchItem>
              <SearchItem
                icon={
                  <Icon name="settings3Line" className="size-16 text-foreground-neutral-subtle" />
                }
                description="Completed"
                onSelect={() => handleSelect('run-tests')}
              >
                run-tests
              </SearchItem>
            </SearchGroup>

            <SearchSeparator />

            <SearchGroup heading="Status">
              <SearchItem
                icon={
                  <Icon
                    name="checkboxCircleLine"
                    className="size-16 text-foreground-success-base"
                  />
                }
                onSelect={() => handleSelect('status:success')}
              >
                Success
              </SearchItem>
              <SearchItem
                icon={
                  <Icon name="errorWarningLine" className="size-16 text-foreground-danger-base" />
                }
                onSelect={() => handleSelect('status:failed')}
              >
                Failed
              </SearchItem>
              <SearchItem
                icon={
                  <Icon name="loopRightLine" className="size-16 text-foreground-warning-base" />
                }
                onSelect={() => handleSelect('status:running')}
              >
                Running
              </SearchItem>
            </SearchGroup>
          </SearchList>
          <SearchFooter />
        </SearchContent>
      </Search>
    </div>
  );
}
