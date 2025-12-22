import {Avatar} from 'components/avatar';
import {UserBadge} from 'components/badge';
import {Button} from 'components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/dropdown-menu';
import {ShinyText} from 'components/shiny-text';

function UsageGauge({used, total}: {used: number; total: number}) {
  const percentage = Math.min((used / total) * 100, 100);

  return (
    <div className="flex h-8 w-full rounded-full bg-tag-neutral-bg overflow-hidden">
      <div className="h-full bg-tag-success-icon rounded-l-2" style={{width: `${percentage}%`}} />
    </div>
  );
}

export function UserProfile() {
  const userName = 'Thierry Abalea';
  const userEmail = 'thierryabalea@acme.com';
  const creditsUsed = 3213;
  const creditsTotal = 6000;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center h-40 px-8 cursor-pointer border-l border-border-neutral-strong">
          <Avatar className="size-24 md:hidden" content="image" fallback="TA" />
          <UserBadge name={userName} className="hidden md:inline-flex" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-220">
        <div className="flex items-center gap-12 px-8 py-4">
          <Avatar className="size-28 shrink-0" content="image" fallback="TA" />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium leading-20 text-foreground-neutral-base truncate">
              {userName}
            </span>
            <span className="text-xs leading-20 text-foreground-neutral-subtle truncate">
              {userEmail}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem icon="sparkling2Fill">Getting started</DropdownMenuItem>
        <DropdownMenuItem icon="userLine">Profile settings</DropdownMenuItem>

        <DropdownMenuSeparator />

        <div className="flex flex-col gap-8 px-8 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Avatar className="size-12" content="logo" logoName="stripe" radius="rounded" />
              <span className="text-sm font-medium leading-20 text-foreground-neutral-subtle">
                Usage
              </span>
            </div>
            <span className="text-sm font-medium leading-20 text-foreground-neutral-subtle">
              {creditsUsed} / {creditsTotal}
            </span>
          </div>
          <UsageGauge used={creditsUsed} total={creditsTotal} />
          <span className="text-xs leading-20 text-foreground-neutral-subtle">
            {creditsTotal} free credits every month.
          </span>
        </div>

        <div className="px-8 pb-12">
          <Button type="button" className="w-full">
            <ShinyText
              text="Upgrade Plan"
              className="flex-1 text-sm font-medium leading-20 text-foreground-neutral-base truncate text-center"
            />
          </Button>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem icon="logoutCircleLine">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
