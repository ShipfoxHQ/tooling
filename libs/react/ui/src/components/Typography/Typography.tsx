import {type VariantProps, cva} from 'class-variance-authority';
import type {ElementType, HTMLAttributes, PropsWithChildren} from 'react';
import {cn} from 'utils';

export const typographyVariants = cva('', {
  variants: {
    variant: {
      text: 'leading-7',
      paragraph: 'leading-7 [&:not(:first-child)]:mt-6',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight font-display',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight font-display',
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl font-display',
      small: 'text-sm font-medium leading-none',
      large: 'text-lg font-semibold',
      muted: 'text-sm text-text-secondary',
      lead: 'text-xl text-text-secondary font-display',
      quote: 'mt-6 border-l-2 pl-6 italic',
      code: 'relative rounded-sm bg-surface px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

const components = {
  text: 'p',
  paragraph: 'p',
  h4: 'h4',
  h3: 'h3',
  h2: 'h2',
  h1: 'h1',
  small: 'small',
  large: 'div',
  muted: 'p',
  lead: 'p',
  quote: 'blockquote',
  code: 'code',
};

export type TypographyProps = PropsWithChildren<HTMLAttributes<HTMLParagraphElement>> &
  VariantProps<typeof typographyVariants> & {
    as?: ElementType;
  };

export function Typography({children, className, variant, as, ...props}: TypographyProps) {
  const Component = as ?? components[variant ?? 'text'] ?? 'p';
  return (
    <Component className={cn(typographyVariants({variant}), className)} {...props}>
      {children}
    </Component>
  );
}
