import {Icon} from 'components/icon';
import {Skeleton} from 'components/skeleton';
import {Text} from 'components/typography';

export function AnalyticsContent() {
  return (
    <div className="min-h-[calc(100vh-48px)] p-12 md:p-24 space-y-16 md:space-y-20 bg-background-neutral-base">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-12 md:gap-0">
        <Skeleton className="h-28 md:h-32 w-120 md:w-160" />
        <div className="flex items-center gap-8 md:gap-16">
          <Skeleton className="h-28 md:h-32 w-80 md:w-100" />
          <Skeleton className="h-28 md:h-32 w-100 md:w-160" />
        </div>
      </div>

      <div className="flex gap-12 md:gap-16 overflow-x-auto scrollbar pb-4 md:pb-0 -mx-12 px-12 md:mx-0 md:px-0">
        {['Total', 'Success', 'Failed', 'Neutral', 'Failure rate'].map((label) => (
          <div
            key={label}
            className="shrink-0 w-100 md:w-auto md:flex-1 p-12 rounded-8 bg-background-neutral-base border border-border-neutral-base"
          >
            <p className="text-xs text-foreground-neutral-subtle mb-4">{label}</p>
            <Skeleton className="h-20 w-40" />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-16 md:gap-20">
        <div className="flex-1 p-12 rounded-8 bg-background-neutral-base border border-border-neutral-base">
          <p className="text-sm font-medium text-foreground-neutral-base mb-12">
            Performance over time
          </p>
          <div className="h-120 md:h-160 flex items-center justify-center">
            <div className="text-center">
              <Icon
                name="fileChartLine"
                className="size-24 text-foreground-neutral-muted mx-auto mb-8"
              />
              <p className="text-sm text-foreground-neutral-subtle">Nothing here yet.</p>
            </div>
          </div>
        </div>
        <div className="flex-1 p-12 rounded-8 bg-background-neutral-base border border-border-neutral-base">
          <p className="text-sm font-medium text-foreground-neutral-base mb-12">
            Duration distribution
          </p>
          <div className="h-120 md:h-160 flex items-center justify-center">
            <div className="text-center">
              <Icon
                name="barChartBoxLine"
                className="size-24 text-foreground-neutral-muted mx-auto mb-8"
              />
              <p className="text-sm text-foreground-neutral-subtle">Nothing here yet.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-8 bg-background-neutral-base border border-border-neutral-base overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-12 gap-12 md:gap-0 border-b border-border-neutral-strong">
          <p className="text-sm font-medium text-foreground-neutral-base">Jobs breakdown</p>
          <div className="flex items-center gap-8 md:gap-16 w-full md:w-auto">
            <Skeleton className="h-28 flex-1 md:flex-none md:w-200" />
            <Skeleton className="h-28 w-28 shrink-0" />
          </div>
        </div>
        <div className="py-48 md:py-64 flex flex-col items-center justify-center gap-12">
          <div className="size-32 rounded-6 bg-transparent border border-border-neutral-strong flex items-center justify-center">
            <Icon
              name="shipfox"
              className="size-16 text-foreground-neutral-subtle"
              color="var(--foreground-neutral-subtle, #a1a1aa)"
            />
          </div>
          <div className="text-center space-y-4 px-16">
            <Text size="sm" className="text-foreground-neutral-base">
              No jobs yet
            </Text>
            <Text size="xs" className="text-foreground-neutral-muted">
              Import past runs or start a runner.
            </Text>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {Array.from({length: 3}).map((_, i) => {
          const blockId = `analytics-extra-block-${i}`;
          return (
            <div
              key={blockId}
              className="p-12 md:p-16 rounded-8 bg-background-subtle-base border border-border-neutral-strong"
            >
              <Skeleton className="h-16 w-full max-w-400 mb-8" />
              <Skeleton className="h-12 w-full max-w-600" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
