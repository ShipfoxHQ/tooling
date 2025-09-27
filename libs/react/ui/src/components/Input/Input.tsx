import {Icon, type IconName} from 'components/Icon';
import {type InputHTMLAttributes, forwardRef} from 'react';
import {cn} from 'utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  startIcon?: IconName;
  endIcon?: IconName;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({className, type, startIcon, endIcon, ...props}, ref) => {
    return (
      <div className="relative w-full">
        <input
          type={type ?? 'text'}
          className={cn(
            'focus-visible:border-border-focus placeholder:text-muted flex h-9 w-full rounded-md border border-border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-border-hover focus-visible:shadow-focus focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
            {
              'pl-10': Boolean(startIcon),
              'pr-10': Boolean(endIcon),
            },
            className,
          )}
          ref={ref}
          {...props}
        />
        {startIcon && (
          <Icon
            icon={startIcon}
            className="absolute left-3 top-1/2 h-4 w-4 transform -translate-y-1/2"
          />
        )}
        {endIcon && (
          <Icon
            icon={endIcon}
            className="absolute right-3 top-1/2 h-4 w-4 transform -translate-y-1/2"
          />
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export {Input};
