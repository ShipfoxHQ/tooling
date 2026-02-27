import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
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
} from './generate-suggestions';
import type {SuggestionItem} from './types';

interface ShipQLSuggestionsPluginProps {
  facets: string[];
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
  focusedLeafNode: LeafAstNode | null;
}

function getActiveSegment(para: ParagraphNode): string {
  const children = para.getChildren();
  let active = '';
  for (let i = children.length - 1; i >= 0; i--) {
    if ($isShipQLLeafNode(children[i])) break;
    active = children[i].getTextContent() + active;
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
  focusedLeafNode,
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

  const isFocusedRef = useRef(false);
  const prevFocusedLeafRef = useRef<LeafAstNode | null>(null);

  // ── Leaf refocus effect ─────────────────────────────────────────────────────
  useEffect(() => {
    if (focusedLeafNode === prevFocusedLeafRef.current) return;
    prevFocusedLeafRef.current = focusedLeafNode;

    if (focusedLeafNode) {
      const facet = extractFacetFromLeaf(focusedLeafNode);
      setCurrentFacetRef.current(facet ?? null);
      const leafItems = buildSuggestionItems(
        facetsRef.current,
        valueSuggestionsRef.current,
        '',
        focusedLeafNode,
      );
      setItemsRef.current(leafItems);
      setSelectedIndexRef.current(0);
      if (isFocusedRef.current) setOpenRef.current(true);
    } else {
      // Leaf deselected — regenerate text-based suggestions immediately
      editor.getEditorState().read(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;
        const activeText = getActiveSegment(para);
        const facetCtx = detectFacetContext(activeText, facetsRef.current);
        setCurrentFacetRef.current(facetCtx?.facet ?? null);
        const newItems = buildSuggestionItems(
          facetsRef.current,
          valueSuggestionsRef.current,
          activeText,
          null,
        );
        setItemsRef.current(newItems);
        setSelectedIndexRef.current(0);
      });
    }
  }, [focusedLeafNode, editor]);

  // ── Reactive regeneration when facets/valueSuggestions change ──────────────
  useEffect(() => {
    if (!openRef.current) return;
    if (prevFocusedLeafRef.current) {
      const leafItems = buildSuggestionItems(
        facets,
        valueSuggestions,
        '',
        prevFocusedLeafRef.current,
      );
      setItemsRef.current(leafItems);
      setOpenRef.current(isFocusedRef.current);
    } else {
      editor.getEditorState().read(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;
        const activeText = getActiveSegment(para);
        const newItems = buildSuggestionItems(facets, valueSuggestions, activeText, null);
        setItemsRef.current(newItems);
        setSelectedIndexRef.current(0);
        setOpenRef.current(isFocusedRef.current);
      });
    }
  }, [facets, valueSuggestions, editor]);

  // ── Apply function ──────────────────────────────────────────────────────────
  useEffect(() => {
    applyRef.current = (selectedValue: string) => {
      editor.update(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;

        const children = para.getChildren();

        // Find the last leaf chip
        let lastLeafIdx = -1;
        for (let i = children.length - 1; i >= 0; i--) {
          if ($isShipQLLeafNode(children[i])) {
            lastLeafIdx = i;
            break;
          }
        }

        // Remove trailing plain-text nodes after the last leaf chip
        for (let i = children.length - 1; i > lastLeafIdx; i--) {
          children[i].remove();
        }

        let insertText = '';

        if (currentFacetRef.current) {
          // Value selection — remove focused leaf chip if it matches the facet
          if (focusedLeafNodeRef.current && lastLeafIdx >= 0) {
            const lastLeaf = children[lastLeafIdx];
            if ($isShipQLLeafNode(lastLeaf)) {
              const leafText = lastLeaf.getTextContent().trimEnd();
              const fieldPrefix = `${currentFacetRef.current}:`;
              if (leafText === fieldPrefix || leafText.startsWith(fieldPrefix)) {
                lastLeaf.remove();
              }
            }
          }
          insertText = `${currentFacetRef.current}:${selectedValue} `;
        } else {
          // Facet selection — insert `facet:` and keep dropdown open for value input
          insertText = `${selectedValue}:`;
        }

        // Prefix with a space if the preceding content doesn't already end with one
        const currentText = para.getTextContent();
        if (currentText.length > 0 && !currentText.endsWith(' ')) {
          insertText = ` ${insertText}`;
        }

        const newNode = $createTextNode(insertText);
        para.append(newNode);

        const sel = $createRangeSelection();
        const len = newNode.getTextContentSize();
        sel.anchor.set(newNode.getKey(), len, 'text');
        sel.focus.set(newNode.getKey(), len, 'text');
        $setSelection(sel);
      });

      setSelectedIndexRef.current(0);
    };

    return () => {
      applyRef.current = null;
    };
  }, [editor, applyRef]);

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
        if (next < its.length) setSelectedIndexRef.current(next);
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
        if (prev >= 0) setSelectedIndexRef.current(prev);
        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );

    const unregisterEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (e) => {
        if (!openRef.current || itemsRef.current.length === 0) return false;
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
        if (!openRef.current || itemsRef.current.length === 0) return false;
        const item = itemsRef.current[selectedIndexRef.current];
        if (!item || item.type === 'section-header') return false;
        e?.preventDefault();
        applyRef.current?.(item.value);
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
      if (tags.has('shipql-rebuild')) return;

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
            if (shipqlNode.type === 'text') {
              activeText = anchor.getTextContent();
              focusedLeaf = null;
            } else {
              focusedLeaf = shipqlNode;
            }
          }
        }

        const facetCtx = detectFacetContext(activeText, facetsRef.current);
        const newFacet = facetCtx?.facet ?? null;
        setCurrentFacetRef.current(newFacet);

        const newItems = buildSuggestionItems(
          facetsRef.current,
          valueSuggestionsRef.current,
          activeText,
          focusedLeaf,
        );
        setItemsRef.current(newItems);
        setSelectedIndexRef.current(0);

        setOpenRef.current(isFocusedRef.current);
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
  }, [editor, isSelectingRef, applyRef]);

  return null;
}
