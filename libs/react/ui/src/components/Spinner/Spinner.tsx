import {Icon, type IconProps} from 'components/Icon';
import {cn} from 'utils';

type SpinnerProps = Partial<IconProps> & {
  size?: number;
};

export function Spinner(props?: SpinnerProps) {
  const {className, ...iconProps} = props || {};

  return <Icon icon="spinner" className={cn('h-12 w-12 animate-spin', className)} {...iconProps} />;
}
