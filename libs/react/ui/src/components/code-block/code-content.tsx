import type {HTMLAttributes} from 'react';
import {cn} from 'utils/cn';

type CodeContentProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  highlightedCode?: string;
  isLoading: boolean;
  syntaxHighlighting: boolean;
  lineNumbers?: boolean;
};

export function CodeContent({
  code,
  highlightedCode,
  isLoading,
  syntaxHighlighting,
  lineNumbers = false,
  className,
  ...props
}: CodeContentProps) {
  const shouldShowHighlighted = syntaxHighlighting && !isLoading && highlightedCode;

  if (shouldShowHighlighted) {
    return (
      <div
        className={cn(
          'shiki-override w-full overflow-x-auto font-code [&_pre]:m-0 [&_pre]:p-0 [&_pre]:bg-transparent [&_pre]:font-code [&_code]:font-code [&_code]:bg-transparent [&_code]:text-xs [&_code]:leading-20 [&_code]:text-foreground-neutral-base',
          lineNumbers &&
            '[&_code]:grid [&_code]:[counter-reset:line] [&_code]:[counter-increment:line_0] [&_.line]:before:content-[counter(line)] [&_.line]:before:inline-block [&_.line]:before:[counter-increment:line] [&_.line]:before:w-16 [&_.line]:before:mr-16 [&_.line]:before:text-xs [&_.line]:before:text-right [&_.line]:before:text-foreground-neutral-subtle [&_.line]:before:font-code [&_.line]:before:select-none',
          '[&_.line]:px-12 [&_.line]:w-full [&_.line]:relative [&_.line]:font-code',
          className,
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki outputs HTML for syntax highlighting
        dangerouslySetInnerHTML={{__html: highlightedCode}}
        {...props}
      />
    );
  }

  const lines = lineNumbers ? code.split('\n') : null;

  return (
    <pre
      className={cn('m-0 p-0 bg-transparent font-code', className)}
      {...(props as HTMLAttributes<HTMLPreElement>)}
    >
      <code
        className={cn(
          'w-full overflow-x-auto bg-transparent font-code text-xs leading-20 text-foreground-neutral-base',
          lineNumbers &&
            'grid [counter-reset:line] [counter-increment:line_0] [&_.line]:before:content-[counter(line)] [&_.line]:before:inline-block [&_.line]:before:[counter-increment:line] [&_.line]:before:w-16 [&_.line]:before:mr-16 [&_.line]:before:text-xs [&_.line]:before:text-right [&_.line]:before:text-foreground-neutral-subtle [&_.line]:before:font-code [&_.line]:before:select-none',
        )}
      >
        {lineNumbers && lines
          ? lines.map((line, i) => (
              <span
                className="line px-12 w-full relative font-code"
                key={`line-${i}-${line.slice(0, 10)}`}
              >
                {line}
              </span>
            ))
          : code}
      </code>
    </pre>
  );
}
