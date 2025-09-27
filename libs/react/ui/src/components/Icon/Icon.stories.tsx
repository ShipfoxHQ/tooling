import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from 'components/Typography';
import {Icon, type IconName} from './Icon';

const icons: IconName[] = [
  'spinner',
  'repository',
  'branch',
  'commit',
  'github',
  'gitlab',
  'desktop',
  'sun',
  'moon',
  'check',
  'reload',
  'arrowDown',
  'arrowLeft',
  'arrowRight',
  'arrowUp',
  'doubleArrowDown',
  'doubleArrowLeft',
  'doubleArrowRight',
  'doubleArrowUp',
  'chevronDown',
  'chevronLeft',
  'chevronRight',
  'chevronUp',
  'caretDown',
  'caretLeft',
  'caretRight',
  'caretUp',
  'caretSort',
  'eyeOpen',
  'eyeClosed',
  'eyeNone',
  'calendar',
  'cross',
  'dot',
  'dotFilled',
  'checkCircled',
  'crossCircled',
  'stopwatch',
  'lapTimer',
  'lightningBolt',
  'layers',
  'stack',
  'rows',
  'activityLog',
  'size',
  'openInNewWindow',
  'crumpledPaper',
  'plus',
  'plusCircled',
  'minus',
  'minusCircled',
  'gear',
  'dotsHorizontal',
  'dotsVertical',
  'paperPlane',
  'envelopeClosed',
  'envelopeOpen',
  'enter',
  'exit',
  'piggyBank',
  'handCoins',
  'clipboard',
  'clipboardCopy',
  'trash',
  'hamburgerMenu',
  'link1',
  'link2',
] as const;

const meta: Meta<typeof Icon> = {
  title: 'Assets/Icons',
  component: Icon,
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Playground: Story = {
  render: () => {
    return (
      <div className="grid grid-cols-8 gap-4">
        {icons.sort().map((icon) => (
          <div key={icon} className="flex flex-col items-center">
            <Icon icon={icon} />
            <Typography>{icon}</Typography>
          </div>
        ))}
      </div>
    );
  },
};
