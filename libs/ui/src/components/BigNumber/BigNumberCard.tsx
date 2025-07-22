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
import {BigNumber, type BigNumberProps} from './BigNumber';

export interface BigNumberCardProps<T extends number | bigint> extends BigNumberProps<T> {
  title: string;
  description?: string;
  isLoading?: boolean;
  cardProps?: CardProps;
  cardHeaderActions?: ReactNode;
}

export function BigNumberCard<T extends number | bigint>({
  title,
  description,
  isLoading,
  cardProps,
  cardHeaderActions,
  ...props
}: BigNumberCardProps<T>) {
  return (
    <Card {...cardProps}>
      <CardHeader>
        <div className="flex flex-row">
          <div className="flex grow flex-col">
            <CardTitle>{title}</CardTitle>
            {description ? <CardDescription>{description}</CardDescription> : null}
          </div>
          {cardHeaderActions}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? <Skeleton className="h-8 w-full" /> : <BigNumber {...props} />}
      </CardContent>
    </Card>
  );
}
