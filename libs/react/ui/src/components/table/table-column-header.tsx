import type {Column} from '@tanstack/react-table';
import {Icon} from 'components/icon';
import type {HTMLAttributes} from 'react';
import {cn} from 'utils/cn';
import {Button} from '../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../dropdown-menu';

export interface TableColumnHeaderProps<TData, TValue> extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function TableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: TableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn('text-xs font-medium', className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="transparent"
            size="xs"
            className="-ml-12 h-32 px-8 data-[state=open]:bg-background-components-hover"
          >
            <span className="text-xs font-medium text-foreground-neutral-subtle">{title}</span>
            {isSorted === 'desc' ? (
              <Icon name="arrowDownSLine" className="ml-4 size-16 text-foreground-neutral-muted" />
            ) : isSorted === 'asc' ? (
              <Icon name="arrowUpSLine" className="ml-4 size-16 text-foreground-neutral-muted" />
            ) : (
              <Icon name="arrowUpDownLine" className="ml-4 size-16 text-foreground-neutral-muted" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            icon="arrowUpSLine"
            onClick={() => column.toggleSorting(false)}
            closeOnSelect
          >
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            icon="arrowDownSLine"
            onClick={() => column.toggleSorting(true)}
            closeOnSelect
          >
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
