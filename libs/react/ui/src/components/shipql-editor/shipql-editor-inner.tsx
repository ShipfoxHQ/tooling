import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {PlainTextPlugin} from '@lexical/react/LexicalPlainTextPlugin';
import {hasTextNodes} from '@shipfox/shipql-parser';
import {Input} from 'components/input';
import {Popover, PopoverAnchor} from 'components/popover';
import {$createParagraphNode, $createTextNode, $getRoot} from 'lexical';
import {useCallback, useRef, useState} from 'react';
import {cn} from '../../utils/cn';
import {Icon} from '../icon/icon';
import {LeafCloseOverlay} from './lexical/leaf-close-overlay';
import {OnBlurPlugin} from './lexical/on-blur-plugin';
import {OnTextChangePlugin} from './lexical/on-text-change-plugin';
import type {LeafAstNode} from './lexical/shipql-leaf-node';
import {ShipQLLeafNode} from './lexical/shipql-leaf-node';
import {ShipQLPlugin} from './lexical/shipql-plugin';
import type {ShipQLEditorInnerProps} from './shipql-editor';
import {detectFacetContext, normalizeFacets, tryParse} from './suggestions/generate-suggestions';
import {ShipQLSuggestionsDropdown} from './suggestions/shipql-suggestions-dropdown';
import type {SyntaxHintMode} from './suggestions/shipql-suggestions-footer';
import {ShipQLSuggestionsPlugin} from './suggestions/shipql-suggestions-plugin';
import type {SuggestionItem} from './suggestions/types';

const INPUT_CLASSES =
  'block w-full rounded-6 bg-background-field-base py-2 pl-32 pr-58 sm:pr-64 text-md text-foreground-neutral-base caret-foreground-neutral-base outline-none focus:border-border-highlights-interactive shadow-button-neutral';
const INPUT_ERROR_CLASSES = 'shadow-border-error';
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
  isError,
  onTextChange,
  onClear,
  onToggleMode,
  facets,
  currentFacet,
  setCurrentFacet,
  valueSuggestions,
  isLoadingValueSuggestions,
  onLeafChange,
  formatLeafDisplay,
  allowFreeText,
}: ShipQLEditorInnerProps) {
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [focusedLeafNode, setFocusedLeafNode] = useState<LeafAstNode | null>(null);
  const [isNegated, setIsNegated] = useState(false);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const [isTextModeBlurError, setIsTextModeBlurError] = useState(false);

  const isSelectingRef = useRef(false);
  const applyRef = useRef<((value: string) => void) | null>(null);
  const negationPrefixRef = useRef('');

  const hasSuggestions = Boolean(facets && facets.length > 0);
  const showValueActions = Boolean(currentFacet);
  const isRangeContext = items.length === 1 && items[0]?.type === 'range-slider';
  const syntaxHintMode: SyntaxHintMode = isRangeContext ? 'range' : 'value';

  const handleToggleNegate = useCallback((negated: boolean) => {
    setIsNegated(negated);
    negationPrefixRef.current = negated ? '-' : '';
  }, []);

  const handleSetCurrentFacet = useCallback(
    (facet: string | null) => {
      setCurrentFacet?.(facet);
    },
    [setCurrentFacet],
  );

  const handleLeafFocus = useCallback(
    (node: LeafAstNode | null) => {
      setFocusedLeafNode(node);
      onLeafFocus?.(node);
    },
    [onLeafFocus],
  );

  const handleSelect = useCallback((value: string) => {
    applyRef.current?.(value);
  }, []);

  const handleToggleSyntaxHelp = useCallback(() => {
    setShowSyntaxHelp((prev) => !prev);
  }, []);

  return (
    <div data-shipql-editor className={cn('relative', className)}>
      {mode === 'editor' ? (
        <Popover open={hasSuggestions && suggestionsOpen}>
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
                  <div className="relative">
                    <div className="absolute left-0 top-4 select-none px-8 py-2 text-md text-foreground-neutral-muted">
                      <Icon
                        name={isLoadingValueSuggestions ? 'spinner' : 'searchLine'}
                        size={16}
                        className="shrink-0 text-foreground-neutral-muted"
                      />
                    </div>
                    <ContentEditable
                      id="shipql-editor"
                      aria-label="ShipQL query editor"
                      className={cn(
                        INPUT_CLASSES,
                        isError && INPUT_ERROR_CLASSES,
                        disabled && 'pointer-events-none opacity-50',
                      )}
                    />
                  </div>
                }
                placeholder={
                  placeholder ? (
                    <div className="pointer-events-none absolute left-0 top-0 select-none pl-32 pr-8 py-2 text-md text-foreground-neutral-muted">
                      {placeholder}
                    </div>
                  ) : null
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <ShipQLPlugin
                onLeafFocus={handleLeafFocus}
                formatLeafDisplay={formatLeafDisplay}
                allowFreeText={allowFreeText}
                suggestionsOpen={suggestionsOpen}
              />
              <OnBlurPlugin onChange={onChange} allowFreeText={allowFreeText} />
              <OnTextChangePlugin onTextChange={onTextChange} />
              <HistoryPlugin />
              {!disabled && <LeafCloseOverlay />}
              {hasSuggestions && (
                <ShipQLSuggestionsPlugin
                  facets={facets ?? []}
                  currentFacet={currentFacet ?? null}
                  setCurrentFacet={handleSetCurrentFacet}
                  valueSuggestions={valueSuggestions ?? []}
                  isLoadingValueSuggestions={isLoadingValueSuggestions ?? false}
                  open={suggestionsOpen}
                  setOpen={setSuggestionsOpen}
                  selectedIndex={selectedIndex}
                  setSelectedIndex={setSelectedIndex}
                  items={items}
                  setItems={setItems}
                  isSelectingRef={isSelectingRef}
                  applyRef={applyRef}
                  negationPrefixRef={negationPrefixRef}
                  focusedLeafNode={focusedLeafNode}
                  onLeafChange={onLeafChange}
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
              isLoading={isLoadingValueSuggestions}
              isNegated={isNegated}
              onToggleNegate={handleToggleNegate}
              showValueActions={showValueActions}
              showSyntaxHelp={showSyntaxHelp}
              onToggleSyntaxHelp={handleToggleSyntaxHelp}
              isError={isError}
              syntaxHintMode={syntaxHintMode}
            />
          )}
        </Popover>
      ) : (
        <Input
          ref={(el) => el?.focus()}
          aria-label="ShipQL query editor"
          iconLeft={
            <Icon name="searchLine" size={16} className="shrink-0 text-foreground-neutral-muted" />
          }
          className={cn(INPUT_CLASSES, disabled && 'pointer-events-none opacity-50')}
          aria-invalid={isError || isTextModeBlurError}
          value={text}
          onChange={(e) => {
            const newText = e.target.value;
            setIsTextModeBlurError(false);
            onTextChange(newText);

            const facetNames = facets ? normalizeFacets(facets) : [];
            const facetCtx = detectFacetContext(newText, facetNames);
            setCurrentFacet?.(facetCtx?.facet ?? null);

            onLeafChange?.({partialValue: facetCtx?.partialValue ?? '', ast: tryParse(newText)});
          }}
          onBlur={(e) => {
            const ast = tryParse(e.target.value);
            const hasDeferredFreeTextError = Boolean(ast && !allowFreeText && hasTextNodes(ast));
            setIsTextModeBlurError(hasDeferredFreeTextError);
            if (ast && !hasDeferredFreeTextError) onChange?.(ast);
          }}
          onFocus={() => setIsTextModeBlurError(false)}
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
