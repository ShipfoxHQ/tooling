import type {VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';
import {Icon} from '../icon';
import {Kbd} from '../kbd';
import {useSearchContext} from './search-context';
import {searchTriggerVariants} from './search-variants';

export type SearchTriggerProps = ComponentProps<'button'> &
  VariantProps<typeof searchTriggerVariants> & {
    placeholder?: string;
    shortcut?: string;
  };

export function SearchTrigger({
  className,
  variant,
  size,
  radius,
  placeholder = 'Search',
  shortcut = '⌘K',
  ...props
}: SearchTriggerProps) {
  const {setOpen} = useSearchContext();
  const isSmall = size === 'small';

  return (
    <button
      type="button"
      data-slot="search-trigger"
      onClick={() => setOpen(true)}
      className={cn(searchTriggerVariants({variant, size, radius}), className)}
      {...props}
    >
      <Icon name="searchLine" className={cn('shrink-0', isSmall ? 'size-14' : 'size-16')} />
      <span className="flex-1 text-left truncate">{placeholder}</span>
      <Kbd
        className={cn(
          isSmall && 'h-16 min-w-16 px-4 text-[10px]',
          radius === 'rounded' && 'rounded-full',
        )}
      >
        {shortcut}
      </Kbd>
    </button>
  );
}
