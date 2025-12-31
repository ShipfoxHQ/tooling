import {Text} from 'components/typography';
import {cn} from 'utils/cn';

export interface ChartTooltipContentProps {
  active?: boolean;
  label?: string | number;
  payload?: ReadonlyArray<{
    name?: string;
    value?: string | number;
    dataKey?: string | number;
    color?: string;
  }>;
  hoveredDataKey?: string;
  labelFormatter?: (label: string) => string;
}

export function ChartTooltipContent({
  active,
  label,
  payload,
  hoveredDataKey,
  labelFormatter,
}: ChartTooltipContentProps) {
  const isVisible = active && payload && payload.length;

  if (!isVisible) return null;

  return (
    <div className="flex flex-col gap-4 rounded-8 p-12 bg-background-neutral-overlay border border-border-neutral-base shadow-lg">
      <Text size="xs" className="text-foreground-neutral-muted">
        {labelFormatter ? labelFormatter(String(label)) : label}
      </Text>
      <div className="h-px w-full bg-border-neutral-base" />
      <div className="flex flex-col gap-4">
        {payload.map((item, index: number) => (
          <div
            key={item.name ?? index.toString()}
            className={cn(
              'flex items-center gap-8',
              hoveredDataKey && item.dataKey !== hoveredDataKey && 'opacity-50',
            )}
          >
            <span className="size-8 shrink-0 rounded-full" style={{backgroundColor: item.color}} />
            {item.name && (
              <Text size="xs" className="text-foreground-neutral-subtle">
                {item.name}
              </Text>
            )}
            <Text
              size="xs"
              className="text-foreground-neutral-base font-medium ml-auto tabular-nums"
            >
              {item.value}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}
