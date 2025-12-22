import {Button} from 'components/button';
import {Icon, type IconName} from 'components/icon';
import {cn} from 'utils/cn';

export function TopbarButton({
  className,
  icon,
  label,
}: {
  className?: string;
  icon: IconName;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="transparent"
      className={cn(
        'flex items-center justify-center overflow-hidden shrink-0 w-40 h-40 bg-background-subtle-base hover:bg-background-neutral-hover transition-colors rounded-none border-l border-border-neutral-strong',
        className,
      )}
      aria-label={label ?? undefined}
    >
      <Icon name={icon} className="size-18 text-foreground-neutral-subtle" />
    </Button>
  );
}
