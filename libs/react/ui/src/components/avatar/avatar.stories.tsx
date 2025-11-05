import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {Avatar} from './avatar';
import {AvatarGroup, type AvatarGroupItem} from './avatar-group';

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
    fallback: 'Leek ',
    size: '3xs',
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
    radius: {
      control: 'select',
      options: radiusOptions,
    },
    maxVisible: {
      control: 'number',
    },
  },
  args: {
    size: 'md',
    radius: 'full',
  },
} satisfies Meta<typeof AvatarGroup>;

export const AvatarGroupDefault: StoryObj<typeof avatarGroupMeta> = {
  args: {
    avatars: [],
  },
  render: () => {
    const avatars: AvatarGroupItem[] = [
      {content: 'image', fallback: 'John Doe'},
      {content: 'image', fallback: 'Jane Smith'},
      {content: 'image', fallback: 'Bob Johnson'},
    ];

    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            2 Avatars
          </Code>
          <AvatarGroup avatars={avatars.slice(0, 2)} size="md" />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            3 Avatars
          </Code>
          <AvatarGroup avatars={avatars} size="md" />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            4+ Avatars (maxVisible: 4)
          </Code>
          <AvatarGroup
            avatars={[
              ...avatars,
              {content: 'image', fallback: 'Alice Brown'},
              {content: 'image', fallback: 'Charlie Davis'},
              {content: 'image', fallback: 'Diana Wilson'},
            ]}
            size="md"
            maxVisible={4}
          />
        </div>
      </div>
    );
  },
};

export const AvatarGroupSizes: StoryObj<typeof avatarGroupMeta> = {
  args: {
    avatars: [],
  },
  render: () => {
    const avatars: AvatarGroupItem[] = [
      {content: 'image', fallback: 'User 1'},
      {content: 'image', fallback: 'User 2'},
      {content: 'image', fallback: 'User 3'},
    ];

    return (
      <div className="flex flex-col gap-16">
        {sizeOptions.map((size) => (
          <div key={size} className="flex flex-col gap-8">
            <Code variant="label" className="text-foreground-neutral-base">
              {size}
            </Code>
            <AvatarGroup avatars={avatars} size={size} />
          </div>
        ))}
      </div>
    );
  },
};

export const AvatarGroupWithOverflow: StoryObj<typeof avatarGroupMeta> = {
  args: {
    avatars: [],
  },
  render: () => {
    const manyAvatars: AvatarGroupItem[] = Array.from({length: 10}, (_, i) => ({
      content: 'image' as const,
      fallback: `User ${i + 1}`,
    }));

    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            10 Avatars, maxVisible: 3
          </Code>
          <AvatarGroup avatars={manyAvatars} size="md" maxVisible={3} />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            10 Avatars, maxVisible: 4
          </Code>
          <AvatarGroup avatars={manyAvatars} size="xl" maxVisible={4} />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            10 Avatars, maxVisible: 5
          </Code>
          <AvatarGroup avatars={manyAvatars} size="2xl" maxVisible={5} />
        </div>
      </div>
    );
  },
};

export const AvatarGroupMixedContent: StoryObj<typeof avatarGroupMeta> = {
  args: {
    avatars: [],
  },
  render: () => {
    const mixedAvatars: AvatarGroupItem[] = [
      {content: 'image', fallback: 'John Doe'},
      {content: 'letters', fallback: 'Jane Smith'},
      {content: 'logo'},
      {content: 'letters', fallback: 'Bob Johnson'},
    ];

    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            Mixed Content Types
          </Code>
          <AvatarGroup avatars={mixedAvatars} size="md" />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            With Overflow
          </Code>
          <AvatarGroup
            avatars={[
              ...mixedAvatars,
              {content: 'image', fallback: 'Alice Brown'},
              {content: 'letters', fallback: 'Charlie Davis'},
            ]}
            size="xl"
            maxVisible={4}
          />
        </div>
      </div>
    );
  },
};

export const AvatarGroupAnimateOnHover: StoryObj<typeof avatarGroupMeta> = {
  args: {
    avatars: [],
  },
  render: () => {
    const avatars: AvatarGroupItem[] = [
      {content: 'image', fallback: 'Alice Green', animateOnHover: true},
      {content: 'image', fallback: 'Bob White', animateOnHover: true},
      {content: 'image', fallback: 'Carol Black', animateOnHover: true},
      {content: 'image', fallback: 'David Gray', animateOnHover: true},
    ];

    return (
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-base">
          Animate On Hover (Group)
        </Code>
        <AvatarGroup avatars={avatars} size="md" />
      </div>
    );
  },
};
