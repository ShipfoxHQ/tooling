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
import {Kbd} from 'components/kbd';
import {useState} from 'react';
import {cn} from 'utils/cn';

export interface FilterOption {
  id: string;
  label: string;
  checked: boolean;
}

export interface FilterButtonProps {
  filters?: FilterOption[];
  onFiltersChange?: (filters: FilterOption[]) => void;
  className?: string;
}

const defaultFilters: FilterOption[] = [
  {id: 'success', label: 'Success', checked: false},
  {id: 'failed', label: 'Failed', checked: false},
  {id: 'neutral', label: 'Neutral', checked: false},
  {id: 'flaked', label: 'Flaked', checked: false},
  {id: 'running', label: 'Running', checked: false},
];

export function FilterButton({
  filters: controlledFilters,
  onFiltersChange,
  className,
}: FilterButtonProps) {
  const [internalFilters, setInternalFilters] = useState<FilterOption[]>(defaultFilters);
  const filters = controlledFilters ?? internalFilters;

  const handleFilterChange = (filterId: string, checked: boolean) => {
    const updatedFilters = filters.map((f) => (f.id === filterId ? {...f, checked} : f));
    if (onFiltersChange) {
      onFiltersChange(updatedFilters);
    } else {
      setInternalFilters(updatedFilters);
    }
  };

  const activeCount = filters.filter((f) => f.checked).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className={cn(className)}>
          <Icon
            name="filterLine"
            className="size-16 text-foreground-neutral-subtle block md:hidden"
          />
          <span className="hidden md:inline-flex items-center gap-6">
            Filter <Kbd className="h-16 min-w-16 px-4 text-[10px]">F</Kbd>
          </span>

          {activeCount > 0 && (
            <span className="size-16 rounded-full bg-foreground-highlight-interactive text-[10px] font-medium text-foreground-neutral-on-color flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-200">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {filters.map((filter) => (
          <DropdownMenuCheckboxItem
            key={filter.id}
            checked={filter.checked}
            onCheckedChange={(checked) => handleFilterChange(filter.id, checked)}
            closeOnSelect={false}
          >
            {filter.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
