import {Card} from 'components/card';
import {Skeleton} from 'components/skeleton';
import {Text} from 'components/typography';
import type {ComponentProps, ReactNode} from 'react';
import {cn} from 'utils/cn';

export type KpiVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'purple';

export interface KpiCardProps extends Omit<ComponentProps<'div'>, 'title'> {
  label: string;
  value: string | number | ReactNode;
  variant?: KpiVariant;
  isLoading?: boolean;
}

const variantDotStyles: Record<KpiVariant, string> = {
  neutral: 'bg-foreground-neutral-muted',
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
};

export function KpiCard({
  label,
  value,
  variant = 'neutral',
  isLoading,
  className,
  ...props
}: KpiCardProps) {
  return (
    <Card className={cn('flex flex-col gap-4 p-12 min-w-120 flex-1', className)} {...props}>
      <Text size="xs" className="text-foreground-neutral-subtle">
        {label}
      </Text>
      <div className="flex items-center gap-6">
        <span className={cn('shrink-0 size-8 rounded-2', variantDotStyles[variant])} />
        {isLoading ? (
          <Skeleton className="w-48 h-20 rounded-4" />
        ) : typeof value === 'string' || typeof value === 'number' ? (
          <Text size="sm" className="font-medium text-foreground-neutral-base">
            {value}
          </Text>
        ) : (
          <div className="text-sm font-medium text-foreground-neutral-base">{value}</div>
        )}
      </div>
    </Card>
  );
}

export interface KpiCardsGroupProps extends ComponentProps<'div'> {
  cards: KpiCardProps[];
}

export function KpiCardsGroup({cards, className, ...props}: KpiCardsGroupProps) {
  return (
    <div
      className={cn(
        'flex gap-12 md:gap-16 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth',
        className,
      )}
      {...props}
    >
      <div className="flex gap-16 pl-0 w-full">
        {cards.map((card, index) => {
          const {key: _key, ...cardProps} = card;
          return (
            <KpiCard
              key={`${card.label}-${index}`}
              {...cardProps}
              className={cn(
                'shrink-0 w-[calc((100vw-56px)/2)] snap-start md:flex-1 md:w-0',
                card.className,
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
