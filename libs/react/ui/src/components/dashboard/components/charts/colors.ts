export const chartColors = {
  blue: 'var(--color-blue-500)',
  green: 'var(--color-green-500)',
  orange: 'var(--color-orange-500)',
  purple: 'var(--color-purple-500)',
  red: 'var(--color-red-500)',
  amber: 'var(--color-amber-500)',
  neutral: 'var(--color-neutral-500)',
} as const;

export type ChartColor = keyof typeof chartColors;

export const chartColorsList = [
  chartColors.blue,
  chartColors.green,
  chartColors.orange,
  chartColors.purple,
  chartColors.red,
  chartColors.amber,
  chartColors.neutral,
];
