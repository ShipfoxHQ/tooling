import {Icon, type IconName} from 'components/Icon';
import {forwardRef} from 'react';
import {cn} from 'utils';
import {Button, type ButtonProps} from './Button';

export interface IconButtonProps extends ButtonProps {
  icon: IconName;
  srText: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({icon, srText, className, ...props}, ref) => {
    return (
      <Button className={cn(['px-3', className])} ref={ref} {...props}>
        <Icon icon={icon} />
        <span className="sr-only">{srText}</span>
      </Button>
    );
  },
);
IconButton.displayName = 'IconButton';
