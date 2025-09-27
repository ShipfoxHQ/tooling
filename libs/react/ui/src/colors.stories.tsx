import type {Meta, StoryObj} from '@storybook/react';
import {Typography} from 'components/Typography';
import {colors} from '../tailwind.config.colors';
import {getColor} from './utils';

const scales = [
  'gray',
  'blue',
  'purple',
  'amber',
  'red',
  'pink',
  'green',
  'teal',
  'gray-alpha',
] as const;

const scaleSteps = Array.from({length: 10}, (_, i) => (i + 1) * 100);

const meta: Meta = {
  title: 'Assets/Colors',
};
export default meta;

type Story = StoryObj;

interface ColorItemProps {
  color: string;
  tint: string;
  name: string;
}

const colorVarRegex = /var\(--(.+)\)/;

function ColorItem({name, color, tint}: ColorItemProps) {
  const colorVariants = colors[color as keyof typeof colors];
  const varColor = colorVariants[tint as keyof typeof colorVariants] as string;
  const varName = varColor.match(colorVarRegex)?.[1];
  const hex = getColor(varName as string);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="h-8 w-16 rounded-xs border border-border" style={{background: varColor}} />
      <Typography variant="muted">{name}</Typography>
      <Typography variant="muted">{hex}</Typography>
    </div>
  );
}

interface ColorPaletteProps {
  title: string;
  rootKey: string;
  variants: {name: string; key?: string}[];
}

function ColorPalette({title, rootKey, variants}: ColorPaletteProps) {
  return (
    <div className="grid grid-cols-11">
      <Typography className="capitalize">{title}</Typography>
      {variants.map((variant) => (
        <ColorItem
          key={variant.key ?? variant.name}
          name={variant.name}
          color={rootKey}
          tint={variant.key ?? 'DEFAULT'}
        />
      ))}
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <Typography variant="h2">Scales</Typography>

        {scales.map((color) => (
          <ColorPalette
            key={color}
            title={color.replace('-', ' ')}
            rootKey={color}
            variants={scaleSteps.map((step) => ({name: `${color}-${step}`, key: `${step}`}))}
          />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <Typography variant="h2">Applications</Typography>
        <ColorPalette
          title="Background"
          rootKey="background"
          variants={[
            {name: 'Default background'},
            {key: 'secondary', name: 'Secondary background'},
          ]}
        />

        <ColorPalette
          title="Border"
          rootKey="border"
          variants={[
            {name: 'Default border'},
            {key: 'hover', name: 'Hover border'},
            {key: 'active', name: 'Active border'},
          ]}
        />

        <ColorPalette
          title="Text"
          rootKey="text"
          variants={[
            {name: 'Default text'},
            {key: 'secondary', name: 'Secondary text'},
            {key: 'muted', name: 'Muted text'},
            {key: 'contrast', name: 'Contrast text'},
          ]}
        />

        <ColorPalette
          title="Focus"
          rootKey="focus"
          variants={[
            {key: 'border', name: 'Focus border'},
            {key: 'color', name: 'Focus text'},
          ]}
        />

        <ColorPalette
          title="Surface"
          rootKey="surface"
          variants={[
            {name: 'Default surface'},
            {key: 'hover', name: 'Surface hover'},
            {key: 'active', name: 'Surface active'},
          ]}
        />

        <ColorPalette
          title="Contrast"
          rootKey="contrast"
          variants={[{name: 'Default contrast'}, {key: 'hover', name: 'Hover contrast'}]}
        />

        <ColorPalette
          title="Execution Status"
          rootKey="status"
          variants={[
            {key: 'success', name: 'Success'},
            {key: 'failed', name: 'Failed'},
            {key: 'neutral', name: 'Neutral'},
          ]}
        />
      </section>
    </div>
  ),
};
