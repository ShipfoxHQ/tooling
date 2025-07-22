import {type HTMLAttributes, createContext, forwardRef, useId} from 'react';
import {cn} from 'utils';

type FormItemContextValue = {
  id: string;
};

export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

export const FormItem = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({className, ...props}, ref) => {
    const id = useId();

    return (
      <FormItemContext.Provider value={{id}}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';
