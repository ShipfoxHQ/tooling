import type {Meta, StoryObj} from '@storybook/react';
import {Button} from 'components/button';
import {Code} from 'components/typography';
import {Toaster, toast} from './toast';
import {ToastCustom} from './toast-custom';

const meta = {
  title: 'Components/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <>
        <Story />
        <div className="flex flex-wrap justify-center items-center gap-32">
          {/* Regular Toasts */}
          <div className="flex flex-col gap-8">
            <Code variant="label" className="text-foreground-neutral-subtle text-center">
              REGULAR TOASTS
            </Code>
            <Button
              onClick={() => {
                toast('Event has been created');
              }}
            >
              Default Toast
            </Button>
            <Button
              onClick={() => {
                toast.success('Success! Your changes have been saved.');
              }}
            >
              Success Toast
            </Button>
            <Button
              onClick={() => {
                toast.error('Error! Something went wrong.');
              }}
            >
              Error Toast
            </Button>
            <Button
              onClick={() => {
                toast.warning('Warning! Please review your input.');
              }}
            >
              Warning Toast
            </Button>
            <Button
              onClick={() => {
                toast.info('Info: This is an informational message.');
              }}
            >
              Info Toast
            </Button>
            <Button
              onClick={() => {
                toast('Event has been created', {
                  description: 'Sunday, December 03, 2023 at 9:00 AM',
                });
              }}
            >
              Toast with Description
            </Button>
            <Button
              onClick={() => {
                toast('Event has been created', {
                  description: 'Sunday, December 03, 2023 at 9:00 AM',
                  action: {
                    label: 'Undo',
                    onClick: () => {
                      toast('Undo clicked');
                    },
                  },
                });
              }}
            >
              Toast with Action
            </Button>
            <Button
              onClick={() => {
                const promise = new Promise((resolve) => {
                  setTimeout(() => {
                    resolve({name: 'Sonner'});
                  }, 2000);
                });

                toast.promise(promise, {
                  loading: 'Loading...',
                  success: (data) => {
                    return `${(data as {name: string}).name} toast has been added`;
                  },
                  error: 'Error',
                });
              }}
            >
              Promise Toast
            </Button>
          </div>
          {/* Custom Toasts */}
          <div className="flex flex-col gap-8 text-center">
            <Code variant="label" className="text-foreground-neutral-subtle">
              CUSTOM TOASTS
            </Code>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="success"
                      title="Insert your alert title here"
                      description="Insert the alert description here. It would look better as two lines of text."
                      actions={[
                        {
                          label: 'Upgrade',
                          onClick: () => {
                            toast('Upgrade clicked');
                            toast.dismiss(t);
                          },
                        },
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Success - Full)
            </Button>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="info"
                      title="Insert your alert title here"
                      description="Insert the alert description here. It would look better as two lines of text."
                      actions={[
                        {
                          label: 'Upgrade',
                          onClick: () => {
                            toast('Upgrade clicked');
                            toast.dismiss(t);
                          },
                        },
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Info - Full)
            </Button>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="warning"
                      title="Insert your alert title here"
                      description="Insert the alert description here. It would look better as two lines of text."
                      actions={[
                        {
                          label: 'Upgrade',
                          onClick: () => {
                            toast('Upgrade clicked');
                            toast.dismiss(t);
                          },
                        },
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Warning - Full)
            </Button>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="error"
                      title="Insert your alert title here"
                      description="Insert the alert description here. It would look better as two lines of text."
                      actions={[
                        {
                          label: 'Upgrade',
                          onClick: () => {
                            toast('Upgrade clicked');
                            toast.dismiss(t);
                          },
                        },
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Error - Full)
            </Button>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="success"
                      content="Insert your alert content here"
                      actions={[
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Success - Simple)
            </Button>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="info"
                      content="Insert your alert content here"
                      actions={[
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Info - Simple)
            </Button>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="warning"
                      content="Insert your alert content here"
                      actions={[
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Warning - Simple)
            </Button>
            <Button
              onClick={() => {
                toast.custom(
                  (t) => (
                    <ToastCustom
                      variant="error"
                      content="Insert your alert content here"
                      actions={[
                        {
                          label: 'Learn more',
                          onClick: () => {
                            toast('Learn more clicked');
                            toast.dismiss(t);
                          },
                        },
                      ]}
                      onClose={() => toast.dismiss(t)}
                    />
                  ),
                  {
                    duration: Infinity,
                  },
                );
              }}
            >
              Custom Toast (Error - Simple)
            </Button>
          </div>
        </div>
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Toaster position="top-center" />,
};
