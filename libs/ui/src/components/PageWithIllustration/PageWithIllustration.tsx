import {Typography} from 'components/Typography';
import type {HTMLAttributes} from 'react';
import {cn} from 'utils';
import landscapeUrl from '../../../src/illustrations/landscape_1.svg';

export interface PageWithIllustrationProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
}

export function PageWithIllustration({
  title,
  subtitle,
  children,
  className,
  ...props
}: PageWithIllustrationProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2', className)} {...props}>
      <img
        className="hidden h-screen w-full object-cover md:block"
        src={landscapeUrl}
        alt="Abstract illustration background"
      />

      <div className="flex flex-col gap-8 p-8">
        <div>
          <Typography variant="h3">{title}</Typography>
          {subtitle && <Typography variant="muted">{subtitle}</Typography>}
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
