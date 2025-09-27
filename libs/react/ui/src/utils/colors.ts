import chroma from 'chroma-js';
import {getCssVariableValue} from './css';

const oklchRegex = /^oklch\(([0-9.]+)%\s*([0-9.]+)\s*([0-9.]+)\)$/;

export function getColor(colorName: string): string {
  const color = getCssVariableValue(`--${colorName}`);
  if (!color) throw new Error(`Could not find color: ${colorName}`);
  const oklchMatch = oklchRegex.exec(color);
  if (!oklchMatch) return color;
  const [_, l, c, h] = oklchMatch;
  return chroma.oklch(Number.parseFloat(l) / 100, Number.parseFloat(c), Number.parseFloat(h)).hex();
}
