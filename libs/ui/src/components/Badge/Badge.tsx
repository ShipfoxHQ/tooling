import {type VariantProps, cva} from 'class-variance-authority';
import {cn} from 'utils';

export const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold text-text-contrast inline-flex shadow',
  {
    variants: {
      variant: {
        gray: 'bg-gray-700',
        blue: 'bg-blue-700',
        purple: 'bg-purple-700',
        amber: 'bg-amber-700',
        red: 'bg-red-700',
        pink: 'bg-pink-700',
        green: 'bg-green-700',
        teal: 'bg-teal-700',
        success: 'bg-status-success',
        failed: 'bg-status-failed',
        warning: 'bg-status-warning',
        inverted: 'bg-gray-1000 text-gray-100',
        'gray-subtle': 'bg-gray-200 text-gray-1000',
        'blue-subtle': 'bg-blue-200 text-blue-1000',
        'purple-subtle': 'bg-purple-200 text-purple-1000',
        'amber-subtle': 'bg-amber-200 text-amber-1000',
        'red-subtle': 'bg-red-200 text-red-1000',
        'pink-subtle': 'bg-pink-200 text-pink-1000',
        'green-subtle': 'bg-green-200 text-green-1000',
        'teal-subtle': 'bg-teal-200 text-teal-1000',
      },
    },
    defaultVariants: {
      variant: 'gray',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({className, variant, ...props}: BadgeProps) {
  return <span className={cn(badgeVariants({variant}), className)} {...props} />;
}
