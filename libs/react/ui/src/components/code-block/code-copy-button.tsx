import {Icon} from 'components/icon';
import {useCopyToClipboard} from 'hooks/useCopyToClipboard';
import type {ComponentProps} from 'react';
import {useState} from 'react';
import {cn} from 'utils/cn';

type CodeCopyButtonProps = Omit<ComponentProps<'button'>, 'onCopy'> & {
  content: string;
  onCopy?: (content: string) => void;
  onError?: (error: Error) => void;
  timeout?: number;
  children?: React.ReactNode;
};

export function CodeCopyButton({
  content,
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const {copy} = useCopyToClipboard({
    text: content,
    onCopy: () => {
      setIsCopied(true);
      onCopy?.(content);
      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    },
  });

  const handleClick = async () => {
    try {
      await copy();
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to copy'));
    }
  };

  return (
    <button
      type="button"
      className={cn(
        'flex shrink-0 cursor-pointer items-center justify-center rounded-6 bg-transparent text-foreground-neutral-muted transition-colors hover:bg-background-components-hover active:bg-background-components-pressed p-4',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children ?? <Icon name={isCopied ? 'check' : 'copy'} className="size-16" />}
    </button>
  );
}
