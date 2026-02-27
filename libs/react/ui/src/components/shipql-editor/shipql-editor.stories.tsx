import type {AstNode} from '@shipfox/shipql-parser';
import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import type {LeafAstNode} from './lexical/shipql-leaf-node';
import {ShipQLEditor} from './shipql-editor';
import type {ShipQLFieldDef} from './suggestions/types';

const meta = {
  title: 'Components/ShipQLEditor',
  component: ShipQLEditor,
  tags: ['autodocs'],
  args: {
    placeholder: 'Type a ShipQL query…',
  },
} satisfies Meta<typeof ShipQLEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'status:success AND env:prod',
  },
};

export const ComplexQuery: Story = {
  args: {
    defaultValue: 'status:[200 TO 299] OR (env:prod NOT service:payments)',
  },
};

export const ExpandedLeaves: Story = {
  name: 'Expanded Leaves (NOT, grouped)',
  args: {
    defaultValue: 'NOT service:payments env:(prod OR staging) -status:error',
  },
};

function LeafFocusCallbackDemo(args: Parameters<typeof ShipQLEditor>[0]) {
  const [focused, setFocused] = useState<LeafAstNode | null>(null);
  const [lastAst, setLastAst] = useState<AstNode | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <ShipQLEditor
        {...args}
        defaultValue="status:success AND env:prod"
        onLeafFocus={setFocused}
        onChange={setLastAst}
      />
      <div className="rounded-6 border border-border-neutral-base bg-background-components-base p-3 text-sm font-code">
        <p className="mb-1 text-foreground-neutral-subtle">Focused leaf:</p>
        <pre className="text-foreground-neutral-base">
          {focused ? JSON.stringify(focused, null, 2) : 'null'}
        </pre>
        {lastAst && (
          <>
            <p className="mb-1 mt-3 text-foreground-neutral-subtle">Last valid AST (on blur):</p>
            <pre className="text-foreground-neutral-base">{JSON.stringify(lastAst, null, 2)}</pre>
          </>
        )}
      </div>
    </div>
  );
}

export const LeafFocusCallback: Story = {
  render: (args) => <LeafFocusCallbackDemo {...args} />,
};

export const Disabled: Story = {
  args: {
    defaultValue: 'status:success AND env:prod',
    disabled: true,
  },
};

const DEMO_FIELDS: ShipQLFieldDef[] = [
  {
    name: 'status',
    label: 'Status',
    type: 'list',
    values: ['success', 'failed', 'cancelled', 'running'],
  },
  {name: 'env', label: 'Environment', type: 'list', values: ['prod', 'staging', 'dev']},
  {name: 'service', label: 'Service', type: 'list', values: ['payments', 'auth', 'api', 'worker']},
  {
    name: 'repository',
    label: 'Repository',
    type: 'list',
    values: ['shipfox-api', 'shipfox-web', 'tooling'],
  },
  {name: 'duration', label: 'Duration', type: 'range', min: 0, max: 120_000_000_000},
];

export const WithSuggestions: Story = {
  args: {
    fields: DEMO_FIELDS,
    placeholder: 'Type a field or value…',
  },
};

const BASE_FIELDS: ShipQLFieldDef[] = [
  {name: 'status', label: 'Status', type: 'list'},
  {name: 'duration', label: 'Duration', type: 'range', min: 0, max: 120_000_000_000},
  {name: 'ci-pipeline', label: 'CI Pipeline', type: 'list'},
  {name: 'repository', label: 'Repository', type: 'list'},
  {name: 'branch', label: 'Branch', type: 'list'},
];

const FIELD_VALUES: Record<string, string[]> = {
  status: ['success', 'failed', 'cancelled', 'running'],
  'ci-pipeline': ['main', 'release', 'hotfix', 'feature'],
  repository: ['shipfox-api', 'shipfox-web', 'tooling'],
  branch: ['main', 'develop', 'staging'],
};

async function mockFetchSuggestions(fieldName?: string): Promise<ShipQLFieldDef[]> {
  await new Promise((r) => setTimeout(r, 150));
  if (fieldName && FIELD_VALUES[fieldName]) {
    return BASE_FIELDS.map((f) =>
      f.name === fieldName ? {...f, values: FIELD_VALUES[fieldName]} : f,
    );
  }
  return BASE_FIELDS;
}

export const WithDynamicSuggestions: Story = {
  name: 'With Dynamic Suggestions (async fetch)',
  render: (args) => (
    <ShipQLEditor
      {...args}
      fetchSuggestions={mockFetchSuggestions}
      placeholder="Type to search — suggestions fetched dynamically…"
    />
  ),
};
