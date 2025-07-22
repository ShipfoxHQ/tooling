import {Slot, Slottable} from '@radix-ui/react-slot';
import {type VariantProps, cva} from 'class-variance-authority';
import {Icon, type IconName} from 'components/Icon';
import {Spinner} from 'components/Spinner';
import {forwardRef} from 'react';
import {cn} from 'utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50 flex flex-row gap-2 items-center',
  {
    variants: {
      variant: {
        primary: 'bg-gray-1000 text-background-100 shadow-sm hover:bg-gray-900',
        destructive: 'bg-red-800 text-text-contrast shadow-xs hover:bg-red-900',
        outline:
          'border border-gray-alpha-400 bg-background shadow-xs hover:bg-gray-alpha-200 hover:text-gray-1000',
        secondary: 'bg-amber-800 text-text-contrast shadow-xs hover:bg-amber-900',
        ghost: 'hover:bg-gray-alpha-200 hover:text-gray-1000',
        link: 'underline-offset-4 hover:underline hover:text-gray-1000',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  iconClassName?: string;
  asChild?: boolean;
  loading?: boolean;
  icon?: IconName;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {className, iconClassName, variant, size, asChild = false, loading, children, icon, ...props},
    ref,
  ) => {
    const rootCn = cn(buttonVariants({variant, size, className}), className);
    const iconCn = cn('h-4 w-4', {'animate-spin': loading});

    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={rootCn} ref={ref} {...props}>
        {loading && <Spinner className={iconCn} />}
        {!loading && icon && <Icon icon={icon} className={iconCn} />}
        <Slottable>{children}</Slottable>
      </Comp>
    );
  },
);
Button.displayName = 'Button';
