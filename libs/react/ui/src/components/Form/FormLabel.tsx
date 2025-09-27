import type * as LabelPrimitive from '@radix-ui/react-label';
import {type ComponentPropsWithoutRef, type ElementRef, forwardRef} from 'react';
import {cn} from 'utils';
import {Label} from '../Label';
import {useFormField} from './FormField';

export const FormLabel = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({className, ...props}, ref) => {
  const {error, formItemId} = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-red-800', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';
