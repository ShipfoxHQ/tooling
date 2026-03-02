import {
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  type LexicalEditor,
  type ParagraphNode,
} from 'lexical';
import {$isShipQLLeafNode} from './shipql-leaf-node';

/**
 * Handles the right-arrow key when the cursor is on a leaf at the end of the
 * input. Moves the cursor out of the leaf (appending a space node if needed),
 * mirroring the behaviour of pressing space. Returns false when the conditions
 * are not met so the event falls through to Lexical's default handling.
 */
export function handleArrowRightFromLeaf(
  event: KeyboardEvent | null,
  editor: LexicalEditor,
): boolean {
  let shouldHandle = false;
  editor.getEditorState().read(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) return;
    const anchor = sel.anchor.getNode();
    if (!$isShipQLLeafNode(anchor)) return;
    const next = anchor.getNextSibling();
    // Only take over when the leaf is the last meaningful node in the input.
    if (!next || ($isTextNode(next) && next.getTextContentSize() === 0)) {
      shouldHandle = true;
    }
  });
  if (!shouldHandle) return false;
  event?.preventDefault();
  editor.update(() => {
    const sel = $getSelection();
    if (!$isRangeSelection(sel)) return;
    const anchor = sel.anchor.getNode();
    if (!$isShipQLLeafNode(anchor)) return;
    const para = $getRoot().getFirstChild() as ParagraphNode | null;
    if (!para) return;
    const next = anchor.getNextSibling();
    const newSel = $createRangeSelection();
    if (next && $isTextNode(next)) {
      newSel.anchor.set(next.getKey(), 0, 'text');
      newSel.focus.set(next.getKey(), 0, 'text');
    } else {
      const spaceNode = $createTextNode(' ');
      para.append(spaceNode);
      newSel.anchor.set(spaceNode.getKey(), 1, 'text');
      newSel.focus.set(spaceNode.getKey(), 1, 'text');
    }
    $setSelection(newSel);
  });
  return true;
}
