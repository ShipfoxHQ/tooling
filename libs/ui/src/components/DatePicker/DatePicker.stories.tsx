import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {DatePicker} from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Molecules/DatePicker',
  component: DatePicker,
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof DatePicker>;

export const Playground: Story = {
  render: () => {
    const [date, setData] = useState<Date | undefined>();
    return <DatePicker date={date} onSelect={(date) => setData(date)} />;
  },
};
