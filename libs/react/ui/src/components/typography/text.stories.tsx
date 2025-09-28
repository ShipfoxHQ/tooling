import type {Meta, StoryObj} from '@storybook/react';
import {Code} from './code';
import {Text} from './text';

const meta: Meta = {
  title: 'Typography/Text',
};
export default meta;

type Story = StoryObj;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {sizes.map((size) => (
        <div key={size} className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size}
            </Code>
            <Text size={size}>The quick brown fox jumps over the lazy dog</Text>
          </div>
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size} - Bold
            </Code>
            <Text size={size} bold>
              The quick brown fox jumps over the lazy dog
            </Text>
          </div>
        </div>
      ))}
    </div>
  ),
};

const textParagraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export const Paragraph: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {sizes.map((size) => (
        <div key={size} className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size} - Regular
            </Code>
            <Text size={size} compact={false}>
              {textParagraph}
            </Text>
          </div>
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size} - Compact
            </Code>
            <Text size={size} compact={true}>
              {textParagraph}
            </Text>
          </div>
        </div>
      ))}
    </div>
  ),
};
