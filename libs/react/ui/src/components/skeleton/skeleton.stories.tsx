import type {Meta, StoryObj} from '@storybook/react';
import {Code, Header} from 'components/typography';
import {Skeleton} from './skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="w-200 h-20" />,
};

export const Card: Story = {
  render: () => (
    <div className="flex flex-col gap-12 p-16 rounded-10 border border-border-neutral-base bg-background-field-base max-w-400">
      <Skeleton className="h-200 w-full rounded-6" />
      <div className="space-y-8">
        <Skeleton className="h-20 w-3/4" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-5/6" />
      </div>
      <div className="flex gap-8 pt-8">
        <Skeleton className="h-32 w-100 rounded-6" />
        <Skeleton className="h-32 w-100 rounded-6" />
      </div>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="flex flex-col gap-8 max-w-500">
      {Array.from({length: 5}, (_, i) => i).map((id) => (
        <div
          key={`list-${id}`}
          className="flex items-center gap-12 p-12 rounded-6 border border-border-neutral-base bg-background-field-base"
        >
          <Skeleton className="h-48 w-48 rounded-full shrink-0" />
          <div className="flex-1 space-y-8">
            <Skeleton className="h-16 w-3/4" />
            <Skeleton className="h-14 w-1/2" />
          </div>
          <Skeleton className="h-32 w-80 rounded-6" />
        </div>
      ))}
    </div>
  ),
};

export const Showcase: Story = {
  render: () => (
    <div className="flex flex-col gap-32">
      <div className="flex flex-col gap-16">
        <Header variant="h3">Basic Shapes</Header>
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-8">
            <Code variant="label" className="text-foreground-neutral-subtle">
              Rectangle
            </Code>
            <Skeleton className="h-20 w-200" />
          </div>

          <div className="flex flex-col gap-8">
            <Code variant="label" className="text-foreground-neutral-subtle">
              Circle
            </Code>
            <Skeleton className="h-48 w-48 rounded-full" />
          </div>

          <div className="flex flex-col gap-8">
            <Code variant="label" className="text-foreground-neutral-subtle">
              Square
            </Code>
            <Skeleton className="h-100 w-100" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <Header variant="h3">Card Loading</Header>
        <div className="flex flex-col gap-12 p-16 rounded-10 border border-border-neutral-base bg-background-field-base max-w-400">
          <Skeleton className="h-200 w-full rounded-6" />
          <div className="space-y-8">
            <Skeleton className="h-20 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-2/3" />
          </div>
          <div className="flex gap-8 pt-8">
            <Skeleton className="h-32 w-100 rounded-6" />
            <Skeleton className="h-32 w-100 rounded-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <Header variant="h3">List Loading</Header>
        <div className="flex flex-col gap-8 max-w-500">
          {Array.from({length: 4}, (_, i) => i).map((id) => (
            <div
              key={`list-loading-${id}`}
              className="flex items-center gap-12 p-12 rounded-6 border border-border-neutral-base bg-background-field-base"
            >
              <Skeleton className="h-48 w-48 rounded-full shrink-0" />
              <div className="flex-1 space-y-8">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-14 w-1/2" />
              </div>
              <Skeleton className="h-32 w-80 rounded-6" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <Header variant="h3">Table Loading</Header>
        <div className="rounded-10 border border-border-neutral-base bg-background-field-base overflow-hidden max-w-700">
          <div className="flex gap-16 p-12 border-b border-border-neutral-base bg-background-neutral-base">
            <Skeleton className="h-16 w-140" />
            <Skeleton className="h-16 w-220" />
            <Skeleton className="h-16 w-120" />
            <Skeleton className="h-16 w-100 ml-auto" />
          </div>
          {Array.from({length: 5}, (_, i) => i).map((id) => (
            <div
              key={`table-row-${id}`}
              className="flex gap-16 p-12 border-b border-border-neutral-base last:border-0"
            >
              <Skeleton className="h-14 w-140" />
              <Skeleton className="h-14 w-220" />
              <Skeleton className="h-14 w-120" />
              <Skeleton className="h-14 w-100 ml-auto" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <Header variant="h3">Form Loading</Header>
        <div className="max-w-400 space-y-16 p-16 rounded-10 border border-border-neutral-base bg-background-field-base">
          <div className="space-y-8">
            <Skeleton className="h-16 w-100" />
            <Skeleton className="h-32 w-full rounded-6" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-16 w-120" />
            <Skeleton className="h-32 w-full rounded-6" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-16 w-80" />
            <Skeleton className="h-96 w-full rounded-6" />
          </div>
          <div className="flex gap-8 pt-8">
            <Skeleton className="h-32 w-100 rounded-6" />
            <Skeleton className="h-32 w-100 rounded-6" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <Header variant="h3">Avatar Group Loading</Header>
        <div className="flex -space-x-8">
          {Array.from({length: 5}, (_, i) => i).map((id) => (
            <Skeleton
              key={`avatar-${id}`}
              className="h-40 w-40 rounded-full border-2 border-background-field-base"
            />
          ))}
        </div>
      </div>
    </div>
  ),
};
