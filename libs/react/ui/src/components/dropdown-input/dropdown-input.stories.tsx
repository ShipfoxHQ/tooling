import type {Meta, StoryObj} from '@storybook/react';
import {DropdownInput, type DropdownInputItem} from 'components/dropdown-input';
import {Label} from 'components/label';
import {useEffect, useMemo, useState} from 'react';

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

export const Default: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [selectedItem, setSelectedItem] = useState<DropdownInputItem<string> | null>(null);

    const items = useMemo(() => {
      if (value.length < 1) return [];
      const lowerQuery = value.toLowerCase();
      return sampleItems.filter((item) => item.label.toLowerCase().includes(lowerQuery));
    }, [value]);

    const shouldOpen = value.length >= 1 && items.length > 0 && !selectedItem;

    useEffect(() => {
      setOpen(shouldOpen);
      if (shouldOpen) setFocusedIndex(-1);
    }, [shouldOpen]);

    return (
      <div className="w-320">
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
          emptyPlaceholder="No results found"
          minQueryLength={1}
        />
      </div>
    );
  },
};

export const WithItems: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('');
    const [open, setOpen] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    return (
      <div className="w-320">
        <Label htmlFor="dropdown-with-items">Select an item</Label>
        <DropdownInput
          id="dropdown-with-items"
          value={value}
          onValueChange={setValue}
          items={sampleItems}
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

export const EmptyState: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('xyz');
    const [open, setOpen] = useState(true);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    return (
      <div className="w-320">
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
      <div className="w-320">
        <Label htmlFor="dropdown-loading">Loading</Label>
        <DropdownInput
          id="dropdown-loading"
          value={value}
          onValueChange={setValue}
          items={sampleItems}
          isLoading={true}
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

export const SelectedState: Story = {
  args: {} as never,
  render: () => {
    const [value, setValue] = useState('apache');
    const [open, setOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const selectedItem = sampleItems[0];

    return (
      <div className="w-320">
        <Label htmlFor="dropdown-selected">Selected item</Label>
        <DropdownInput
          id="dropdown-selected"
          value={value}
          onValueChange={setValue}
          selectedItem={selectedItem}
          items={sampleItems}
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
