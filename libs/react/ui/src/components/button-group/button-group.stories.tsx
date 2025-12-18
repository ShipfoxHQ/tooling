import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Button} from '../button';
import {Icon} from '../icon';
import {Input} from '../input';
import {Popover, PopoverContent, PopoverTrigger} from '../popover';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../select';
import {Textarea} from '../textarea';
import {Code, Header} from '../typography';
import {ButtonGroup, ButtonGroupSeparator, ButtonGroupText} from './button-group';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A container that groups related buttons together with consistent styling. Automatically styles Button, Input, Select, and Textarea children without requiring manual className overrides. Separators are recommended for visual hierarchy.',
      },
    },
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'The orientation of the button group',
      defaultValue: 'horizontal',
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

function SelectExample() {
  const [currency, setCurrency] = useState('$');

  return (
    <div className="inline-flex gap-8">
      <ButtonGroup className="w-280" aria-label="Currency converter">
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger
            className="w-80 font-mono text-foreground-neutral-subtle"
            aria-label="Select currency"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="$">$ USD</SelectItem>
            <SelectItem value="€">€ EUR</SelectItem>
            <SelectItem value="£">£ GBP</SelectItem>
            <SelectItem value="¥">¥ JPY</SelectItem>
          </SelectContent>
        </Select>
        <ButtonGroupSeparator />
        <Input placeholder="10.00" pattern="[0-9]*" aria-label="Amount" />
      </ButtonGroup>
      <ButtonGroup aria-label="Send action">
        <Button variant="secondary" aria-label="Send">
          <Icon name="arrowRightLine" className="size-16 text-foreground-neutral-subtle" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

function PopoverExample() {
  const [open, setOpen] = useState(false);

  return (
    <ButtonGroup aria-label="Copilot actions">
      <ButtonGroupText>
        <Icon name="sparklingLine" className="size-16" />
        Copilot
      </ButtonGroupText>
      <ButtonGroupSeparator />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            className="!text-foreground-neutral-subtle"
            aria-label="Open Copilot options"
          >
            <Icon name="arrowDownSLine" className="size-16" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-320 p-0 rounded-12">
          <div className="px-16 py-12 border-b border-border-neutral-strong">
            <Header variant="h4" className="text-sm font-medium">
              Agent Tasks
            </Header>
          </div>
          <div className="p-16 flex flex-col gap-12">
            <Textarea
              placeholder="Describe your task in natural language."
              className="min-h-80 resize-none"
              aria-label="Task description"
            />
            <div className="flex flex-col gap-8">
              <Code variant="label" className="font-medium text-foreground-neutral-base">
                Start a new task with Copilot
              </Code>
              <Code variant="paragraph" className="text-foreground-neutral-subtle text-xs">
                Describe your task in natural language. Copilot will work in the background and open
                a pull request for your review.
              </Code>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  );
}

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-24">
      {/* Basic Button Group */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Basic Button Group
        </Code>
        <ButtonGroup aria-label="Text alignment">
          <Button variant="secondary" size="sm" aria-label="Align left">
            <Icon name="rewindFill" className="size-14 text-foreground-neutral-subtle" />
          </Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="sm" aria-label="Align center">
            <Icon name="playFill" className="size-14 text-foreground-neutral-subtle" />
          </Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="sm" aria-label="Align right">
            <Icon name="speedFill" className="size-14 text-foreground-neutral-subtle" />
          </Button>
        </ButtonGroup>
      </div>

      {/* Sizes */}
      <div className="flex flex-col gap-12">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Sizes
        </Code>
        <div className="flex flex-col gap-8">
          <ButtonGroup aria-label="Small buttons">
            <Button variant="secondary" size="sm" aria-label="Cut">
              <Icon name="rewindFill" className="size-14 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="sm" aria-label="Copy">
              <Icon name="playFill" className="size-14 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="sm" aria-label="Paste">
              <Icon name="speedFill" className="size-14 text-foreground-neutral-subtle" />
            </Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Medium buttons">
            <Button variant="secondary" size="md" aria-label="Cut">
              <Icon name="rewindFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="md" aria-label="Copy">
              <Icon name="playFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="md" aria-label="Paste">
              <Icon name="speedFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Large buttons">
            <Button variant="secondary" size="lg" aria-label="Cut">
              <Icon name="rewindFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="lg" aria-label="Copy">
              <Icon name="playFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="lg" aria-label="Paste">
              <Icon name="speedFill" className="size-16 text-foreground-neutral-subtle" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Orientation */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Orientation
        </Code>
        <div className="flex gap-24 items-start">
          <ButtonGroup aria-label="Horizontal">
            <Button variant="secondary" size="sm" aria-label="Zoom in">
              <Icon name="addLine" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="secondary" size="sm" aria-label="Zoom out">
              <Icon name="subtractLine" className="size-16 text-foreground-neutral-subtle" />
            </Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical" className="h-fit w-fit" aria-label="Vertical">
            <Button variant="secondary" size="sm" aria-label="Increase">
              <Icon name="addLine" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator orientation="horizontal" />
            <Button variant="secondary" size="sm" aria-label="Decrease">
              <Icon name="subtractLine" className="size-16 text-foreground-neutral-subtle" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Split Button */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Split Button
        </Code>
        <ButtonGroup aria-label="Save actions">
          <Button variant="secondary" size="sm" className=" !text-foreground-neutral-subtle">
            Save
          </Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="sm" aria-label="More options">
            <Icon name="arrowDownSLine" className="size-16 text-foreground-neutral-subtle" />
          </Button>
        </ButtonGroup>
      </div>

      {/* With Input */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With Input
        </Code>
        <ButtonGroup className="w-320" aria-label="Search">
          <Input placeholder="Search..." aria-label="Search input" />
          <ButtonGroupSeparator />
          <Button variant="secondary" aria-label="Submit search">
            <Icon name="searchLine" className="size-16 text-foreground-neutral-subtle" />
          </Button>
        </ButtonGroup>
      </div>

      {/* Quantity Input */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Quantity Selector
        </Code>
        <ButtonGroup className="w-280" aria-label="Quantity selector">
          <Button variant="secondary" aria-label="Decrease">
            <Icon name="subtractLine" className="size-16 text-foreground-neutral-subtle" />
          </Button>
          <ButtonGroupSeparator />
          <Input placeholder="1" className="text-center" aria-label="Quantity" />
          <ButtonGroupSeparator />
          <Button variant="secondary" aria-label="Increase">
            <Icon name="addLine" className="size-16 text-foreground-neutral-subtle" />
          </Button>
        </ButtonGroup>
      </div>

      {/* With Select */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With Select
        </Code>
        <SelectExample />
      </div>

      {/* With Popover */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          With Popover
        </Code>
        <PopoverExample />
      </div>

      {/* Nested Groups */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Nested Groups
        </Code>
        <div className="inline-flex gap-8">
          <ButtonGroup aria-label="Page selection">
            <Button
              variant="transparent"
              className="w-42 !text-foreground-neutral-subtle"
              aria-label="Page 1"
            >
              1
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant="transparent"
              className="w-42 !text-foreground-neutral-subtle"
              aria-label="Page 2"
            >
              2
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant="transparent"
              className="w-42 !text-foreground-neutral-subtle"
              aria-label="Page 3"
            >
              3
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant="transparent"
              className="w-42 !text-foreground-neutral-subtle"
              aria-label="Page 4"
            >
              4
            </Button>
            <ButtonGroupSeparator />
            <Button
              variant="transparent"
              className="w-42 !text-foreground-neutral-subtle"
              aria-label="Page 5"
            >
              5
            </Button>
          </ButtonGroup>
          <ButtonGroup aria-label="Pagination controls">
            <Button variant="transparent" aria-label="Previous page">
              <Icon name="arrowLeftSLine" className="size-16 text-foreground-neutral-subtle" />
            </Button>
            <ButtonGroupSeparator />
            <Button variant="transparent" aria-label="Next page">
              <Icon name="arrowRightSLine" className="size-16 text-foreground-neutral-subtle" />
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {/* Disabled State */}
      <div className="flex flex-col gap-8">
        <Code variant="label" className="text-foreground-neutral-subtle">
          Disabled State
        </Code>
        <ButtonGroup aria-label="Button group with disabled state">
          <Button variant="secondary" size="sm" className=" !text-foreground-neutral-subtle">
            Enabled
          </Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="sm" disabled>
            Disabled
          </Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="sm" className=" !text-foreground-neutral-subtle">
            Enabled
          </Button>
        </ButtonGroup>
      </div>
    </div>
  ),
};
