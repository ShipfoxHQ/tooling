import {Command as CommandPrimitive} from 'cmdk';
import {AnimatePresence, motion, type Transition} from 'framer-motion';
import type {ComponentProps, ReactNode} from 'react';
import {useEffect} from 'react';
import {cn} from 'utils/cn';
import {Icon} from '../icon';
import {Kbd} from '../kbd';
import {useSearchContext} from './search-context';
import {searchDefaultTransition} from './search-variants';

export type SearchOverlayProps = {
  className?: string;
  transition?: Transition;
};

export function SearchOverlay({
  className,
  transition = searchDefaultTransition,
}: SearchOverlayProps) {
  const {open, setOpen} = useSearchContext();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-slot="search-overlay"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={transition}
          onClick={() => setOpen(false)}
          className={cn(
            'fixed inset-0 z-40 bg-background-backdrop-backdrop backdrop-blur-sm',
            className,
          )}
        />
      )}
    </AnimatePresence>
  );
}

export type SearchContentProps = {
  className?: string;
  children?: ReactNode;
  transition?: Transition;
};

export function SearchContent({
  className,
  children,
  transition = searchDefaultTransition,
}: SearchContentProps) {
  const {open, setOpen, searchValue, setSearchValue} = useSearchContext();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (searchValue) {
          setSearchValue('');
        } else {
          setOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, searchValue, setSearchValue, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-slot="search-content"
          initial={{opacity: 0, scale: 0.95, y: -10}}
          animate={{opacity: 1, scale: 1, y: 0}}
          exit={{opacity: 0, scale: 0.95, y: -10}}
          transition={transition}
          className={cn(
            'fixed left-1/2 top-[15%] z-50 w-full max-w-600 -translate-x-1/2',
            'flex flex-col overflow-hidden rounded-12',
            'bg-background-neutral-base text-foreground-neutral-base',
            'shadow-tooltip border border-border-neutral-base',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export type SearchInputProps = Omit<
  ComponentProps<typeof CommandPrimitive.Input>,
  'value' | 'onValueChange'
>;

export function SearchInput({className, ...props}: SearchInputProps) {
  const {open, searchValue, setSearchValue} = useSearchContext();

  return (
    <div className="flex items-center gap-8 border-b border-border-neutral-strong px-16 py-12">
      <Icon name="searchLine" className="size-16 shrink-0 text-foreground-neutral-muted" />
      <CommandPrimitive.Input
        data-slot="search-input"
        autoFocus={open}
        value={searchValue}
        onValueChange={setSearchValue}
        className={cn(
          'flex-1 bg-transparent text-sm leading-20 outline-none',
          'placeholder:text-foreground-neutral-muted',
          'disabled:cursor-not-allowed disabled:text-foreground-neutral-disabled',
          className,
        )}
        {...props}
      />
      <Kbd>Esc</Kbd>
    </div>
  );
}

export type SearchListProps = ComponentProps<typeof CommandPrimitive.List>;

export function SearchList({className, ...props}: SearchListProps) {
  return (
    <CommandPrimitive.List
      data-slot="search-list"
      className={cn('max-h-400 overflow-y-auto overflow-x-hidden px-8 py-4 scrollbar', className)}
      {...props}
    />
  );
}

export type SearchEmptyProps = ComponentProps<typeof CommandPrimitive.Empty>;

export function SearchEmpty({className, ...props}: SearchEmptyProps) {
  return (
    <CommandPrimitive.Empty
      data-slot="search-empty"
      className={cn('py-32 text-center text-sm text-foreground-neutral-muted', className)}
      {...props}
    />
  );
}

export type SearchGroupProps = ComponentProps<typeof CommandPrimitive.Group>;

export function SearchGroup({className, ...props}: SearchGroupProps) {
  return (
    <CommandPrimitive.Group
      data-slot="search-group"
      className={cn(
        'overflow-hidden',
        '[&_[cmdk-group-heading]]:px-8 [&_[cmdk-group-heading]]:py-4',
        '[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:leading-20',
        '[&_[cmdk-group-heading]]:text-foreground-neutral-subtle',
        '[&_[cmdk-group-heading]]:select-none',
        className,
      )}
      {...props}
    />
  );
}

export type SearchItemProps = ComponentProps<typeof CommandPrimitive.Item> & {
  icon?: ReactNode;
  description?: string;
};

export function SearchItem({className, children, icon, description, ...props}: SearchItemProps) {
  return (
    <CommandPrimitive.Item
      data-slot="search-item"
      className={cn(
        'relative flex cursor-pointer select-none items-center gap-12 rounded-8 p-8',
        'text-sm leading-20 text-foreground-neutral-subtle outline-none transition-colors',
        'aria-selected:bg-background-components-hover aria-selected:text-foreground-neutral-base',
        'data-[disabled=true]:pointer-events-none data-[disabled=true]:text-foreground-neutral-disabled',
        className,
      )}
      {...props}
    >
      {icon && <span className="shrink-0 text-foreground-neutral-muted">{icon}</span>}
      <div className="flex-1 min-w-0">
        <div className="truncate">{children}</div>
        {description && (
          <div className="truncate text-xs text-foreground-neutral-muted">{description}</div>
        )}
      </div>
    </CommandPrimitive.Item>
  );
}

export type SearchSeparatorProps = ComponentProps<typeof CommandPrimitive.Separator>;

export function SearchSeparator({className, ...props}: SearchSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      data-slot="search-separator"
      className={cn('my-8 h-px bg-border-neutral-base', className)}
      {...props}
    />
  );
}

export type SearchFooterProps = ComponentProps<'div'>;

export function SearchFooter({className, ...props}: SearchFooterProps) {
  return (
    <div
      data-slot="search-footer"
      className={cn(
        'flex items-center justify-end gap-12 px-16 py-12',
        'border-t border-border-neutral-strong',
        'bg-background-components-base',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-8">
        <span className="text-xs font-medium text-foreground-neutral-subtle">Navigation</span>
        <div className="flex items-center gap-4">
          <Kbd>↓</Kbd>
          <Kbd>↑</Kbd>
        </div>
      </div>
      <div className="h-12 w-px bg-border-neutral-strong" />
      <div className="flex items-center gap-8">
        <span className="text-xs font-medium text-foreground-neutral-subtle">Open result</span>
        <Kbd>↵</Kbd>
      </div>
    </div>
  );
}
