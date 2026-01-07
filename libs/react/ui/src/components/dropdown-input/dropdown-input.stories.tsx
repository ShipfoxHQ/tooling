import type {Meta, StoryObj} from '@storybook/react';
import {Button, ButtonLink} from 'components/button';
import {DropdownInput, type DropdownInputItem} from 'components/dropdown-input';
import {Icon} from 'components/icon';
import {Label} from 'components/label';
import {type RefObject, useMemo, useRef, useState} from 'react';

const sampleItems: DropdownInputItem<string>[] = [
  {id: 'apache', label: 'apache', value: 'apache'},
  {id: 'apache-superset', label: 'apache-superset', value: 'apache-superset'},
  {id: 'apaleo', label: 'apaleo', value: 'apaleo'},
  {id: 'apollo', label: 'apollo', value: 'apollo'},
  {id: 'apple', label: 'apple', value: 'apple'},
  {id: 'apache-kafka', label: 'apache-kafka', value: 'apache-kafka'},
];

const meta = {
  title: 'Components/DropdownInput',
  component: DropdownInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownInput>;

export default meta;
type Story = StoryObj<typeof meta>;

interface CustomEmptyStateContentProps {
  value: string;
  onValueChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  contactSupportHref: string;
  inputRef: RefObject<HTMLInputElement>;
}

function CustomEmptyStateContent({
  value,
  onValueChange,
  onOpenChange,
  contactSupportHref,
  inputRef,
}: CustomEmptyStateContentProps) {
  return (
    <div className="flex flex-col items-start justify-center">
      <Button
        type="button"
        variant="transparent"
        className="!px-4 w-full justify-start"
        onClick={() => {
          onValueChange(value);
          onOpenChange(false);
          inputRef.current?.blur();
        }}
      >
        <Icon name="addLine" className="size-16 text-foreground-neutral-subtle" />
        <span className="truncate">{value}</span>
      </Button>
      <p className="px-8 whitespace-pre-wrap">
        Repository list is limited to 100. Enter the full repository path or{' '}
        <ButtonLink
          variant="base"
          underline
          href={contactSupportHref}
          target="_blank"
          rel="noopener noreferrer"
          className="!font-regular"
        >
          contact support
        </ButtonLink>
        .
      </p>
    </div>
  );
}

export const Default: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [selectedItem, setSelectedItem] = useState<DropdownInputItem<string> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const items = useMemo(() => {
      if (value.length < 1) return sampleItems;
      const lowerQuery = value.toLowerCase();
      return sampleItems.filter((item) => item.label.toLowerCase().includes(lowerQuery));
    }, [value]);

    return (
      <div className="w-[80vw] md:w-500">
        <Label htmlFor="dropdown-input">Search repositories</Label>
        <DropdownInput
          id="dropdown-input"
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            if (selectedItem && selectedItem.label !== newValue) {
              setSelectedItem(null);
            }
          }}
          onSelect={(item) => {
            setSelectedItem(item);
          }}
          selectedItem={selectedItem}
          items={items}
          open={open}
          onOpenChange={setOpen}
          focusedIndex={focusedIndex}
          onFocusedIndexChange={setFocusedIndex}
          placeholder="Type to search..."
          emptyPlaceholder={
            <CustomEmptyStateContent
              value={value}
              onValueChange={setValue}
              onOpenChange={setOpen}
              contactSupportHref="https://support.example.com"
              inputRef={inputRef as RefObject<HTMLInputElement>}
            />
          }
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('abcxyz');
    const [open, setOpen] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    return (
      <div className="w-[80vw] md:w-500">
        <Label htmlFor="dropdown-empty">No results</Label>
        <DropdownInput
          id="dropdown-empty"
          value={value}
          onValueChange={setValue}
          items={[]}
          open={open}
          onOpenChange={setOpen}
          focusedIndex={focusedIndex}
          onFocusedIndexChange={setFocusedIndex}
          placeholder="Type to search..."
          emptyPlaceholder="No results found"
        />
      </div>
    );
  },
};

export const LoadingState: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('apache');
    const [open, setOpen] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    return (
      <div className="w-[80vw] md:w-500">
        <Label htmlFor="dropdown-loading">Loading</Label>
        <DropdownInput
          id="dropdown-loading"
          value={value}
          onValueChange={setValue}
          items={[]}
          iconRight={<Icon name="spinner" className="size-16 text-foreground-neutral-base" />}
          open={open}
          onOpenChange={setOpen}
          focusedIndex={focusedIndex}
          onFocusedIndexChange={setFocusedIndex}
          placeholder="Type to search..."
          emptyPlaceholder="Fetching..."
        />
      </div>
    );
  },
};

export const DisabledState: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('apache');
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    return (
      <div className="w-[80vw] md:w-500">
        <Label htmlFor="dropdown-disabled">Disabled</Label>
        <DropdownInput
          id="dropdown-disabled"
          value={value}
          onValueChange={setValue}
          items={sampleItems}
          disabled
          open={open}
          onOpenChange={setOpen}
          focusedIndex={focusedIndex}
          onFocusedIndexChange={setFocusedIndex}
          placeholder="Disabled input"
          emptyPlaceholder="No results found"
        />
      </div>
    );
  },
};
