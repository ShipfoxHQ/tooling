import {Slot} from '@radix-ui/react-slot';
import {cva, type VariantProps} from 'class-variance-authority';
import type {ComponentProps} from 'react';
import {cn} from 'utils/cn';

const buttonGroupVariants = cva(
  [
    'flex w-fit items-stretch',
    // Apply shadow to the group container instead of individual children
    'rounded-6 shadow-button-neutral',
    // Focus management
    '[&>*]:focus-visible:z-10 [&>*]:focus-visible:relative',
    // Select trigger sizing
    "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
    // Input flex
    '[&>input]:flex-1',
    // Nested button groups
    'has-[>[data-slot=button-group]]:gap-8',
    // Remove shadows from all children to prevent inner shadow artifacts
    '[&>*]:shadow-none',
  ],
  {
    variants: {
      orientation: {
        horizontal: [
          // Remove left border-radius and left border from all but first child
          '[&>*:not(:first-child)]:rounded-l-none',
          '[&>*:not(:first-child)]:border-l-0',
          // Remove right border-radius from all but last child
          '[&>*:not(:last-child)]:rounded-r-none',
        ],
        vertical: [
          'flex-col',
          // Remove top border-radius and top border from all but first child
          '[&>*:not(:first-child)]:rounded-t-none',
          '[&>*:not(:first-child)]:border-t-0',
          // Remove bottom border-radius from all but last child
          '[&>*:not(:last-child)]:rounded-b-none',
        ],
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  },
);

type ButtonGroupProps = ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>;

function ButtonGroup({className, orientation, ...props}: ButtonGroupProps) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: role="group" is semantically correct for button groups
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({orientation}), className)}
      {...props}
    />
  );
}

type ButtonGroupTextProps = ComponentProps<'div'> & {
  asChild?: boolean;
};

function ButtonGroupText({className, asChild = false, ...props}: ButtonGroupTextProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="button-group-text"
      className={cn(
        'flex items-center gap-8 rounded-6 px-12',
        'bg-background-field-base text-foreground-neutral-subtle',
        'text-sm leading-20 font-medium',
        'shadow-button-neutral',
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-16",
        className,
      )}
      {...props}
    />
  );
}

type ButtonGroupSeparatorProps = ComponentProps<'div'> & {
  orientation?: 'horizontal' | 'vertical';
};

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: ButtonGroupSeparatorProps) {
  return (
    <div
      aria-hidden="true"
      data-slot="button-group-separator"
      data-orientation={orientation}
      className={cn(
        'shrink-0 self-stretch',
        'bg-border-neutral-strong',
        orientation === 'vertical' ? 'h-auto w-px' : 'h-px w-auto',
        className,
      )}
      {...props}
    />
  );
}

export {ButtonGroup, ButtonGroupSeparator, ButtonGroupText, buttonGroupVariants};
