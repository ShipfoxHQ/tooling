import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $createRangeSelection,
  $createTextNode,
  $getRoot,
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
import {generateSuggestions, generateSuggestionsForLeaf} from './generate-suggestions';
import type {ShipQLFieldDef, SuggestionItem} from './types';

interface ShipQLSuggestionsPluginProps {
  fields: ShipQLFieldDef[];
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedIndex: number;
  setSelectedIndex: (i: number) => void;
  items: SuggestionItem[];
  setItems: (items: SuggestionItem[]) => void;
  isSelectingRef: React.RefObject<boolean>;
  applyRef: React.RefObject<((encodedValue: string) => void) | null>;
  isNegated: boolean;
  setIsNegated: (v: boolean) => void;
  focusedLeafNode: LeafAstNode | null;
  onActiveFieldChange: (fieldName?: string) => void;
}

/**
 * Derives the active text segment the user is currently typing —
 * trailing plain text after the last leaf chip (or full text if no chips).
 */
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
  fields,
  open,
  setOpen,
  selectedIndex,
  setSelectedIndex,
  items,
  setItems,
  isSelectingRef,
  applyRef,
  isNegated,
  setIsNegated,
  focusedLeafNode,
  onActiveFieldChange,
}: ShipQLSuggestionsPluginProps) {
  const [editor] = useLexicalComposerContext();

  // Keep latest state values accessible in stable callbacks without re-registering.
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
  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;
  const isNegatedRef = useRef(isNegated);
  isNegatedRef.current = isNegated;
  const setIsNegatedRef = useRef(setIsNegated);
  setIsNegatedRef.current = setIsNegated;
  const onActiveFieldChangeRef = useRef(onActiveFieldChange);
  onActiveFieldChangeRef.current = onActiveFieldChange;

  // Track focus so the update listener can decide whether to open the dropdown.
  const isFocusedRef = useRef(false);
  // Track last active field to avoid redundant fetches.
  const lastActiveFieldRef = useRef<string | undefined>(undefined);
  // Track last focused leaf to detect changes.
  const prevFocusedLeafRef = useRef<LeafAstNode | null>(null);

  // ── Leaf refocus effect ─────────────────────────────────────────────────────
  useEffect(() => {
    if (focusedLeafNode === prevFocusedLeafRef.current) return;
    prevFocusedLeafRef.current = focusedLeafNode;

    if (focusedLeafNode) {
      const leafItems = generateSuggestionsForLeaf(
        focusedLeafNode,
        fieldsRef.current,
        isNegatedRef.current,
      );
      setItemsRef.current(leafItems);
      const firstNavigable = leafItems.findIndex((item) => item.type !== 'section-header');
      setSelectedIndexRef.current(firstNavigable >= 0 ? firstNavigable : 0);
      if (isFocusedRef.current) setOpenRef.current(true);

      // Trigger fetch for this facet's values
      if (focusedLeafNode.type === 'match') {
        onActiveFieldChangeRef.current(focusedLeafNode.facet);
      } else if (focusedLeafNode.type === 'range') {
        onActiveFieldChangeRef.current(focusedLeafNode.facet);
      } else if (
        focusedLeafNode.type === 'not' &&
        (focusedLeafNode.expr.type === 'match' || focusedLeafNode.expr.type === 'range')
      ) {
        onActiveFieldChangeRef.current(focusedLeafNode.expr.facet);
      }
    }
  }, [focusedLeafNode]);

  // ── Regenerate suggestions when isNegated changes (while dropdown open) ────
  useEffect(() => {
    if (!openRef.current) return;
    // If we have a focused leaf, regenerate leaf suggestions with new negated state
    if (prevFocusedLeafRef.current) {
      const leafItems = generateSuggestionsForLeaf(
        prevFocusedLeafRef.current,
        fieldsRef.current,
        isNegated,
      );
      setItemsRef.current(leafItems);
      return;
    }
    // Otherwise re-run text-based suggestions
    editor.getEditorState().read(() => {
      const para = $getRoot().getFirstChild() as ParagraphNode | null;
      if (!para) return;
      const activeText = getActiveSegment(para);
      const newItems = generateSuggestions(activeText, fieldsRef.current, {isNegated});
      setItemsRef.current(newItems);
      const firstNavigable = newItems.findIndex((item) => item.type !== 'section-header');
      setSelectedIndexRef.current(firstNavigable >= 0 ? firstNavigable : 0);
    });
  }, [isNegated, editor]);

  useEffect(() => {
    // Expose apply function to the outside (used by dropdown mouse clicks).
    applyRef.current = (encodedValue: string) => {
      let keepOpen = false;

      editor.update(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;

        const children = para.getChildren();
        let insertText = '';

        if (encodedValue.startsWith('__field__')) {
          // Remove all trailing plain-text nodes after the last leaf chip.
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

          insertText = `${encodedValue.replace('__field__', '')}:`;
          keepOpen = true;
        } else if (encodedValue.startsWith('__raw__')) {
          // Raw token — remove trailing plain text after last leaf, then insert as-is.
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

          // Also remove field-only leaf chip if present (e.g. `duration:` became a leaf).
          if (lastLeafIdx >= 0) {
            const lastLeaf = children[lastLeafIdx];
            const rawToken = encodedValue.replace('__raw__', '');
            const colonIdx = rawToken.indexOf(':');
            const fieldName = colonIdx > 0 ? rawToken.slice(0, colonIdx) : '';
            if (fieldName && $isShipQLLeafNode(lastLeaf)) {
              const leafText = lastLeaf.getTextContent().trimEnd();
              if (leafText === `${fieldName}:` || leafText.startsWith(`${fieldName}:`)) {
                lastLeaf.remove();
              }
            }
          }

          insertText = encodedValue.replace('__raw__', '');
          keepOpen = true; // keep open to show field suggestions after
        } else if (
          encodedValue.startsWith('__wildcard__') ||
          encodedValue.startsWith('__complete__') ||
          encodedValue.startsWith('__value__')
        ) {
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

          let fieldName = '';
          let value = '';
          let negatedFlag = '0';
          if (encodedValue.startsWith('__wildcard__')) {
            fieldName = encodedValue.replace('__wildcard__', '');
          } else {
            const raw = encodedValue.replace('__complete__', '').replace('__value__', '');
            [fieldName, value, negatedFlag] = raw.split('__');
          }

          // Remove field-only leaf chip if present.
          if (lastLeafIdx >= 0) {
            const lastLeaf = children[lastLeafIdx];
            if ($isShipQLLeafNode(lastLeaf)) {
              const leafText = lastLeaf.getTextContent().trimEnd();
              const fieldPrefix = `${fieldName}:`;
              if (leafText === fieldPrefix || leafText.startsWith(fieldPrefix)) {
                lastLeaf.remove();
              }
            }
          }

          if (encodedValue.startsWith('__wildcard__')) {
            insertText = `${fieldName}:* `;
          } else {
            insertText = negatedFlag === '1' ? `${fieldName}:!${value} ` : `${fieldName}:${value} `;
          }
          keepOpen = true; // keep open — update listener will show next field suggestions
        }

        if (!insertText) return;

        // Prefix with a space if the preceding content doesn't already end with one.
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

      if (!keepOpen) setOpenRef.current(false);
      setSelectedIndexRef.current(0);
    };

    return () => {
      applyRef.current = null;
    };
  }, [editor, applyRef]);

  useEffect(() => {
    const unregisterFocus = editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        isFocusedRef.current = true;
        // Always open on focus — items will be generated by the update listener
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
        if (!item || item.type === 'section-header' || item.type === 'duration-range') return false;
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
        if (!item || item.type === 'section-header' || item.type === 'duration-range') return false;
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
      // Skip updates triggered by our own rebuild to avoid feedback loops.
      if (tags.has('shipql-rebuild')) return;
      // If a leaf is focused, the leaf-refocus effect handles suggestions — don't override.
      if (prevFocusedLeafRef.current) return;

      editorState.read(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;

        const activeText = getActiveSegment(para);

        // Detect active field for async fetch
        const colonIdx = activeText.indexOf(':');
        const activeField = colonIdx > 0 ? activeText.slice(0, colonIdx).trim() : undefined;
        if (activeField !== lastActiveFieldRef.current) {
          lastActiveFieldRef.current = activeField;
          onActiveFieldChangeRef.current(activeField);
        }

        const newItems = generateSuggestions(activeText, fieldsRef.current, {
          isNegated: isNegatedRef.current,
        });
        setItemsRef.current(newItems);
        const firstNavigable = newItems.findIndex((item) => item.type !== 'section-header');
        setSelectedIndexRef.current(firstNavigable >= 0 ? firstNavigable : 0);

        setOpenRef.current(isFocusedRef.current && newItems.length > 0);
      });
    });

    // Negation toggle via Alt/Shift keys on the editor root element
    const rootElement = editor.getRootElement();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.shiftKey) setIsNegatedRef.current(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.altKey && !e.shiftKey) setIsNegatedRef.current(false);
    };
    rootElement?.addEventListener('keydown', handleKeyDown);
    rootElement?.addEventListener('keyup', handleKeyUp);

    return () => {
      unregisterFocus();
      unregisterBlur();
      unregisterArrowDown();
      unregisterArrowUp();
      unregisterEnter();
      unregisterTab();
      unregisterEscape();
      unregisterUpdate();
      rootElement?.removeEventListener('keydown', handleKeyDown);
      rootElement?.removeEventListener('keyup', handleKeyUp);
    };
  }, [editor, isSelectingRef, applyRef]);

  return null;
}
