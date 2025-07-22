import type {Meta, StoryObj} from '@storybook/react';
import {Button} from 'components/Button';
import {toast} from 'sonner';
import {Toaster} from './Toaster';

const meta: Meta<typeof Toaster> = {
  title: 'Atoms/Toaster',
  component: Toaster,
};
export default meta;

type Story = StoryObj<typeof Toaster>;

export const Playground: Story = {
  render: () => (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast('Event has been created', {
            description: 'Sunday, December 03, 2023 at 9:00 AM',
            action: {
              label: 'Undo',
              // biome-ignore lint/suspicious/noEmptyBlockStatements: no-op for demo
              onClick: () => {},
            },
          })
        }
      >
        Show Toast
      </Button>
      <Toaster />
    </>
  ),
};
