import {type Header, flexRender} from '@tanstack/react-table';
import {Button} from 'components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/DropdownMenu';
import {Icon} from 'components/Icon';
import {cn} from 'utils';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  header: Header<TData, TValue>;
}

export function DataTableColumnHeader<TData, TValue>({
  header,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const {column} = header;
  const headerDef = column.columnDef.header;
  const title = flexRender(headerDef, header.getContext());

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const emptyTitle = typeof headerDef === 'string' && headerDef.length === 0;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn([
              '-ml-3 h-8 px-2 data-[state=open]:bg-surface-active',
              {'ml-0': header.index === 0},
            ])}
          >
            {!emptyTitle && <span>{title}</span>}
            {column.getIsSorted() === 'desc' ? (
              <Icon icon="arrowDown" className={cn(['ml-2 h-4 w-4', {'ml-0': emptyTitle}])} />
            ) : column.getIsSorted() === 'asc' ? (
              <Icon icon="arrowUp" className={cn(['ml-2 h-4 w-4', {'ml-0': emptyTitle}])} />
            ) : (
              <Icon icon="caretSort" className={cn(['ml-2 h-4 w-4', {'ml-0': emptyTitle}])} />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <Icon icon="arrowUp" className="text-text-secondary/70 mr-2 h-3.5 w-3.5" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <Icon icon="arrowDown" className="text-text-secondary/70 mr-2 h-3.5 w-3.5" />
            Desc
          </DropdownMenuItem>

          {column.getCanHide() && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <Icon icon="eyeNone" className="text-text-secondary/70 mr-2 h-3.5 w-3.5" />
                Hide
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
