import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  type CardProps,
  CardTitle,
} from 'components/Card';
import {Skeleton} from 'components/Skeleton';
import type {ReactNode} from 'react';
import {cn} from 'utils';
import {XYChart, type XYChartProps} from './XYChart';

export interface XYChartCardProps extends XYChartProps {
  title?: string;
  description?: string;
  isLoading?: boolean;
  cardProps?: Partial<CardProps>;
  cardHeaderActions?: ReactNode;
}

export function XYChartCard({
  title,
  description,
  isLoading,
  cardProps,
  cardHeaderActions,
  ...props
}: XYChartCardProps) {
  const {className, ...cardRest} = cardProps ?? {};
  return (
    <Card className={cn('flex h-48 w-full flex-col', className)} {...cardRest}>
      <CardHeader>
        <div className="flex flex-row">
          <div className="flex grow flex-col">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {cardHeaderActions}
        </div>
      </CardHeader>
      <CardContent className="h-full w-full grow">
        {isLoading ? <Skeleton className="h-full w-full" /> : <XYChart {...props} />}
      </CardContent>
    </Card>
  );
}
