import {Card} from 'components/card';
import {Skeleton} from 'components/skeleton';
import {Text} from 'components/typography';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

export type KpiVariant = 'neutral' | 'success' | 'warning' | 'error' | 'info';

export interface KpiCardProps extends Omit<ComponentProps<'div'>, 'title'> {
  label: string;
  value: string | number;
  variant?: KpiVariant;
  isLoading?: boolean;
}

const variantDotStyles: Record<KpiVariant, string> = {
  neutral: 'bg-foreground-neutral-muted',
  success: 'bg-green-500',
  warning: 'bg-orange-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
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
        ) : (
          <Text size="sm" className="font-medium text-foreground-neutral-base">
            {value}
          </Text>
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
        // Base layout
        'flex gap-12 md:gap-16',
        // Mobile: Swipeable with scroll-snap
        'overflow-x-auto pb-4 md:pb-0',
        // Scroll snap for smooth swiping
        'snap-x snap-mandatory',
        // Hide scrollbar but allow scrolling
        '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
        // Smooth scrolling
        'scroll-smooth',
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
                // Mobile: Show ~2 cards per view with peek of next
                'shrink-0 w-[calc((100vw-56px)/2)] snap-start',
                // Desktop: Flex grow
                'md:flex-1 md:w-0',
                card.className,
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

export interface SelectorConfig {
  display?: {
    label?: string;
    hidden?: boolean;
    format?: unknown;
  };
  [key: string]: unknown;
}

export interface KpiCardsGroupFromQueryConfig<TSelectorConfig extends SelectorConfig, TResult> {
  /**
   * Record of selector configurations
   * Keys are the selector IDs, values are the config objects
   */
  selectors: Record<string, TSelectorConfig>;
  /**
   * The result data (single row expected)
   */
  result?: TResult | null;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Function to extract the raw value from result for a given key
   */
  extractValue: (key: string, result: TResult) => string | number | bigint | undefined;
  /**
   * Function to format the raw value for display
   */
  formatValue: (key: string, config: TSelectorConfig, rawValue: string | number | bigint) => string;
  /**
   * Function to get the label for a given key and config
   */
  getLabel: (key: string, config: TSelectorConfig) => string;
  /**
   * Function to determine the variant for a given key
   */
  getVariant?: (key: string) => KpiVariant;
  /**
   * Additional props to pass to each KpiCard
   */
  cardProps?: Partial<KpiCardProps>;
}

export interface KpiCardsGroupFromQueryProps<TSelectorConfig extends SelectorConfig, TResult>
  extends ComponentProps<'div'>,
    KpiCardsGroupFromQueryConfig<TSelectorConfig, TResult> {}

export function KpiCardsGroupFromQuery<TSelectorConfig extends SelectorConfig, TResult>({
  selectors,
  result,
  isLoading = false,
  extractValue,
  formatValue,
  getLabel,
  getVariant,
  cardProps,
  className,
  ...props
}: KpiCardsGroupFromQueryProps<TSelectorConfig, TResult>) {
  const cards: KpiCardProps[] = Object.entries(selectors)
    .filter(([, config]) => !config.display?.hidden)
    .map(([key, config]) => {
      const rawValue = result ? extractValue(key, result) : undefined;
      const formattedValue = rawValue !== undefined ? formatValue(key, config, rawValue) : '-';
      return {
        label: getLabel(key, config),
        value: formattedValue,
        variant: getVariant ? getVariant(key) : 'neutral',
        isLoading,
        ...cardProps,
      } as KpiCardProps;
    });

  return <KpiCardsGroup cards={cards} className={className} {...props} />;
}

export const defaultKpiCards: KpiCardProps[] = [
  {label: 'Total', value: '1211', variant: 'neutral'},
  {label: 'Success', value: '1200', variant: 'success'},
  {label: 'Neutral', value: '11', variant: 'neutral'},
  {label: 'Failure rate', value: '0%', variant: 'success'},
];
