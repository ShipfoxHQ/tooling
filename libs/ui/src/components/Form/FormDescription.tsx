import {type HTMLAttributes, forwardRef} from 'react';
import {cn} from 'utils';
import {useFormField} from './FormField';

export const FormDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({className, ...props}, ref) => {
  const {formDescriptionId} = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-[0.8rem] text-text-secondary', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';
