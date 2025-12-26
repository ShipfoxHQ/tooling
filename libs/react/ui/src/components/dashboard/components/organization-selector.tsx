import {Avatar} from 'components/avatar';
import {Button} from 'components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from 'components/dropdown-menu';
import {Icon} from 'components/icon';
import {useState} from 'react';
import {cn} from 'utils/cn';

type LogoName = 'stripe' | 'shipfox' | 'github' | 'google';

interface Organization {
  id: string;
  name: string;
  logo: LogoName;
}

const organizations: Organization[] = [
  {id: 'stripe', name: 'Stripe', logo: 'stripe'},
  {id: 'shipfox', name: 'Shipfox', logo: 'shipfox'},
  {id: 'github', name: 'GitHub', logo: 'github'},
];

export interface OrganizationSelectorProps {
  /**
   * The currently selected organization ID
   * @default 'stripe'
   */
  defaultValue?: string;
  /**
   * Callback when organization changes
   */
  onOrganizationChange?: (organizationId: string) => void;
  /**
   * Callback when settings is clicked
   */
  onSettingsClick?: () => void;
  /**
   * Callback when new organization is clicked
   */
  onNewOrganizationClick?: () => void;
  /**
   * Additional class name
   */
  className?: string;
}

export function OrganizationSelector({
  defaultValue = 'stripe',
  onOrganizationChange,
  onSettingsClick,
  onNewOrganizationClick,
  className,
}: OrganizationSelectorProps) {
  const [selectedOrg, setSelectedOrg] = useState(defaultValue);
  const currentOrg = organizations.find((org) => org.id === selectedOrg) || organizations[0];

  const handleOrganizationSelect = (orgId: string) => {
    setSelectedOrg(orgId);
    onOrganizationChange?.(orgId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="transparent"
          className={cn(
            'w-200 h-40 shadow-none bg-background-neutral-base hover:bg-background-neutral-hover',
            'rounded-none gap-8 pl-12 border-l min-[321px]:border-r border-border-neutral-strong',
            'justify-start',
            className,
          )}
        >
          <Avatar size="3xs" content="logo" logoName={currentOrg.logo} radius="rounded" />
          <span className="flex-1 text-left truncate text-sm text-foreground-neutral-subtle">
            {currentOrg.name}
          </span>
          <Icon
            name="expandUpDownLine"
            className="size-14 text-foreground-neutral-muted shrink-0"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" size="md" className="min-w-200">
        {/* Current Organization Display */}
        <div className="flex items-center gap-8 px-8 py-6 rounded-6">
          <Avatar size="3xs" content="logo" logoName={currentOrg.logo} radius="rounded" />
          <span className="flex-1 text-sm text-foreground-neutral-subtle truncate">
            {currentOrg.name}&apos;s organization
          </span>
        </div>

        <DropdownMenuSeparator />

        {/* Settings */}
        <DropdownMenuItem icon="settings3Line" onSelect={onSettingsClick}>
          Settings
        </DropdownMenuItem>

        {/* Switch Organization - Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger icon="arrowLeftRightLine">
            Switch organization
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                icon={org.logo}
                iconStyle={
                  org.id === selectedOrg
                    ? 'text-foreground-highlight-interactive'
                    : 'text-foreground-neutral-base'
                }
                className={cn(org.id === selectedOrg && 'text-foreground-neutral-base font-medium')}
                onSelect={() => handleOrganizationSelect(org.id)}
              >
                {org.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* New Organization */}
        <DropdownMenuItem icon="addLine" onSelect={onNewOrganizationClick}>
          New organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
