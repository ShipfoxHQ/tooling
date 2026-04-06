import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {Meta, StoryObj} from '@storybook/react';
import {ScrollArea} from 'components/scroll-area';
import {buildSuggestionItems} from './generate-suggestions';
import {ShipQLSuggestionItem} from './shipql-suggestion-item';
import {ShipQLSuggestionsFooter} from './shipql-suggestions-footer';
import type {FacetDef, SuggestionItem} from './types';

// ─── Shared data ──────────────────────────────────────────────────────────────

const GROUPED_FACETS: FacetDef[] = [
  {
    id: 'status',
    metadata: {
      label: 'Status',
      description: 'Primary execution status (success, failed, cancelled...)',
      group: 'execution',
      groupLabel: 'Execution',
      groupOrder: 0,
      groupIcon: 'playLine',
    },
  },
  {
    id: 'pipeline.name',
    metadata: {
      label: 'Pipeline',
      description: 'Name of the CI pipeline',
      group: 'pipeline',
      groupLabel: 'Pipeline',
      groupOrder: 1,
      groupIcon: 'gitMergeLine',
    },
  },
  {
    id: 'pipeline.execution.number',
    metadata: {
      label: 'Pipeline Exec #',
      description: 'Execution number of the pipeline',
      group: 'pipeline',
      groupLabel: 'Pipeline',
      groupOrder: 1,
      groupIcon: 'gitMergeLine',
    },
  },
  {
    id: 'vcs.ref.head.name',
    metadata: {
      label: 'Branch',
      description: 'Branch or tag name',
      group: 'vcs',
      groupLabel: 'VCS',
      groupOrder: 5,
      groupIcon: 'gitBranchLine',
    },
  },
  {
    id: 'vcs.commit.author.name',
    metadata: {
      label: 'Commit Author',
      description: 'Name of the commit author',
      group: 'vcs',
      groupLabel: 'VCS',
      groupOrder: 5,
      groupIcon: 'gitBranchLine',
    },
  },
  {
    id: 'host.arch',
    metadata: {
      label: 'CPU Architecture',
      description: 'CPU architecture (x86, amd64, arm64)',
      group: 'infrastructure',
      groupLabel: 'Infrastructure',
      groupOrder: 6,
      groupIcon: 'serverLine',
    },
  },
  {
    id: 'ci.runner.type',
    metadata: {
      label: 'Runner Type',
      description: 'Type of CI runner (e.g. shipfox-2vcpu-ubuntu-2404)',
      group: 'ci',
      groupLabel: 'CI',
      groupOrder: 8,
      groupIcon: 'robotLine',
    },
  },
];

// ─── Inline dropdown panel ────────────────────────────────────────────────────

const noop = () => undefined;

interface SuggestionsPanel {
  items: SuggestionItem[];
  selectedIndex?: number;
}

function SuggestionsPanel({items, selectedIndex = -1}: SuggestionsPanel) {
  return (
    <div className="flex flex-col overflow-hidden rounded-8 bg-background-neutral-base shadow-tooltip w-[320px]">
      <ScrollArea className="flex-1 min-h-0 overflow-y-auto scrollbar">
        <div className="flex flex-col">
          {items.map((item, index) => (
            <ShipQLSuggestionItem
              key={item.value}
              item={item}
              isHighlighted={selectedIndex === index}
              onMouseDown={noop}
            />
          ))}
        </div>
      </ScrollArea>
      <ShipQLSuggestionsFooter
        showValueActions={false}
        showSyntaxHelp={false}
        onToggleSyntaxHelp={noop}
        syntaxHintMode="value"
      />
    </div>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Components/ShipQLEditor/SuggestionItem',
  component: ShipQLSuggestionItem,
  tags: ['autodocs'],
} satisfies Meta<typeof ShipQLSuggestionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const GroupedFacets: Story = {
  render: () => <SuggestionsPanel items={buildSuggestionItems(GROUPED_FACETS, [], '', null)} />,
  play: async (ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    await argosScreenshot(ctx, 'ShipQLEditor SuggestionItem GroupedFacets');
  },
};

export const GroupedFacetsFiltered: Story = {
  render: () => <SuggestionsPanel items={buildSuggestionItems(GROUPED_FACETS, [], 'pipe', null)} />,
  play: async (ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    await argosScreenshot(ctx, 'ShipQLEditor SuggestionItem GroupedFacetsFiltered');
  },
};

export const ValueSuggestions: Story = {
  render: () => (
    <SuggestionsPanel
      items={buildSuggestionItems(
        GROUPED_FACETS,
        ['success', 'failed', 'cancelled', 'running'],
        'status:',
        null,
      )}
    />
  ),
  play: async (ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    await argosScreenshot(ctx, 'ShipQLEditor SuggestionItem ValueSuggestions');
  },
};
