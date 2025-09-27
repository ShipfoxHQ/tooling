import {Typography} from 'components/Typography';
import type {HTMLAttributes, ReactNode} from 'react';
import {cn} from 'utils';

export interface ContentPageProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  contentClassName?: string;
  headerActions?: ReactNode;
  headerProps?: HTMLAttributes<HTMLDivElement>;
}

export function ContentPage({
  children,
  className,
  title,
  subtitle,
  contentClassName,
  headerActions,
  headerProps,
  ...props
}: ContentPageProps) {
  const {className: headerPropsClassName, ...headerPropsRest} = headerProps ?? {};
  return (
    <div className={cn('', className)} {...props}>
      <header
        className={cn(
          'fixed left-48 right-0 top-0 z-40 flex flex-row items-center justify-between border-b border-border bg-background-secondary p-2',
          headerPropsClassName,
        )}
        {...headerPropsRest}
      >
        <div>
          <Typography variant="h3" as="h1">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="small" className="text-text-secondary">
              {subtitle}
            </Typography>
          )}
        </div>
        <div className="flex flex-row gap-2">{headerActions}</div>
      </header>
      <div className="h-[53px]" />
      <div className={cn('flex flex-col gap-4 p-4', contentClassName)}>{children}</div>
    </div>
  );
}
