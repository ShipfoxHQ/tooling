import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {SimpleQueryBuilder} from './simple-query-builder';
import type {SelectedFacets} from './types';

const meta = {
  title: 'Components/SimpleQueryBuilder',
  component: SimpleQueryBuilder,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof SimpleQueryBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

function facetsToJson(facets: SelectedFacets): string {
  const obj: Record<string, unknown> = {};
  for (const [id, sel] of Object.entries(facets)) {
    if (sel.type === 'list') {
      obj[id] = {type: 'list', methodology: sel.methodology, values: [...sel.values]};
    } else {
      obj[id] = {type: 'range', min: sel.min, max: sel.max};
    }
  }
  return JSON.stringify(obj, null, 2);
}

function SimpleQueryBuilderWithLog() {
  const [query, setQuery] = useState('status:success env:prod');
  const [facetsSnapshot, setFacetsSnapshot] = useState<{facets: SelectedFacets; freeText: string}>({
    facets: {},
    freeText: '',
  });

  return (
    <div className="space-y-12 w-700">
      <SimpleQueryBuilder
        value={query}
        onQueryChange={setQuery}
        onFacetsChange={(facets, freeText) => {
          setFacetsSnapshot({facets, freeText});
        }}
        placeholder="Type ShipQL: status:success env:prod"
        className="w-full"
      />
      <div className="text-xs font-mono space-y-6">
        <div className="p-8 bg-background-neutral-base rounded-6 text-foreground-neutral-base">
          <span className="text-foreground-neutral-muted">Query: </span>
          {query || '(empty)'}
        </div>
        <div className="p-8 bg-background-neutral-base rounded-6 text-foreground-neutral-base">
          <span className="text-foreground-neutral-muted">Facets: </span>
          <pre className="mt-4 whitespace-pre-wrap wrap-break-word">
            {facetsToJson(facetsSnapshot.facets)}
          </pre>
        </div>
        <div className="p-8 bg-background-neutral-base rounded-6 text-foreground-neutral-base">
          <span className="text-foreground-neutral-muted">Free text (searchQuery): </span>
          {facetsSnapshot.freeText || '(none)'}
        </div>
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div className="w-screen min-h-screen p-16">
      <SimpleQueryBuilderWithLog />
    </div>
  ),
};

export const WithRangeAndExclude: Story = {
  render: () => {
    const [query, setQuery] = useState('status:error NOT env:dev latency:[100 TO 500]');
    return (
      <div className="space-y-12 w-700">
        <SimpleQueryBuilder
          value={query}
          onQueryChange={setQuery}
          placeholder="ShipQL"
          className="w-full"
        />
        <div className="text-xs text-foreground-neutral-muted font-mono p-8 bg-background-neutral-base rounded-6">
          Query: {query || '(empty)'}
        </div>
      </div>
    );
  },
};
