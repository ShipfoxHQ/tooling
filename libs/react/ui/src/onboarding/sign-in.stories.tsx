import {argosScreenshot} from '@argos-ci/storybook/vitest';
import type {Meta, StoryObj} from '@storybook/react';
import {Avatar} from 'components/avatar';
import {Button} from 'components/button';
import {DotGrid} from 'components/dot-grid';
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
        <div
          className="absolute w-[800px] max-w-[800px] h-[400px] top-0 left-1/2 -translate-x-1/2 translate-y-[-145px]"
          style={{
            maskImage:
              'radial-gradient(ellipse 100% 125% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0) 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 100% 125% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 30%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0) 100%)',
          }}
        >
          <DotGrid
            dotSize={2}
            gap={20}
            baseColor="#e63e00"
            activeColor="#FF0076"
            proximity={100}
            shockRadius={8}
            shockStrength={100}
            resistance={500}
            returnDuration={1.5}
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
