import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {Meta, StoryObj} from '@storybook/react';
import {Avatar} from 'components/avatar';
import {Button} from 'components/button';
import {Header, Text} from 'components/typography';

const meta = {
  title: 'Onboarding/Signin',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async (ctx) => {
    await argosScreenshot(ctx, 'example-screenshot');
  },
  render: () => {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-subtle-base">
        {/* Background illustration - simplified decorative element */}
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[120px]">
          <div
            className="h-[332px] w-[800px] opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255, 75, 0, 0.3) 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '-80px 31px',
            }}
          />
        </div>

        {/* Main content */}
        <div className="relative flex w-full max-w-[384px] flex-col items-center gap-32 px-24 pb-80 pt-24">
          {/* Logo and title section */}
          <div className="flex flex-col items-center gap-16">
            <Avatar content="logo" size="xl" radius="rounded" logoName="shipfox" />
            <div className="flex min-w-[128px] flex-col items-center gap-4 text-center">
              <Header
                variant="h1"
                className="text-[28px] font-medium leading-[44px] text-foreground-neutral-base"
              >
                Connect to Shipfox
              </Header>
              <Text
                size="sm"
                className="text-sm font-normal leading-[24px] text-foreground-neutral-subtle"
              >
                Log in to access Shipfox.
              </Text>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex w-full flex-col gap-20">
            <Button variant="primary" size="md" iconLeft="google" className="w-full">
              Continue with Google
            </Button>
            <Button variant="primary" size="md" iconLeft="microsoft" className="w-full">
              Continue with Microsoft
            </Button>
            <Button variant="transparent" size="md" className="w-full">
              Connect with Enterprise SSO
            </Button>
          </div>
        </div>
      </div>
    );
  },
};
