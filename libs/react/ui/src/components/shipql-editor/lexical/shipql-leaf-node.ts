import {type AstNode, parse, stringify} from '@shipfox/shipql-parser';
import {type EditorConfig, type NodeKey, type SerializedTextNode, TextNode} from 'lexical';

export type LeafAstNode = AstNode;

const LEAF_BASE_CLASSES =
  'whitespace-nowrap rounded-4 mx-1.5 px-4 py-2 text-foreground-neutral-base cursor-text transition-[background-color,box-shadow] duration-150 ease-out';
const LEAF_NORMAL_CLASSES =
  'bg-background-button-neutral-default hover:ring-1 hover:ring-border-highlights-interactive shadow-button-neutral';
const LEAF_ERROR_CLASSES = 'bg-tag-error-bg hover:bg-tag-error-bg-hover';

export function isSimpleLeaf(ast: AstNode): boolean {
  return ast.type === 'match' || ast.type === 'range' || ast.type === 'text';
}

/**
 * Returns true if an and/or node represents a grouped compound like
 * `env:(prod OR staging)` or `tag:(web AND api)` — i.e. a facet
 * followed by parenthesised values joined by AND/OR.
 */
const GROUPED_COMPOUND_RE = /^-?[a-zA-Z_][\w.]*:\(.*\)$/;
export function isGroupedCompound(ast: AstNode): boolean {
  if (ast.type !== 'and' && ast.type !== 'or') return false;
  return GROUPED_COMPOUND_RE.test(ast.source);
}

/** Returns true if a NOT node wraps a simple leaf or grouped compound (single chip). */
export function isNotLeaf(ast: AstNode): boolean {
  if (ast.type !== 'not') return false;
  return isSimpleLeaf(ast.expr) || isGroupedCompound(ast.expr);
}

function isValidLeafText(text: string): boolean {
  if (!text.trim()) return false;
  try {
    const ast = parse(text);
    if (ast === null) return false;
    return isSimpleLeaf(ast) || isNotLeaf(ast) || isGroupedCompound(ast);
  } catch {
    return false;
  }
}

type SerializedShipQLLeafNode = SerializedTextNode & {type: 'shipql-leaf'};

export class ShipQLLeafNode extends TextNode {
  __shipqlNode: LeafAstNode;
  __displayText: string | null;

  constructor(text: string, shipqlNode: LeafAstNode, key?: NodeKey, displayText?: string) {
    super(text, key);
    this.__shipqlNode = shipqlNode;
    this.__displayText = displayText ?? null;
  }

  static getType(): string {
    return 'shipql-leaf';
  }

  static clone(node: ShipQLLeafNode): ShipQLLeafNode {
    return new ShipQLLeafNode(
      node.__text,
      node.__shipqlNode,
      node.__key,
      node.__displayText ?? undefined,
    );
  }

  static importJSON(serialized: SerializedShipQLLeafNode): ShipQLLeafNode {
    const text = serialized.text;
    let shipqlNode: LeafAstNode;
    try {
      const ast = parse(text);
      if (ast !== null && isAstLeafNode(ast)) {
        shipqlNode = ast;
      } else {
        shipqlNode = {type: 'text', value: text, source: text};
      }
    } catch {
      shipqlNode = {type: 'text', value: text, source: text};
    }
    const node = new ShipQLLeafNode(text, shipqlNode);
    node.setFormat(serialized.format);
    node.setDetail(serialized.detail);
    node.setMode(serialized.mode);
    node.setStyle(serialized.style);
    return node;
  }

  exportJSON(): SerializedShipQLLeafNode {
    return {
      ...super.exportJSON(),
      type: 'shipql-leaf',
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    if (this.__displayText) {
      element.textContent = this.__displayText;
    }
    const valid = isValidLeafText(this.__text);
    for (const cls of LEAF_BASE_CLASSES.split(' ')) element.classList.add(cls);
    for (const cls of (valid ? LEAF_NORMAL_CLASSES : LEAF_ERROR_CLASSES).split(' '))
      element.classList.add(cls);
    element.setAttribute('data-shipql-leaf', 'true');
    element.setAttribute('data-shipql-key', this.__key);
    return element;
  }

  updateDOM(prevNode: this, dom: HTMLElement, config: EditorConfig): boolean {
    const result = super.updateDOM(prevNode, dom, config);
    if (prevNode.__text !== this.__text) {
      const prevValid = isValidLeafText(prevNode.__text);
      const nextValid = isValidLeafText(this.__text);
      if (prevValid !== nextValid) {
        for (const cls of (prevValid ? LEAF_NORMAL_CLASSES : LEAF_ERROR_CLASSES).split(' '))
          dom.classList.remove(cls);
        for (const cls of (nextValid ? LEAF_NORMAL_CLASSES : LEAF_ERROR_CLASSES).split(' '))
          dom.classList.add(cls);
      }
    }
    return result;
  }

  isSimpleText(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  getShipQLNode(): LeafAstNode {
    return this.getLatest().__shipqlNode;
  }
}

export function $isShipQLLeafNode(node: unknown): node is ShipQLLeafNode {
  return node instanceof ShipQLLeafNode;
}

export function $createShipQLLeafNode(
  text: string,
  shipqlNode: LeafAstNode,
  displayText?: string,
): ShipQLLeafNode {
  return new ShipQLLeafNode(text, shipqlNode, undefined, displayText);
}

/** Returns true if the AST node qualifies as a visual leaf chip in the editor. */
export function isAstLeafNode(ast: AstNode): ast is LeafAstNode {
  return isSimpleLeaf(ast) || isNotLeaf(ast) || isGroupedCompound(ast);
}

export function leafSource(node: LeafAstNode): string {
  return node.source ?? stringify(node);
}
