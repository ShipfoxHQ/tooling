import {cva, type VariantProps} from 'class-variance-authority';
import {Command as CommandPrimitive} from 'cmdk';
import {AnimatePresence, motion, type Transition} from 'framer-motion';
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {cn} from 'utils/cn';
import {Icon} from '../icon';
import {Kbd} from '../kbd';

const searchInputVariants = cva(
  [
    'inline-flex items-center gap-8',
    'text-sm leading-20',
    'transition-[color,box-shadow,background-color] outline-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-background-field-base',
          'shadow-button-neutral',
          'focus-within:shadow-border-interactive-with-active',
        ],
        secondary: [
          'bg-background-field-component',
          'border border-border-neutral-strong',
          'focus-within:shadow-border-interactive-with-active',
        ],
      },
      size: {
        base: 'h-32 px-8 py-6',
        small: 'h-28 px-8 py-4',
      },
      radius: {
        rounded: 'rounded-full',
        squared: 'rounded-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
      radius: 'squared',
    },
  },
);

const searchTriggerVariants = cva(
  [
    'inline-flex items-center gap-8 cursor-pointer',
    'text-sm leading-20 text-foreground-neutral-muted',
    'transition-[color,box-shadow,background-color] outline-none',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-foreground-neutral-disabled',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-background-field-base',
          'shadow-button-neutral',
          'hover:bg-background-field-hover',
          'focus-visible:shadow-border-interactive-with-active',
        ],
        secondary: [
          'bg-background-field-component',
          'border border-border-neutral-strong',
          'hover:bg-background-field-component-hover',
          'focus-visible:shadow-border-interactive-with-active',
        ],
      },
      size: {
        base: 'h-32 px-8 py-6',
        small: 'h-28 px-8 py-4',
      },
      radius: {
        rounded: 'rounded-full',
        squared: 'rounded-6',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'base',
      radius: 'squared',
    },
  },
);

const searchDefaultTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

const SHORTCUT_KEY_REGEX = /^(meta\+|cmd\+|ctrl\+|⌘)/;

type SearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('Search components must be used within a Search component');
  }
  return context;
}

type SearchProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  /** Keyboard shortcut to open search (e.g., 'f', 'k'). Use 'meta+k' for ⌘K. */
  shortcutKey?: string;
};

function Search({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  shortcutKey,
}: SearchProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (newOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange],
  );

  // Handle keyboard shortcut to open search
  useEffect(() => {
    if (!shortcutKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = shortcutKey.toLowerCase();
      const isMetaKey = key.startsWith('meta+') || key.startsWith('cmd+') || key.startsWith('⌘');
      const isCtrlKey = key.startsWith('ctrl+');
      const targetKey = key.replace(SHORTCUT_KEY_REGEX, '');

      if (isMetaKey && e.metaKey && e.key.toLowerCase() === targetKey) {
        e.preventDefault();
        setOpen(true);
      } else if (isCtrlKey && e.ctrlKey && e.key.toLowerCase() === targetKey) {
        e.preventDefault();
        setOpen(true);
      } else if (
        !isMetaKey &&
        !isCtrlKey &&
        e.key.toLowerCase() === targetKey &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        // Only trigger if not in an input/textarea
        const target = e.target as HTMLElement;
        if (
          target.tagName !== 'INPUT' &&
          target.tagName !== 'TEXTAREA' &&
          !target.isContentEditable
        ) {
          e.preventDefault();
          setOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcutKey, setOpen]);

  return (
    <SearchContext.Provider value={{open, setOpen}}>
      <CommandPrimitive data-slot="search">{children}</CommandPrimitive>
    </SearchContext.Provider>
  );
}

type SearchTriggerProps = ComponentProps<'button'> &
  VariantProps<typeof searchTriggerVariants> & {
    placeholder?: string;
    shortcut?: string;
  };

function SearchTrigger({
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

type SearchInlineProps = Omit<ComponentProps<'input'>, 'size'> &
  VariantProps<typeof searchInputVariants> & {
    /** Whether to show the Esc kbd button when input has value */
    showClearButton?: boolean;
    /** Callback when input is cleared via Esc button */
    onClear?: () => void;
  };

function SearchInline({
  className,
  variant,
  size,
  radius,
  value,
  onChange,
  onClear,
  showClearButton = true,
  ...props
}: SearchInlineProps) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  const hasValue = Boolean(inputValue);
  const isSmall = size === 'small';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    onClear?.();
  };

  // Handle Escape key to clear input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && hasValue) {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div
      data-slot="search-inline"
      className={cn(searchInputVariants({variant, size, radius}), className)}
    >
      <Icon
        name="searchLine"
        className={cn('shrink-0 text-foreground-neutral-muted', isSmall ? 'size-14' : 'size-16')}
      />
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex-1 bg-transparent outline-none min-w-0',
          'text-foreground-neutral-base',
          'placeholder:text-foreground-neutral-muted',
          'disabled:cursor-not-allowed disabled:text-foreground-neutral-disabled',
        )}
        {...props}
      />
      {showClearButton && hasValue && (
        <button
          type="button"
          onClick={handleClear}
          className={cn(
            'shrink-0 cursor-pointer rounded-4 p-2 -mx-2',
            'text-foreground-neutral-muted hover:text-foreground-neutral-subtle transition-colors',
          )}
          aria-label="Clear search"
        >
          <Icon name="closeLine" className="size-16" />
        </button>
      )}
    </div>
  );
}

type SearchOverlayProps = {
  className?: string;
  transition?: Transition;
};

function SearchOverlay({className, transition = searchDefaultTransition}: SearchOverlayProps) {
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

type SearchContentProps = {
  className?: string;
  children?: ReactNode;
  transition?: Transition;
};

function SearchContent({
  className,
  children,
  transition = searchDefaultTransition,
}: SearchContentProps) {
  const {open, setOpen} = useSearchContext();

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, setOpen]);

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

type SearchInputProps = ComponentProps<typeof CommandPrimitive.Input>;

function SearchInput({className, ...props}: SearchInputProps) {
  const {open} = useSearchContext();

  return (
    <div className="flex items-center gap-8 border-b border-border-neutral-strong px-16 py-12">
      <Icon name="searchLine" className="size-16 shrink-0 text-foreground-neutral-muted" />
      <CommandPrimitive.Input
        data-slot="search-input"
        autoFocus={open}
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

type SearchListProps = ComponentProps<typeof CommandPrimitive.List>;

function SearchList({className, ...props}: SearchListProps) {
  return (
    <CommandPrimitive.List
      data-slot="search-list"
      className={cn('max-h-400 overflow-y-auto overflow-x-hidden px-8 py-4 scrollbar', className)}
      {...props}
    />
  );
}

type SearchEmptyProps = ComponentProps<typeof CommandPrimitive.Empty>;

function SearchEmpty({className, ...props}: SearchEmptyProps) {
  return (
    <CommandPrimitive.Empty
      data-slot="search-empty"
      className={cn('py-32 text-center text-sm text-foreground-neutral-muted', className)}
      {...props}
    />
  );
}

type SearchGroupProps = ComponentProps<typeof CommandPrimitive.Group>;

function SearchGroup({className, ...props}: SearchGroupProps) {
  return (
    <CommandPrimitive.Group
      data-slot="search-group"
      className={cn(
        'overflow-hidden',
        '**:[[cmdk-group-heading]]:px-8 **:[[cmdk-group-heading]]:py-4',
        '**:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:leading-20',
        '**:[[cmdk-group-heading]]:text-foreground-neutral-subtle',
        '**:[[cmdk-group-heading]]:select-none',
        className,
      )}
      {...props}
    />
  );
}

type SearchItemProps = ComponentProps<typeof CommandPrimitive.Item> & {
  icon?: ReactNode;
  description?: string;
};

function SearchItem({className, children, icon, description, ...props}: SearchItemProps) {
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

type SearchSeparatorProps = ComponentProps<typeof CommandPrimitive.Separator>;

function SearchSeparator({className, ...props}: SearchSeparatorProps) {
  return (
    <CommandPrimitive.Separator
      data-slot="search-separator"
      className={cn('my-8 h-px bg-border-neutral-base', className)}
      {...props}
    />
  );
}

type SearchFooterProps = ComponentProps<'div'>;

function SearchFooter({className, ...props}: SearchFooterProps) {
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

export {
  Search,
  SearchInline,
  SearchTrigger,
  SearchOverlay,
  SearchContent,
  SearchInput,
  SearchList,
  SearchEmpty,
  SearchGroup,
  SearchItem,
  SearchSeparator,
  SearchFooter,
  searchDefaultTransition,
  searchInputVariants,
  searchTriggerVariants,
  useSearchContext,
};

export type {
  SearchProps,
  SearchInlineProps,
  SearchTriggerProps,
  SearchOverlayProps,
  SearchContentProps,
  SearchInputProps,
  SearchItemProps,
  SearchFooterProps,
};
