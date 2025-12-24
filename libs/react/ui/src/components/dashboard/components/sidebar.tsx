import {Button} from 'components/button';
import {Icon, type IconName} from 'components/icon';
import {Kbd} from 'components/kbd';
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from 'components/tooltip';
import {Text} from 'components/typography';
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {cn} from 'utils/cn';

const SIDEBAR_WIDTH = '16rem'; // 256px
const SIDEBAR_WIDTH_ICON = '4rem'; // 64px
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

export type SidebarNavItem = {
  id: string;
  label: string;
  icon: IconName;
  href?: string;
  isActive?: boolean;
};

export interface SidebarProps {
  items: SidebarNavItem[];
  activeItemId?: string;
  onItemClick?: (item: SidebarNavItem) => void;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

type SidebarContextType = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarContext must be used within Sidebar');
  }
  return context;
}

export function Sidebar({
  items,
  activeItemId,
  onItemClick,
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
}: SidebarProps) {
  // Internal state for uncontrolled mode
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open],
  );

  const toggleSidebar = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  // Keyboard shortcut: Cmd/Ctrl + B
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = useMemo<SidebarContextType>(
    () => ({
      state,
      open,
      setOpen,
      toggleSidebar,
    }),
    [state, open, setOpen, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <aside
          style={{
            width: state === 'collapsed' ? SIDEBAR_WIDTH_ICON : SIDEBAR_WIDTH,
          }}
          className={cn(
            'group/sidebar flex flex-col shrink-0 h-full',
            'transition-[width] duration-150 ease-linear',
            className,
          )}
          data-state={state}
          data-collapsible={state === 'collapsed' ? 'icon' : ''}
        >
          {/* Navigation */}
          <nav className="flex flex-col flex-1 overflow-hidden gap-4">
            <SidebarHeader />
            <SidebarContent>
              <SidebarMenu items={items} activeItemId={activeItemId} onItemClick={onItemClick} />
            </SidebarContent>
          </nav>
        </aside>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function SidebarHeader() {
  const {state, toggleSidebar} = useSidebarContext();

  return (
    <div
      data-slot="sidebar-header"
      className={cn(
        'flex items-center h-32 shrink-0',
        'transition-all duration-200',
        state === 'collapsed' ? 'justify-center px-0' : 'justify-between pl-24 pr-16',
      )}
    >
      {state === 'expanded' && (
        <Text
          size="xs"
          className="flex-1 font-medium text-foreground-neutral-muted whitespace-nowrap"
        >
          Analytics
        </Text>
      )}

      {/* Toggle Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="transparent"
            size="2xs"
            className={cn(
              'shrink-0 text-foreground-neutral-muted hover:text-foreground-neutral-subtle',
              'transition-all duration-200',
              'p-6 rounded-6',
              'size-32',
            )}
            onClick={toggleSidebar}
            aria-label={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={state === 'expanded'}
          >
            <Icon
              name={state === 'expanded' ? 'sidebarFoldLine' : 'sidebarUnfoldLine'}
              className="size-16"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-8">
          <span>{state === 'expanded' ? 'Collapse' : 'Expand'} sidebar</span>
          <Kbd className="h-16 !text-foreground-neutral-subtle">⌘B</Kbd>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}

function SidebarContent({className, children}: {className?: string; children: React.ReactNode}) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-4 overflow-auto scrollbar',
        'px-16 pb-16',
        'group-data-[collapsible=icon]/sidebar:overflow-hidden',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface SidebarMenuProps {
  items: SidebarNavItem[];
  activeItemId?: string;
  onItemClick?: (item: SidebarNavItem) => void;
}

function SidebarMenu({items, activeItemId, onItemClick}: SidebarMenuProps) {
  return (
    <ul data-slot="sidebar-menu" className="flex w-full min-w-0 flex-col gap-4">
      {items.map((item) => {
        const isActive = item.isActive ?? item.id === activeItemId;
        return (
          <SidebarMenuItem
            key={item.id}
            item={item}
            isActive={isActive}
            onClick={() => onItemClick?.(item)}
          />
        );
      })}
    </ul>
  );
}

interface SidebarMenuItemProps {
  item: SidebarNavItem;
  isActive: boolean;
  onClick: () => void;
}

function SidebarMenuItem({item, isActive, onClick}: SidebarMenuItemProps) {
  const {state} = useSidebarContext();

  const button = (
    <button
      type="button"
      onClick={onClick}
      data-slot="sidebar-menu-button"
      data-active={isActive}
      className={cn(
        'peer/menu-button flex w-full items-center gap-10 overflow-hidden rounded-6',
        'text-left text-sm outline-hidden',
        'transition-[width,height,padding] duration-200 ease-linear',
        'hover:bg-background-neutral-hover',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-highlight-interactive',
        'active:bg-background-neutral-hover',
        'disabled:pointer-events-none disabled:opacity-50',
        'h-32 p-8',
        'group-data-[collapsible=icon]/sidebar:size-32! group-data-[collapsible=icon]/sidebar:p-8!',
        isActive
          ? 'bg-background-neutral-hover font-medium text-foreground-neutral-base'
          : 'text-foreground-neutral-subtle',
        '[&>span:last-child]:truncate',
        'relative',
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon
        name={item.icon}
        className={cn(
          'size-16 shrink-0 transition-colors duration-200',
          isActive ? 'text-[#FF4B00]' : 'text-foreground-neutral-muted',
        )}
      />
      <span className="flex-1 truncate text-sm font-normal">{item.label}</span>
    </button>
  );

  return (
    <li data-slot="sidebar-menu-item" className="group/menu-item relative">
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" align="center" hidden={state !== 'collapsed'}>
          {item.label}
        </TooltipContent>
      </Tooltip>
    </li>
  );
}

/**
 * Default sidebar items for Analytics page
 * These represent sub-sections within Analytics
 */
export const defaultSidebarItems: SidebarNavItem[] = [
  {id: 'reliability', label: 'Reliability', icon: 'shieldCheckLine'},
  {id: 'performance', label: 'Performance', icon: 'speedLine'},
];
