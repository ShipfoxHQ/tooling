import type {Meta, StoryObj} from '@storybook/react';
import {Button} from 'components/button';
import {Input} from 'components/input';
import {Label} from 'components/label';
import {Text} from 'components/typography';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-400">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>This is a description of the card content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Card content goes here. This is where the main information is displayed.</Text>
        </CardContent>
      </Card>
    </div>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <div className="w-400">
      <Card>
        <CardHeader>
          <CardTitle>Card with Footer</CardTitle>
          <CardDescription>This card includes a footer with actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Text>Main content area with important information.</Text>
        </CardContent>
        <CardFooter>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const WithAction: Story = {
  render: () => (
    <div className="w-400">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-16">
            <div className="flex flex-col gap-4 flex-1">
              <CardTitle>Card with Action</CardTitle>
              <CardDescription>This card has an action button in the header.</CardDescription>
            </div>
            <CardAction>
              <Button variant="transparent" size="sm">
                Edit
              </Button>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <Text>Content that can be edited using the action button.</Text>
        </CardContent>
      </Card>
    </div>
  ),
};

export const LoginForm: Story = {
  render: () => (
    <div className="w-400">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-16">
            <div className="flex flex-col gap-4 flex-1">
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </div>
            <CardAction>
              <Button variant="transparent" size="sm">
                Sign Up
              </Button>
            </CardAction>
          </div>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-16">
            <div className="grid gap-6">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-6">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Button variant="transparent" size="xs" className="ml-auto">
                  Forgot password?
                </Button>
              </div>
              <Input id="password" type="password" required />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-8">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button type="submit" variant="secondary" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
