import type {Meta, StoryObj} from '@storybook/react';
import {Button} from '../button';
import {Icon} from '../icon/icon';
import {Input} from '../input';
import {Label} from '../label/label';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from './';

const meta = {
  title: 'Components/Item',
  component: Item,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm'],
    },
  },
  args: {
    variant: 'default',
    size: 'default',
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
  },
  render: (args) => (
    <Item {...args} className="px-12 py-12">
      <ItemContent>
        <ItemTitle>Basic Item</ItemTitle>
        <ItemDescription>A simple item with title and description.</ItemDescription>
      </ItemContent>
      <ItemActions className="pt-8">
        <Button variant="secondary" size="sm">
          Action
        </Button>
      </ItemActions>
    </Item>
  ),
};

export const Variants: Story = {
  args: {},
  render: () => (
    <ItemGroup className="flex w-full max-w-md flex-col gap-12">
      <Item variant="default" className="px-12 py-12">
        <ItemContent>
          <ItemTitle>Default Variant</ItemTitle>
          <ItemDescription>Standard styling with subtle background and borders.</ItemDescription>
        </ItemContent>
        <ItemActions className="pt-8">
          <Button variant="secondary" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="neutral" className="px-12 py-12">
        <ItemContent>
          <ItemTitle>Neutral Variant</ItemTitle>
          <ItemDescription>Neutral style with subtle background and borders.</ItemDescription>
        </ItemContent>
        <ItemActions className="pt-8">
          <Button variant="primary" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
};

export const ImportPastJobsModal: Story = {
  args: {},
  render: () => (
    <div className="flex w-full max-w-lg flex-col">
      <Item variant="neutral">
        <ItemHeader className="justify-between px-24 py-16">
          <ItemTitle className="text-lg font-medium text-foreground-neutral-base">
            Import past jobs from Github
          </ItemTitle>
          <div className="flex items-center gap-8">
            <kbd className="flex items-center justify-center rounded-8 border border-border-neutral-base shadow-button-neutral bg-background-field-base text-xs text-foreground-neutral-subtle px-4">
              esc
            </kbd>
            <Button
              variant="transparent"
              size="xs"
              className="rounded-4 p-2 cursor-pointer bg-transparent border-none text-foreground-neutral-muted hover:text-foreground-neutral-base hover:bg-background-components-hover transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-background-accent-blue-base focus-visible:ring-offset-2 w-24 h-24"
            >
              <Icon name="close" />
            </Button>
          </div>
        </ItemHeader>
        <ItemSeparator />
        <ItemContent className="px-24 py-16">
          <ItemDescription className="mb-16 text-sm text-foreground-neutral-subtle">
            Backfill your CI history by importing past runs from your Github repo. We'll handle the
            rest by creating a background task to import the data for you.
          </ItemDescription>
          <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-8">
              <Label htmlFor="repo-owner">Repository owner</Label>
              <Input id="repo-owner" type="text" defaultValue="apache" />
            </div>
            <div className="flex flex-col gap-8">
              <Label htmlFor="repo-name">Repository name</Label>
              <Input id="repo-name" type="text" defaultValue="kafka" />
            </div>
            <div className="flex flex-col gap-8">
              <Label htmlFor="start-date">Start date</Label>
              <Input
                id="start-date"
                type="datetime-local"
                defaultValue="September 5th, 2025"
                className="pl-32"
              />
            </div>
          </div>
        </ItemContent>
        <ItemSeparator />
        <ItemFooter className="justify-end gap-8 px-24 py-16">
          <Button variant="transparent" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Import
          </Button>
        </ItemFooter>
      </Item>
    </div>
  ),
};
