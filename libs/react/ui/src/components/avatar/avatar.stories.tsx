import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {isValidElement} from 'react';
import {Avatar, type AvatarProps} from './avatar';
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

export const AvatarGroupWithRenderItem: StoryObj<typeof avatarGroupMeta> = {
  args: {
    avatars: [],
  },
  render: () => {
    const avatars: AvatarGroupItem[] = [
      {content: 'image', fallback: 'John Doe'},
      {content: 'image', fallback: 'Jane Smith'},
      {content: 'image', fallback: 'Bob Johnson'},
      {content: 'image', fallback: 'Alice Brown'},
      {content: 'image', fallback: 'Carlos Vega'},
      {content: 'image', fallback: 'Linda Tran'},
      {content: 'image', fallback: 'Raj Patel'},
      {content: 'image', fallback: 'Sara Kim'},
    ];

    const renderItem = (
      avatar: React.ReactElement,
      index: number,
      item: AvatarGroupItem,
    ): React.ReactElement => {
      const tooltipText = isValidElement(item)
        ? (item.props as AvatarProps).fallback || 'User'
        : (item as AvatarProps).fallback || 'User';

      return (
        <div key={index} className="group relative" title={tooltipText}>
          {avatar}
        </div>
      );
    };

    return (
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            With renderItem
          </Code>
          <AvatarGroup avatars={avatars} size="md" renderItem={renderItem} maxVisible={4} />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            Without renderItem (Default)
          </Code>
          <AvatarGroup avatars={avatars} size="md" maxVisible={4} />
        </div>
        <div className="flex flex-col gap-8">
          <Code variant="label" className="text-foreground-neutral-base">
            With animation on hover
          </Code>
          <AvatarGroup avatars={avatars} size="md" maxVisible={4} animateOnHover />
        </div>
      </div>
    );
  },
};
