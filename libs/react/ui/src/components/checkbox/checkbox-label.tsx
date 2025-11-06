import {cn} from 'utils/cn';
import {Icon} from '../icon/icon';
import {Label} from '../label/label';
import {Checkbox, type CheckboxProps} from './checkbox';

export type CheckboxLabelProps = Omit<CheckboxProps, 'id'> & {
  id?: string;
  label: string;
  optional?: boolean;
  description?: string;
  showInfoIcon?: boolean;
  border?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
};

export function CheckboxLabel({
  id,
  label,
  optional = false,
  description,
  showInfoIcon = false,
  border = false,
  className,
  labelClassName,
  descriptionClassName,
  ...checkboxProps
}: CheckboxLabelProps) {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const isDisabled = checkboxProps.disabled ?? false;

  if (border) {
    return (
      <Label
        htmlFor={checkboxId}
        className={cn(
          // Base container styles with border
          'flex items-start gap-10 rounded-8 p-8 transition-colors',
          // Unchecked state - default
          'bg-checkbox-unchecked-bg shadow-checkbox-unchecked',
          // Unchecked state - hover
          'hover:bg-checkbox-unchecked-bg-hover',
          // Unchecked state - focus
          'has-data-[state=unchecked]:focus-visible:shadow-border-interactive-with-active',
          // Checked state - default
          'has-data-[state=checked]:bg-background-neutral-base has-data-[state=checked]:shadow-checkbox-checked',
          // Checked state - hover
          'has-data-[state=checked]:hover:bg-background-neutral-hover',
          // Checked state - focus
          'has-data-[state=checked]:focus-visible:shadow-checkbox-checked-focus',
          // Indeterminate state - default
          'has-data-[state=indeterminate]:bg-background-neutral-base has-data-[state=indeterminate]:shadow-checkbox-indeterminate',
          // Indeterminate state - hover
          'has-data-[state=indeterminate]:hover:bg-background-neutral-hover',
          // Indeterminate state - focus
          'has-data-[state=indeterminate]:focus-visible:shadow-checkbox-indeterminate-focus',
          // Disabled state
          isDisabled && 'opacity-50 cursor-not-allowed',
          !isDisabled && 'cursor-pointer',
          className,
        )}
      >
        <span className="p-4">
          <Checkbox id={checkboxId} disabled={isDisabled} {...checkboxProps} />
        </span>
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <div className="flex gap-4 items-center">
            <p
              className={cn(
                'text-sm leading-20 overflow-hidden text-ellipsis whitespace-nowrap',
                isDisabled
                  ? 'font-normal text-foreground-neutral-subtle'
                  : 'font-medium text-foreground-neutral-base',
                labelClassName,
              )}
            >
              {label}
            </p>
            {optional && (
              <span className="text-sm leading-20 font-regular text-foreground-neutral-muted whitespace-nowrap">
                (Optional)
              </span>
            )}
            {showInfoIcon && (
              <Icon
                name="info"
                className="size-16 text-foreground-neutral-muted shrink-0"
                aria-hidden="true"
              />
            )}
          </div>
          {description && (
            <p
              className={cn(
                'text-sm leading-20',
                isDisabled ? 'text-foreground-neutral-disabled' : 'text-foreground-neutral-subtle',
                descriptionClassName,
              )}
            >
              {description}
            </p>
          )}
        </div>
      </Label>
    );
  }

  // Without border variant
  return (
    <div className={cn('flex items-start gap-10', className)}>
      <span className="p-2">
        <Checkbox id={checkboxId} disabled={isDisabled} {...checkboxProps} />
      </span>
      <div className="flex flex-col gap-4 flex-1 min-w-0">
        <div className="flex gap-4 items-center">
          <p
            className={cn(
              'text-sm leading-20 overflow-hidden text-ellipsis whitespace-nowrap',
              isDisabled
                ? 'font-normal text-foreground-neutral-subtle'
                : 'font-medium text-foreground-neutral-base',
              labelClassName,
            )}
          >
            {label}
          </p>
          {optional && (
            <span className="text-sm leading-20 font-regular text-foreground-neutral-muted whitespace-nowrap">
              (Optional)
            </span>
          )}
          {showInfoIcon && (
            <Icon
              name="info"
              className="size-16 text-foreground-neutral-muted shrink-0"
              aria-hidden="true"
            />
          )}
        </div>
        {description && (
          <p
            className={cn(
              'text-sm leading-20',
              isDisabled ? 'text-foreground-neutral-disabled' : 'text-foreground-neutral-subtle',
              descriptionClassName,
            )}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
