import type {Meta, StoryObj} from '@storybook/react';
import {getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {DataTableCard} from './DataTableCard';

const data = [
  {firstName: 'Keanu', lastName: 'Reeves', age: 42},
  {firstName: 'Brad', lastName: 'Pitt', age: 45},
  {firstName: 'Johnny', lastName: 'Depp', age: 50},
  {firstName: 'Tom', lastName: 'Hanks', age: 60},
  {firstName: 'Tom', lastName: 'Cruise', age: 60},
  {firstName: 'Angelina', lastName: 'Jolie', age: 60},
  {firstName: 'Will', lastName: 'Smith', age: 60},
  {firstName: 'Jack', lastName: 'Dorsey', age: 60},
  {firstName: 'Eddie', lastName: 'Murphy', age: 60},
];

const meta: Meta<typeof DataTableCard> = {
  title: 'Molecules/DataTable/DataTableCard',
  component: DataTableCard,
  argTypes: {
    title: {
      control: {type: 'text'},
    },
    description: {
      control: {type: 'text'},
    },
    isLoading: {
      type: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof DataTableCard>;

export const Playground: Story = {
  args: {
    title: 'Interesting table',
    description: 'All these columns have been hand carved',
    isLoading: false,
  },
  render: (args) => {
    const table = useReactTable({
      data,
      columns: [
        {
          header: 'First name',
          accessorKey: 'firstName',
        },
        {
          header: 'Last name',
          accessorKey: 'lastName',
        },
        {
          header: 'Age',
          accessorKey: 'age',
        },
      ],
      getCoreRowModel: getCoreRowModel(),
    });
    return <DataTableCard {...args} table={table} />;
  },
};
