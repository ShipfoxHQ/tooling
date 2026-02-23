import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import {cn} from '../../utils/cn';
import {OnBlurPlugin} from './lexical/on-blur-plugin';
import {ShipQLLeafNode} from './lexical/shipql-leaf-node';
import {ShipQLPlugin} from './lexical/shipql-plugin';
import type {ShipQLEditorProps} from './shipql-editor';

export default function ShipQLEditorInner({
  defaultValue,
  onChange,
  onLeafFocus,
  placeholder,
  className,
  disabled,
}: ShipQLEditorProps) {
  return (
    <LexicalComposer
      initialConfig={{
        namespace: 'ShipQLEditor',
        nodes: [ShipQLLeafNode],
        onError: (error) => {
          throw error;
        },
        editorState: defaultValue
          ? () => {
              const para = $createParagraphNode();
              para.append($createTextNode(defaultValue));
              $getRoot().append(para);
            }
          : undefined,
      }}
    >
      <div className={cn('relative', className)}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              aria-label="ShipQL query editor"
              className={cn(
                'block w-full rounded-6 border border-border-neutral-base-component bg-background-field-base px-3 py-2 text-md text-foreground-neutral-base caret-foreground-neutral-base outline-none',
                'focus:border-border-highlights-interactive',
                disabled && 'pointer-events-none opacity-50',
              )}
            />
          }
          placeholder={
            placeholder ? (
              <div className="pointer-events-none absolute left-0 top-0 select-none px-3 py-2 text-md text-foreground-neutral-muted">
                {placeholder}
              </div>
            ) : null
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ShipQLPlugin onLeafFocus={onLeafFocus} />
        <OnBlurPlugin onChange={onChange} />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
}
