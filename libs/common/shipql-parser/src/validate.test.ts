import {describe, expect, it} from 'vitest';
import {parse} from './parser';
import type {AstNode} from './types';
import {hasTextNodes} from './validate';

function parsed(input: string): AstNode {
  const ast = (parse as (input: string) => AstNode | null)(input);
  if (!ast) throw new Error(`Failed to parse: ${input}`);
  return ast;
}

describe('hasTextNodes', () => {
  it('returns true for a bare word', () => {
    expect(hasTextNodes(parsed('hello'))).toBe(true);
  });

  it('returns true for a quoted string', () => {
    expect(hasTextNodes(parsed('"hello world"'))).toBe(true);
  });

  it('returns false for a facet match', () => {
    expect(hasTextNodes(parsed('status:200'))).toBe(false);
  });

  it('returns true for a mixed query with a text node', () => {
    expect(hasTextNodes(parsed('error service:api'))).toBe(true);
  });

  it('returns true for a text node inside NOT', () => {
    expect(hasTextNodes(parsed('NOT "error"'))).toBe(true);
  });

  it('returns false for multiple facet matches', () => {
    expect(hasTextNodes(parsed('status:200 env:prod'))).toBe(false);
  });

  it('returns false for a range query', () => {
    expect(hasTextNodes(parsed('status:[200 TO 300]'))).toBe(false);
  });
});
