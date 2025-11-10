import {useControllableState} from '@radix-ui/react-use-controllable-state';
import {CodeContent} from 'components/code-block/code-content';
import {CodeCopyButton} from 'components/code-block/code-copy-button';
import {useResolvedTheme} from 'hooks/useResolvedTheme';
import {useShikiHighlight} from 'hooks/useShikiHighlight';
import {useShikiStyleInjection} from 'hooks/useShikiStyleInjection';
import type {ComponentProps, HTMLAttributes, ReactNode} from 'react';
import {createContext, useContext} from 'react';
import {cn} from 'utils/cn';

export type BundledLanguage = string;

type CodeBlockData = {
  language: string;
  filename: string;
  code: string;
};

type CodeBlockContextType = {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  data: CodeBlockData[];
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  value: undefined,
  onValueChange: undefined,
  data: [],
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  data: CodeBlockData[];
};

export function CodeBlock({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue,
  className,
  data,
  ...props
}: CodeBlockProps) {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue ?? '',
    prop: controlledValue,
    onChange: controlledOnValueChange,
  });

  return (
    <CodeBlockContext.Provider value={{value, onValueChange, data}}>
      <div
        className={cn(
          'size-full overflow-hidden rounded-12 bg-background-components-pressed dark:bg-background-contrast-base shadow-button-neutral',
          className,
        )}
        {...props}
      />
    </CodeBlockContext.Provider>
  );
}

export type CodeBlockHeaderProps = HTMLAttributes<HTMLDivElement>;

export function CodeBlockHeader({className, ...props}: CodeBlockHeaderProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-row items-center gap-12 overflow-clip bg-background-components-pressed dark:bg-background-contrast-base px-16 py-8',
        className,
      )}
      {...props}
    />
  );
}

export type CodeBlockFilesProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: (item: CodeBlockData) => ReactNode;
};

export function CodeBlockFiles({className, children, ...props}: CodeBlockFilesProps) {
  const {data} = useContext(CodeBlockContext);

  return (
    <div className={cn('flex grow flex-row items-center gap-12', className)} {...props}>
      {data.map(children)}
    </div>
  );
}

export type CodeBlockFilenameProps = HTMLAttributes<HTMLDivElement> & {
  value?: string;
};

export function CodeBlockFilename({className, value, children, ...props}: CodeBlockFilenameProps) {
  const {value: activeValue} = useContext(CodeBlockContext);

  if (value !== activeValue) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex min-h-0 min-w-0 flex-1 items-center overflow-hidden text-ellipsis whitespace-nowrap text-xs leading-20 font-code text-foreground-neutral-muted',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export type CodeBlockCopyButtonProps = ComponentProps<'button'> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export function CodeBlockCopyButton({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) {
  const {data, value} = useContext(CodeBlockContext);
  const code = data.find((item) => item.language === value)?.code ?? '';

  return (
    <CodeCopyButton
      content={code}
      onCopy={() => onCopy?.()}
      onError={onError}
      timeout={timeout}
      className={className}
      {...props}
    >
      {children}
    </CodeCopyButton>
  );
}

type CodeBlockFallbackProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: string;
};

function CodeBlockFallback({children, className, ...props}: CodeBlockFallbackProps) {
  const lines = children?.toString().split('\n') ?? [];
  return (
    <pre
      className={cn('w-full font-code', className)}
      {...(props as HTMLAttributes<HTMLPreElement>)}
    >
      <code>
        {lines.map((line, i) => {
          const isDiffRemove = line.trim().startsWith('-');
          const isDiffAdd = line.trim().startsWith('+');
          const diffClass = isDiffRemove ? 'diff remove' : isDiffAdd ? 'diff add' : '';

          return (
            <span className={cn('line', diffClass)} key={`line-${i}-${line.slice(0, 10)}`}>
              {line}
            </span>
          );
        })}
      </code>
    </pre>
  );
}

export type CodeBlockBodyProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children: (item: CodeBlockData) => ReactNode;
};

export function CodeBlockBody({children, ...props}: CodeBlockBodyProps) {
  const {data} = useContext(CodeBlockContext);

  return <div {...props}>{data.map(children)}</div>;
}

export type CodeBlockItemProps = HTMLAttributes<HTMLDivElement> & {
  value: string;
  lineNumbers?: boolean;
};

export function CodeBlockItem({
  children,
  lineNumbers = true,
  className,
  value,
  ...props
}: CodeBlockItemProps) {
  const {value: activeValue} = useContext(CodeBlockContext);

  if (value !== activeValue) {
    return null;
  }

  return (
    <div
      className={cn('flex w-full shrink-0 items-start overflow-clip px-4 pb-4 pt-0', className)}
      {...props}
    >
      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 shrink-0 rounded-8 border border-border-contrast-bottom bg-background-neutral-base dark:bg-background-contrast-subtle font-code',
          '[&_pre]:py-12 [&_pre]:font-code',
          '[&_code]:w-full [&_code]:grid [&_code]:overflow-x-auto [&_code]:bg-transparent [&_code]:font-code [&_code]:text-xs [&_code]:leading-20 [&_code]:text-foreground-neutral-base',
          '[&_.line]:px-12 [&_.line]:w-full [&_.line]:relative [&_.line]:font-code',
          lineNumbers &&
            '[&_code]:[counter-reset:line] [&_code]:[counter-increment:line_0] [&_.line]:before:content-[counter(line)] [&_.line]:before:inline-block [&_.line]:before:[counter-increment:line] [&_.line]:before:w-16 [&_.line]:before:mr-16 [&_.line]:before:text-xs [&_.line]:before:text-right [&_.line]:before:text-foreground-neutral-subtle [&_.line]:before:font-code [&_.line]:before:select-none',
          '[&_.line.diff]:after:absolute [&_.line.diff]:after:left-0 [&_.line.diff]:after:top-0 [&_.line.diff]:after:bottom-0 [&_.line.diff]:after:w-1',
          '[&_.line.diff.add]:bg-emerald-50 [&_.line.diff.add]:text-green-700 [&_.line.diff.add]:after:bg-emerald-500',
          '[&_.line.diff.remove]:bg-rose-50 [&_.line.diff.remove]:text-red-700 [&_.line.diff.remove]:after:bg-rose-500',
          'dark:[&_.line.diff.add]:bg-emerald-500/10 dark:[&_.line.diff.add]:text-emerald-400',
          'dark:[&_.line.diff.remove]:bg-rose-500/10 dark:[&_.line.diff.remove]:text-rose-400',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export type CodeBlockContentProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  themes?: {
    light: string;
    dark: string;
  };
  language?: BundledLanguage;
  syntaxHighlighting?: boolean;
  children: string;
};

export function CodeBlockContent({
  children,
  themes = {
    light: 'vitesse-light',
    dark: 'vitesse-dark',
  },
  language = 'typescript',
  syntaxHighlighting = false,
  ...props
}: CodeBlockContentProps) {
  const resolvedTheme = useResolvedTheme();

  useShikiStyleInjection(syntaxHighlighting);

  const {highlightedCode, isLoading} = useShikiHighlight({
    code: children,
    lang: language,
    themes,
    resolvedTheme,
    syntaxHighlighting,
  });

  if (!syntaxHighlighting || isLoading) {
    return <CodeBlockFallback {...props}>{children}</CodeBlockFallback>;
  }

  return (
    <CodeContent
      code={children}
      highlightedCode={highlightedCode}
      isLoading={isLoading}
      syntaxHighlighting={syntaxHighlighting}
      {...props}
    />
  );
}
