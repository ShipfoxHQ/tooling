import {Alert, AlertClose, AlertContent, AlertDescription, AlertTitle} from 'components/alert';

export interface DashboardAlertProps {
  title?: string;
  description?: string;
  onDismiss?: () => void;
  className?: string;
}

export function DashboardAlert({
  title = 'Ship faster. At half the cost.',
  description = 'Track every workflow in one place, with full visibility into performance and reliability.',
  onDismiss,
  className,
}: DashboardAlertProps) {
  return (
    <Alert variant="info" onOpenChange={(open) => !open && onDismiss?.()} className={className}>
      <AlertContent>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </AlertContent>
      <AlertClose />
    </Alert>
  );
}
