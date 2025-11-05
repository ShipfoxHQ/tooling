import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {Avatar} from './avatar';
import {AvatarGroup, AvatarGroupTooltip} from './avatar-group';

const contentOptions = ['letters', 'logo', 'logoPlaceholder', 'image', 'upload'] as const;
const radiusOptions = ['full', 'rounded'] as const;
const sizeOptions = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'select',
      options: contentOptions,
    },
    radius: {
      control: 'select',
      options: radiusOptions,
    },
    size: {
      control: 'select',
      options: sizeOptions,
    },
    fallback: {
      control: 'text',
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
  },
  args: {
    content: 'letters',
    radius: 'full',
    size: 'md',
    fallback: 'John Doe',
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: 'upload',
    fallback: 'Kyle Nguyen',
  },

  render: (args) => (
    <div className="flex flex-wrap items-end gap-16">
      {sizeOptions.map((size) => (
        <div key={size} className="flex flex-col items-center gap-8">
          <Avatar {...args} size={size} />
          <Code variant="label" className="text-foreground-neutral-base">
            {size}
          </Code>
        </div>
      ))}
    </div>
  ),
};

// AvatarGroup Stories
const avatarGroupMeta = {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: sizeOptions,
    },
    maxVisible: {
      control: 'number',
    },
  },
  args: {
    size: 'md',
    children: [],
  },
} satisfies Meta<typeof AvatarGroup>;

export const AvatarGroupDefault: StoryObj<typeof avatarGroupMeta> = {
  args: {
    children: [],
  },
  render: () => {
    const avatars = [
      {name: 'John Doe', content: 'image'},
      {name: 'Jane Smith', content: 'image'},
      {name: 'Bob Johnson', content: 'image'},
      {name: 'Alice Brown', content: 'image'},
    ] as const;

    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            Default (without tooltips)
          </Code>
          <AvatarGroup size="md">
            {avatars.map((avatar) => (
              <Avatar key={avatar.name} content={avatar.content} fallback={avatar.name} />
            ))}
          </AvatarGroup>
        </div>
      </div>
    );
  },
};

export const AvatarGroupWithTooltips: StoryObj<typeof avatarGroupMeta> = {
  args: {
    children: [],
  },
  render: () => {
    const avatars = [
      {name: 'John Doe', content: 'image'},
      {name: 'Jane Smith', content: 'image'},
      {name: 'Bob Johnson', content: 'image'},
      {name: 'Alice Brown', content: 'image'},
      {name: 'Carlos Vega', content: 'image'},
      {name: 'Linda Tran', content: 'image'},
    ] as const;

    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            With Tooltips
          </Code>
          <AvatarGroup size="md">
            {avatars.map((avatar) => (
              <Avatar key={avatar.name} content={avatar.content} fallback={avatar.name}>
                <AvatarGroupTooltip>{avatar.name}</AvatarGroupTooltip>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            With Tooltips (maxVisible: 4)
          </Code>
          <AvatarGroup size="md" maxVisible={4}>
            {avatars.map((avatar) => (
              <Avatar key={avatar.name} content={avatar.content} fallback={avatar.name}>
                <AvatarGroupTooltip>{avatar.name}</AvatarGroupTooltip>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            With Tooltips and Hover Animation
          </Code>
          <AvatarGroup size="md" maxVisible={4} animateOnHover>
            {avatars.map((avatar) => (
              <Avatar key={avatar.name} content={avatar.content} fallback={avatar.name}>
                <AvatarGroupTooltip>{avatar.name}</AvatarGroupTooltip>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </div>
    );
  },
};
