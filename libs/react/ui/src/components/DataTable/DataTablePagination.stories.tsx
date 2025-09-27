import type {Meta, StoryObj} from '@storybook/react';
import {getCoreRowModel, useReactTable} from '@tanstack/react-table';
import {DataTablePagination} from './DataTablePagination';

const data = Array.from({length: 250}, () => ({number: Math.floor(Math.random() * 100)}));

const meta: Meta<typeof DataTablePagination> = {
  title: 'Molecules/DataTable/DataTablePagination',
  component: DataTablePagination,
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof DataTablePagination>;

export const Playground: Story = {
  args: {},
  render: () => {
    const table = useReactTable({
      data,
      columns: [],
      getCoreRowModel: getCoreRowModel(),
    });
    return <DataTablePagination table={table} />;
  },
};
