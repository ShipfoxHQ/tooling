import {
  type AstNode,
  type MatchNode,
  parse,
  type RangeNode,
  type TextNode as ShipQLTextNode,
  stringify,
} from '@shipfox/shipql-parser';
import {type EditorConfig, type NodeKey, type SerializedTextNode, TextNode} from 'lexical';

export type LeafAstNode = MatchNode | RangeNode | ShipQLTextNode;

// These constant strings must remain as complete literals so Tailwind scans them.
const LEAF_BASE_CLASSES = 'rounded-4 px-2 cursor-text transition-colors duration-150';
const LEAF_NORMAL_CLASSES = 'bg-tag-blue-bg hover:bg-tag-blue-bg-hover';
const LEAF_ERROR_CLASSES = 'bg-tag-error-bg hover:bg-tag-error-bg-hover';

function isValidLeafText(text: string): boolean {
  if (!text.trim()) return false;
  try {
    const ast = parse(text);
    return ast !== null && (ast.type === 'match' || ast.type === 'range' || ast.type === 'text');
  } catch {
    return false;
  }
}

type SerializedShipQLLeafNode = SerializedTextNode & {type: 'shipql-leaf'};

export class ShipQLLeafNode extends TextNode {
  __shipqlNode: LeafAstNode;

  constructor(text: string, shipqlNode: LeafAstNode, key?: NodeKey) {
    super(text, key);
    this.__shipqlNode = shipqlNode;
  }

  static getType(): string {
    return 'shipql-leaf';
  }

  static clone(node: ShipQLLeafNode): ShipQLLeafNode {
    return new ShipQLLeafNode(node.__text, node.__shipqlNode, node.__key);
  }

  static importJSON(serialized: SerializedShipQLLeafNode): ShipQLLeafNode {
    const text = serialized.text;
    let shipqlNode: LeafAstNode;
    try {
      const ast = parse(text);
      if (ast !== null && (ast.type === 'match' || ast.type === 'range' || ast.type === 'text')) {
        shipqlNode = ast as LeafAstNode;
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
    const valid = isValidLeafText(this.__text);
    for (const cls of LEAF_BASE_CLASSES.split(' ')) element.classList.add(cls);
    for (const cls of (valid ? LEAF_NORMAL_CLASSES : LEAF_ERROR_CLASSES).split(' '))
      element.classList.add(cls);
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

export function $createShipQLLeafNode(text: string, shipqlNode: LeafAstNode): ShipQLLeafNode {
  return new ShipQLLeafNode(text, shipqlNode);
}

// Re-export for use in consumers wanting to identify AST leaf nodes
export function isAstLeafNode(ast: AstNode): ast is LeafAstNode {
  return ast.type === 'match' || ast.type === 'range' || ast.type === 'text';
}

export function leafSource(node: LeafAstNode): string {
  return node.source ?? stringify(node);
}
