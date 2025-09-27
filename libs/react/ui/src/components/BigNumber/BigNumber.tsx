import {type VariantProps, cva} from 'class-variance-authority';
import {Typography} from 'components/Typography';
import type {HTMLAttributes, ReactNode} from 'react';
import {cn, formatNumberCompact} from 'utils';

export const bigNumberVariants = cva('', {
  variants: {
    status: {
      success: 'text-green-800',
      warning: 'text-amber-800',
      error: 'text-red-800',
    },
  },
});

type Status = VariantProps<typeof bigNumberVariants>['status'];

export interface BigNumberProps<T extends number | bigint> extends HTMLAttributes<HTMLDivElement> {
  value?: T;
  format?: (value: T) => ReactNode;
  status?: Status;
  secondaryValue?: number;
  secondaryFormat?: (value: number) => ReactNode;
  secondaryStatus?: Status;
}

export function BigNumber<T extends number | bigint>({
  value,
  format,
  status,
  secondaryValue,
  secondaryFormat,
  secondaryStatus,
  className,
  ...props
}: BigNumberProps<T>) {
  const formatValue = format ?? formatNumberCompact;
  const secondaryFormatValue = secondaryFormat ?? formatNumberCompact;
  return (
    <div className={cn('flex flex-row items-end gap-2', className)} {...props}>
      <Typography variant="large" className={cn([{[bigNumberVariants({status})]: status}])}>
        {typeof value === 'number' || typeof value === 'bigint' ? formatValue(value) : null}
      </Typography>
      {typeof secondaryValue === 'number' ? (
        <Typography
          variant="small"
          className={cn([{[bigNumberVariants({status: secondaryStatus})]: secondaryStatus}])}
        >
          {secondaryFormatValue(secondaryValue)}
        </Typography>
      ) : null}
    </div>
  );
}
