import {Label} from 'components/label';
import type {ReactNode} from 'react';
import {cn} from 'utils/cn';
import {Checkbox, type CheckboxProps} from './checkbox';

export type CheckboxLink = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type CheckboxLinksProps = Omit<CheckboxProps, 'id'> & {
  id?: string;
  label: string;
  links: CheckboxLink[];
  separator?: ReactNode;
  className?: string;
  labelClassName?: string;
  linkClassName?: string;
};

export function CheckboxLinks({
  id,
  label,
  links,
  separator,
  className,
  labelClassName,
  linkClassName,
  ...checkboxProps
}: CheckboxLinksProps) {
  const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const defaultSeparator = (
    <span className="size-3 rounded-full bg-foreground-neutral-muted" aria-hidden="true" />
  );

  return (
    <div className={cn('flex gap-10 items-start', className)}>
      <span className="p-2">
        <Checkbox id={checkboxId} {...checkboxProps} />
      </span>
      <div className="flex flex-col gap-4 items-start flex-1">
        <Label
          htmlFor={checkboxId}
          className={cn(
            'text-sm leading-20 font-medium text-foreground-neutral-base',
            'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
            labelClassName,
          )}
        >
          {label}
        </Label>
        <div className="flex gap-6 items-center">
          {links.map((link, index) => (
            <div key={link.label} className="flex gap-6 items-center">
              {link.href ? (
                <a
                  href={link.href}
                  onClick={link.onClick}
                  className={cn(
                    'text-sm leading-20 font-medium text-foreground-highlight-interactive',
                    'hover:text-foreground-highlight-interactive-hover',
                    linkClassName,
                  )}
                >
                  {link.label}
                </a>
              ) : (
                <button
                  type="button"
                  onClick={link.onClick}
                  className={cn(
                    'text-sm leading-20 font-medium text-foreground-highlight-interactive',
                    'hover:text-foreground-highlight-interactive-hover',
                    linkClassName,
                  )}
                >
                  {link.label}
                </button>
              )}
              {index < links.length - 1 && (separator ?? defaultSeparator)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
