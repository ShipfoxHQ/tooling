import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {Input} from 'components/input';
import {Popover, PopoverAnchor} from 'components/popover';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';
import {cn} from '../../utils/cn';
import {Icon} from '../icon/icon';
import {LeafCloseOverlay} from './lexical/leaf-close-overlay';
import {OnBlurPlugin} from './lexical/on-blur-plugin';
import {OnTextChangePlugin} from './lexical/on-text-change-plugin';
import type {LeafAstNode} from './lexical/shipql-leaf-node';
import {ShipQLLeafNode} from './lexical/shipql-leaf-node';
import {ShipQLPlugin} from './lexical/shipql-plugin';
import type {ShipQLEditorInnerProps} from './shipql-editor';
import {ShipQLSuggestionsDropdown} from './suggestions/shipql-suggestions-dropdown';
import {ShipQLSuggestionsPlugin} from './suggestions/shipql-suggestions-plugin';
import type {ShipQLFieldDef, SuggestionItem} from './suggestions/types';

const INPUT_CLASSES =
  'block w-full rounded-6 bg-background-field-base py-2 pl-7 pr-58 sm:pr-64 text-md text-foreground-neutral-base caret-foreground-neutral-base outline-none focus:border-border-highlights-interactive shadow-button-neutral';
const BUTTON_CLASSES =
  'shrink-0 text-foreground-neutral-subtle hover:text-foreground-neutral-base transition-all duration-150 flex justify-center items-center cursor-pointer w-28 sm:w-32 h-full';

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
  fields,
  fetchSuggestions,
}: ShipQLEditorInnerProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [isNegated, setIsNegated] = useState(false);
  const [focusedLeafNode, setFocusedLeafNode] = useState<LeafAstNode | null>(null);
  const [resolvedFields, setResolvedFields] = useState<ShipQLFieldDef[]>(fields ?? []);

  const isSelectingRef = useRef(false);
  const applyRef = useRef<((encodedValue: string) => void) | null>(null);
  const fetchRef = useRef(fetchSuggestions);
  fetchRef.current = fetchSuggestions;
  const fetchCancelRef = useRef<(() => void) | null>(null);

  // Sync static fields when no fetchSuggestions
  useEffect(() => {
    if (!fetchSuggestions) setResolvedFields(fields ?? []);
  }, [fields, fetchSuggestions]);

  const handleActiveFieldChange = useCallback(
    (fieldName?: string) => {
      fetchCancelRef.current?.();
      if (!fetchRef.current) {
        setResolvedFields(fields ?? []);
        return;
      }
      let cancelled = false;
      fetchCancelRef.current = () => {
        cancelled = true;
      };
      fetchRef.current(fieldName).then((result) => {
        if (!cancelled) setResolvedFields(result);
      });
    },
    [fields],
  );

  const handleLeafFocus = useCallback(
    (node: LeafAstNode | null) => {
      setFocusedLeafNode(node);
      onLeafFocus?.(node);
    },
    [onLeafFocus],
  );

  const hasSuggestions = Boolean(fetchSuggestions ?? (fields && fields.length > 0));

  const handleSelect = useCallback((value: string) => {
    applyRef.current?.(value);
  }, []);

  return (
    <div data-shipql-editor className={cn('relative', className)}>
      {mode === 'editor' ? (
        <Popover open={hasSuggestions && suggestionsOpen} onOpenChange={setSuggestionsOpen}>
          <PopoverAnchor className="w-full">
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
                    id="shipql-editor"
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
              <ShipQLPlugin onLeafFocus={handleLeafFocus} />
              <OnBlurPlugin onChange={onChange} />
              <OnTextChangePlugin onTextChange={onTextChange} />
              <HistoryPlugin />
              {!disabled && <LeafCloseOverlay />}
              {hasSuggestions && (
                <ShipQLSuggestionsPlugin
                  fields={resolvedFields}
                  open={suggestionsOpen}
                  setOpen={setSuggestionsOpen}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  items={items}
                  setItems={setItems}
                  isSelectingRef={isSelectingRef}
                  applyRef={applyRef}
                  isNegated={isNegated}
                  setIsNegated={setIsNegated}
                  focusedLeafNode={focusedLeafNode}
                  onActiveFieldChange={handleActiveFieldChange}
                />
              )}
            </LexicalComposer>
          </PopoverAnchor>
          {hasSuggestions && (
            <ShipQLSuggestionsDropdown
              items={items}
              selectedIndex={selectedIndex}
              isSelectingRef={isSelectingRef}
              onSelect={handleSelect}
            />
          )}
        </Popover>
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
        <div className="absolute right-0 top-0 flex h-28 items-center">
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
          <button
            type="button"
            aria-label={mode === 'editor' ? 'Switch to free text mode' : 'Switch to editor mode'}
            className={cn(BUTTON_CLASSES, 'sm:border-l border-border-neutral-strong')}
            onClick={onToggleMode}
          >
            <Icon name={mode === 'editor' ? 'edit2Line' : 'codeLine'} size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
