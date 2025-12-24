/**
 * Mobile Sidebar Component
 *
 * Drawer-based sidebar for mobile devices using DropdownMenu
 */

import {Button} from 'components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/dropdown-menu';
import {Icon} from 'components/icon';
import {cn} from 'utils/cn';
import type {SidebarNavItem} from './sidebar';

export interface MobileSidebarProps {
  items: SidebarNavItem[];
  activeItemId?: string;
  onItemClick?: (item: SidebarNavItem) => void;
  className?: string;
}

/**
 * Mobile Sidebar
 *
 * Hamburger menu that opens a dropdown with sidebar navigation
 */
export function MobileSidebar({items, activeItemId, onItemClick, className}: MobileSidebarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="transparent"
          size="sm"
          className={cn('lg:hidden', className)}
          aria-label="Open navigation menu"
        >
          <Icon name="menu2Line" className="size-20" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" size="sm" className="space-y-4">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <DropdownMenuItem
              key={item.id}
              icon={item.icon}
              onSelect={() => onItemClick?.(item)}
              className={cn(
                isActive &&
                  'bg-background-components-hover text-foreground-neutral-base font-medium',
              )}
              iconStyle="text-foreground-highlight-interactive"
            >
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
