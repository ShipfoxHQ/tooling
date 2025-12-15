import {Slot} from '@radix-ui/react-slot';
import {Icon} from 'components/icon/icon';
import {ShinyText} from 'components/shiny-text';
import {Text} from 'components/typography';
import type {ComponentProps, HTMLAttributes, ReactNode} from 'react';
import {ShipfoxLoader} from 'shipfox-loader-react';
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
      <ShipfoxLoader size={20} animation="circular" color="white" background="dark" />
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
      <CodeBlockFooterIcon className="text-tag-success-icon">{defaultIcon}</CodeBlockFooterIcon>
      {(message || description) && (
        <CodeBlockFooterContent>
          {message && (
            <CodeBlockFooterMessage>
              {state === 'running' && typeof message === 'string' ? (
                <ShinyText text={message} speed={3} />
              ) : (
                message
              )}
            </CodeBlockFooterMessage>
          )}
          {description && <CodeBlockFooterDescription>{description}</CodeBlockFooterDescription>}
        </CodeBlockFooterContent>
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
      className={cn('flex flex-col items-start justify-center gap-0 min-w-0 flex-1', className)}
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
  if (asChild) {
    return (
      <Slot
        data-slot="code-block-footer-message"
        className={cn('overflow-hidden text-ellipsis whitespace-nowrap text-xs', className)}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <Text
      data-slot="code-block-footer-message"
      size="xs"
      className={cn('overflow-hidden text-ellipsis whitespace-nowrap', className)}
      {...props}
    >
      {children}
    </Text>
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
  if (asChild) {
    return (
      <Slot
        data-slot="code-block-footer-description"
        className={cn('text-xs text-foreground-neutral-subtle', className)}
        {...props}
      >
        {children}
      </Slot>
    );
  }

  return (
    <Text
      data-slot="code-block-footer-description"
      size="xs"
      className={cn('text-foreground-neutral-subtle', className)}
      {...props}
    >
      {children}
    </Text>
  );
}
