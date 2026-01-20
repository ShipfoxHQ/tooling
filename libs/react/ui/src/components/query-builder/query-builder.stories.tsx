import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {QueryBuilder} from './query-builder';
import type {QueryBuilderSuggestion} from './use-query-builder';

const meta = {
  title: 'Components/QueryBuilder',
  component: QueryBuilder,
  tags: ['autodocs'],
  argTypes: {
    value: {control: 'text'},
    placeholder: {control: 'text'},
  },
  args: {
    placeholder: 'Add filter...',
  },
} satisfies Meta<typeof QueryBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSuggestions: QueryBuilderSuggestion[] = [
  {property: 'status', value: 'success', label: 'Success', count: 9},
  {property: 'status', value: 'failed', label: 'Failed', count: 5},
  {property: 'status', value: 'running', label: 'Running', count: 2},
  {property: 'duration', value: '< 1 min', label: '< 1 min', count: 9},
  {property: 'duration', value: '1-5 min', label: '1-5 min', count: 9},
  {property: 'duration', value: '5-10 min', label: '5-10 min', count: 5},
  {property: 'duration', value: '> 10 min', label: '> 10 min', count: 5},
  {property: 'pipeline', value: 'feat/data-processing', label: 'feat/data-processing'},
  {property: 'pipeline', value: 'main', label: 'main'},
  {property: 'pipeline', value: 'develop', label: 'develop'},
];

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState('');
    return (
      <div className="w-full max-w-600">
        <QueryBuilder
          {...args}
          value={value}
          onValueChange={setValue}
          suggestions={mockSuggestions}
        />
        <div className="mt-16 p-12 bg-background-neutral-subtle rounded-6">
          <p className="text-xs text-foreground-neutral-muted mb-4">Query string:</p>
          <code className="text-sm text-foreground-neutral-base">{value || '(empty)'}</code>
        </div>
      </div>
    );
  },
};

export const WithInitialValue: Story = {
  render: (args) => {
    const [value, setValue] = useState('status:success duration:1-5 min,5-10 min');
    return (
      <div className="w-full max-w-600">
        <QueryBuilder
          {...args}
          value={value}
          onValueChange={setValue}
          suggestions={mockSuggestions}
        />
        <div className="mt-16 p-12 bg-background-neutral-subtle rounded-6">
          <p className="text-xs text-foreground-neutral-muted mb-4">Query string:</p>
          <code className="text-sm text-foreground-neutral-base">{value || '(empty)'}</code>
        </div>
      </div>
    );
  },
};

export const WithNegatedValues: Story = {
  render: (args) => {
    const [value, setValue] = useState('status:-failed pipeline:main');
    return (
      <div className="w-full max-w-600">
        <QueryBuilder
          {...args}
          value={value}
          onValueChange={setValue}
          suggestions={mockSuggestions}
        />
        <div className="mt-16 p-12 bg-background-neutral-subtle rounded-6">
          <p className="text-xs text-foreground-neutral-muted mb-4">Query string:</p>
          <code className="text-sm text-foreground-neutral-base">{value || '(empty)'}</code>
        </div>
      </div>
    );
  },
};

export const MultipleFilters: Story = {
  render: (args) => {
    const [value, setValue] = useState(
      'status:success,failed duration:1-5 min pipeline:main,develop',
    );
    return (
      <div className="w-full max-w-600">
        <QueryBuilder
          {...args}
          value={value}
          onValueChange={setValue}
          suggestions={mockSuggestions}
        />
        <div className="mt-16 p-12 bg-background-neutral-subtle rounded-6">
          <p className="text-xs text-foreground-neutral-muted mb-4">Query string:</p>
          <code className="text-sm text-foreground-neutral-base">{value || '(empty)'}</code>
        </div>
      </div>
    );
  },
};
