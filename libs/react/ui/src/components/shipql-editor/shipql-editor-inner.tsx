import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {Input} from 'components/input';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import {cn} from '../../utils/cn';
import {Icon} from '../icon/icon';
import {LeafCloseOverlay} from './lexical/leaf-close-overlay';
import {OnBlurPlugin} from './lexical/on-blur-plugin';
import {OnTextChangePlugin} from './lexical/on-text-change-plugin';
import {ShipQLLeafNode} from './lexical/shipql-leaf-node';
import {ShipQLPlugin} from './lexical/shipql-plugin';
import type {ShipQLEditorInnerProps} from './shipql-editor';

const INPUT_CLASSES =
  'block w-full rounded-6 bg-background-field-base py-2 pl-7 pr-20 text-md text-foreground-neutral-base caret-foreground-neutral-base outline-none focus:border-border-highlights-interactive shadow-button-neutral';
const BUTTON_CLASSES =
  'shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-all duration-150 px-8 flex items-center cursor-pointer w-32 h-32';

export default function ShipQLEditorInner({
  onChange,
  onLeafFocus,
  placeholder,
  className,
  disabled,
  mode,
  text,
  editorKey,
  onTextChange,
  onClear,
  onToggleMode,
}: ShipQLEditorInnerProps) {
  return (
    <div data-shipql-editor className={cn('relative', className)}>
      {mode === 'editor' ? (
        <LexicalComposer
          key={editorKey}
          initialConfig={{
            namespace: 'ShipQLEditor',
            nodes: [ShipQLLeafNode],
            onError: (error) => {
              throw error;
            },
            editorState: text
              ? () => {
                  const para = $createParagraphNode();
                  para.append($createTextNode(text));
                  $getRoot().append(para);
                }
              : undefined,
          }}
        >
          <PlainTextPlugin
            contentEditable={
              <ContentEditable
                aria-label="ShipQL query editor"
                className={cn(INPUT_CLASSES, disabled && 'pointer-events-none opacity-50')}
              />
            }
            placeholder={
              placeholder ? (
                <div className="pointer-events-none absolute left-0 top-0 select-none px-7 py-2 text-md text-foreground-neutral-muted">
                  {placeholder}
                </div>
              ) : null
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ShipQLPlugin onLeafFocus={onLeafFocus} />
          <OnBlurPlugin onChange={onChange} />
          <OnTextChangePlugin onTextChange={onTextChange} />
          <HistoryPlugin />
          {!disabled && <LeafCloseOverlay />}
        </LexicalComposer>
      ) : (
        <Input
          ref={(el) => el?.focus()}
          aria-label="ShipQL query editor"
          className={cn(INPUT_CLASSES, disabled && 'pointer-events-none opacity-50')}
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}

      {!disabled && (
        <div className="absolute right-px top-1/2 flex -translate-y-1/2 items-center">
          <button
            type="button"
            aria-label="Clear query"
            className={cn(
              BUTTON_CLASSES,
              text.trim().length > 0 ? 'opacity-100' : 'opacity-0 pointer-events-none',
            )}
            onClick={onClear}
          >
            <Icon name="closeLine" size={16} />
          </button>
          <div className="h-28 w-px bg-border-neutral-strong" />
          <button
            type="button"
            aria-label={mode === 'editor' ? 'Switch to free text mode' : 'Switch to editor mode'}
            className={BUTTON_CLASSES}
            onClick={onToggleMode}
          >
            <Icon name={mode === 'editor' ? 'edit2Line' : 'codeLine'} size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
