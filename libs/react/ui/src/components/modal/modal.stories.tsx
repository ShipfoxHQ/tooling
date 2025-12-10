import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {Meta, StoryObj} from '@storybook/react';
import {screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Button, ButtonLink} from 'components/button';
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockItem,
} from 'components/code-block';
import {DatePicker} from 'components/date-picker';
import {DynamicItem} from 'components/dynamic-item';
import {Icon} from 'components/icon';
import {Input} from 'components/input';
import {ItemTitle} from 'components/item';
import {Label} from 'components/label';
import {MovingBorder} from 'components/moving-border';
import {Text} from 'components/typography';
import {useState} from 'react';
import {cn} from 'utils/cn';
import illustration2 from '../../assets/illustration-2.svg';
import illustrationBg from '../../assets/illustration-gradient.svg';
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from './modal';

const OPEN_MODAL_REGEX = /open modal/i;
const IMPORT_JOBS_REGEX = /import past jobs from github/i;
const GITHUB_ACTIONS_REGEX = /run github actions on shipfox/i;

const DEFAULT_START_DATE = new Date('2025-12-06T00:00:00.000Z');

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async (ctx) => {
    const {canvasElement, step} = ctx;
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Open the modal', async () => {
      const triggerButton = canvas.getByRole('button', {name: OPEN_MODAL_REGEX});
      await user.click(triggerButton);
    });

    await step('Wait for dialog to appear and render', async () => {
      await screen.findByRole('dialog');
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await argosScreenshot(ctx, 'Default Modal Open');
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex h-[calc(100vh/2)] w-[calc(100vw/2)] items-center justify-center rounded-16 bg-background-subtle-base shadow-tooltip">
        <Modal open={open} onOpenChange={setOpen}>
          <ModalTrigger asChild>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent aria-describedby={undefined}>
            <ModalTitle className="sr-only">Modal Title</ModalTitle>
            <ModalHeader>
              <Text
                size="lg"
                className="flex-1 overflow-ellipsis overflow-hidden whitespace-nowrap"
              >
                Modal Title
              </Text>
            </ModalHeader>
            <ModalBody>
              <Text size="sm" className="text-foreground-neutral-subtle w-full">
                This modal automatically adapts between dialog (desktop) and drawer (mobile) based
                on screen size. Try resizing your browser window!
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="transparent" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  },
};

export const ImportForm: Story = {
  play: async (ctx) => {
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
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(DEFAULT_START_DATE);

    return (
      <div className="flex h-[calc(100vh/2)] w-[calc(100vw/2)] items-center justify-center rounded-16 bg-background-subtle-base shadow-tooltip">
        <Modal open={open} onOpenChange={setOpen}>
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
                  <Label>Repository owner</Label>
                  <Input placeholder="apache" />
                </div>
                <div className="flex flex-col gap-8 w-full">
                  <Label>Repository name</Label>
                  <Input placeholder="kafka" />
                </div>
                <div className="flex flex-col gap-8 w-full">
                  <Label htmlFor="start-date">Start date</Label>
                  <DatePicker
                    id="start-date"
                    date={date}
                    onDateSelect={setDate}
                    onClear={() => setDate(undefined)}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="transparent" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Import
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  },
};

const diffCode = `jobs:
  build:
-   runs-on: ubuntu-latest
+   runs-on: shipfox-2vcpu-ubuntu-2404`;

export const GithubActions: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'large',
    },
  },
  play: async (ctx) => {
    const {canvasElement, step} = ctx;
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Open the modal', async () => {
      const triggerButton = canvas.getByRole('button', {name: GITHUB_ACTIONS_REGEX});
      await user.click(triggerButton);
    });

    await step('Wait for dialog to appear and render', async () => {
      await screen.findByRole('dialog');
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await argosScreenshot(ctx, 'Github Actions Modal Open');
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex h-[50vh] w-[calc(100vw/2)] items-center justify-center rounded-16 bg-background-subtle-base shadow-tooltip">
        <Modal open={open} onOpenChange={setOpen}>
          <ModalTrigger asChild>
            <Button>Run GitHub Actions on Shipfox</Button>
          </ModalTrigger>
          <ModalContent aria-describedby={undefined} overlayClassName="bg-background-modal-overlay">
            <ModalTitle className="sr-only">Run GitHub Actions on Shipfox</ModalTitle>
            <ModalHeader title="Run GitHub Actions on Shipfox" />
            <ModalBody className="gap-32">
              <div className="flex flex-col gap-20 w-full">
                <Text size="sm" className="text-foreground-neutral-subtle w-full">
                  This will run your jobs on Shipfox&apos;s optimized infrastructure. Giving you
                  faster builds, and dedicated resources.
                </Text>
                <div className="relative">
                  <img
                    src={illustration2}
                    alt="illustration-2"
                    className="hidden sm:block absolute overflow-clip right-2 top-1/2 -translate-y-1/2 translate-x-8 w-fit object-contain z-50"
                  />
                  <div className={cn('relative overflow-hidden bg-transparent p-1 rounded-8')}>
                    <div className="absolute inset-0" style={{borderRadius: 'calc(0.5rem * 0.96)'}}>
                      <MovingBorder duration={6000} rx="30%" ry="30%">
                        <div className="h-100 w-200 bg-[radial-gradient(#ff9e7a_40%,transparent_60%)]" />
                      </MovingBorder>
                    </div>
                    <div
                      className="relative"
                      style={{
                        borderRadius: 'calc(0.5rem * 0.96)',
                      }}
                    >
                      <DynamicItem
                        variant="default"
                        title={
                          <div className="flex items-center gap-6">
                            <span className="flex shrink-0 items-center justify-center text-tag-success-icon w-16 h-16">
                              <Icon
                                name="money"
                                size="sm"
                                color="var(--foreground-neutral-subtle, #a1a1aa)"
                              />
                            </span>
                            <ItemTitle>6000 free credits/month to run your jobs</ItemTitle>
                          </div>
                        }
                        description="~500 builds/month. No payment required."
                        rightElement={
                          <img
                            src={illustrationBg}
                            alt="illustration-bg"
                            className="hidden sm:block absolute overflow-clip right-4 w-fit object-contain scale-105"
                          />
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-20 w-full">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-center w-full">
                    <Text className="flex-1 font-semibold text-foreground-neutral-base overflow-ellipsis overflow-hidden whitespace-nowrap">
                      Update your GitHub Actions workflow
                    </Text>
                    <ButtonLink variant="base" size="sm" href="#" iconRight="bookOpen">
                      See docs
                    </ButtonLink>
                  </div>
                  <Text size="sm" className="text-foreground-neutral-subtle w-full">
                    Replace the runs-on line in your workflow file to use Shipfox runners.
                  </Text>
                </div>

                <CodeBlock
                  data={[
                    {
                      language: 'yaml',
                      filename: '.github/workflows/<workflow-name>.yml',
                      code: diffCode,
                    },
                  ]}
                  defaultValue="yaml"
                >
                  <CodeBlockHeader>
                    <CodeBlockFiles>
                      {(item) => (
                        <CodeBlockFilename value={item.language}>{item.filename}</CodeBlockFilename>
                      )}
                    </CodeBlockFiles>
                    <CodeBlockCopyButton />
                  </CodeBlockHeader>
                  <CodeBlockBody>
                    {(item) => (
                      <CodeBlockItem value={item.language}>
                        <CodeBlockContent language={item.language}>{item.code}</CodeBlockContent>
                      </CodeBlockItem>
                    )}
                  </CodeBlockBody>
                  <CodeBlockFooter
                    state="running"
                    message="Waiting for Shipfox runner event…"
                    description="This usually takes 30-60 seconds after you commit the workflow file."
                  />
                </CodeBlock>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Got it
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  },
};

export const OpenedModal: Story = {
  play: async (ctx) => {
    const {canvasElement, step} = ctx;
    const canvas = within(canvasElement);
    const user = userEvent.setup();

    await step('Open the modal', async () => {
      const triggerButton = canvas.getByRole('button', {name: OPEN_MODAL_REGEX});
      await user.click(triggerButton);
    });

    await step('Wait for dialog to appear and render', async () => {
      await screen.findByRole('dialog');
      await new Promise((resolve) => setTimeout(resolve, 100));
    });

    await argosScreenshot(ctx, 'Opened Modal State');
  },
  render: () => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex h-[calc(100vh/2)] w-[calc(100vw/2)] items-center justify-center rounded-16 bg-background-subtle-base shadow-tooltip">
        <Modal open={open} onOpenChange={setOpen}>
          <ModalTrigger asChild>
            <Button>Open Modal</Button>
          </ModalTrigger>
          <ModalContent aria-describedby={undefined}>
            <ModalTitle className="sr-only">Modal Title</ModalTitle>
            <ModalHeader>
              <Text
                size="lg"
                className="flex-1 overflow-ellipsis overflow-hidden whitespace-nowrap"
              >
                Modal Title
              </Text>
            </ModalHeader>
            <ModalBody>
              <Text size="sm" className="text-foreground-neutral-subtle w-full">
                This modal automatically adapts between dialog (desktop) and drawer (mobile) based
                on screen size. Try resizing your browser window!
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button variant="transparent" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Confirm
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    );
  },
};
