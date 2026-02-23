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
  COMMAND_PRIORITY_HIGH,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ENTER_COMMAND,
  type LexicalNode,
  type ParagraphNode,
  type Point,
} from 'lexical';
import {useEffect, useRef} from 'react';
import {
  $createShipQLLeafNode,
  $isShipQLLeafNode,
  type LeafAstNode,
  leafSource,
} from './shipql-leaf-node';

// ─── Tokenisation helpers ─────────────────────────────────────────────────────

type Segment = {kind: 'op'; text: string} | {kind: 'leaf'; text: string; node: LeafAstNode};

function collectLeaves(ast: AstNode): Array<{source: string; node: LeafAstNode}> {
  switch (ast.type) {
    case 'match':
    case 'range':
    case 'text':
      return [{source: leafSource(ast), node: ast}];
    case 'and':
    case 'or':
      return [...collectLeaves(ast.left), ...collectLeaves(ast.right)];
    case 'not':
      return collectLeaves(ast.expr);
  }
}

function tokenize(fullText: string, leaves: Array<{source: string; node: LeafAstNode}>): Segment[] {
  const segments: Segment[] = [];
  let remaining = fullText;

  for (const {source, node} of leaves) {
    const idx = remaining.indexOf(source);
    if (idx === -1) {
      // Source not found in remaining text — bail and treat all as operator
      return [{kind: 'op', text: fullText}];
    }
    if (idx > 0) segments.push({kind: 'op', text: remaining.slice(0, idx)});
    segments.push({kind: 'leaf', text: source, node});
    remaining = remaining.slice(idx + source.length);
  }

  if (remaining.length > 0) segments.push({kind: 'op', text: remaining});
  return segments.filter((s) => s.text.length > 0);
}

function needsRebuild(children: LexicalNode[], segments: Segment[]): boolean {
  if (children.length !== segments.length) return true;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const seg = segments[i];
    if ($isShipQLLeafNode(child) !== (seg.kind === 'leaf')) return true;
    if ($isTextNode(child) && child.getTextContent() !== seg.text) return true;
  }
  return false;
}

function getAbsoluteOffset(para: ParagraphNode, point: Point): number {
  let offset = 0;
  for (const child of para.getChildren()) {
    if (child.getKey() === point.key) return offset + point.offset;
    if ($isTextNode(child)) offset += child.getTextContentSize();
  }
  return offset + point.offset;
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

const REBUILD_TAG = 'shipql-rebuild';

interface ShipQLPluginProps {
  onLeafFocus?: (node: LeafAstNode | null) => void;
}

export function ShipQLPlugin({onLeafFocus}: ShipQLPluginProps): null {
  const [editor] = useLexicalComposerContext();

  // Keep latest callback accessible inside Lexical listeners without re-registering.
  const onLeafFocusRef = useRef(onLeafFocus);
  onLeafFocusRef.current = onLeafFocus;

  // Track the key of the last focused leaf to avoid redundant callbacks.
  const lastFocusedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    // Block newlines — ShipQL is a single-line language.
    const unregisterEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        event?.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );
    const unregisterParagraph = editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => true,
      COMMAND_PRIORITY_HIGH,
    );

    const unregisterUpdate = editor.registerUpdateListener(({editorState, tags}) => {
      // After our own rebuild we only need to refresh the leaf-focus callback.
      if (tags.has(REBUILD_TAG)) {
        editorState.read(() => {
          const sel = $getSelection();
          if (!$isRangeSelection(sel)) return;
          const anchor = sel.anchor.getNode();
          const key = $isShipQLLeafNode(anchor) ? anchor.getKey() : null;
          if (key !== lastFocusedKeyRef.current) {
            lastFocusedKeyRef.current = key;
            onLeafFocusRef.current?.(
              key !== null && $isShipQLLeafNode(anchor) ? anchor.getShipQLNode() : null,
            );
          }
        });
        return;
      }

      // ── Read current editor state ──────────────────────────────────────────
      let shouldRebuild = false;
      let nextSegments: Segment[] = [];
      let savedOffset = -1;

      editorState.read(() => {
        const para = $getRoot().getFirstChild() as ParagraphNode | null;
        if (!para) return;

        const text = para.getTextContent();
        const children = para.getChildren();

        let ast: AstNode | null = null;
        try {
          ast = parse(text);
        } catch {
          // parse error — fall through with ast = null
        }

        if (!ast) {
          // Clear all leaf highlights if any exist.
          if (children.some($isShipQLLeafNode)) {
            shouldRebuild = true;
            nextSegments = text ? [{kind: 'op', text}] : [];
            const sel = $getSelection();
            if ($isRangeSelection(sel) && sel.anchor.type === 'text') {
              savedOffset = getAbsoluteOffset(para, sel.anchor);
            }
          }
          // Cursor left any leaf.
          if (lastFocusedKeyRef.current !== null) {
            lastFocusedKeyRef.current = null;
            onLeafFocusRef.current?.(null);
          }
          return;
        }

        const segments = tokenize(text, collectLeaves(ast));

        if (needsRebuild(children, segments)) {
          shouldRebuild = true;
          nextSegments = segments;
          const sel = $getSelection();
          if ($isRangeSelection(sel) && sel.anchor.type === 'text') {
            savedOffset = getAbsoluteOffset(para, sel.anchor);
          }
        } else {
          // No structural change — just update leaf-focus.
          const sel = $getSelection();
          if ($isRangeSelection(sel)) {
            const anchor = sel.anchor.getNode();
            const key = $isShipQLLeafNode(anchor) ? anchor.getKey() : null;
            if (key !== lastFocusedKeyRef.current) {
              lastFocusedKeyRef.current = key;
              onLeafFocusRef.current?.(
                key !== null && $isShipQLLeafNode(anchor) ? anchor.getShipQLNode() : null,
              );
            }
          }
        }
      });

      if (!shouldRebuild) return;

      // ── Rebuild node structure ─────────────────────────────────────────────
      editor.update(
        () => {
          const para = $getRoot().getFirstChild() as ParagraphNode | null;
          if (!para) return;

          para.clear();

          const newNodes = nextSegments.map((seg) =>
            seg.kind === 'leaf'
              ? $createShipQLLeafNode(seg.text, seg.node)
              : $createTextNode(seg.text),
          );

          for (const node of newNodes) para.append(node);

          // Restore cursor to the same absolute character position.
          if (savedOffset >= 0 && newNodes.length > 0) {
            let remaining = savedOffset;
            for (const node of newNodes) {
              const len = $isTextNode(node) ? node.getTextContentSize() : 0;
              if (remaining <= len) {
                const sel = $createRangeSelection();
                sel.anchor.set(node.getKey(), remaining, 'text');
                sel.focus.set(node.getKey(), remaining, 'text');
                $setSelection(sel);
                break;
              }
              remaining -= len;
            }
          }
        },
        {tag: REBUILD_TAG},
      );
    });

    return () => {
      unregisterEnter();
      unregisterParagraph();
      unregisterUpdate();
    };
  }, [editor]);

  return null;
}
