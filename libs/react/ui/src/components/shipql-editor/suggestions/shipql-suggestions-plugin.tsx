import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import type {AstNode} from '@shipfox/shipql-parser';
import {parse} from '@shipfox/shipql-parser';
import {
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_NORMAL,
  FOCUS_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
  KEY_TAB_COMMAND,
  type ParagraphNode,
} from 'lexical';
import {useEffect, useRef} from 'react';
import type {LeafAstNode} from '../lexical/shipql-leaf-node';
import {$isShipQLLeafNode} from '../lexical/shipql-leaf-node';
import {
  buildSuggestionItems,
  detectFacetContext,
  extractFacetFromLeaf,
  negationPrefixFromSource,
  normalizeFacets,
  stripNegationPrefix,
} from './generate-suggestions';
import type {FacetDef, SuggestionItem} from './types';

interface ShipQLSuggestionsPluginProps {
  facets: FacetDef[];
  currentFacet: string | null;
  setCurrentFacet: (facet: string | null) => void;
  valueSuggestions: string[];
  isLoadingValueSuggestions: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  items: SuggestionItem[];
  setItems: (items: SuggestionItem[]) => void;
  isSelectingRef: React.RefObject<boolean>;
  applyRef: React.RefObject<((value: string) => void) | null>;
  negationPrefixRef: React.RefObject<string>;
  focusedLeafNode: LeafAstNode | null;
  onLeafChange?: (payload: {partialValue: string; ast: AstNode | null}) => void;
}

function getActiveSegment(para: ParagraphNode): string {
  const children = para.getChildren();
  let active = '';
  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    if ($isShipQLLeafNode(child)) {
      // When trailing text starts immediately after a leaf that contains ':',
      // the user is typing a value continuation — e.g.
      // [Leaf("status:"), Text("s")] should yield "status:s", not just "s".
      const leafText = child.getTextContent();
      if (active.length > 0 && active[0] !== ' ' && leafText.includes(':')) {
        active = leafText + active;
      }
      break;
    }
    active = child.getTextContent() + active;
  }
  return active.trimStart();
}

export function ShipQLSuggestionsPlugin({
  facets,
  currentFacet,
  setCurrentFacet,
  valueSuggestions,
  isLoadingValueSuggestions,
  open,
  setOpen,
  selectedIndex,
  setSelectedIndex,
  items,
  setItems,
  isSelectingRef,
  applyRef,
  negationPrefixRef,
  focusedLeafNode,
  onLeafChange,
}: ShipQLSuggestionsPluginProps) {
  const [editor] = useLexicalComposerContext();

  // Stable refs so callbacks always see the latest values without re-registering.
  const openRef = useRef(open);
  openRef.current = open;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const setOpenRef = useRef(setOpen);
  setOpenRef.current = setOpen;
  const setSelectedIndexRef = useRef(setSelectedIndex);
  setSelectedIndexRef.current = setSelectedIndex;
  const setItemsRef = useRef(setItems);
  setItemsRef.current = setItems;
  const facetsRef = useRef(facets);
  facetsRef.current = facets;
  const valueSuggestionsRef = useRef(valueSuggestions);
  valueSuggestionsRef.current = valueSuggestions;
  const setCurrentFacetRef = useRef(setCurrentFacet);
  setCurrentFacetRef.current = setCurrentFacet;
  const currentFacetRef = useRef(currentFacet);
  currentFacetRef.current = currentFacet;
  const focusedLeafNodeRef = useRef(focusedLeafNode);
  focusedLeafNodeRef.current = focusedLeafNode;
  const isLoadingValueSuggestionsRef = useRef(isLoadingValueSuggestions);
  isLoadingValueSuggestionsRef.current = isLoadingValueSuggestions;
  const onLeafChangeRef = useRef(onLeafChange);
  onLeafChangeRef.current = onLeafChange;

  const isFocusedRef = useRef(false);
  const hasNavigatedRef = useRef(false);
  const prevFocusedLeafRef = useRef<LeafAstNode | null>(null);

  // ── Leaf refocus effect ─────────────────────────────────────────────────────
  useEffect(() => {
    if (focusedLeafNode === prevFocusedLeafRef.current) return;
    prevFocusedLeafRef.current = focusedLeafNode;

    if (focusedLeafNode) {
      if (focusedLeafNode.type === 'text') {
        // Text-type leaves (e.g. "status:") aren't real facet:value nodes.
        // Detect facet context from the text content, mirroring the update
        // listener's handling of text-type leaves.
        const activeText = focusedLeafNode.value;
        const facetCtx = detectFacetContext(activeText, normalizeFacets(facetsRef.current));
        negationPrefixRef.current =
          facetCtx?.negationPrefix ?? stripNegationPrefix(activeText).prefix;
        setCurrentFacetRef.current(facetCtx?.facet ?? null);
        let text = '';
        editor.getEditorState().read(() => {
          text = $getRoot().getTextContent();
        });
        let ast: AstNode | null = null;
        try {
          ast = parse(text);
        } catch {
          /* invalid */
        }
        onLeafChangeRef.current?.({partialValue: facetCtx?.partialValue ?? '', ast});
        const leafItems = buildSuggestionItems(
          facetsRef.current,
          valueSuggestionsRef.current,
          activeText,
          null,
        );
        setItemsRef.current(leafItems);
      } else {
        const facet = extractFacetFromLeaf(focusedLeafNode);
        negationPrefixRef.current =
          focusedLeafNode.type === 'not' ? negationPrefixFromSource(focusedLeafNode.source) : '';
        setCurrentFacetRef.current(facet ?? null);
        // Don't call onLeafChange here — the update listener that
        // preceded this rebuild already set the correct partial value.
        const leafItems = buildSuggestionItems(
          facetsRef.current,
          valueSuggestionsRef.current,
          '',
          focusedLeafNode,
        );
        setItemsRef.current(leafItems);
      }
      hasNavigatedRef.current = false;
      setSelectedIndexRef.current(-1);
      if (isFocusedRef.current) setOpenRef.current(true);
    } else {
      // Leaf deselected — regenerate text-based suggestions immediately
      editor.getEditorState().read(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;
        const activeText = getActiveSegment(para);
        const facetCtx = detectFacetContext(activeText, normalizeFacets(facetsRef.current));
        negationPrefixRef.current =
          facetCtx?.negationPrefix ?? stripNegationPrefix(activeText).prefix;
        setCurrentFacetRef.current(facetCtx?.facet ?? null);
        const text = $getRoot().getTextContent();
        let ast: AstNode | null = null;
        try {
          ast = parse(text);
        } catch {
          /* invalid */
        }
        onLeafChangeRef.current?.({partialValue: facetCtx?.partialValue ?? '', ast});
        const newItems = buildSuggestionItems(
          facetsRef.current,
          valueSuggestionsRef.current,
          activeText,
          null,
        );
        setItemsRef.current(newItems);
        hasNavigatedRef.current = false;
        setSelectedIndexRef.current(-1);
      });
    }
  }, [focusedLeafNode, editor, negationPrefixRef]);

  // ── Reactive regeneration when facets/valueSuggestions change ──────────────
  useEffect(() => {
    if (!openRef.current) return;
    if (prevFocusedLeafRef.current && prevFocusedLeafRef.current.type !== 'text') {
      const leafItems = buildSuggestionItems(
        facets,
        valueSuggestions,
        '',
        prevFocusedLeafRef.current,
      );
      setItemsRef.current(leafItems);
      setOpenRef.current(isSelectingRef.current || isFocusedRef.current);
    } else if (prevFocusedLeafRef.current?.type === 'text') {
      // Text-type leaf (e.g. "status:") lives inside a ShipQLLeafNode, so
      // getActiveSegment() would return '' — use the leaf's value instead.
      const activeText = prevFocusedLeafRef.current.value;
      const newItems = buildSuggestionItems(facets, valueSuggestions, activeText, null);
      setItemsRef.current(newItems);
      setOpenRef.current(isSelectingRef.current || isFocusedRef.current);
    } else {
      editor.getEditorState().read(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;
        const activeText = getActiveSegment(para);
        const newItems = buildSuggestionItems(facets, valueSuggestions, activeText, null);
        setItemsRef.current(newItems);
        hasNavigatedRef.current = false;
        setSelectedIndexRef.current(-1);
        setOpenRef.current(isSelectingRef.current || isFocusedRef.current);
      });
    }
  }, [facets, valueSuggestions, editor, isSelectingRef]);

  // ── Apply function ──────────────────────────────────────────────────────────
  useEffect(() => {
    applyRef.current = (selectedValue: string) => {
      const isFacetSelection = !currentFacetRef.current;

      editor.update(
        () => {
          const para = $getRoot().getFirstChild() as ParagraphNode | null;
          if (!para) return;

          const insertText = currentFacetRef.current
            ? `${negationPrefixRef.current}${currentFacetRef.current}:${selectedValue} `
            : `${negationPrefixRef.current}${selectedValue}:`;

          // Case 1: Cursor is inside a focused leaf chip — replace the chip in-place
          if (focusedLeafNodeRef.current) {
            const sel = $getSelection();
            if ($isRangeSelection(sel)) {
              const anchor = sel.anchor.getNode();
              if ($isShipQLLeafNode(anchor)) {
                const newNode = $createTextNode(insertText);
                anchor.insertBefore(newNode);
                anchor.remove();
                const newSel = $createRangeSelection();
                const len = newNode.getTextContentSize();
                newSel.anchor.set(newNode.getKey(), len, 'text');
                newSel.focus.set(newNode.getKey(), len, 'text');
                $setSelection(newSel);
                return;
              }
            }
          }

          // Case 2: Cursor is in a plain text node — replace that node's content
          const sel = $getSelection();
          if ($isRangeSelection(sel)) {
            const anchor = sel.anchor.getNode();
            if ($isTextNode(anchor) && !$isShipQLLeafNode(anchor)) {
              const prevSibling = anchor.getPreviousSibling();
              const prevText = prevSibling?.getTextContent() ?? '';
              const needsSpace = prevText.length > 0 && !prevText.endsWith(' ');
              const finalText = needsSpace ? ` ${insertText}` : insertText;
              anchor.setTextContent(finalText);
              const newSel = $createRangeSelection();
              newSel.anchor.set(anchor.getKey(), finalText.length, 'text');
              newSel.focus.set(anchor.getKey(), finalText.length, 'text');
              $setSelection(newSel);
              return;
            }
          }

          // Case 3: Fallback — append after last leaf chip
          const children = para.getChildren();
          let lastLeafIdx = -1;
          for (let i = children.length - 1; i >= 0; i--) {
            if ($isShipQLLeafNode(children[i])) {
              lastLeafIdx = i;
              break;
            }
          }
          for (let i = children.length - 1; i > lastLeafIdx; i--) {
            children[i].remove();
          }
          const currentText = para.getTextContent();
          const finalText =
            currentText.length > 0 && !currentText.endsWith(' ') ? ` ${insertText}` : insertText;
          const newNode = $createTextNode(finalText);
          para.append(newNode);
          const newSel = $createRangeSelection();
          const len = newNode.getTextContentSize();
          newSel.anchor.set(newNode.getKey(), len, 'text');
          newSel.focus.set(newNode.getKey(), len, 'text');
          $setSelection(newSel);
        },
        // Tag facet selections so the update listener skips them — we handle
        // state updates below to avoid the intermediate empty-items state.
        isFacetSelection ? {tag: 'shipql-apply'} : undefined,
      );

      // For facet selections (e.g. "status" → inserts "status:"), notify the
      // parent directly. The update listener is skipped (tagged) because it
      // would call buildSuggestionItems with stale empty valueSuggestions,
      // causing a flash of "No suggestions found".
      if (isFacetSelection) {
        setCurrentFacetRef.current(selectedValue);
        let text = '';
        editor.getEditorState().read(() => {
          text = $getRoot().getTextContent();
        });
        let ast: AstNode | null = null;
        try {
          ast = parse(text);
        } catch {
          /* invalid */
        }
        onLeafChangeRef.current?.({partialValue: '', ast});
        setOpenRef.current(true);
      }

      // Defer focus so it fires after the browser's blur event (which hasn't
      // fired yet during the mousedown handler that calls apply). A synchronous
      // focus() call here is a no-op because the editor is still focused.
      setTimeout(() => editor.focus(), 0);
      hasNavigatedRef.current = false;
      setSelectedIndexRef.current(-1);
    };

    return () => {
      applyRef.current = null;
    };
  }, [editor, applyRef, negationPrefixRef]);

  // ── Keyboard + update listeners ─────────────────────────────────────────────
  useEffect(() => {
    const unregisterFocus = editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        isFocusedRef.current = true;
        setOpenRef.current(true);
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    const unregisterBlur = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        isFocusedRef.current = false;
        if (!isSelectingRef.current) {
          setOpenRef.current(false);
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    const unregisterArrowDown = editor.registerCommand(
      KEY_ARROW_DOWN_COMMAND,
      (e) => {
        if (!openRef.current || itemsRef.current.length === 0) return false;
        e?.preventDefault();
        const its = itemsRef.current;
        let next = selectedIndexRef.current + 1;
        while (next < its.length && its[next]?.type === 'section-header') next++;
        if (next >= its.length) {
          next = 0;
          while (next < its.length && its[next]?.type === 'section-header') next++;
        }
        if (next < its.length) {
          hasNavigatedRef.current = true;
          setSelectedIndexRef.current(next);
        }
        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );

    const unregisterArrowUp = editor.registerCommand(
      KEY_ARROW_UP_COMMAND,
      (e) => {
        if (!openRef.current || itemsRef.current.length === 0) return false;
        e?.preventDefault();
        const its = itemsRef.current;
        let prev = selectedIndexRef.current - 1;
        while (prev >= 0 && its[prev]?.type === 'section-header') prev--;
        if (prev < 0) {
          prev = its.length - 1;
          while (prev >= 0 && its[prev]?.type === 'section-header') prev--;
        }
        if (prev >= 0) {
          hasNavigatedRef.current = true;
          setSelectedIndexRef.current(prev);
        }
        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );

    const unregisterEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (e) => {
        if (!openRef.current || itemsRef.current.length === 0) return false;
        if (!hasNavigatedRef.current || selectedIndexRef.current < 0) return false;
        const item = itemsRef.current[selectedIndexRef.current];
        if (!item || item.type === 'section-header') return false;
        e?.preventDefault();
        applyRef.current?.(item.value);
        return true;
      },
      COMMAND_PRIORITY_CRITICAL,
    );

    const unregisterTab = editor.registerCommand(
      KEY_TAB_COMMAND,
      (e) => {
        if (!openRef.current) return false;
        e?.preventDefault();
        editor.update(() => {
          const sel = $getSelection();
          if (!$isRangeSelection(sel)) return;
          const anchor = sel.anchor.getNode();
          const para = $getRoot().getFirstChild() as ParagraphNode | null;
          if (!para) return;
          if ($isShipQLLeafNode(anchor)) {
            const next = anchor.getNextSibling();
            const newSel = $createRangeSelection();
            if (next && $isTextNode(next)) {
              newSel.anchor.set(next.getKey(), 0, 'text');
              newSel.focus.set(next.getKey(), 0, 'text');
            } else {
              const emptyNode = $createTextNode(' ');
              para.append(emptyNode);
              newSel.anchor.set(emptyNode.getKey(), 1, 'text');
              newSel.focus.set(emptyNode.getKey(), 1, 'text');
            }
            $setSelection(newSel);
            return;
          }
          if ($isTextNode(anchor)) {
            const len = anchor.getTextContentSize();
            const newSel = $createRangeSelection();
            newSel.anchor.set(anchor.getKey(), len, 'text');
            newSel.focus.set(anchor.getKey(), len, 'text');
            $setSelection(newSel);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_CRITICAL,
    );

    const unregisterEscape = editor.registerCommand(
      KEY_ESCAPE_COMMAND,
      (e) => {
        if (!openRef.current) return false;
        e?.preventDefault();
        setOpenRef.current(false);
        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );

    const unregisterUpdate = editor.registerUpdateListener(({editorState, tags}) => {
      if (tags.has('shipql-rebuild') || tags.has('shipql-apply')) return;

      editorState.read(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;

        let activeText = getActiveSegment(para);
        let focusedLeaf: LeafAstNode | null = null;

        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          const anchor = sel.anchor.getNode();
          if ($isShipQLLeafNode(anchor)) {
            const shipqlNode = anchor.getShipQLNode();
            const textContent = anchor.getTextContent();
            if (shipqlNode.type === 'text' || textContent !== shipqlNode.source) {
              // Text-type leaf, or user is actively typing inside a leaf
              // (text content diverged from the AST source). Use the live
              // text so detectFacetContext can extract the partial value.
              activeText = textContent;
              focusedLeaf = null;
            } else {
              focusedLeaf = shipqlNode;
            }
          }
        }

        const facetCtx = detectFacetContext(activeText, normalizeFacets(facetsRef.current));
        if (focusedLeaf) {
          negationPrefixRef.current =
            focusedLeaf.type === 'not' ? negationPrefixFromSource(focusedLeaf.source) : '';
          setCurrentFacetRef.current(extractFacetFromLeaf(focusedLeaf) ?? null);
        } else {
          negationPrefixRef.current =
            facetCtx?.negationPrefix ?? stripNegationPrefix(activeText).prefix;
          setCurrentFacetRef.current(facetCtx?.facet ?? null);
        }
        const text = $getRoot().getTextContent();
        let ast: AstNode | null = null;
        try {
          ast = parse(text);
        } catch {
          /* invalid */
        }
        onLeafChangeRef.current?.({partialValue: facetCtx?.partialValue ?? '', ast});

        const newItems = buildSuggestionItems(
          facetsRef.current,
          valueSuggestionsRef.current,
          activeText,
          focusedLeaf,
        );
        setItemsRef.current(newItems);
        hasNavigatedRef.current = false;
        setSelectedIndexRef.current(-1);

        setOpenRef.current(isSelectingRef.current || isFocusedRef.current);
      });
    });

    return () => {
      unregisterFocus();
      unregisterBlur();
      unregisterArrowDown();
      unregisterArrowUp();
      unregisterEnter();
      unregisterTab();
      unregisterEscape();
      unregisterUpdate();
    };
  }, [editor, isSelectingRef, applyRef, negationPrefixRef]);

  return null;
}
