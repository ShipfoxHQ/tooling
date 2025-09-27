import type {Meta, StoryObj} from '@storybook/react';
import {getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {DataTable} from './DataTable';

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

const meta: Meta<typeof DataTable> = {
  title: 'Molecules/DataTable/DataTable',
  component: DataTable,
  argTypes: {
    isLoading: {
      type: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof DataTable>;

export const Playground: Story = {
  args: {
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
    return <DataTable {...args} table={table} />;
  },
};
