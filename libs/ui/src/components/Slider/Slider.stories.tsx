import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from 'components/Typography';
import {useState} from 'react';
import {Slider} from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Playground: Story = {
  render: (args) => {
    const [value, setValue] = useState([10, 70]);
    return (
      <div>
        <div>
          <Typography variant="h3" className="mb-2">
            Value: {value[0]} - {value[1]}
          </Typography>
        </div>
        <Slider onValueChange={setValue} min={0} max={100} step={1} value={value} {...args} />
      </div>
    );
  },
};
