import type {AstNode} from './types';

/**
 * Removes the first AST node whose `source` matches `targetSource`.
 * Returns the modified tree, or `null` if the entire tree was removed.
 *
 * For compound nodes (and/or), removing one side returns the other.
 * For `not`, removing the inner expression removes the whole `not`.
 *
 * "First match" uses depth-first left-to-right traversal — if the same
 * source string appears in both branches of an AND/OR, only the left
 * occurrence is removed.
 */
export function removeBySource(ast: AstNode | null, targetSource: string): AstNode | null {
  if (ast === null) return null;

  if (ast.source === targetSource) return null;

  switch (ast.type) {
    case 'match':
    case 'range':
    case 'text':
      return ast;

    case 'not': {
      const inner = removeBySource(ast.expr, targetSource);
      if (inner === null) return null;
      if (inner === ast.expr) return ast;
      return {...ast, expr: inner, source: rebuildNotSource(inner)};
    }

    case 'and':
    case 'or': {
      // Try left first — if it changed, keep right untouched (first-match semantics).
      const left = removeBySource(ast.left, targetSource);
      if (left !== ast.left) {
        // Left side had a removal.
        if (left === null) return ast.right;
        return {...ast, left, source: rebuildBinarySource(ast.type, left, ast.right)};
      }
      // Left unchanged — try right.
      const right = removeBySource(ast.right, targetSource);
      if (right !== ast.right) {
        if (right === null) return ast.left;
        return {...ast, right, source: rebuildBinarySource(ast.type, ast.left, right)};
      }
      // Neither side changed.
      return ast;
    }
  }
}

function rebuildNotSource(expr: AstNode): string {
  if (expr.type === 'and' || expr.type === 'or') {
    return `NOT (${expr.source})`;
  }
  return `-${expr.source}`;
}

function rebuildBinarySource(type: 'and' | 'or', left: AstNode, right: AstNode): string {
  const leftStr = needsParens(left, type) ? `(${left.source})` : left.source;
  const rightStr = needsParens(right, type) ? `(${right.source})` : right.source;
  return type === 'or' ? `${leftStr} OR ${rightStr}` : `${leftStr} ${rightStr}`;
}

function needsParens(child: AstNode, parentType: 'and' | 'or'): boolean {
  // OR inside AND needs parens
  return parentType === 'and' && child.type === 'or';
}
