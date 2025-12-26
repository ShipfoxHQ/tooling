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
    <div
      className={cn(
        'flex flex-col gap-4 rounded-8 border border-border-neutral-base',
        'bg-background-neutral-overlay p-12 shadow-tooltip',
      )}
    >
      <p className="text-xs text-foreground-neutral-muted">
        {labelFormatter ? labelFormatter(String(label)) : label}
      </p>
      <div className="h-px w-full bg-border-neutral-base" />
      <div className="flex flex-col gap-4">
        {payload.map((item, index: number) => (
          <div
            key={item.name ?? index.toString()}
            className="flex items-center gap-8"
            style={{
              opacity: hoveredDataKey ? (item.dataKey === hoveredDataKey ? 1 : 0.5) : 1,
            }}
          >
            <span className="size-8 rounded-full shrink-0" style={{backgroundColor: item.color}} />
            {item.name && (
              <span className="text-xs text-foreground-neutral-subtle">{item.name}</span>
            )}
            <span className="text-xs text-foreground-neutral-base font-medium ml-auto tabular-nums">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
