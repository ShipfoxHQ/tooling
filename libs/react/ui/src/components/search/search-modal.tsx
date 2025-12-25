import {Command as CommandPrimitive} from 'cmdk';
import type {ComponentProps, ReactNode} from 'react';
import {useCallback} from 'react';
import {cn} from 'utils/cn';
import {Icon} from '../icon';
import {Kbd} from '../kbd';
import {Modal, ModalBody, ModalContent, type ModalContentProps, ModalTitle} from '../modal/modal';
import {useSearchContext} from './search-context';

export type SearchContentProps = {
  breakpoint?: string;
} & Omit<ModalContentProps, 'open' | 'onOpenChange'>;

export function SearchContent({
  breakpoint = '(min-width: 768px)',
  className,
  children,
  overlayClassName,
  onEscapeKeyDown,
  ...props
}: SearchContentProps) {
  const {open, setOpen, searchValue, setSearchValue} = useSearchContext();

  const handleEscapeKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (searchValue) {
        event.preventDefault();
        setSearchValue('');
      } else {
        onEscapeKeyDown?.(event);
      }
    },
    [searchValue, setSearchValue, onEscapeKeyDown],
  );

  return (
    <Modal open={open} onOpenChange={setOpen} breakpoint={breakpoint}>
      <ModalContent
        data-slot="search-content"
        className={cn('top-[15%]! translate-y-0!', className)}
        overlayClassName={cn('backdrop-blur-sm', overlayClassName)}
        onEscapeKeyDown={handleEscapeKeyDown}
        {...props}
      >
        <ModalTitle className="sr-only">Search</ModalTitle>
        <ModalBody className="flex flex-col p-0 min-h-0 overflow-hidden md:overflow-clip">
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export type SearchInputProps = Omit<
  ComponentProps<typeof CommandPrimitive.Input>,
  'value' | 'onValueChange'
>;

export function SearchInput({className, ...props}: SearchInputProps) {
  const {open, searchValue, setSearchValue} = useSearchContext();

  return (
    <div className="w-full shrink-0 flex items-center gap-8 border-b border-border-neutral-strong px-16 py-12">
      <Icon name="searchLine" className="size-16 shrink-0 text-foreground-neutral-muted" />
      <CommandPrimitive.Input
        data-slot="search-input"
        autoFocus={open}
        value={searchValue}
        onValueChange={setSearchValue}
        className={cn(
          'flex-1 bg-transparent text-base md:text-sm leading-20 outline-none',
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
      className={cn(
        'flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden px-8 py-4 scrollbar',
        'md:max-h-400',
        className,
      )}
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
        'w-full shrink-0 flex items-center justify-end gap-12 px-16 py-12',
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
