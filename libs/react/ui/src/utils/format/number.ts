export interface NumberFormatOptions extends Intl.NumberFormatOptions {
  locale?: string;
}

export function formatNumber(
  value: number | bigint,
  {locale, ...options}: NumberFormatOptions = {},
): string {
  const formatter = new Intl.NumberFormat(locale, options);
  return formatter.format(value);
}

export function formatNumberCompact(
  value: number | bigint,
  options: NumberFormatOptions = {},
): string {
  return formatNumber(value, {
    ...options,
    style: 'decimal',
    notation: 'compact',
    compactDisplay: 'short',
  });
}

export function formatPercent(
  value: number,
  {locale, ...options}: NumberFormatOptions = {},
): string {
  return formatNumber(value, {
    ...options,
    style: 'percent',
  });
}
