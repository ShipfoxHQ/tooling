import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {AstNode} from '@shipfox/shipql-parser';
import type {Meta, StoryObj} from '@storybook/react';
import {useEffect, useState} from 'react';
import type {LeafAstNode} from './lexical/shipql-leaf-node';
import {ShipQLEditor} from './shipql-editor';
import type {FacetDef} from './suggestions/types';

// Wait for React.lazy Suspense + Lexical useEffect tokenisation to settle.
const waitForEditor = async (ctx: Parameters<NonNullable<Story['play']>>[0], name: string) => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  await argosScreenshot(ctx, name);
};

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

export const Playground: Story = {
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor Playground'),
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'status:success AND env:prod',
  },
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor WithDefaultValue'),
};

export const ComplexQuery: Story = {
  args: {
    defaultValue: 'status:[200 TO 299] OR (env:prod NOT service:payments)',
  },
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor ComplexQuery'),
};

export const ExpandedLeaves: Story = {
  name: 'Expanded Leaves (NOT, grouped)',
  args: {
    defaultValue: 'NOT service:payments env:(prod OR staging) -status:error',
  },
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor ExpandedLeaves'),
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
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor LeafFocusCallback'),
};

export const Disabled: Story = {
  args: {
    defaultValue: 'status:success AND env:prod',
    disabled: true,
  },
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor Disabled'),
};

// ─── Shared facet definitions ─────────────────────────────────────────────────

const FACETS: FacetDef[] = [
  'status',
  'env',
  'service',
  'repository',
  {
    name: 'duration',
    config: {
      type: 'range',
      min: '0',
      max: '500',
      presets: ['>10m', '>30m', '>1h', '>6h'],
    },
  },
];

const FACET_VALUES: Record<string, string[]> = {
  status: ['success', 'failed', 'cancelled', 'running'],
  env: ['prod', 'staging', 'dev'],
  service: ['payments', 'auth', 'api', 'worker'],
  repository: ['shipfox-api', 'shipfox-web', 'tooling'],
};

// ─── With Suggestions ─────────────────────────────────────────────────────────

function WithSuggestionsDemo(args: Parameters<typeof ShipQLEditor>[0]) {
  const [currentFacet, setCurrentFacet] = useState<string | null>(null);
  const [partialValue, setPartialValue] = useState('');
  const allValues = currentFacet ? (FACET_VALUES[currentFacet] ?? []) : [];
  const valueSuggestions = partialValue
    ? allValues.filter((v) => v.toLowerCase().includes(partialValue.toLowerCase()))
    : allValues;

  return (
    <div className="flex flex-col gap-4">
      <ShipQLEditor
        {...args}
        facets={FACETS}
        currentFacet={currentFacet}
        setCurrentFacet={setCurrentFacet}
        valueSuggestions={valueSuggestions}
        onPartialValueChange={setPartialValue}
        placeholder="Add filter..."
      />
      <div className="rounded-6 border border-border-neutral-base bg-background-components-base p-3 text-sm font-code">
        <p className="mb-1 text-foreground-neutral-subtle">Parent state:</p>
        <pre className="text-foreground-neutral-base">
          {JSON.stringify({currentFacet, partialValue, valueSuggestions}, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export const WithSuggestions: Story = {
  render: (args) => <WithSuggestionsDemo {...args} />,
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor WithSuggestions'),
};

// ─── With Async Suggestions ───────────────────────────────────────────────────

function WithAsyncSuggestionsDemo(args: Parameters<typeof ShipQLEditor>[0]) {
  const [currentFacet, setCurrentFacet] = useState<string | null>(null);
  const [allValues, setAllValues] = useState<string[]>([]);
  const [partialValue, setPartialValue] = useState('');
  const [isLoadingValueSuggestions, setIsLoadingValueSuggestions] = useState(false);

  useEffect(() => {
    if (!currentFacet) {
      setAllValues([]);
      setIsLoadingValueSuggestions(false);
      return;
    }
    setIsLoadingValueSuggestions(true);
    setAllValues([]);
    const timer = setTimeout(() => {
      setAllValues(FACET_VALUES[currentFacet] ?? []);
      setIsLoadingValueSuggestions(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentFacet]);

  const valueSuggestions = partialValue
    ? allValues.filter((v) => v.toLowerCase().includes(partialValue.toLowerCase()))
    : allValues;

  return (
    <div className="flex flex-col gap-4">
      <ShipQLEditor
        {...args}
        facets={FACETS}
        currentFacet={currentFacet}
        setCurrentFacet={setCurrentFacet}
        valueSuggestions={valueSuggestions}
        isLoadingValueSuggestions={isLoadingValueSuggestions}
        onPartialValueChange={setPartialValue}
        placeholder="Add filter..."
      />
      <div className="rounded-6 border border-border-neutral-base bg-background-components-base p-3 text-sm font-code">
        <p className="mb-1 text-foreground-neutral-subtle">Parent state:</p>
        <pre className="text-foreground-neutral-base">
          {JSON.stringify(
            {currentFacet, partialValue, isLoadingValueSuggestions, valueSuggestions},
            null,
            2,
          )}
        </pre>
      </div>
    </div>
  );
}

export const WithAsyncSuggestions: Story = {
  name: 'With Async Suggestions',
  render: (args) => <WithAsyncSuggestionsDemo {...args} />,
  play: (ctx) => waitForEditor(ctx, 'ShipQLEditor WithAsyncSuggestions'),
};
