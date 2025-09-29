import type {Meta, StoryObj} from '@storybook/react';
import {Code, Header} from 'components/typography';
import {cn} from 'utils/cn';
import {primitiveColors} from './colors.stories.conts';

const meta: Meta = {
  title: 'Assets/Colors',
};
export default meta;

type Story = StoryObj;

interface ColorItemProps {
  color: string;
  variant: string;
}

function ColorItem({variant}: ColorItemProps) {
  const value = variant.split('-').pop();
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('h-24 w-full rounded-6 border border-border', variant)} />
      <Code variant="label" className="text-foreground-neutral-subtle">
        {value}
      </Code>
    </div>
  );
}

interface ColorPaletteProps {
  title: string;
  rootKey: string;
  variants: readonly string[];
}

function ColorPalette({title, rootKey, variants}: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-16 gap-8">
      <Code variant="label" className="text-foreground-neutral-subtle">
        {title}
      </Code>
      {variants.map((variant) => (
        <ColorItem key={variant} variant={variant} color={rootKey} />
      ))}
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <div className="flex flex-col gap-16">
      <section className="flex flex-col gap-8">
        <Header variant="h2">Primitive Colors</Header>

        {Object.entries(primitiveColors).map(([color, variants]) => (
          <ColorPalette
            key={color}
            title={color.replace('-', ' ')}
            rootKey={color}
            variants={variants.variants as readonly string[]}
          />
        ))}
      </section>
    </div>
  ),
};
