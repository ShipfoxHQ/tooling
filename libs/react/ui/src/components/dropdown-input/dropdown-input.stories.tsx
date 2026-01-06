import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {Meta, StoryContext, StoryObj} from '@storybook/react';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button} from 'components/button';
import {type DateRange, DateTimeRangePicker} from 'components/date-time-range-picker';
import {DropdownInput, type DropdownInputItem} from 'components/dropdown-input';
import {Label} from 'components/label';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from 'components/modal';
import {Text} from 'components/typography';
import {addDays} from 'date-fns';
import {useEffect, useMemo, useState} from 'react';

const DEFAULT_START_DATE = new Date();
const IMPORT_JOBS_REGEX = /import past jobs from github/i;

const allRepositoryOwners: DropdownInputItem<string>[] = [
  {id: 'apache', label: 'apache', value: 'apache'},
  {id: 'apache-superset', label: 'apache-superset', value: 'apache-superset'},
  {id: 'apaleo', label: 'apaleo', value: 'apaleo'},
  {id: 'aparrish', label: 'aparrish', value: 'aparrish'},
  {id: 'apollo', label: 'apollo', value: 'apollo'},
  {id: 'apple', label: 'apple', value: 'apple'},
  {id: 'apache-kafka', label: 'apache-kafka', value: 'apache-kafka'},
];

const allRepositoryNames: DropdownInputItem<string>[] = [
  {id: 'kafka', label: 'kafka', value: 'kafka'},
  {id: 'kafka-streams', label: 'kafka-streams', value: 'kafka-streams'},
  {id: 'kafka-connect', label: 'kafka-connect', value: 'kafka-connect'},
  {id: 'kafka-ui', label: 'kafka-ui', value: 'kafka-ui'},
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
  play: async (ctx: StoryContext) => {
    const {canvasElement, step} = ctx;
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Open the modal', async () => {
      const triggerButton = canvas.getByRole('button', {name: IMPORT_JOBS_REGEX});
      await user.click(triggerButton);
    });

    await step('Wait for dialog to appear and render', async () => {
      await screen.findByRole('dialog');
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await argosScreenshot(ctx, 'Import Form Modal Open');
  },
  render: () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
      start: DEFAULT_START_DATE,
      end: addDays(DEFAULT_START_DATE, 6),
    });

    const [ownerValue, setOwnerValue] = useState('');
    const [ownerOpen, setOwnerOpen] = useState(false);
    const [ownerFocusedIndex, setOwnerFocusedIndex] = useState(-1);
    const [ownerSelected, setOwnerSelected] = useState<DropdownInputItem<string> | null>(null);
    const ownerItems = useMemo(() => {
      if (ownerValue.length < 1) return [];
      const lowerQuery = ownerValue.toLowerCase();
      return allRepositoryOwners.filter((owner) => owner.label.toLowerCase().includes(lowerQuery));
    }, [ownerValue]);
    const ownerShouldOpen = ownerValue.length >= 1 && ownerItems.length > 0 && !ownerSelected;

    const [nameValue, setNameValue] = useState('');
    const [nameOpen, setNameOpen] = useState(false);
    const [nameFocusedIndex, setNameFocusedIndex] = useState(-1);
    const [nameSelected, setNameSelected] = useState<DropdownInputItem<string> | null>(null);
    const nameItems = useMemo(() => {
      if (nameValue.length < 1) return [];
      const lowerQuery = nameValue.toLowerCase();
      return allRepositoryNames.filter((name) => name.label.toLowerCase().includes(lowerQuery));
    }, [nameValue]);
    const nameShouldOpen = nameValue.length >= 1 && nameItems.length > 0 && !nameSelected;

    useEffect(() => {
      setOwnerOpen(ownerShouldOpen);
      if (ownerShouldOpen) setOwnerFocusedIndex(-1);
    }, [ownerShouldOpen]);

    useEffect(() => {
      setNameOpen(nameShouldOpen);
      if (nameShouldOpen) setNameFocusedIndex(-1);
    }, [nameShouldOpen]);

    return (
      <div className="flex h-[calc(100vh/2)] w-[calc(100vw/2)] items-center justify-center rounded-16 bg-background-subtle-base shadow-tooltip">
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalTrigger asChild>
            <Button>Import past jobs from GitHub</Button>
          </ModalTrigger>
          <ModalContent aria-describedby={undefined} overlayClassName="bg-background-modal-overlay">
            <ModalTitle className="sr-only">Import past jobs from GitHub</ModalTitle>
            <ModalHeader title="Import past jobs from GitHub" />
            <ModalBody className="gap-20">
              <Text size="sm" className="text-foreground-neutral-subtle w-full">
                Backfill your CI history by importing past runs from your GitHub repo. We&apos;ll
                handle the rest by creating a background task to import the data for you.
              </Text>
              <div className="flex flex-col gap-20 w-full">
                <div className="flex flex-col gap-8 w-full">
                  <Label htmlFor="repo-owner">Repository owner</Label>
                  <DropdownInput
                    id="repo-owner"
                    value={ownerValue}
                    onValueChange={(newValue) => {
                      setOwnerValue(newValue);
                      if (ownerSelected && ownerSelected.label !== newValue) {
                        setOwnerSelected(null);
                      }
                    }}
                    onSelect={(item) => {
                      setOwnerSelected(item);
                    }}
                    selectedItem={ownerSelected}
                    items={ownerItems}
                    open={ownerOpen}
                    onOpenChange={setOwnerOpen}
                    focusedIndex={ownerFocusedIndex}
                    onFocusedIndexChange={setOwnerFocusedIndex}
                    placeholder="apache"
                    emptyPlaceholder="No repository owners found"
                    minQueryLength={1}
                  />
                </div>
                <div className="flex flex-col gap-8 w-full">
                  <Label htmlFor="repo-name">Repository name</Label>
                  <DropdownInput
                    id="repo-name"
                    value={nameValue}
                    onValueChange={(newValue) => {
                      setNameValue(newValue);
                      if (nameSelected && nameSelected.label !== newValue) {
                        setNameSelected(null);
                      }
                    }}
                    onSelect={(item) => {
                      setNameSelected(item);
                    }}
                    selectedItem={nameSelected}
                    items={nameItems}
                    open={nameOpen}
                    onOpenChange={setNameOpen}
                    focusedIndex={nameFocusedIndex}
                    onFocusedIndexChange={setNameFocusedIndex}
                    placeholder="kafka"
                    emptyPlaceholder="No repository names found"
                    minQueryLength={1}
                  />
                </div>
                <div className="flex flex-col gap-8 w-full">
                  <Label htmlFor="history-range">History range</Label>
                  <DateTimeRangePicker
                    id="history-range"
                    dateRange={dateRange}
                    onDateRangeSelect={setDateRange}
                    onClear={() => setDateRange(undefined)}
                    placeholder="Select date range"
                    dateFormat="PP"
                    maxRangeDays={30}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="transparent" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Import
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  },
};
