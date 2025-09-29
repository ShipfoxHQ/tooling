import type {Meta, StoryObj} from '@storybook/react';
import {Code} from './code';

const meta: Meta = {
  title: 'Typography/Code',
};
export default meta;

type Story = StoryObj;

const variants = ['label', 'paragraph'] as const;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {variants.map((variant) => (
        <div key={variant} className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {variant}
            </Code>
            <Code variant={variant}>The quick brown fox jumps over the lazy dog</Code>
          </div>
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {variant} - Bold
            </Code>
            <Code variant={variant} bold>
              The quick brown fox jumps over the lazy dog
            </Code>
          </div>
        </div>
      ))}
    </div>
  ),
};
