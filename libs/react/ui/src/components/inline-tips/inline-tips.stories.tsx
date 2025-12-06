import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {Meta, StoryObj} from '@storybook/react';
import {Code, Header} from 'components/typography';
import {
  InlineTips,
  InlineTipsAction,
  InlineTipsActions,
  InlineTipsContent,
  InlineTipsDescription,
  InlineTipsTitle,
} from './inline-tips';

const meta = {
  title: 'Components/InlineTips',
  component: InlineTips,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'info', 'success', 'error'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary'],
    },
  },
  args: {
    type: 'default',
    variant: 'primary',
  },
} satisfies Meta<typeof InlineTips>;

export default meta;

type Story = StoryObj<typeof meta>;

const types = ['default', 'info', 'success', 'error'] as const;
const variants = ['primary', 'secondary'] as const;

export const Default: Story = {
  play: async (ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await argosScreenshot(ctx, 'InlineTips Default');
  },
  render: (args) => {
    return (
      <InlineTips {...args}>
        <InlineTipsContent>
          <InlineTipsTitle>Title</InlineTipsTitle>
          <InlineTipsDescription>Description</InlineTipsDescription>
        </InlineTipsContent>
        <InlineTipsActions>
          <InlineTipsAction variant={args.variant}>Label</InlineTipsAction>
          <InlineTipsAction variant={args.variant}>Label</InlineTipsAction>
        </InlineTipsActions>
      </InlineTips>
    );
  },
};

export const Variants: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-16">
        {variants.map((variant) => (
          <InlineTips key={variant} type="default" variant={variant}>
            <InlineTipsContent>
              <InlineTipsTitle>Title</InlineTipsTitle>
              <InlineTipsDescription>Description</InlineTipsDescription>
            </InlineTipsContent>
            <InlineTipsActions>
              <InlineTipsAction variant="primary">Label</InlineTipsAction>
              <InlineTipsAction variant="secondary">Label</InlineTipsAction>
            </InlineTipsActions>
          </InlineTips>
        ))}
      </div>
    );
  },
};

export const DesignMock: Story = {
  render: () => {
    const content = {
      default: {title: 'Title', description: 'Description'},
      info: {title: 'Title', description: 'Description'},
      success: {title: 'Title', description: 'Description'},
      error: {title: 'Title', description: 'Description'},
    };

    return (
      <div className="flex flex-col gap-32 pb-64 pt-32 px-32 bg-background-neutral-base">
        <Header variant="h3" className="text-foreground-neutral-subtle">
          INLINE TIPS
        </Header>
        <div className="flex flex-col gap-16">
          <Code variant="label" className="text-foreground-neutral-subtle">
            Primary
          </Code>
          {types.map((type) => (
            <InlineTips key={type} type={type} variant="primary">
              <InlineTipsContent>
                <InlineTipsTitle>{content[type].title}</InlineTipsTitle>
                <InlineTipsDescription>{content[type].description}</InlineTipsDescription>
              </InlineTipsContent>
              <InlineTipsActions>
                <InlineTipsAction variant="primary">Label</InlineTipsAction>
                <InlineTipsAction variant="secondary">Label</InlineTipsAction>
              </InlineTipsActions>
            </InlineTips>
          ))}
          <Code variant="label" className="text-foreground-neutral-subtle">
            Secondary
          </Code>
          {types.map((type) => (
            <InlineTips key={type} type={type} variant="secondary">
              <InlineTipsContent>
                <InlineTipsTitle>{content[type].title}</InlineTipsTitle>
                <InlineTipsDescription>{content[type].description}</InlineTipsDescription>
              </InlineTipsContent>
              <InlineTipsActions>
                <InlineTipsAction variant="primary">Label</InlineTipsAction>
                <InlineTipsAction variant="secondary">Label</InlineTipsAction>
              </InlineTipsActions>
            </InlineTips>
          ))}
        </div>
      </div>
    );
  },
};
