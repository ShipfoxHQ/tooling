import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {Button} from '../button';
import {Tooltip, TooltipContent, type TooltipContentProps, TooltipTrigger} from './tooltip';

type TooltipStoryArgs = {
  defaultOpen?: boolean;
  delayDuration?: number;
  variant?: TooltipContentProps['variant'];
  size?: TooltipContentProps['size'];
  side?: TooltipContentProps['side'];
  align?: TooltipContentProps['align'];
  sideOffset?: TooltipContentProps['sideOffset'];
  animated?: TooltipContentProps['animated'];
};

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {control: 'boolean'},
    delayDuration: {control: 'number'},
    variant: {
      control: 'select',
      options: ['default', 'inverted', 'muted'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    sideOffset: {control: 'number'},
    animated: {control: 'boolean'},
  },
  args: {
    defaultOpen: false,
    delayDuration: 0,
    variant: 'default',
    size: 'md',
    side: 'top',
    align: 'center',
    sideOffset: 8,
    animated: true,
  },
} satisfies Meta<TooltipStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultOpen: false,
  },

  render: (args: TooltipStoryArgs) => {
    const {defaultOpen, delayDuration, variant, size, side, align, sideOffset, animated} = args;
    return (
      <div className="flex items-center justify-center p-64">
        <Tooltip defaultOpen={defaultOpen} delayDuration={delayDuration}>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent
            variant={variant}
            size={size}
            side={side}
            align={align}
            sideOffset={sideOffset}
            animated={animated}
          >
            Tooltip Text
          </TooltipContent>
        </Tooltip>
      </div>
    );
  },
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-col gap-64 p-64">
      <Code variant="label" className="text-foreground-neutral-subtle">
        TYPES
      </Code>
      <div className="flex flex-col gap-32">
        {/* Text Type */}
        <div className="flex flex-col gap-16">
          <Code variant="label" className="text-foreground-neutral-subtle">
            Type=Text
          </Code>
          <div className="flex gap-16">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary">Tooltip Text</Button>
              </TooltipTrigger>
              <TooltipContent variant="inverted">Tooltip Text</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Tooltip Text</Button>
              </TooltipTrigger>
              <TooltipContent>Tooltip Text</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Shortcut Type */}
        <div className="flex flex-col gap-16">
          <Code variant="label" className="text-foreground-neutral-subtle">
            Type=Shortcut
          </Code>
          <div className="flex gap-16">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary">Tooltip Text</Button>
              </TooltipTrigger>
              <TooltipContent variant="inverted">
                <div className="flex items-center gap-6">
                  <span>Tooltip Text</span>
                  <div className="flex items-center gap-4">
                    <kbd className="flex h-16 w-16 items-center justify-center rounded-4 border border-border-neutral-base bg-background-field-base text-sm text-foreground-neutral-subtle">
                      ⌘
                    </kbd>
                    <kbd className="flex h-16 w-16 items-center justify-center rounded-4 border border-border-neutral-base bg-background-field-base text-sm text-foreground-neutral-subtle">
                      /
                    </kbd>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Tooltip Text</Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-6">
                  <span>Tooltip Text</span>
                  <div className="flex items-center gap-4">
                    <kbd className="flex h-16 w-16 items-center justify-center rounded-4 border border-border-neutral-base bg-background-field-base text-xs text-foreground-neutral-subtle">
                      ⌘
                    </kbd>
                    <kbd className="flex h-16 w-16 items-center justify-center rounded-4 border border-border-neutral-base bg-background-field-base text-xs text-foreground-neutral-subtle">
                      /
                    </kbd>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Graph Type */}
        <div className="flex flex-col gap-16">
          <Code variant="label" className="text-foreground-neutral-subtle">
            Type=Graph
          </Code>
          <div className="flex gap-16">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary">Hover for graph data</Button>
              </TooltipTrigger>
              <TooltipContent variant="inverted" className="w-160">
                <div className="flex flex-col gap-4">
                  <div className="text-xs text-foreground-neutral-subtle">Jul 22, 2025</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-purple-500" />
                        <span className="text-xs">Data A</span>
                      </div>
                      <span className="text-xs">$6.14</span>
                    </div>
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-green-500" />
                        <span className="text-xs">Data B</span>
                      </div>
                      <span className="text-xs">$4.37</span>
                    </div>
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-orange-500" />
                        <span className="text-xs">Data C</span>
                      </div>
                      <span className="text-xs">$12.88</span>
                    </div>
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-blue-500" />
                        <span className="text-xs">Data D</span>
                      </div>
                      <span className="text-xs">$2.91</span>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Hover for graph data</Button>
              </TooltipTrigger>
              <TooltipContent className="w-160">
                <div className="flex flex-col gap-4">
                  <div className="text-xs text-foreground-neutral-subtle">Jul 22, 2025</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-purple-500" />
                        <span className="text-xs">Data A</span>
                      </div>
                      <span className="text-xs">$6.14</span>
                    </div>
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-green-500" />
                        <span className="text-xs">Data B</span>
                      </div>
                      <span className="text-xs">$4.37</span>
                    </div>
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-orange-500" />
                        <span className="text-xs">Data C</span>
                      </div>
                      <span className="text-xs">$12.88</span>
                    </div>
                    <div className="flex items-center justify-between gap-12">
                      <div className="flex flex-1 items-center gap-4">
                        <div className="size-6 rounded-full bg-blue-500" />
                        <span className="text-xs">Data D</span>
                      </div>
                      <span className="text-xs">$2.91</span>
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Breadcrumbs Type */}
        <div className="flex flex-col gap-16">
          <Code variant="label" className="text-foreground-neutral-subtle">
            Type=Breadcrumbs
          </Code>
          <div className="flex gap-16">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="primary">Breadcrumb</Button>
              </TooltipTrigger>
              <TooltipContent variant="inverted">
                <div className="flex items-center gap-6">
                  <span>Breadcrumb</span>
                  <span className="text-foreground-neutral-muted">/</span>
                  <span>Breadcrumb</span>
                </div>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary">Breadcrumb</Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex items-center gap-6">
                  <span>Breadcrumb</span>
                  <span className="text-foreground-neutral-muted">/</span>
                  <span>Breadcrumb</span>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  ),
};
