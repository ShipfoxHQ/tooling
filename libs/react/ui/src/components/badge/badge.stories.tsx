import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import React from 'react';
import {Badge, IconBadge, StatusBadge, UserBadge} from '.';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      {/* STATUS BADGE */}
      <div>
        <Code variant="label" className="mb-16">
          Status Badge
        </Code>
        <div className="flex gap-16">
          <StatusBadge variant="neutral">Badge</StatusBadge>
          <StatusBadge variant="info">Badge</StatusBadge>
          <StatusBadge variant="feature">Badge</StatusBadge>
          <StatusBadge variant="success" dotClassName="size-5 rounded-full">
            Badge
          </StatusBadge>
          <StatusBadge variant="warning">Badge</StatusBadge>
          <StatusBadge variant="error">Badge</StatusBadge>
        </div>
      </div>

      {/* USER BADGE */}
      <div>
        <Code variant="label" className="mb-16">
          User Badge
        </Code>
        <div className="flex gap-16">
          <UserBadge
            name="Thierry Abalea"
            avatarSrc="https://avatars.githubusercontent.com/u/1290899?v=4"
          />
          <UserBadge
            name="Kyle Nguyen"
            avatarSrc="https://avatars.githubusercontent.com/u/89263955?v=4"
          />
          <UserBadge
            name="Noe Charmet"
            avatarSrc="https://avatars.githubusercontent.com/u/59678972?v=4"
          />
        </div>
      </div>

      {/* ICON BADGE */}
      <div>
        <Code variant="label" className="mb-16">
          Icon Badge
        </Code>
        <div className="flex gap-16">
          <IconBadge variant="neutral" name="homeSmile" />
          <IconBadge variant="info" name="homeSmile" />
          <IconBadge variant="feature" name="homeSmile" />
          <IconBadge variant="success" name="homeSmile" />
          <IconBadge variant="primary" name="homeSmile" />
          <IconBadge variant="error" name="homeSmile" />
        </div>
      </div>

      {/* BADGE - 2XS SIZE */}
      <div>
        <Code variant="label" className="mb-16">
          Badge - 2XS Size
        </Code>
        <div className="flex flex-col gap-16">
          {/* Base */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="2xs">
              Badge
            </Badge>
            <Badge variant="info" size="2xs">
              Badge
            </Badge>
            <Badge variant="feature" size="2xs">
              Badge
            </Badge>
            <Badge variant="success" size="2xs">
              Badge
            </Badge>
            <Badge variant="warning" size="2xs">
              Badge
            </Badge>
            <Badge variant="error" size="2xs">
              Badge
            </Badge>
          </div>

          {/* With Right Icon */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="2xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="info" size="2xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="feature" size="2xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="success" size="2xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="warning" size="2xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="error" size="2xs" iconRight="close">
              Badge
            </Badge>
          </div>

          {/* With Left Icon */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="2xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="info" size="2xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="feature" size="2xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="success" size="2xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="warning" size="2xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="error" size="2xs" iconLeft="close">
              Badge
            </Badge>
          </div>
        </div>
      </div>

      {/* BADGE - XS SIZE */}
      <div>
        <Code variant="label" className="mb-16">
          Badge - XS Size
        </Code>
        <div className="flex flex-col gap-16">
          {/* Base */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="xs">
              Badge
            </Badge>
            <Badge variant="info" size="xs">
              Badge
            </Badge>
            <Badge variant="feature" size="xs">
              Badge
            </Badge>
            <Badge variant="success" size="xs">
              Badge
            </Badge>
            <Badge variant="warning" size="xs">
              Badge
            </Badge>
            <Badge variant="error" size="xs">
              Badge
            </Badge>
          </div>

          {/* With Right Icon */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="info" size="xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="feature" size="xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="success" size="xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="warning" size="xs" iconRight="close">
              Badge
            </Badge>
            <Badge variant="error" size="xs" iconRight="close">
              Badge
            </Badge>
          </div>

          {/* With Left Icon */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="info" size="xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="feature" size="xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="success" size="xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="warning" size="xs" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="error" size="xs" iconLeft="close">
              Badge
            </Badge>
          </div>
        </div>
      </div>

      {/* BADGE - ROUNDED */}
      <div>
        <Code variant="label" className="mb-16">
          Badge - Rounded
        </Code>
        <div className="flex flex-col gap-16">
          {/* Base - 2XS */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="2xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="info" size="2xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="feature" size="2xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="success" size="2xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="warning" size="2xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="error" size="2xs" radius="rounded">
              Badge
            </Badge>
          </div>

          {/* Base - XS */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="info" size="xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="feature" size="xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="success" size="xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="warning" size="xs" radius="rounded">
              Badge
            </Badge>
            <Badge variant="error" size="xs" radius="rounded">
              Badge
            </Badge>
          </div>

          {/* With Right Icon - 2XS */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="2xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="info" size="2xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="feature" size="2xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="success" size="2xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="warning" size="2xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="error" size="2xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
          </div>

          {/* With Right Icon - XS */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="info" size="xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="feature" size="xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="success" size="xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="warning" size="xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
            <Badge variant="error" size="xs" radius="rounded" iconRight="close">
              Badge
            </Badge>
          </div>

          {/* With Left Icon - 2XS */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="2xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="info" size="2xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="feature" size="2xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="success" size="2xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="warning" size="2xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="error" size="2xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
          </div>

          {/* With Left Icon - XS */}
          <div className="flex gap-16">
            <Badge variant="neutral" size="xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="info" size="xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="feature" size="xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="success" size="xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="warning" size="xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
            <Badge variant="error" size="xs" radius="rounded" iconLeft="close">
              Badge
            </Badge>
          </div>
        </div>
      </div>

      {/* BETA BADGE */}
      <div>
        <Code variant="label" className="mb-16">
          Beta Badge
        </Code>
        <div className="flex gap-16">
          <Badge variant="info" size="2xs" radius="rounded">
            Beta
          </Badge>
        </div>
      </div>
    </div>
  ),
};

// Interactive badges with click handlers
function InteractiveBadgesComponent() {
  const [tags, setTags] = React.useState(['React', 'TypeScript', 'Next.js', 'Tailwind']);

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-32">
      {/* Removable tags */}
      <div>
        <Code variant="label" className="mb-16">
          Interactive Badges - Removable Tags
        </Code>
        <div className="flex flex-wrap gap-8">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="neutral"
              size="xs"
              radius="rounded"
              iconRight="close"
              onIconRightClick={() => removeTag(tag)}
              iconRightAriaLabel={`Remove ${tag} tag`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Different variants with interactive icons */}
      <div>
        <Code variant="label" className="mb-16">
          Interactive Badges - Different Variants
        </Code>
        <div className="flex flex-wrap gap-8">
          <Badge
            variant="success"
            size="xs"
            iconRight="close"
            onIconRightClick={() => alert('Success badge clicked!')}
            iconRightAriaLabel="Remove success badge"
          >
            Completed
          </Badge>
          <Badge
            variant="warning"
            size="xs"
            iconRight="close"
            onIconRightClick={() => alert('Warning badge clicked!')}
            iconRightAriaLabel="Remove warning badge"
          >
            Pending
          </Badge>
          <Badge
            variant="error"
            size="xs"
            iconRight="close"
            onIconRightClick={() => alert('Error badge clicked!')}
            iconRightAriaLabel="Remove error badge"
          >
            Failed
          </Badge>
        </div>
      </div>

      {/* Non-interactive icons (static) */}
      <div>
        <Code variant="label" className="mb-16">
          Static Icons (Non-interactive)
        </Code>
        <div className="flex flex-wrap gap-8">
          <Badge variant="info" size="xs" iconLeft="info">
            Information
          </Badge>
          <Badge variant="success" size="xs" iconLeft="check">
            Verified
          </Badge>
          <Badge variant="feature" size="xs" iconLeft="money">
            Premium
          </Badge>
        </div>
      </div>
    </div>
  );
}

export const InteractiveBadges: Story = {
  render: () => <InteractiveBadgesComponent />,
};
