import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import type {AstNode} from '@shipfox/shipql-parser';
import {parse, removeBySource, stringify} from '@shipfox/shipql-parser';
import {
  $createRangeSelection,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
  $setSelection,
  BLUR_COMMAND,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_NORMAL,
  createCommand,
  FOCUS_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  KEY_ENTER_COMMAND,
  type LexicalNode,
  type ParagraphNode,
  type Point,
} from 'lexical';
import {useEffect, useRef} from 'react';
import {handleArrowRightFromLeaf} from './handle-arrow-right-from-leaf';
import {
  $createShipQLLeafNode,
  $isShipQLLeafNode,
  $setLeafFreeTextError,
  isGroupedCompound,
  isSimpleLeaf,
  type LeafAstNode,
  leafSource,
} from './shipql-leaf-node';

// ─── Tokenisation helpers ─────────────────────────────────────────────────────

type Segment = {kind: 'op'; text: string} | {kind: 'leaf'; text: string; node: LeafAstNode};

function collectLeaves(ast: AstNode): Array<{source: string; node: LeafAstNode}> {
  // Simple terminals are always a single leaf chip.
  if (isSimpleLeaf(ast)) {
    return [{source: leafSource(ast), node: ast}];
  }

  // NOT: if the inner expression is a simple leaf or grouped compound,
  // treat the whole NOT as a single chip. Otherwise recurse into expr.
  if (ast.type === 'not') {
    if (isSimpleLeaf(ast.expr) || isGroupedCompound(ast.expr)) {
      return [{source: ast.source, node: ast}];
    }
    return collectLeaves(ast.expr);
  }

  // AND/OR: if the node is a grouped compound like `env:(prod OR staging)`,
  // treat the whole thing as a single chip. Otherwise recurse both sides.
  if (ast.type === 'and' || ast.type === 'or') {
    if (isGroupedCompound(ast)) {
      return [{source: ast.source, node: ast}];
    }
    return [...collectLeaves(ast.left), ...collectLeaves(ast.right)];
  }

  return [];
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

function getOrderedLeafStateKey(text: string, counts: Map<string, number>): string {
  const index = (counts.get(text) ?? 0) + 1;
  counts.set(text, index);
  return `${text}::${index}`;
}

function getAbsoluteOffset(para: ParagraphNode, point: Point): number {
  if (point.type === 'element') {
    return para
      .getChildren()
      .slice(0, point.offset)
      .reduce((offset, child) => offset + ($isTextNode(child) ? child.getTextContentSize() : 0), 0);
  }

  let offset = 0;
  for (const child of para.getChildren()) {
    if (child.getKey() === point.key) return offset + point.offset;
    if ($isTextNode(child)) offset += child.getTextContentSize();
  }
  return offset + point.offset;
}

function getDesiredLeafErrorState(
  segments: Segment[],
  selectionOffset: number,
  allowFreeText: boolean,
  isFocused: boolean,
): Map<string, boolean> {
  const counts = new Map<string, number>();
  const leafRanges: Array<{stateKey: string; node: LeafAstNode; start: number; end: number}> = [];
  let offset = 0;

  for (const seg of segments) {
    if (seg.kind === 'leaf') {
      leafRanges.push({
        stateKey: getOrderedLeafStateKey(seg.text, counts),
        node: seg.node,
        start: offset,
        end: offset + seg.text.length,
      });
    }
    offset += seg.text.length;
  }

  const activeLeafKey =
    selectionOffset >= 0
      ? (leafRanges.find((leaf) => selectionOffset >= leaf.start && selectionOffset <= leaf.end)
          ?.stateKey ?? null)
      : null;

  const errorState = new Map<string, boolean>();
  for (const leaf of leafRanges) {
    const shouldError =
      !allowFreeText && isTextLeaf(leaf.node) && (!isFocused || leaf.stateKey !== activeLeafKey);
    errorState.set(leaf.stateKey, shouldError);
  }

  return errorState;
}

function leafErrorStateMatches(
  children: LexicalNode[],
  desiredErrorState: Map<string, boolean>,
): boolean {
  const counts = new Map<string, number>();

  for (const child of children) {
    if (!$isShipQLLeafNode(child)) continue;
    const stateKey = getOrderedLeafStateKey(child.getTextContent(), counts);
    if ((desiredErrorState.get(stateKey) ?? false) !== child.getLatest().__freeTextError) {
      return false;
    }
  }

  return true;
}

/** Returns true if a leaf segment represents a free-text node (bare word / quoted string). */
function isTextLeaf(node: LeafAstNode): boolean {
  if (node.type === 'text') return true;
  if (node.type === 'not' && node.expr.type === 'text') return true;
  return false;
}

// ─── Commands ─────────────────────────────────────────────────────────────────

/** Payload: the Lexical node key of the leaf to remove. */
export const REMOVE_LEAF_COMMAND = createCommand<string>('REMOVE_LEAF_COMMAND');

// ─── Plugin ───────────────────────────────────────────────────────────────────

const REBUILD_TAG = 'shipql-rebuild';

interface ShipQLPluginProps {
  onLeafFocus?: (node: LeafAstNode | null) => void;
  formatLeafDisplay?: (source: string, node: LeafAstNode) => string;
  allowFreeText?: boolean;
}

export function ShipQLPlugin({
  onLeafFocus,
  formatLeafDisplay,
  allowFreeText = true,
}: ShipQLPluginProps): null {
  const [editor] = useLexicalComposerContext();

  // Keep latest callback accessible inside Lexical listeners without re-registering.
  const onLeafFocusRef = useRef(onLeafFocus);
  onLeafFocusRef.current = onLeafFocus;
  const formatLeafDisplayRef = useRef(formatLeafDisplay);
  formatLeafDisplayRef.current = formatLeafDisplay;
  const allowFreeTextRef = useRef(allowFreeText);
  allowFreeTextRef.current = allowFreeText;

  // Track the key of the last focused leaf to avoid redundant callbacks.
  const lastFocusedKeyRef = useRef<string | null>(null);

  // Track whether the editor is focused so we can show errors only when blurred.
  const isFocusedRef = useRef(true);

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

    const unregisterArrowRight = editor.registerCommand(
      KEY_ARROW_RIGHT_COMMAND,
      (event) => handleArrowRightFromLeaf(event, editor),
      COMMAND_PRIORITY_NORMAL,
    );

    const unregisterRemoveLeaf = editor.registerCommand(
      REMOVE_LEAF_COMMAND,
      (nodeKey) => {
        editor.update(() => {
          const para = $getRoot().getFirstChild() as ParagraphNode | null;
          if (!para) return;

          // Find the leaf node's source text from its key. When a plain
          // TextNode sits immediately after the leaf (no leading space) the
          // parser treats them as one token — e.g. [Leaf("status:"), Text("s")]
          // parses as "status:s". Include that trailing fragment so
          // removeBySource can match the full AST source.
          let targetSource: string | null = null;
          for (const child of para.getChildren()) {
            if ($isShipQLLeafNode(child) && child.getKey() === nodeKey) {
              targetSource = child.getTextContent();
              const next = child.getNextSibling();
              if (next && $isTextNode(next) && !$isShipQLLeafNode(next)) {
                const trailing = next.getTextContent().split(' ')[0];
                if (trailing) targetSource += trailing;
              }
              break;
            }
          }
          if (!targetSource) return;

          // Parse, remove, re-stringify.
          const fullText = para.getTextContent();
          let ast: AstNode | null = null;
          try {
            ast = parse(fullText);
          } catch {
            return;
          }
          if (!ast) return;

          const newAst = removeBySource(ast, targetSource);
          const newText = stringify(newAst);

          // Replace paragraph content — the update listener will re-tokenize.
          para.clear();
          if (newText) {
            para.append($createTextNode(newText));
          }
        });
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );

    // ── Blur / Focus: toggle free-text error styling via rebuild ────────────

    function syncLeafNodesWithCurrentState(): void {
      editor.update(
        () => {
          const para = $getRoot().getFirstChild() as ParagraphNode | null;
          if (!para) return;
          const text = para.getTextContent();
          const children = para.getChildren();

          const sel = $getSelection();
          const selectionOffset = $isRangeSelection(sel) ? getAbsoluteOffset(para, sel.anchor) : -1;

          if (!text) {
            if (children.some($isShipQLLeafNode)) {
              para.clear();
            }
            return;
          }

          let ast: AstNode | null = null;
          try {
            ast = parse(text);
          } catch {
            return;
          }
          if (!ast) {
            if (!children.some($isShipQLLeafNode)) return;
            para.clear();
            para.append($createTextNode(text));
            return;
          }

          const segments = tokenize(text, collectLeaves(ast));
          const fmt = formatLeafDisplayRef.current;
          const desiredLeafErrors = getDesiredLeafErrorState(
            segments,
            selectionOffset,
            allowFreeTextRef.current,
            isFocusedRef.current,
          );

          if (
            !needsRebuild(children, segments) &&
            leafErrorStateMatches(children, desiredLeafErrors)
          ) {
            return;
          }

          para.clear();
          const newNodes: LexicalNode[] = [];
          const counts = new Map<string, number>();
          for (const seg of segments) {
            const node =
              seg.kind === 'leaf'
                ? $createShipQLLeafNode(
                    seg.text,
                    seg.node,
                    fmt?.(seg.text, seg.node),
                    desiredLeafErrors.get(getOrderedLeafStateKey(seg.text, counts)) ?? false,
                  )
                : $createTextNode(seg.text);
            newNodes.push(node);
            para.append(node);
          }

          if (selectionOffset >= 0 && newNodes.length > 0) {
            let remaining = selectionOffset;
            let lastTextNode: LexicalNode | null = null;

            for (const node of newNodes) {
              if (!$isTextNode(node)) continue;
              lastTextNode = node;
              const len = node.getTextContentSize();
              if (remaining <= len) {
                const nextSelection = $createRangeSelection();
                nextSelection.anchor.set(node.getKey(), remaining, 'text');
                nextSelection.focus.set(node.getKey(), remaining, 'text');
                $setSelection(nextSelection);
                return;
              }
              remaining -= len;
            }

            if (lastTextNode && $isTextNode(lastTextNode)) {
              const endSelection = $createRangeSelection();
              const end = lastTextNode.getTextContentSize();
              endSelection.anchor.set(lastTextNode.getKey(), end, 'text');
              endSelection.focus.set(lastTextNode.getKey(), end, 'text');
              $setSelection(endSelection);
            }
          }
        },
        {tag: REBUILD_TAG},
      );
    }

    const unregisterBlur = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        isFocusedRef.current = false;
        if (!allowFreeTextRef.current) syncLeafNodesWithCurrentState();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    const unregisterFocus = editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        isFocusedRef.current = true;
        if (!allowFreeTextRef.current) syncLeafNodesWithCurrentState();
        return false;
      },
      COMMAND_PRIORITY_LOW,
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
      let desiredLeafErrors = new Map<string, boolean>();
      let needsErrorStateUpdate = false;

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
            if ($isRangeSelection(sel)) {
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
        const sel = $getSelection();
        if ($isRangeSelection(sel)) {
          savedOffset = getAbsoluteOffset(para, sel.anchor);
        }
        desiredLeafErrors = getDesiredLeafErrorState(
          segments,
          savedOffset,
          allowFreeTextRef.current,
          isFocusedRef.current,
        );

        if (needsRebuild(children, segments)) {
          shouldRebuild = true;
          nextSegments = segments;
        } else {
          // No structural change — update leaf-focus and deferred text-node errors.
          if ($isRangeSelection(sel)) {
            const anchor = sel.anchor.getNode();
            const key = $isShipQLLeafNode(anchor) ? anchor.getKey() : null;
            if (key !== lastFocusedKeyRef.current) {
              lastFocusedKeyRef.current = key;
              onLeafFocusRef.current?.(
                key !== null && $isShipQLLeafNode(anchor) ? anchor.getShipQLNode() : null,
              );
            }
          } else if (lastFocusedKeyRef.current !== null) {
            lastFocusedKeyRef.current = null;
            onLeafFocusRef.current?.(null);
          }
          needsErrorStateUpdate = !leafErrorStateMatches(children, desiredLeafErrors);
        }
      });

      if (!shouldRebuild) {
        if (needsErrorStateUpdate) {
          editor.update(
            () => {
              const para = $getRoot().getFirstChild() as ParagraphNode | null;
              if (!para) return;

              const counts = new Map<string, number>();
              for (const child of para.getChildren()) {
                if (!$isShipQLLeafNode(child)) continue;
                const stateKey = getOrderedLeafStateKey(child.getTextContent(), counts);
                $setLeafFreeTextError(child, desiredLeafErrors.get(stateKey) ?? false);
              }
            },
            {tag: REBUILD_TAG},
          );
        }
        return;
      }

      // ── Rebuild node structure ─────────────────────────────────────────────
      editor.update(
        () => {
          const para = $getRoot().getFirstChild() as ParagraphNode | null;
          if (!para) return;

          para.clear();

          const fmt = formatLeafDisplayRef.current;
          const occurrenceCounts = new Map<string, number>();

          const newNodes = nextSegments.map((seg) => {
            if (seg.kind === 'leaf') {
              const stateKey = getOrderedLeafStateKey(seg.text, occurrenceCounts);
              const freeTextError = desiredLeafErrors.get(stateKey) ?? false;
              return $createShipQLLeafNode(
                seg.text,
                seg.node,
                fmt?.(seg.text, seg.node),
                freeTextError,
              );
            }
            return $createTextNode(seg.text);
          });

          for (const node of newNodes) para.append(node);

          // Restore cursor to the same absolute character position.
          if (savedOffset >= 0 && newNodes.length > 0) {
            let remaining = savedOffset;
            let lastTextNode: LexicalNode | null = null;
            let restoredSelection = false;
            for (const node of newNodes) {
              if (!$isTextNode(node)) continue;
              lastTextNode = node;
              const len = node.getTextContentSize();
              if (remaining <= len) {
                const sel = $createRangeSelection();
                sel.anchor.set(node.getKey(), remaining, 'text');
                sel.focus.set(node.getKey(), remaining, 'text');
                $setSelection(sel);
                restoredSelection = true;
                break;
              }
              remaining -= len;
            }

            if (!restoredSelection && lastTextNode && $isTextNode(lastTextNode)) {
              const sel = $createRangeSelection();
              const end = lastTextNode.getTextContentSize();
              sel.anchor.set(lastTextNode.getKey(), end, 'text');
              sel.focus.set(lastTextNode.getKey(), end, 'text');
              $setSelection(sel);
            }
          }
        },
        {tag: REBUILD_TAG},
      );
    });

    // Perform the initial tokenization pass directly. The update listener is
    // registered after Lexical has already committed its initialConfig editorState
    // (useEffect runs post-paint), so the listener never fires for the first render.
    // We do the full rebuild here instead of relying on the listener being triggered.
    syncLeafNodesWithCurrentState();

    return () => {
      unregisterEnter();
      unregisterParagraph();
      unregisterArrowRight();
      unregisterRemoveLeaf();
      unregisterBlur();
      unregisterFocus();
      unregisterUpdate();
    };
  }, [editor]);

  return null;
}
