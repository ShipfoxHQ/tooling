import {
  Alert,
  AlertAction,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  type AlertProps,
  AlertTitle,
} from 'components/alert';
import type {ReactNode} from 'react';

export interface DashboardAlertProps extends AlertProps {
  title?: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
  variant?: 'info' | 'warning';
  primaryAction?: {
    label: string | ReactNode;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string | ReactNode;
    onClick: () => void;
  };
}

export function DashboardAlert({
  title,
  description,
  onDismiss,
  className,
  variant = 'info',
  primaryAction,
  secondaryAction,
  ...props
}: DashboardAlertProps) {
  return (
    <Alert
      variant={variant}
      onOpenChange={(open: boolean) => !open && onDismiss?.()}
      className={className}
      {...props}
    >
      <AlertContent>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <AlertActions>
          {primaryAction && (
            <AlertAction onClick={primaryAction.onClick}>{primaryAction.label}</AlertAction>
          )}
          {secondaryAction && (
            <AlertAction onClick={secondaryAction.onClick}>{secondaryAction.label}</AlertAction>
          )}
        </AlertActions>
      </AlertContent>
      <AlertClose />
    </Alert>
  );
}
