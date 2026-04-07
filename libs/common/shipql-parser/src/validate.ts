import type {AstNode} from './types';

export function hasTextNodes(ast: AstNode): boolean {
  if (ast.type === 'text') return true;
  if (ast.type === 'and' || ast.type === 'or')
    return hasTextNodes(ast.left) || hasTextNodes(ast.right);
  if (ast.type === 'not') return hasTextNodes(ast.expr);
  return false;
}
