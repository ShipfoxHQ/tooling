import type {Meta, StoryObj} from '@storybook/react';
import {Code} from './code';
import {Header} from './header';

const meta: Meta = {
  title: 'Typography/Header',
};
export default meta;

type Story = StoryObj;

const variants = ['h1', 'h2', 'h3', 'h4'] as const;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-col gap-4">
          <Code variant="label" className="text-foreground-neutral-subtle">
            {variant}
          </Code>
          <Header variant={variant}>The quick brown fox jumps over the lazy dog</Header>
        </div>
      ))}
    </div>
  ),
};
