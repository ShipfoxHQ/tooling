import {Button} from 'components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from 'components/dropdown-menu';
import {Kbd} from 'components/kbd';
import type {HTMLAttributes} from 'react';
import {useEffect, useState} from 'react';
import {cn} from 'utils/cn';
import {RESOURCE_TYPE_LABELS, RESOURCE_TYPE_OPTIONS} from '../context';
import type {ResourceType} from '../context/types';

export interface FilterButtonProps extends HTMLAttributes<HTMLButtonElement> {
  value: ResourceType;
  onValueChange: (value: ResourceType) => void;
}

export function FilterButton({value, onValueChange, className, ...props}: FilterButtonProps) {
  const [open, setOpen] = useState(false);
  const filterOptions = RESOURCE_TYPE_OPTIONS.filter((opt) => !opt.disabled);
  const normalizedValue = (
    filterOptions.some((opt) => opt.id === value) ? value : (filterOptions[0]?.id ?? value)
  ) as ResourceType;
  const selectedLabel = RESOURCE_TYPE_LABELS[normalizedValue] ?? normalizedValue;
  const selectedIndex = filterOptions.findIndex((opt) => opt.id === normalizedValue);

  const handleFilterChange = (filterId: ResourceType) => {
    onValueChange(filterId);
    setOpen(false);
  };

  const indicator = (index: number) => {
    if (index === 0) {
      return <span className="size-[8.3px] rotate-45 border border-tag-purple-icon" />;
    }
    return <span className="size-10 rounded-full border border-tag-neutral-icon" />;
  };

  const calculatePaddingLeft = (index: number) => {
    switch (index) {
      case 0:
        return 10;
      case 1:
        return 28;
      case 2:
        return 48;
      default:
        return 0;
    }
  };

  const calculateLeftPosition = (index: number) => {
    switch (index) {
      case 0:
        return 0;
      case 1:
        return 16;
      case 2:
        return 34;
      default:
        return 0;
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === 'ArrowDown' &&
        (event.metaKey || event.ctrlKey) &&
        event.target instanceof HTMLElement &&
        !['INPUT', 'TEXTAREA'].includes(event.target.tagName) &&
        !event.target.isContentEditable
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className={cn('px-10', className)} {...props}>
          <span className="hidden md:inline-flex items-center gap-6">
            <span className="inline-flex items-center gap-8">
              {selectedIndex >= 0 && indicator(selectedIndex)}
              <span>{selectedLabel}</span>
            </span>
            <Kbd className="h-16 min-w-16 px-4 text-[10px]">⌘↓</Kbd>
          </span>
          <span className="flex md:hidden items-center gap-8">
            {selectedIndex >= 0 && indicator(selectedIndex)}
            <span>{selectedLabel}</span>
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-200">
        <DropdownMenuLabel className="text-foreground-neutral-muted text-xs">
          CI Structure
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {filterOptions.map((option, index) => {
            return (
              <DropdownMenuItem
                key={option.id}
                onClick={() => handleFilterChange(option.id)}
                style={{
                  paddingLeft: calculatePaddingLeft(index),
                }}
                className={cn(
                  'relative hover:text-foreground-neutral-base',
                  selectedIndex === index && 'text-foreground-neutral-base',
                )}
              >
                {index !== 0 && (
                  <>
                    <span
                      className="absolute top-0 bottom-0 w-px bg-border-neutral-strong h-16"
                      style={{left: calculateLeftPosition(index)}}
                    />
                    <span
                      className="absolute top-16 bottom-0 w-6 bg-border-neutral-strong h-px"
                      style={{left: calculateLeftPosition(index)}}
                    />
                  </>
                )}
                <span className="inline-flex items-center gap-8 ml-2">
                  {indicator(index)}
                  {option.label}
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
