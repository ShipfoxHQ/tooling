import {Text} from 'components/typography';
import {cn} from 'utils/cn';

export type KpiVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface KpiCardProps {
  label: string;
  value: string | number;
  variant?: KpiVariant;
  className?: string;
}

const variantDotStyles: Record<KpiVariant, string> = {
  neutral: 'bg-foreground-neutral-muted',
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
};

export function KpiCard({label, value, variant = 'neutral', className}: KpiCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 p-12 rounded-8',
        'bg-background-neutral-base border border-border-neutral-base',
        'min-w-120 flex-1',
        className,
      )}
    >
      <p className="text-xs text-foreground-neutral-subtle">{label}</p>
      <div className="flex items-center gap-6">
        <span className={cn('size-8 rounded-2 shrink-0', variantDotStyles[variant])} />
        <Text size="sm" className="font-medium text-foreground-neutral-base">
          {value}
        </Text>
      </div>
    </div>
  );
}

export interface KpiCardsGroupProps {
  cards: KpiCardProps[];
  className?: string;
}

export function KpiCardsGroup({cards, className}: KpiCardsGroupProps) {
  return (
    <div
      className={cn(
        // Base layout
        'flex gap-12 md:gap-16',
        // Mobile: Swipeable with scroll-snap
        'overflow-x-auto scrollbar-none pb-4 md:pb-0',
        // Scroll snap for smooth swiping
        'snap-x snap-mandatory',
        // Hide scrollbar but allow scrolling
        '[&::-webkit-scrollbar]:hidden',
        // Smooth scrolling
        'scroll-smooth',
        className,
      )}
    >
      <div className="flex gap-16 pl-12 md:pl-0 md:w-full">
        {cards.map((card) => (
          <KpiCard
            key={card.label}
            {...card}
            className={cn(
              // Mobile: Show ~2 cards per view with peek of next
              'shrink-0 w-[calc((100vw-56px)/2)] md:w-auto',
              'snap-start',
              // Desktop: Flex grow
              'md:flex-1',
            )}
          />
        ))}
      </div>
    </div>
  );
}

export const defaultKpiCards: KpiCardProps[] = [
  {label: 'Total', value: '1211', variant: 'neutral'},
  {label: 'Success', value: '1200', variant: 'success'},
  {label: 'Neutral', value: '11', variant: 'neutral'},
  {label: 'Failure rate', value: '0%', variant: 'success'},
];
