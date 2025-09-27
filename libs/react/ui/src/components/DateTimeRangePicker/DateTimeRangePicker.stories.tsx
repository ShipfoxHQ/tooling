import type {Meta, StoryObj} from '@storybook/react';
import {subHours} from 'date-fns';
import {useState} from 'react';
import {DateTimeRangePicker} from './DateTimeRangePicker';

const meta: Meta<typeof DateTimeRangePicker> = {
  title: 'Molecules/DateTimeRangePicker',
  component: DateTimeRangePicker,
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof DateTimeRangePicker>;

export const Playground: Story = {
  render: () => {
    const [interval, setInterval] = useState({
      start: subHours(new Date('2024-03-20T17:45:00Z'), 1),
      end: new Date(),
    });
    return <DateTimeRangePicker interval={interval} setInterval={setInterval} />;
  },
};
