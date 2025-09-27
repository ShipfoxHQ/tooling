import type {RowData} from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardProps,
  CardTitle,
} from 'components/Card';
import type {ReactNode} from 'react';
import {DataTable, type DataTableProps} from './DataTable';
import {DataTablePagination} from './DataTablePagination';

export interface DataTableCardProps<T extends RowData> extends DataTableProps<T> {
  title: string;
  description?: string;
  cardProps?: CardProps;
  cardHeaderActions?: ReactNode;
}

export function DataTableCard<T extends RowData>({
  table,
  title,
  description,
  cardProps,
  cardHeaderActions,
  ...props
}: DataTableCardProps<T>) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row">
          <div className="flex grow flex-col">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {cardHeaderActions}
        </div>
      </CardHeader>
      <CardContent>
        <DataTable table={table} {...props} />
      </CardContent>
      <CardFooter>
        <DataTablePagination table={table} />
      </CardFooter>
    </Card>
  );
}
