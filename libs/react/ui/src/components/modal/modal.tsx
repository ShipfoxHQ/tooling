import * as DialogPrimitive from '@radix-ui/react-dialog';
import {cva} from 'class-variance-authority';
import {Button} from 'components/button';
import {Icon} from 'components/icon';
import {motion, type Transition} from 'framer-motion';
import {useMediaQuery} from 'hooks/useMediaQuery';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';
import {Drawer as VaulDrawer} from 'vaul';

const modalDefaultTransition: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

const modalOverlayVariants = cva(
  'fixed inset-0 z-40 bg-background-backdrop-backdrop data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
);

const modalContentVariants = cva(
  'fixed left-1/2 top-1/2 z-50 flex flex-col overflow-clip bg-background-neutral-base rounded-16 w-full max-w-[576px] -translate-x-1/2 -translate-y-1/2 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 shadow-tooltip',
);

function Modal({
  breakpoint = '(min-width: 768px)',
  ...props
}: ComponentProps<typeof DialogPrimitive.Root> & {breakpoint?: string}) {
  const isDesktop = useMediaQuery(breakpoint);

  if (isDesktop) {
    return <DialogPrimitive.Root {...props} />;
  }

  return <VaulDrawer.Root {...props} />;
}

function ModalTrigger({
  breakpoint = '(min-width: 768px)',
  ...props
}: ComponentProps<typeof DialogPrimitive.Trigger> & {breakpoint?: string}) {
  const isDesktop = useMediaQuery(breakpoint);

  if (isDesktop) {
    return <DialogPrimitive.Trigger {...props} />;
  }

  return <VaulDrawer.Trigger {...props} />;
}

function ModalPortal({
  breakpoint = '(min-width: 768px)',
  ...props
}: ComponentProps<typeof DialogPrimitive.Portal> & {breakpoint?: string}) {
  const isDesktop = useMediaQuery(breakpoint);

  if (isDesktop) {
    return <DialogPrimitive.Portal {...props} />;
  }

  return <VaulDrawer.Portal {...props} />;
}

function ModalClose({
  breakpoint = '(min-width: 768px)',
  ...props
}: ComponentProps<typeof DialogPrimitive.Close> & {breakpoint?: string}) {
  const isDesktop = useMediaQuery(breakpoint);

  if (isDesktop) {
    return <DialogPrimitive.Close {...props} />;
  }

  return <VaulDrawer.Close {...props} />;
}

type ModalOverlayProps = ComponentProps<typeof DialogPrimitive.Overlay> & {
  animated?: boolean;
  transition?: Transition;
  breakpoint?: string;
};

function ModalOverlay({
  className,
  animated = true,
  transition = modalDefaultTransition,
  breakpoint = '(min-width: 768px)',
  ...props
}: ModalOverlayProps) {
  const isDesktop = useMediaQuery(breakpoint);

  if (!isDesktop) {
    return <VaulDrawer.Overlay className={cn(modalOverlayVariants(), className)} {...props} />;
  }

  if (animated) {
    return (
      <DialogPrimitive.Overlay className={cn(modalOverlayVariants(), className)} asChild {...props}>
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={transition}
        />
      </DialogPrimitive.Overlay>
    );
  }

  return <DialogPrimitive.Overlay className={cn(modalOverlayVariants(), className)} {...props} />;
}

type ModalContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
  animated?: boolean;
  transition?: Transition;
  showClose?: boolean;
  breakpoint?: string;
};

function ModalContent({
  className,
  children,
  animated = true,
  transition = modalDefaultTransition,
  showClose = false,
  breakpoint = '(min-width: 768px)',
  ...props
}: ModalContentProps) {
  const isDesktop = useMediaQuery(breakpoint);

  if (!isDesktop) {
    return (
      <ModalPortal breakpoint={breakpoint}>
        <ModalOverlay animated={animated} transition={transition} breakpoint={breakpoint} />
        <VaulDrawer.Content
          className={cn(
            'fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background-neutral-base rounded-t-16 max-h-[85vh] shadow-tooltip',
            className,
          )}
          {...props}
        >
          <div className="relative w-full h-full flex flex-col min-h-0">
            <div className="pointer-events-none absolute inset-0 shadow-separator-inset rounded-t-16" />
            <div className="flex items-center justify-center pt-8 pb-8 shrink-0">
              <div className="bg-foreground-neutral-subtle w-32 h-4 rounded-full opacity-40" />
            </div>
            {children}
          </div>
        </VaulDrawer.Content>
      </ModalPortal>
    );
  }

  const baseClasses = cn(modalContentVariants(), className);

  return (
    <ModalPortal breakpoint={breakpoint}>
      <ModalOverlay animated={animated} transition={transition} breakpoint={breakpoint} />
      <DialogPrimitive.Content className={baseClasses} {...props}>
        <div className="relative size-full">
          <div className="pointer-events-none absolute inset-0 shadow-separator-inset rounded-16" />
          {children}
        </div>
      </DialogPrimitive.Content>
    </ModalPortal>
  );
}

type ModalHeaderProps = ComponentProps<'div'> & {
  title?: string;
  showEscIndicator?: boolean;
  showClose?: boolean;
  breakpoint?: string;
};

function ModalHeader({
  className,
  title,
  showEscIndicator = true,
  showClose = true,
  breakpoint = '(min-width: 768px)',
  children,
  ...props
}: ModalHeaderProps) {
  const isDesktop = useMediaQuery(breakpoint);

  return (
    <div className="flex flex-col w-full shrink-0" {...props}>
      <div className="bg-background-neutral-base flex items-center justify-center gap-20 overflow-clip px-24 py-16 w-full">
        {title ? (
          <p className="flex-1 font-medium text-lg leading-20 overflow-ellipsis overflow-hidden text-foreground-neutral-base whitespace-nowrap">
            {title}
          </p>
        ) : (
          <div className="flex-1">{children}</div>
        )}
        <div className="flex items-center gap-8">
          {isDesktop && showEscIndicator && (
            <kbd className="flex items-center justify-center rounded-8 border border-border-neutral-base shadow-button-neutral bg-background-field-base text-xs text-foreground-neutral-subtle px-4">
              esc
            </kbd>
          )}
          {showClose && (
            <ModalClose breakpoint={breakpoint} asChild>
              <Button
                variant="transparent"
                size="xs"
                className="rounded-4 p-2 cursor-pointer bg-transparent border-none text-foreground-neutral-muted hover:text-foreground-neutral-base hover:bg-background-components-hover transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-background-accent-blue-base focus-visible:ring-offset-2 w-24 h-24"
              >
                <Icon name="close" />
              </Button>
            </ModalClose>
          )}
        </div>
      </div>
      <div className="bg-border-neutral-strong h-[1px] w-full" />
    </div>
  );
}

function ModalBody({
  className,
  children,
  breakpoint = '(min-width: 768px)',
  ...props
}: ComponentProps<'div'> & {breakpoint?: string}) {
  const isDesktop = useMediaQuery(breakpoint);

  return (
    <div
      className={cn(
        'bg-background-neutral-base flex flex-col items-start px-24 pb-24 pt-16 w-full',
        isDesktop ? 'overflow-clip' : 'overflow-y-auto overflow-x-clip flex-1',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ModalFooter({className, children, ...props}: ComponentProps<'div'>) {
  return (
    <div className="flex flex-col w-full shrink-0" {...props}>
      <div className="bg-border-neutral-strong h-[1px] w-full" />
      <div className="bg-background-neutral-base flex items-end justify-end gap-20 overflow-clip px-24 py-16 w-full">
        <div className={cn('flex items-center gap-16', className)}>{children}</div>
      </div>
    </div>
  );
}

type ModalTitleProps = ComponentProps<typeof DialogPrimitive.Title> & {breakpoint?: string};

function ModalTitle({className, breakpoint = '(min-width: 768px)', ...props}: ModalTitleProps) {
  const isDesktop = useMediaQuery(breakpoint);

  const titleClassName = cn(
    'font-medium text-lg leading-20 overflow-ellipsis overflow-hidden text-foreground-neutral-base',
    className,
  );

  if (!isDesktop) {
    return <VaulDrawer.Title className={titleClassName} {...props} />;
  }

  return <DialogPrimitive.Title className={titleClassName} {...props} />;
}

type ModalDescriptionProps = ComponentProps<typeof DialogPrimitive.Description> & {
  breakpoint?: string;
};

function ModalDescription({
  className,
  breakpoint = '(min-width: 768px)',
  ...props
}: ModalDescriptionProps) {
  const isDesktop = useMediaQuery(breakpoint);

  const descClassName = cn('text-sm leading-20 text-foreground-neutral-subtle', className);

  if (!isDesktop) {
    return <VaulDrawer.Description className={descClassName} {...props} />;
  }

  return <DialogPrimitive.Description className={descClassName} {...props} />;
}

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  modalContentVariants,
  modalOverlayVariants,
  modalDefaultTransition,
};

export type {
  ModalContentProps,
  ModalHeaderProps,
  ModalOverlayProps,
  ModalTitleProps,
  ModalDescriptionProps,
};
