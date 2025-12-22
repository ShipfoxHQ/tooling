import {cn} from 'utils/cn';
import {CompleteSetupButton} from './complete-setup-button';
import {MobileMenu} from './mobile-menu';
import {OrganizationSelector} from './organization-selector';
import {TopbarButton} from './topbar-button';
import {UserProfile} from './user-profile';

export function Topbar({hidelogo = false}: {hidelogo?: boolean}) {
  return (
    <div className="flex flex-col items-start w-full bg-background-subtle-base">
      <div className="flex items-center justify-between w-full shrink-0 border-b border-border-neutral-strong">
        <div className="flex items-center flex-1 min-w-0">
          <div className={cn('shrink-0', hidelogo ? 'opacity-0' : 'opacity-100')}>
            <TopbarButton icon="shipfox" label="Shipfox" className="border-none" />
          </div>
          <OrganizationSelector />
          <div className="hidden md:block flex-1 h-40 bg-background-subtle-base" />
        </div>

        <CompleteSetupButton className="hidden md:flex" />

        <div className="hidden md:block">
          <TopbarButton icon="searchLine" label="Search" />
        </div>

        <div className="hidden md:block">
          <TopbarButton icon="questionLine" label="Help" />
        </div>

        <div className="hidden md:block">
          <TopbarButton icon="notification3Line" label="Notifications" />
        </div>

        <MobileMenu />

        <UserProfile />
      </div>
    </div>
  );
}
