import type {Meta, StoryObj} from '@storybook/react';
import {Calendar} from './Calendar';

const meta: Meta<typeof Calendar> = {
  title: 'Molecules/Calendar',
  component: Calendar,
  argTypes: {
    showOutsideDays: {
      type: 'boolean',
    },
    numberOfMonths: {
      type: 'number',
    },
    fromYear: {
      type: 'number',
    },
    toYear: {
      type: 'number',
    },
    captionLayout: {
      control: {type: 'select'},
      options: ['buttons', 'dropdown', 'dropdown-buttons'],
    },
    fixedWeeks: {
      type: 'boolean',
    },
    mode: {
      control: {type: 'select'},
      options: ['default', 'single', 'multiple', 'range'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Calendar>;

export const Playground: Story = {
  args: {
    numberOfMonths: 1,
    showOutsideDays: false,
    pagedNavigation: true,
    fromYear: 2000,
    toYear: 2050,
    captionLayout: 'buttons',
    fixedWeeks: false,
    mode: 'default',
  },
};
