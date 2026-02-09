import type {AstNode} from './index';

/**
 * Converts an AST back into a ShipQL query string.
 *
 * The output is a canonical form:
 * - AND is always implicit (no "AND" keyword)
 * - NOT is always the keyword form (no "-" shorthand)
 * - Values are quoted only when necessary (spaces, empty, or special characters)
 * - Parentheses are added only when needed to preserve precedence
 */
export function stringify(ast: AstNode | null): string {
  if (ast === null) return '';

  switch (ast.type) {
    case 'match': {
      const value = quoteIfNeeded(ast.value);
      return ast.op === '=' ? `${ast.facet}:${value}` : `${ast.facet}:${ast.op}${value}`;
    }

    case 'range':
      return `${ast.facet}:[${quoteIfNeeded(ast.min)} TO ${quoteIfNeeded(ast.max)}]`;

    case 'text':
      return quoteIfNeeded(ast.value);

    case 'and':
      return `${stringifyChild(ast.left, 'and')} ${stringifyChild(ast.right, 'and')}`;

    case 'or':
      return `${stringifyChild(ast.left, 'or')} OR ${stringifyChild(ast.right, 'or')}`;

    case 'not':
      return `NOT ${stringifyChild(ast.expr, 'not')}`;
  }
}

const NEEDS_QUOTING = /[\s"()[\]]/;

/** Quote a value if it contains whitespace, is empty, or contains special characters. */
function quoteIfNeeded(value: string): string {
  if (value === '' || NEEDS_QUOTING.test(value)) {
    return `"${value}"`;
  }
  return value;
}

/** Stringify a child node, wrapping in parentheses when precedence requires it. */
function stringifyChild(child: AstNode, parentType: 'and' | 'or' | 'not'): string {
  const s = stringify(child);

  // OR inside AND needs parens: a:1 (b:2 OR c:3)
  if (parentType === 'and' && child.type === 'or') {
    return `(${s})`;
  }

  // AND or OR inside NOT needs parens: NOT (a:1 b:2)
  if (parentType === 'not' && (child.type === 'and' || child.type === 'or')) {
    return `(${s})`;
  }

  return s;
}
