import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {QueryBuilder} from './query-builder';

const meta = {
  title: 'Components/QueryBuilder',
  component: QueryBuilder,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof QueryBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

function QueryBuilderExample() {
  const [query, setQuery] = useState('');

  return (
    <div className="space-y-8 w-700">
      <QueryBuilder value={query} onQueryChange={setQuery} className="w-full" />
      <div className="text-xs text-foreground-neutral-muted font-mono p-8 bg-background-neutral-base rounded-6">
        Query: {query || '(empty)'}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <div className="w-screen h-screen p-16">
      <QueryBuilderExample />
    </div>
  ),
};
