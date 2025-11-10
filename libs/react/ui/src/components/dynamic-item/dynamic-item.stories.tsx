import type {Meta, StoryObj} from '@storybook/react';
import {Button} from 'components/button/button';
import {ItemTitle} from 'components/item';
import {cn} from 'utils/cn';
import illustration1 from '../../assets/illustration-1.svg';
import illustration2 from '../../assets/illustration-2.svg';
import illustrationBg from '../../assets/illustration-gradient.svg';
import {Avatar} from '../avatar/avatar';
import {AvatarGroup, AvatarGroupTooltip} from '../avatar/avatar-group';
import {Icon} from '../icon/icon';
import {MovingBorder} from '../moving-border/moving-border';
import {DynamicItem} from './dynamic-item';

const meta = {
  title: 'Components/DynamicItem',
  component: DynamicItem,
  tags: ['autodocs'],
} satisfies Meta<typeof DynamicItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OrganizationItem: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-16 w-full max-w-476">
      <DynamicItem
        variant="default"
        leftElement={<Avatar content="logo" logoName="slack" radius="rounded" size="xl" />}
        title="Slack"
        description="3 members"
        rightElement={
          <AvatarGroup size="md">
            <Avatar content="image" fallback="John Doe">
              <AvatarGroupTooltip>John Doe</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Jane Smith">
              <AvatarGroupTooltip>Jane Smith</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Bob Johnson">
              <AvatarGroupTooltip>Bob Johnson</AvatarGroupTooltip>
            </Avatar>
          </AvatarGroup>
        }
      />
      <DynamicItem
        variant="default"
        leftElement={<Avatar content="logo" logoName="stripe" radius="rounded" size="xl" />}
        title="Stripe"
        description="2 members"
        rightElement={
          <AvatarGroup size="md">
            <Avatar content="image" fallback="Alice Brown">
              <AvatarGroupTooltip>Alice Brown</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Carlos Vega">
              <AvatarGroupTooltip>Carlos Vega</AvatarGroupTooltip>
            </Avatar>
          </AvatarGroup>
        }
      />
      <DynamicItem
        variant="default"
        leftElement={<Avatar content="logo" logoName="shipfox" radius="rounded" size="xl" />}
        title="Shipfox"
        description="9 members"
        rightElement={
          <AvatarGroup size="md" maxVisible={4} animateOnHover>
            <Avatar content="image" fallback="Linda Tran">
              <AvatarGroupTooltip>Linda Tran</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Michael Chen">
              <AvatarGroupTooltip>Michael Chen</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Sarah Williams">
              <AvatarGroupTooltip>Sarah Williams</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="David Lee">
              <AvatarGroupTooltip>David Lee</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Emily Davis">
              <AvatarGroupTooltip>Emily Davis</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="James Wilson">
              <AvatarGroupTooltip>James Wilson</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Olivia Martinez">
              <AvatarGroupTooltip>Olivia Martinez</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Noah Anderson">
              <AvatarGroupTooltip>Noah Anderson</AvatarGroupTooltip>
            </Avatar>
            <Avatar content="image" fallback="Sophia Taylor">
              <AvatarGroupTooltip>Sophia Taylor</AvatarGroupTooltip>
            </Avatar>
          </AvatarGroup>
        }
      />
    </div>
  ),
};

export const ConnectGithubAccountItem: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-16 w-full max-w-476">
      <DynamicItem
        variant="default"
        leftElement={
          <div className="relative">
            <Avatar content="logoPlaceholder" logoName="slack" radius="full" size="lg" />
            <Avatar
              content="logoPlaceholder"
              logoName="github"
              radius="full"
              size="2xs"
              logoClassName="p-0"
              className="absolute bottom-0 left-27"
            />
          </div>
        }
        title="Slack"
        description="Connect Github organization"
        rightElement={
          <Button variant="primary" size="sm">
            Connect
          </Button>
        }
      />

      <DynamicItem
        variant="default"
        leftElement={
          <div className="relative">
            <Avatar content="logoPlaceholder" logoName="slack" radius="full" size="lg" />
            <Avatar
              content="logo"
              logoName="github"
              radius="full"
              size="2xs"
              logoClassName="p-0"
              className="absolute bottom-0 left-27"
            />
          </div>
        }
        title="Slack"
        description="Personal account (kye-nguyen)"
        rightElement={
          <Button variant="primary" size="sm">
            Change account
          </Button>
        }
      />

      <DynamicItem
        variant="default"
        leftElement={
          <div className="relative">
            <Avatar content="logoPlaceholder" logoName="slack" radius="full" size="lg" />
            <Avatar
              content="logo"
              logoName="github"
              radius="full"
              size="2xs"
              logoClassName="p-0"
              className="absolute bottom-0 left-27"
            />
          </div>
        }
        title="Slack"
        description="Organization (slack-github)"
        rightElement={
          <Button variant="secondary" size="sm">
            Change account
          </Button>
        }
      />
    </div>
  ),
};

export const WithCustomElementsItem: Story = {
  args: {},
  render: () => {
    return (
      <div className="flex flex-col gap-16 w-full max-w-672">
        <DynamicItem
          variant="default"
          leftElement={
            <div className="flex shrink-0 items-center justify-center text-tag-success-icon">
              <Icon name="checkCircleSolid" size="sm" />
            </div>
          }
          title="Give access to your Github organizations"
          description="We'll use this permission to sync your organization's."
          action={
            <div className="flex gap-8 mx-auto sm:mx-0">
              <Button variant="primary" size="sm">
                Github access
              </Button>
              <Button variant="transparentMuted" size="sm">
                Skip for now
              </Button>
            </div>
          }
          rightElement={
            <img
              src={illustration1}
              alt="illustration-1"
              className="hidden sm:block absolute overflow-clip right-2 top-1/2 -translate-y-1/2 -translate-x-46 w-fit object-contain"
            />
          }
        />
        <div className="relative">
          <img
            src={illustration2}
            alt="illustration-2"
            className="hidden sm:block absolute overflow-clip right-2 top-1/2 -translate-y-1/2 translate-x-8 w-fit object-contain z-50"
          />
          <div className={cn('relative overflow-hidden bg-transparent p-1 rounded-8')}>
            <div className="absolute inset-0" style={{borderRadius: 'calc(0.5rem * 0.96)'}}>
              <MovingBorder duration={6000} rx="30%" ry="30%">
                <div className="h-100 w-200 bg-[radial-gradient(#ff9e7a_40%,transparent_60%)]" />
              </MovingBorder>
            </div>
            <div
              className="relative"
              style={{
                borderRadius: 'calc(0.5rem * 0.96)',
              }}
            >
              <DynamicItem
                variant="default"
                title={
                  <div className="flex items-center gap-6">
                    <span className="flex shrink-0 items-center justify-center text-tag-success-icon w-16 h-16">
                      <Icon
                        name="money"
                        size="sm"
                        color="var(--foreground-neutral-subtle, #a1a1aa)"
                      />
                    </span>
                    <ItemTitle>6000 free credits/month to run your jobs</ItemTitle>
                  </div>
                }
                description="~500 builds/month. No payment required."
                rightElement={
                  <img
                    src={illustrationBg}
                    alt="illustration-bg"
                    className="hidden sm:block absolute overflow-clip right-4 w-fit object-contain scale-105"
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
