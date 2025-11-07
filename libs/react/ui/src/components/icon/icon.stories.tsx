import type {Meta, StoryObj} from '@storybook/react';
import {Code} from 'components/typography';
import {Icon, iconNames} from './icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  args: {name: 'google'},
  render: (args) => (
    <div className="flex flex-col gap-16">
      <div className="grid grid-cols-8 gap-16">
        {iconNames.toSorted().map((name) => (
          <div key={name} className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center w-20 h-20">
              <Icon {...args} name={name} />
            </div>
            <Code variant="label" className="text-foreground-neutral-subtle">
              {name}
            </Code>
          </div>
        ))}
      </div>
    </div>
  ),
};
