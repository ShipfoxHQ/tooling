import {describe, expect, it} from '@shipfox/vitest/vi';
import {parse, stringify} from './index';
import {removeBySource} from './remove';

/** Parse → remove → stringify helper. Returns empty string when tree is fully removed. */
function removeAndStringify(query: string, target: string): string {
  const ast = parse(query);
  const result = removeBySource(ast, target);
  return stringify(result);
}

describe('removeBySource', () => {
  it('should return null when removing the only node', () => {
    const ast = parse('status:success');
    expect(removeBySource(ast, 'status:success')).toBeNull();
  });

  it('should return empty string when stringifying null', () => {
    expect(removeAndStringify('status:success', 'status:success')).toBe('');
  });

  it('should remove the left side of an AND', () => {
    expect(removeAndStringify('status:success env:prod', 'status:success')).toBe('env:prod');
  });

  it('should remove the right side of an AND', () => {
    expect(removeAndStringify('status:success env:prod', 'env:prod')).toBe('status:success');
  });

  it('should remove from an OR expression', () => {
    expect(removeAndStringify('status:success OR env:prod', 'status:success')).toBe('env:prod');
  });

  it('should remove a NOT-wrapped leaf by its full source', () => {
    const ast = parse('status:success NOT env:prod');
    // The NOT node's source is "NOT env:prod"
    const notNode = ast?.type === 'and' ? ast.right : null;
    expect(notNode?.type).toBe('not');
    const result = removeBySource(ast, notNode!.source);
    expect(stringify(result)).toBe('status:success');
  });

  it('should remove a negated leaf by inner source', () => {
    // Remove the inner expr "env:prod" — this should collapse the NOT entirely
    expect(removeAndStringify('status:success NOT env:prod', 'env:prod')).toBe('status:success');
  });

  it('should remove from a complex expression', () => {
    // "status:[200 TO 299] OR (env:prod NOT service:payments)"
    // Remove status range → left with "env:prod NOT service:payments"
    const query = 'status:[200 TO 299] OR (env:prod NOT service:payments)';
    expect(removeAndStringify(query, 'status:[200 TO 299]')).toBe('env:prod -service:payments');
  });

  it('should keep tree unchanged when target not found', () => {
    const query = 'status:success env:prod';
    const ast = parse(query);
    const result = removeBySource(ast, 'nonexistent:value');
    // Result should be the same reference
    expect(result).toBe(ast);
  });

  it('should handle removing a text node', () => {
    expect(removeAndStringify('hello env:prod', 'hello')).toBe('env:prod');
  });

  it('should remove first match when duplicate sources exist', () => {
    // "status:200 OR status:200" — remove first occurrence
    const ast = parse('status:200 OR status:200');
    const result = removeBySource(ast, 'status:200');
    // The left gets removed, right remains
    expect(stringify(result)).toBe('status:200');
  });
});
