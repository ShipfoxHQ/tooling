import type {Meta, StoryObj} from '@storybook/react';
import {Header} from 'components/typography';
import {
  Alert,
  AlertAction,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from './alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'destructive'],
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

const variants = ['default', 'info', 'success', 'warning', 'destructive'] as const;

export const Default: Story = {
  render: (args) => {
    return (
      <Alert {...args}>
        <AlertContent>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
          <AlertActions>
            <AlertAction>Download</AlertAction>
            <AlertAction>View</AlertAction>
          </AlertActions>
        </AlertContent>
        <AlertClose variant={args.variant} />
      </Alert>
    );
  },
};

export const DesignMock: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-32 pb-64 pt-32 px-32 bg-background-neutral-base">
        <Header variant="h3" className="text-foreground-neutral-subtle">
          ALERTS
        </Header>
        <div className="flex flex-col gap-16">
          {variants.map((variant) => (
            <Alert key={variant} variant={variant}>
              <AlertContent>
                <AlertTitle>Title</AlertTitle>
                <AlertDescription>Description</AlertDescription>
                <AlertActions>
                  <AlertAction>Download</AlertAction>
                  <AlertAction>View</AlertAction>
                </AlertActions>
              </AlertContent>
              <AlertClose variant={variant} />
            </Alert>
          ))}
        </div>
      </div>
    );
  },
};
