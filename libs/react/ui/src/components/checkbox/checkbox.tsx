import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import {cva, type VariantProps} from 'class-variance-authority';
import {Icon} from 'components/icon';
import type {ComponentProps} from 'react';
import {useEffect, useState} from 'react';
import {cn} from 'utils/cn';

export const checkboxVariants = cva(
  'peer shrink-0 border-none transition-[background-color,box-shadow,opacity] outline-none',
  {
    variants: {
      size: {
        sm: 'size-16',
        md: 'size-20',
        lg: 'size-24',
      },
    },
    defaultVariants: {
      size: 'sm',
    },
  },
);

export type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants>;

export function Checkbox({
  className,
  size,
  checked,
  defaultChecked,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const [isIndeterminate, setIsIndeterminate] = useState(
    checked === 'indeterminate' || defaultChecked === 'indeterminate',
  );

  const handleCheckedChange = (newChecked: boolean | 'indeterminate') => {
    setIsIndeterminate(newChecked === 'indeterminate');
    onCheckedChange?.(newChecked);
  };

  useEffect(() => {
    setIsIndeterminate(checked === 'indeterminate' || defaultChecked === 'indeterminate');
  }, [checked, defaultChecked]);

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      className={cn(
        checkboxVariants({size}),
        // Unchecked state - default
        'rounded-4 bg-checkbox-unchecked-bg shadow-checkbox-unchecked',
        // Unchecked state - hover
        'hover:bg-checkbox-unchecked-bg-hover',
        // Unchecked state - focus
        'focus-visible:shadow-checkbox-unchecked-focus',
        // Checked state
        'data-[state=checked]:bg-checkbox-checked-bg data-[state=checked]:text-foreground-neutral-on-color data-[state=checked]:shadow-checkbox-checked',
        'data-[state=checked]:hover:bg-checkbox-checked-bg-hover',
        'data-[state=checked]:focus-visible:shadow-checkbox-checked-focus',
        // Indeterminate state
        'data-[state=indeterminate]:bg-checkbox-indeterminate-bg data-[state=indeterminate]:text-foreground-neutral-on-color data-[state=indeterminate]:shadow-checkbox-indeterminate',
        'data-[state=indeterminate]:hover:bg-checkbox-indeterminate-bg-hover',
        'data-[state=indeterminate]:focus-visible:shadow-checkbox-indeterminate-focus',
        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {isIndeterminate ? (
          <Icon name="subtractLine" className="size-16" aria-hidden="true" />
        ) : (
          <Icon name="check" className="size-16" aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
