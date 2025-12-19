import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Icon} from '../icon';
import {
  Search,
  SearchContent,
  SearchEmpty,
  SearchFooter,
  SearchGroup,
  SearchInline,
  SearchInput,
  SearchItem,
  SearchList,
  SearchOverlay,
  SearchSeparator,
  SearchTrigger,
} from './index';

const meta: Meta = {
  title: 'Components/Search',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A search component with two types: inline (input-style) and modal (trigger + overlay). Supports primary/secondary variants, base/small sizes, and squared/rounded radius options.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Inline: Story = {
  render: () => {
    function InlineDemo() {
      const [value, setValue] = useState('');

      return (
        <div className="flex flex-col gap-16 max-w-400">
          <SearchInline
            placeholder="Search..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
          />
          {value && (
            <p className="text-sm text-foreground-neutral-muted">Searching for: "{value}"</p>
          )}
        </div>
      );
    }
    return <InlineDemo />;
  },
};

export const InlineVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Primary (default)</span>
        <div className="flex gap-8">
          <SearchInline
            variant="primary"
            radius="squared"
            placeholder="Search..."
            defaultValue="random"
            className="w-200"
          />
          <SearchInline
            variant="primary"
            radius="rounded"
            placeholder="Search..."
            defaultValue="random"
            className="w-200"
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Secondary</span>
        <div className="flex gap-8">
          <SearchInline
            variant="secondary"
            radius="squared"
            placeholder="Search..."
            defaultValue="random"
            className="w-200"
          />
          <SearchInline
            variant="secondary"
            radius="rounded"
            placeholder="Search..."
            defaultValue="random"
            className="w-200"
          />
        </div>
      </div>
    </div>
  ),
};

export const InlineSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Base (32px)</span>
        <div className="flex gap-8">
          <SearchInline
            size="base"
            placeholder="Search..."
            defaultValue="random"
            className="w-200"
          />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Small (28px)</span>
        <div className="flex gap-8">
          <SearchInline
            size="small"
            placeholder="Search..."
            defaultValue="random"
            className="w-200"
          />
        </div>
      </div>
    </div>
  ),
};

function ModalSearchDemo() {
  const [open, setOpen] = useState(false);

  return (
    <Search open={open} onOpenChange={setOpen} shortcutKey="meta+k">
      <SearchTrigger placeholder="Find..." className="w-full max-w-280" />
      <SearchOverlay />
      <SearchContent>
        <SearchInput placeholder="Search for anything..." />
        <SearchList>
          <SearchEmpty>No results found.</SearchEmpty>
          <SearchGroup heading="Recent">
            <SearchItem
              icon={
                <Icon name="gitBranchLine" className="size-16 text-foreground-neutral-subtle" />
              }
              description="qr-attendance"
            >
              feat/data-processing
            </SearchItem>
            <SearchItem
              icon={
                <Icon name="gitBranchLine" className="size-16 text-foreground-neutral-subtle" />
              }
              description="qr-attendance"
            >
              feat/pagination-polling
            </SearchItem>
          </SearchGroup>
          <SearchSeparator />
          <SearchGroup heading="Team">
            <SearchItem
              icon={<Icon name="rocketLine" className="size-16 text-foreground-neutral-subtle" />}
              description="Team"
            >
              Deployments
            </SearchItem>
            <SearchItem
              icon={<Icon name="linksLine" className="size-16 text-foreground-neutral-subtle" />}
              description="Team"
            >
              Integrations
            </SearchItem>
          </SearchGroup>
        </SearchList>
        <SearchFooter />
      </SearchContent>
    </Search>
  );
}

export const Modal: Story = {
  render: () => <ModalSearchDemo />,
};

function TriggerPreview({
  variant,
  size,
  radius,
  className,
}: {
  variant?: 'primary' | 'secondary';
  size?: 'base' | 'small';
  radius?: 'squared' | 'rounded';
  className?: string;
}) {
  return (
    <Search>
      <SearchTrigger variant={variant} size={size} radius={radius} className={className} />
    </Search>
  );
}

export const ModalTriggerVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Primary (default)</span>
        <div className="flex gap-8">
          <TriggerPreview variant="primary" radius="squared" className="w-200" />
          <TriggerPreview variant="primary" radius="rounded" className="w-200" />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Secondary</span>
        <div className="flex gap-8">
          <TriggerPreview variant="secondary" radius="squared" className="w-200" />
          <TriggerPreview variant="secondary" radius="rounded" className="w-200" />
        </div>
      </div>
    </div>
  ),
};

export const ModalTriggerSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Base (32px)</span>
        <div className="flex gap-8">
          <TriggerPreview size="base" variant="primary" className="w-200" />
          <TriggerPreview size="base" variant="secondary" className="w-200" />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-xs text-foreground-neutral-muted">Small (28px)</span>
        <div className="flex gap-8">
          <TriggerPreview size="small" variant="primary" className="w-200" />
          <TriggerPreview size="small" variant="secondary" className="w-200" />
        </div>
      </div>
    </div>
  ),
};

export const AllCombinations: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      <div>
        <h3 className="text-sm font-medium text-foreground-neutral-base mb-12">Inline Search</h3>
        <div className="grid grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Squared / Base</span>
            <SearchInline
              variant="primary"
              radius="squared"
              size="base"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Squared / Small</span>
            <SearchInline
              variant="primary"
              radius="squared"
              size="small"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Rounded / Base</span>
            <SearchInline
              variant="primary"
              radius="rounded"
              size="base"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Rounded / Small</span>
            <SearchInline
              variant="primary"
              radius="rounded"
              size="small"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Squared / Base
            </span>
            <SearchInline
              variant="secondary"
              radius="squared"
              size="base"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Squared / Small
            </span>
            <SearchInline
              variant="secondary"
              radius="squared"
              size="small"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Rounded / Base
            </span>
            <SearchInline
              variant="secondary"
              radius="rounded"
              size="base"
              placeholder="Search..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Rounded / Small
            </span>
            <SearchInline
              variant="secondary"
              radius="rounded"
              size="small"
              placeholder="Search..."
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-foreground-neutral-base mb-12">
          Modal Search Triggers
        </h3>
        <div className="grid grid-cols-4 gap-12">
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Squared / Base</span>
            <TriggerPreview variant="primary" radius="squared" size="base" className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Squared / Small</span>
            <TriggerPreview variant="primary" radius="squared" size="small" className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Rounded / Base</span>
            <TriggerPreview variant="primary" radius="rounded" size="base" className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">Primary / Rounded / Small</span>
            <TriggerPreview variant="primary" radius="rounded" size="small" className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Squared / Base
            </span>
            <TriggerPreview variant="secondary" radius="squared" size="base" className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Squared / Small
            </span>
            <TriggerPreview variant="secondary" radius="squared" size="small" className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Rounded / Base
            </span>
            <TriggerPreview variant="secondary" radius="rounded" size="base" className="w-full" />
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-xs text-foreground-neutral-muted">
              Secondary / Rounded / Small
            </span>
            <TriggerPreview variant="secondary" radius="rounded" size="small" className="w-full" />
          </div>
        </div>
      </div>
    </div>
  ),
};
