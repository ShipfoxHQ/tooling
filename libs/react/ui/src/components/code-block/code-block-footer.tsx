import {Slot} from '@radix-ui/react-slot';
import {Icon} from 'components/icon/icon';
import type {ComponentProps, HTMLAttributes, ReactNode} from 'react';
import {cn} from 'utils/cn';

export type CodeBlockFooterProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  state?: 'running' | 'done';
  message?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
};

export function CodeBlockFooter({
  className,
  asChild = false,
  state = 'running',
  message,
  description,
  icon,
  children,
  ...props
}: CodeBlockFooterProps) {
  const Comp = asChild ? Slot : 'div';

  const defaultIcon =
    icon ??
    (state === 'running' ? (
      <Icon name="shipfox" className="size-20" aria-hidden="true" />
    ) : (
      <Icon
        name="checkCircleSolid"
        className="size-20 text-foreground-neutral-base"
        aria-hidden="true"
      />
    ));

  if (asChild || children) {
    return (
      <Comp
        data-slot="code-block-footer"
        className={cn('flex w-full items-center justify-start gap-12 px-16 py-12', className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      data-slot="code-block-footer"
      className={cn('flex w-full items-center justify-start gap-12 px-16 py-12', className)}
      {...props}
    >
      <div className="flex shrink-0 items-center justify-center size-20 text-tag-success-icon">
        {defaultIcon}
      </div>
      {(message || description) && (
        <div className="flex flex-col items-start justify-center gap-0">
          {message && (
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-20 text-foreground-neutral-base">
              {message}
            </div>
          )}
          {description && (
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-20 text-foreground-neutral-subtle">
              {description}
            </div>
          )}
        </div>
      )}
    </Comp>
  );
}

export type CodeBlockFooterIconProps = ComponentProps<'div'> & {
  asChild?: boolean;
};

export function CodeBlockFooterIcon({
  className,
  asChild = false,
  children,
  ...props
}: CodeBlockFooterIconProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="code-block-footer-icon"
      className={cn('flex shrink-0 items-center justify-center size-20', className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export type CodeBlockFooterContentProps = ComponentProps<'div'> & {
  asChild?: boolean;
};

export function CodeBlockFooterContent({
  className,
  asChild = false,
  children,
  ...props
}: CodeBlockFooterContentProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="code-block-footer-content"
      className={cn('flex flex-col items-start justify-center gap-0', className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export type CodeBlockFooterMessageProps = ComponentProps<'div'> & {
  asChild?: boolean;
};

export function CodeBlockFooterMessage({
  className,
  asChild = false,
  children,
  ...props
}: CodeBlockFooterMessageProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="code-block-footer-message"
      className={cn(
        'overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-20 text-foreground-neutral-base',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export type CodeBlockFooterDescriptionProps = ComponentProps<'div'> & {
  asChild?: boolean;
};

export function CodeBlockFooterDescription({
  className,
  asChild = false,
  children,
  ...props
}: CodeBlockFooterDescriptionProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="code-block-footer-description"
      className={cn(
        'overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-20 text-foreground-neutral-subtle',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
