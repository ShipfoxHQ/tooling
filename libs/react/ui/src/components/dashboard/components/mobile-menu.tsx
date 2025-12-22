import {Button} from 'components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/dropdown-menu';
import {Icon} from 'components/icon';
import {ShinyText} from 'components/shiny-text';
import {useResolvedTheme} from 'hooks/useResolvedTheme';
import {ShipfoxLoader} from 'shipfox-loader-react';

export function MobileMenu() {
  const resolvedTheme = useResolvedTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="transparent"
          className="flex md:hidden items-center justify-center shrink-0 w-40 h-40 bg-background-subtle-base hover:bg-background-neutral-hover transition-colors rounded-none border-l border-border-neutral-strong"
        >
          <Icon
            name="menuLine"
            className="size-18 text-foreground-neutral-subtle"
            aria-label="Menu"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-200">
        <DropdownMenuItem>
          <div className="flex items-center gap-8">
            <ShipfoxLoader
              size={13}
              animation="circular"
              color={resolvedTheme === 'dark' ? 'white' : 'orange'}
              background={resolvedTheme === 'dark' ? 'dark' : 'light'}
            />
            <ShinyText
              text="Complete setup"
              className="flex-1 text-sm font-medium leading-20 text-foreground-neutral-base truncate text-left"
            />
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon="searchLine">Search</DropdownMenuItem>
        <DropdownMenuItem icon="questionLine">Help</DropdownMenuItem>
        <DropdownMenuItem icon="notification3Line">Notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
