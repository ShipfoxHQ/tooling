/**
 * Column definitions for Table stories
 */

import type {ColumnDef} from '@tanstack/react-table';
import {Badge} from 'components/badge';
import {Icon} from 'components/icon';
import type {JobData, SearchJobData, User} from './table.stories.data';
import {TableColumnHeader} from './table-column-header';

/**
 * Create column definitions for JobData
 */
export const createJobColumns = (): ColumnDef<JobData>[] => [
  {
    accessorKey: 'name',
    header: ({column}) => <TableColumnHeader column={column} title="Name" />,
    cell: ({row}) => (
      <div className="font-medium text-foreground-neutral-base">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'total',
    header: ({column}) => <TableColumnHeader column={column} title="Total" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <div className="size-6 rounded-full bg-foreground-neutral-muted" />
        <span className="tabular-nums">{row.getValue('total')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'success',
    header: ({column}) => <TableColumnHeader column={column} title="Success" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <div className="size-6 rounded-full bg-tag-success-icon" />
        <span className="tabular-nums">{row.getValue('success')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'failed',
    header: ({column}) => <TableColumnHeader column={column} title="Failed" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <div className="size-6 rounded-full bg-tag-error-icon" />
        <span className="tabular-nums">{row.getValue('failed')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'neutral',
    header: ({column}) => <TableColumnHeader column={column} title="Neutral" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <div className="size-6 rounded-full bg-foreground-neutral-muted" />
        <span className="tabular-nums">{row.getValue('neutral')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'flaked',
    header: ({column}) => <TableColumnHeader column={column} title="Flaked" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <div className="size-6 rounded-full bg-tag-warning-icon" />
        <span className="tabular-nums">{row.getValue('flaked')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'failureRate',
    header: ({column}) => <TableColumnHeader column={column} title="Failure rate" />,
    cell: ({row}) => <span className="tabular-nums">{row.getValue('failureRate')}</span>,
  },
  {
    accessorKey: 'flakeRate',
    header: ({column}) => <TableColumnHeader column={column} title="Flake rate" />,
    cell: ({row}) => <span className="tabular-nums">{row.getValue('flakeRate')}</span>,
  },
];

/**
 * Create column definitions for User data
 */
export const createUserColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: 'name',
    header: ({column}) => <TableColumnHeader column={column} title="Name" />,
    cell: ({row}) => (
      <div className="font-medium text-foreground-neutral-base">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'email',
    header: ({column}) => <TableColumnHeader column={column} title="Email" />,
    cell: ({row}) => <div className="text-foreground-neutral-subtle">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'role',
    header: ({column}) => <TableColumnHeader column={column} title="Role" />,
    cell: ({row}) => <Badge variant="neutral">{row.getValue('role')}</Badge>,
  },
  {
    accessorKey: 'status',
    header: ({column}) => <TableColumnHeader column={column} title="Status" />,
    cell: ({row}) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'success' : 'neutral'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
];

/**
 * Create column definitions for SearchJobData
 */
export const createSearchJobColumns = (): ColumnDef<SearchJobData>[] => [
  {
    accessorKey: 'name',
    header: ({column}) => <TableColumnHeader column={column} title="Job Name" />,
    cell: ({row}) => (
      <div className="font-medium text-foreground-neutral-base">{row.getValue('name')}</div>
    ),
  },
  {
    accessorKey: 'repository',
    header: ({column}) => <TableColumnHeader column={column} title="Repository" />,
    cell: ({row}) => (
      <div className="text-foreground-neutral-subtle font-mono text-xs">
        {row.getValue('repository')}
      </div>
    ),
  },
  {
    accessorKey: 'branch',
    header: ({column}) => <TableColumnHeader column={column} title="Branch" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <Icon name="gitBranchLine" className="size-14 text-foreground-neutral-muted" />
        <span className="font-mono text-xs">{row.getValue('branch')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: ({column}) => <TableColumnHeader column={column} title="Total" />,
    cell: ({row}) => <span className="tabular-nums">{row.getValue('total')}</span>,
  },
  {
    accessorKey: 'success',
    header: ({column}) => <TableColumnHeader column={column} title="Success" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <div className="size-6 rounded-full bg-tag-success-icon" />
        <span className="tabular-nums">{row.getValue('success')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'failed',
    header: ({column}) => <TableColumnHeader column={column} title="Failed" />,
    cell: ({row}) => (
      <div className="flex items-center gap-6">
        <div className="size-6 rounded-full bg-tag-error-icon" />
        <span className="tabular-nums">{row.getValue('failed')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({column}) => <TableColumnHeader column={column} title="Status" />,
    cell: ({row}) => {
      const status = row.getValue('status') as string;
      const variantMap = {
        active: 'info',
        completed: 'success',
        failed: 'error',
      } as const;
      return (
        <Badge variant={variantMap[status as keyof typeof variantMap]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
];

/**
 * Column instances for reuse in stories
 */
export const jobColumns = createJobColumns();
export const userColumns = createUserColumns();
export const searchJobColumns = createSearchJobColumns();
