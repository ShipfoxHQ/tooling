import {type HTMLAttributes, forwardRef} from 'react';
import {cn} from '../../utils/cn';

export const TableCaption = forwardRef<
  HTMLTableCaptionElement,
  HTMLAttributes<HTMLTableCaptionElement>
>(({className, ...props}, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-text-secondary', className)} {...props} />
));
TableCaption.displayName = 'TableCaption';
