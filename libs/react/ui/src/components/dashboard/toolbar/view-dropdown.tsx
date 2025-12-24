import {Button} from 'components/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/dropdown-menu';
import {Icon} from 'components/icon';
import {useState} from 'react';

export interface ViewColumn {
  id: string;
  label: string;
  visible: boolean;
}

export interface ViewDropdownProps {
  columns?: ViewColumn[];
  onColumnsChange?: (columns: ViewColumn[]) => void;
}

const defaultColumns: ViewColumn[] = [
  {id: 'total', label: 'Total', visible: true},
  {id: 'success', label: 'Success', visible: true},
  {id: 'failed', label: 'Failed', visible: true},
  {id: 'neutral', label: 'Neutral', visible: true},
  {id: 'flaked', label: 'Flaked', visible: true},
  {id: 'failure-rate', label: 'Failure rate', visible: true},
  {id: 'flake-rate', label: 'Flake rate', visible: true},
  {id: 'repository', label: 'Repository', visible: false},
  {id: 'branch', label: 'Branch', visible: false},
];

export function ViewDropdown({columns: controlledColumns, onColumnsChange}: ViewDropdownProps) {
  const [internalColumns, setInternalColumns] = useState<ViewColumn[]>(defaultColumns);
  const columns = controlledColumns ?? internalColumns;

  const handleColumnChange = (columnId: string, visible: boolean) => {
    const updatedColumns = columns.map((col) => (col.id === columnId ? {...col, visible} : col));
    if (onColumnsChange) {
      onColumnsChange(updatedColumns);
    } else {
      setInternalColumns(updatedColumns);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" aria-label="Customize columns">
          <Icon
            name="stackedView"
            className="size-16 text-foreground-neutral-subtle block md:hidden"
          />
          <span className="hidden md:inline-flex items-center gap-6">
            View <Icon name="stackedView" className="size-16 text-foreground-neutral-subtle" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-180">
        <DropdownMenuLabel>Custom display</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.visible}
            onCheckedChange={(visible) => handleColumnChange(column.id, visible)}
            closeOnSelect={false}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
