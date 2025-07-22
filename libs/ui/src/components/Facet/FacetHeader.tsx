import {CardHeader, type CardHeaderProps, CardTitle} from 'components/Card';
import {Icon} from 'components/Icon';
import {cn} from 'utils';

export interface FacetHeaderProps extends CardHeaderProps {
  name: string;
  isOpen: boolean;
}

export function FacetHeader({name, isOpen, className, ...props}: FacetHeaderProps) {
  return (
    <CardHeader
      className={cn([
        'flex cursor-pointer flex-row flex-nowrap items-center justify-start gap-2 space-y-0 hover:bg-surface-hover hover:text-gray-1000',
        className,
      ])}
      {...props}
    >
      <Icon icon="chevronDown" className={cn('h-4 w-4', {'-rotate-90': !isOpen})} />
      <CardTitle className="mt-0 min-w-0 grow overflow-hidden text-ellipsis text-nowrap text-left">
        {name}
      </CardTitle>
    </CardHeader>
  );
}
