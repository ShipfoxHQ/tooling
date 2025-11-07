import type {Meta, StoryObj} from '@storybook/react';
import shipfoxIllustration from '../../assets/illutration-1.svg';
import {useBreakpoint} from '../../hooks/useBreakpoint';
import {Avatar} from '../avatar/avatar';
import {AvatarGroup, AvatarGroupTooltip} from '../avatar/avatar-group';
import {Button} from '../button';
import {Icon} from '../icon/icon';
import {Card, CardContent} from './';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary'],
    },
  },
  args: {
    variant: 'primary',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => (
    <Card {...args} className="p-16">
      <p className="text-foreground-neutral-base">Card content goes here</p>
    </Card>
  ),
};

const cardContentMeta = {
  title: 'Components/CardContent',
  component: CardContent,
  tags: ['autodocs'],
} satisfies Meta<typeof CardContent>;

export const OrganizationCard: StoryObj<typeof cardContentMeta> = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-8 w-full max-w-476">
      <CardContent
        variant="primary"
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
      <CardContent
        variant="primary"
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
      <CardContent
        variant="primary"
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

export const ConnectGithubAccount: StoryObj<typeof cardContentMeta> = {
  args: {},
  render: () => (
    <div className="flex flex-col gap-16 w-full max-w-476">
      <CardContent
        variant="primary"
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

      <CardContent
        variant="primary"
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

      <CardContent
        variant="primary"
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

export const WithCustomElements: StoryObj<typeof cardContentMeta> = {
  args: {},
  render: () => {
    function CardWithBreakpoint() {
      const isSm = useBreakpoint('sm');

      return (
        <div className="flex flex-col gap-16 w-full max-w-672">
          <CardContent
            variant="primary"
            leftElement={
              <div className="flex shrink-0 items-center justify-center pt-2 text-tag-success-icon">
                <Icon name="checkCircleSolid" size="sm" />
              </div>
            }
            align={isSm ? 'start' : 'center'}
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
              isSm ? (
                <img
                  src={shipfoxIllustration}
                  alt="Shipfox Illustration"
                  className="absolute overflow-clip right-2 top-1/2 -translate-y-1/2 -translate-x-46 w-fit object-contain"
                />
              ) : null
            }
          />
        </div>
      );
    }

    return <CardWithBreakpoint />;
  },
};
