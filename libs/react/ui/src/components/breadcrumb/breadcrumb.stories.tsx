import type {Meta, StoryObj} from '@storybook/react';
import {Avatar} from 'components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'components/dropdown-menu';
import {Icon, type IconName} from 'components/icon';
import {Code} from 'components/typography';
import React from 'react';
import {UserBadge} from '../badge';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '.';

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for breadcrumb with dropdown menu - only icon triggers dropdown
function BreadcrumbWithDropdown({
  href,
  children,
  items,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  items: Array<{label: string; value: string; onClick: () => void; icon?: IconName}>;
  icon?: IconName;
}) {
  return (
    <div className="flex items-center gap-4">
      <a
        href={href}
        className="flex items-center gap-4 text-xs font-medium leading-20 text-foreground-neutral-muted hover:text-foreground-neutral-base transition-colors"
        onClick={(e) => e.preventDefault()}
      >
        {icon && <Icon name={icon} className="size-16" />}
        <span className="overflow-ellipsis overflow-hidden">{children}</span>
      </a>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center justify-center hover:opacity-70 transition-opacity cursor-pointer"
            aria-label="Select option"
          >
            <Icon name="expandUpDownLine" className="size-16 text-foreground-neutral-muted" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-200">
          <DropdownMenuGroup>
            {items.map((item) => (
              <DropdownMenuItem key={item.value} onClick={item.onClick} icon={item.icon}>
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-64 p-64 bg-background-neutral-base min-w-800">
      {/* BASIC BREADCRUMB */}
      <div className="flex flex-col gap-16">
        <Code variant="label" className="text-foreground-neutral-subtle">
          BASIC BREADCRUMB
        </Code>
        <Breadcrumb>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href="/docs">Docs</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </Breadcrumb>
      </div>

      {/* BREADCRUMB WITH DROPDOWN */}
      <div className="flex flex-col gap-16">
        <Code variant="label" className="text-foreground-neutral-subtle">
          WITH DROPDOWN (ICON TRIGGER)
        </Code>
        <Breadcrumb>
          <BreadcrumbWithDropdown
            href="/stripe"
            icon="stripe"
            items={[
              {label: 'Stripe', value: 'stripe', icon: 'stripe', onClick: () => alert('Stripe')},
              {label: 'Acme Corp', value: 'acme', onClick: () => alert('Acme')},
              {label: 'TechCo', value: 'techco', onClick: () => alert('TechCo')},
            ]}
          >
            Stripe
          </BreadcrumbWithDropdown>
          <BreadcrumbSeparator />
          <BreadcrumbWithDropdown
            href="/pipeline"
            items={[
              {label: 'Main', value: 'main', onClick: () => alert('Main')},
              {label: 'Development', value: 'dev', onClick: () => alert('Dev')},
              {label: 'Staging', value: 'staging', onClick: () => alert('Staging')},
            ]}
          >
            Pipeline
          </BreadcrumbWithDropdown>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Jobs</BreadcrumbPage>
        </Breadcrumb>
      </div>

      {/* BREADCRUMB WITH ELLIPSIS */}
      <div className="flex flex-col gap-16">
        <Code variant="label" className="text-foreground-neutral-subtle">
          WITH ELLIPSIS
        </Code>
        <Breadcrumb>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbEllipsis onClick={() => alert('Show more')} />
          <BreadcrumbSeparator />
          <BreadcrumbLink href="/components">Components</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </Breadcrumb>
      </div>
    </div>
  ),
};

// Navbar story matching your actual implementation
export const NavbarWithBreadcrumb: Story = {
  render: () => (
    <div className="flex flex-col gap-32 w-[90vw]">
      <Code variant="label" className="px-32 text-foreground-neutral-subtle">
        NAVBAR WITH BREADCRUMB
      </Code>

      {/* Navbar matching your actual implementation */}
      <header className="flex items-center justify-between border border-neutral-strong bg-background-subtle-base">
        <div className="flex items-center border-r border-neutral-strong">
          {/* Logo */}
          <a href="/">
            <div className="h-40 w-40 flex items-center justify-center border-r hover:bg-background-button-transparent-hover transition-colors">
              <Icon name="shipfox" className="size-18 shrink-0" />
            </div>
          </a>

          {/* Organization Selector with Dropdown */}
          <div className="flex items-center bg-background-neutral-base">
            <a
              href="/organizations/stripe"
              className="flex items-center gap-8 px-12 py-10 max-w-280 min-w-124 text-sm font-medium text-foreground-neutral-base hover:bg-background-neutral-surface transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              <Avatar content="logo" size="3xs" radius="rounded" logoName="stripe" />
              <span className="overflow-ellipsis overflow-hidden whitespace-nowrap flex-1">
                Stripe
              </span>
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center size-40 hover:bg-background-button-transparent-hover transition-colors"
                  aria-label="Select organization"
                >
                  <Icon name="expandUpDownLine" className="size-18 text-foreground-neutral-muted" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-200">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem icon="stripe">Stripe</DropdownMenuItem>
                  <DropdownMenuItem icon="slack">Slack</DropdownMenuItem>
                  <DropdownMenuItem icon="shipfox">Shipfox</DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center">
          <button
            type="button"
            className="flex items-center justify-center border-l-2 size-40 hover:bg-background-button-transparent-hover transition-colors"
            aria-label="Search"
          >
            <Icon name="searchLine" className="size-18 text-foreground-neutral-subtle" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center border-l-2 size-40 hover:bg-background-button-transparent-hover transition-colors"
            aria-label="Help"
          >
            <Icon name="questionLine" className="size-18 text-foreground-neutral-subtle" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center border-l-2 size-40 hover:bg-background-button-transparent-hover transition-colors"
            aria-label="Notifications"
          >
            <Icon name="notification3Line" className="size-18 text-foreground-neutral-subtle" />
          </button>
          <div className="border-l-2 px-8 h-40 flex items-center justify-center">
            <UserBadge
              name="Kyle Nguyen"
              avatarSrc="https://avatars.githubusercontent.com/u/89263955?v=4"
            />
          </div>
        </div>
      </header>
    </div>
  ),
};

// Interactive example with React Router style navigation
function InteractiveBreadcrumbComponent() {
  const [currentPath, setCurrentPath] = React.useState('/organizations/stripe/pipelines/main/jobs');

  const pathSegments = currentPath.split('/').filter(Boolean);

  const handleNavigation = (index: number) => {
    const newPath = '/' + pathSegments.slice(0, index + 1).join('/');
    setCurrentPath(newPath);
  };

  return (
    <div className="flex flex-col gap-32 p-64 bg-background-neutral-base min-w-800">
      <div className="flex flex-col gap-16">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Interactive Navigation
        </Code>
        <div className="flex flex-col gap-16">
          <Code className="text-foreground-neutral-muted">Current path: {currentPath}</Code>
          <Breadcrumb>
            <BreadcrumbLink href="/" onClick={() => setCurrentPath('/')}>
              Home
            </BreadcrumbLink>
            {pathSegments.map((segment, index) => (
              <React.Fragment key={`${segment}-${index}`}>
                <BreadcrumbSeparator />
                {index === pathSegments.length - 1 ? (
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={`/${pathSegments.slice(0, index + 1).join('/')}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(index);
                    }}
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </React.Fragment>
            ))}
          </Breadcrumb>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Quick Navigation
        </Code>
        <div className="flex gap-8 flex-wrap">
          <button
            type="button"
            onClick={() => setCurrentPath('/organizations')}
            className="px-12 py-8 bg-background-button-neutral-default text-foreground-neutral-base rounded-6 text-xs hover:bg-background-button-neutral-hover"
          >
            Organizations
          </button>
          <button
            type="button"
            onClick={() => setCurrentPath('/organizations/stripe')}
            className="px-12 py-8 bg-background-button-neutral-default text-foreground-neutral-base rounded-6 text-xs hover:bg-background-button-neutral-hover"
          >
            Stripe
          </button>
          <button
            type="button"
            onClick={() => setCurrentPath('/organizations/stripe/pipelines')}
            className="px-12 py-8 bg-background-button-neutral-default text-foreground-neutral-base rounded-6 text-xs hover:bg-background-button-neutral-hover"
          >
            Pipelines
          </button>
          <button
            type="button"
            onClick={() => setCurrentPath('/organizations/stripe/pipelines/main/jobs')}
            className="px-12 py-8 bg-background-button-neutral-default text-foreground-neutral-base rounded-6 text-xs hover:bg-background-button-neutral-hover"
          >
            Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

export const InteractiveBreadcrumb: Story = {
  render: () => <InteractiveBreadcrumbComponent />,
};
