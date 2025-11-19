import {Slot} from '@radix-ui/react-slot';
import {Label} from 'components/label';
import type {ComponentProps} from 'react';
import * as React from 'react';
import type {ControllerProps, FieldPath, FieldValues} from 'react-hook-form';
import {Controller, FormProvider, useFormContext} from 'react-hook-form';
import {cn} from 'utils/cn';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

type FormItemContextValue = {
  id: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

const FormItemContext = React.createContext<FormItemContextValue | null>(null);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{name: props.name}}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const {getFieldState, formState} = useFormContext();

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  if (!itemContext) {
    throw new Error('useFormField should be used within <FormItem>');
  }

  const fieldState = getFieldState(fieldContext.name, formState);
  const {id} = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItem = React.forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({className, ...props}, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{id}}>
        <div ref={ref} className={className} {...props} />
      </FormItemContext.Provider>
    );
  },
);
FormItem.displayName = 'FormItem';

const FormLabel = React.forwardRef<React.ElementRef<typeof Label>, ComponentProps<typeof Label>>(
  ({className, ...props}, ref) => {
    const {error, formItemId} = useFormField();

    return (
      <Label
        ref={ref}
        className={cn(error && 'text-foreground-error', className)}
        htmlFor={formItemId}
        {...props}
      />
    );
  },
);
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, ComponentProps<typeof Slot>>(
  ({...props}, ref) => {
    const {error, formItemId, formDescriptionId, formMessageId} = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={error ? formMessageId : formDescriptionId}
        aria-invalid={!!error}
        {...props}
      />
    );
  },
);
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<HTMLParagraphElement, ComponentProps<'p'>>(
  ({className, ...props}, ref) => {
    const {error, formDescriptionId} = useFormField();

    if (error) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formDescriptionId}
        className={cn('text-sm text-foreground-neutral-muted', className)}
        {...props}
      />
    );
  },
);
FormDescription.displayName = 'FormDescription';

const FormMessage = React.forwardRef<HTMLParagraphElement, ComponentProps<'p'>>(
  ({className, children, ...props}, ref) => {
    const {error, formMessageId} = useFormField();
    const body = error ? String(error?.message ?? '') : children;

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn('text-sm font-medium text-foreground-highlight-error', className)}
        {...props}
      >
        {body}
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';

export {Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage};
