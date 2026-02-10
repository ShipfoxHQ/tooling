import {describe, expect, it} from '@shipfox/vitest/vi';
import {parse} from './index';

describe('parser', () => {
  // ── facet:value match ─────────────────────────────────────────────

  it('should parse a simple facet:value pair', () => {
    const result = parse('status:success');

    expect(result).toEqual({
      type: 'match',
      facet: 'status',
      op: '=',
      value: 'success',
      source: 'status:success',
    });
  });

  it('should support dotted facet names', () => {
    const result = parse('http.status:200');

    expect(result).toEqual({
      type: 'match',
      facet: 'http.status',
      op: '=',
      value: '200',
      source: 'http.status:200',
    });
  });

  // ── quoted values ─────────────────────────────────────────────────

  it('should support quoted values with spaces', () => {
    const result = parse('message:"hello world"');

    expect(result).toEqual({
      type: 'match',
      facet: 'message',
      op: '=',
      value: 'hello world',
      source: 'message:"hello world"',
    });
  });

  it('should support quoted empty value', () => {
    const result = parse('field:""');

    expect(result).toEqual({
      type: 'match',
      facet: 'field',
      op: '=',
      value: '',
      source: 'field:""',
    });
  });

  // ── implicit AND ──────────────────────────────────────────────────

  it('should implicitly AND adjacent terms', () => {
    const result = parse('status:success repository:shipfox');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'status', op: '=', value: 'success', source: 'status:success'},
      right: {type: 'match', facet: 'repository', op: '=', value: 'shipfox', source: 'repository:shipfox'},
      source: 'status:success repository:shipfox',
    });
  });

  it('should chain multiple implicit ANDs left-to-right', () => {
    const result = parse('a:1 b:2 c:3');

    expect(result).toEqual({
      type: 'and',
      left: {
        type: 'and',
        left: {type: 'match', facet: 'a', op: '=', value: '1', source: 'a:1'},
        right: {type: 'match', facet: 'b', op: '=', value: '2', source: 'b:2'},
        source: 'a:1 b:2',
      },
      right: {type: 'match', facet: 'c', op: '=', value: '3', source: 'c:3'},
      source: 'a:1 b:2 c:3',
    });
  });

  // ── explicit AND ──────────────────────────────────────────────────

  it('should support explicit AND', () => {
    const result = parse('status:success AND repository:shipfox');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'status', op: '=', value: 'success', source: 'status:success'},
      right: {type: 'match', facet: 'repository', op: '=', value: 'shipfox', source: 'repository:shipfox'},
      source: 'status:success AND repository:shipfox',
    });
  });

  // ── explicit OR ───────────────────────────────────────────────────

  it('should support explicit OR', () => {
    const result = parse('status:success OR status:error');

    expect(result).toEqual({
      type: 'or',
      left: {type: 'match', facet: 'status', op: '=', value: 'success', source: 'status:success'},
      right: {type: 'match', facet: 'status', op: '=', value: 'error', source: 'status:error'},
      source: 'status:success OR status:error',
    });
  });

  // ── precedence: AND binds tighter than OR ─────────────────────────

  it('should give AND higher precedence than OR', () => {
    // a:1 b:2 OR c:3  →  (a:1 AND b:2) OR c:3
    const result = parse('a:1 b:2 OR c:3');

    expect(result).toEqual({
      type: 'or',
      left: {
        type: 'and',
        left: {type: 'match', facet: 'a', op: '=', value: '1', source: 'a:1'},
        right: {type: 'match', facet: 'b', op: '=', value: '2', source: 'b:2'},
        source: 'a:1 b:2',
      },
      right: {type: 'match', facet: 'c', op: '=', value: '3', source: 'c:3'},
      source: 'a:1 b:2 OR c:3',
    });
  });

  // ── NOT ───────────────────────────────────────────────────────────

  it('should support NOT prefix', () => {
    const result = parse('NOT status:error');

    expect(result).toEqual({
      type: 'not',
      expr: {type: 'match', facet: 'status', op: '=', value: 'error', source: 'status:error'},
      source: 'NOT status:error',
    });
  });

  it('should combine NOT with implicit AND', () => {
    const result = parse('env:prod NOT status:error');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'env:prod'},
      right: {
        type: 'not',
        expr: {type: 'match', facet: 'status', op: '=', value: 'error', source: 'status:error'},
        source: 'NOT status:error',
      },
      source: 'env:prod NOT status:error',
    });
  });

  // ── dash negation shorthand ───────────────────────────────────────

  it('should support -facet:value as NOT shorthand', () => {
    const result = parse('-status:error');

    expect(result).toEqual({
      type: 'not',
      expr: {type: 'match', facet: 'status', op: '=', value: 'error', source: 'status:error'},
      source: '-status:error',
    });
  });

  it('should combine -facet:value with implicit AND', () => {
    const result = parse('env:prod -status:error');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'env:prod'},
      right: {
        type: 'not',
        expr: {type: 'match', facet: 'status', op: '=', value: 'error', source: 'status:error'},
        source: '-status:error',
      },
      source: 'env:prod -status:error',
    });
  });

  it('should support -facet:value with quoted values', () => {
    const result = parse('-message:"bad request"');

    expect(result).toEqual({
      type: 'not',
      expr: {type: 'match', facet: 'message', op: '=', value: 'bad request', source: 'message:"bad request"'},
      source: '-message:"bad request"',
    });
  });

  it('should keep dash inside values as-is', () => {
    const result = parse('id:abc-123');

    expect(result).toEqual({
      type: 'match',
      facet: 'id',
      op: '=',
      value: 'abc-123',
      source: 'id:abc-123',
    });
  });

  // ── parenthesized grouping ────────────────────────────────────────

  it('should support parenthesized grouping', () => {
    const result = parse('status:error AND (env:prod OR env:staging)');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'status', op: '=', value: 'error', source: 'status:error'},
      right: {
        type: 'or',
        left: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'env:prod'},
        right: {type: 'match', facet: 'env', op: '=', value: 'staging', source: 'env:staging'},
        source: '(env:prod OR env:staging)',
      },
      source: 'status:error AND (env:prod OR env:staging)',
    });
  });

  // ── free text ─────────────────────────────────────────────────────

  it('should support free text terms', () => {
    const result = parse('hello');

    expect(result).toEqual({
      type: 'text',
      value: 'hello',
      source: 'hello',
    });
  });

  it('should implicitly AND free text with facet:value', () => {
    const result = parse('error service:api');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'text', value: 'error', source: 'error'},
      right: {type: 'match', facet: 'service', op: '=', value: 'api', source: 'service:api'},
      source: 'error service:api',
    });
  });

  // ── comparison operators ───────────────────────────────────────────

  it('should support >= operator', () => {
    const result = parse('status:>=200');

    expect(result).toEqual({
      type: 'match',
      facet: 'status',
      op: '>=',
      value: '200',
      source: 'status:>=200',
    });
  });

  it('should support > operator', () => {
    const result = parse('latency:>500');

    expect(result).toEqual({
      type: 'match',
      facet: 'latency',
      op: '>',
      value: '500',
      source: 'latency:>500',
    });
  });

  it('should support <= operator', () => {
    const result = parse('status:<=299');

    expect(result).toEqual({
      type: 'match',
      facet: 'status',
      op: '<=',
      value: '299',
      source: 'status:<=299',
    });
  });

  it('should support < operator', () => {
    const result = parse('latency:<100');

    expect(result).toEqual({
      type: 'match',
      facet: 'latency',
      op: '<',
      value: '100',
      source: 'latency:<100',
    });
  });

  it('should normalize = operator to eq', () => {
    const result = parse('status:=200');

    expect(result).toEqual({
      type: 'match',
      facet: 'status',
      op: '=',
      value: '200',
      source: 'status:=200',
    });
  });

  it('should support comparison with quoted value', () => {
    const result = parse('timestamp:>="2025-01-01"');

    expect(result).toEqual({
      type: 'match',
      facet: 'timestamp',
      op: '>=',
      value: '2025-01-01',
      source: 'timestamp:>="2025-01-01"',
    });
  });

  it('should combine comparison with implicit AND', () => {
    const result = parse('service:api status:>=400');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'service', op: '=', value: 'api', source: 'service:api'},
      right: {type: 'match', facet: 'status', op: '>=', value: '400', source: 'status:>=400'},
      source: 'service:api status:>=400',
    });
  });

  it('should negate comparison with -', () => {
    const result = parse('-latency:>1000');

    expect(result).toEqual({
      type: 'not',
      expr: {type: 'match', facet: 'latency', op: '>', value: '1000', source: 'latency:>1000'},
      source: '-latency:>1000',
    });
  });

  // ── range queries ─────────────────────────────────────────────────

  it('should support range query with [min TO max]', () => {
    const result = parse('status:[200 TO 299]');

    expect(result).toEqual({
      type: 'range',
      facet: 'status',
      min: '200',
      max: '299',
      source: 'status:[200 TO 299]',
    });
  });

  it('should support range query with quoted bounds', () => {
    const result = parse('timestamp:["2025-01-01" TO "2025-12-31"]');

    expect(result).toEqual({
      type: 'range',
      facet: 'timestamp',
      min: '2025-01-01',
      max: '2025-12-31',
      source: 'timestamp:["2025-01-01" TO "2025-12-31"]',
    });
  });

  it('should combine range with implicit AND', () => {
    const result = parse('env:prod status:[200 TO 299]');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'env:prod'},
      right: {type: 'range', facet: 'status', min: '200', max: '299', source: 'status:[200 TO 299]'},
      source: 'env:prod status:[200 TO 299]',
    });
  });

  it('should negate range with -', () => {
    const result = parse('-status:[400 TO 599]');

    expect(result).toEqual({
      type: 'not',
      expr: {type: 'range', facet: 'status', min: '400', max: '599', source: 'status:[400 TO 599]'},
      source: '-status:[400 TO 599]',
    });
  });

  it('should support range with extra whitespace', () => {
    const result = parse('status:[  200  TO  299  ]');

    expect(result).toEqual({
      type: 'range',
      facet: 'status',
      min: '200',
      max: '299',
      source: 'status:[  200  TO  299  ]',
    });
  });

  // ── grouped values: facet:(val1 OR val2) ──────────────────────────

  it('should support grouped OR values', () => {
    const result = parse('env:(prod OR staging)');

    expect(result).toEqual({
      type: 'or',
      left: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'prod'},
      right: {type: 'match', facet: 'env', op: '=', value: 'staging', source: 'staging'},
      source: 'env:(prod OR staging)',
    });
  });

  it('should support grouped explicit AND values', () => {
    const result = parse('tag:(web AND api)');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'tag', op: '=', value: 'web', source: 'web'},
      right: {type: 'match', facet: 'tag', op: '=', value: 'api', source: 'api'},
      source: 'tag:(web AND api)',
    });
  });

  it('should support grouped implicit AND values', () => {
    const result = parse('tag:(web api)');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'tag', op: '=', value: 'web', source: 'web'},
      right: {type: 'match', facet: 'tag', op: '=', value: 'api', source: 'api'},
      source: 'tag:(web api)',
    });
  });

  it('should support a single value in group', () => {
    const result = parse('env:(prod)');

    expect(result).toEqual({
      type: 'match',
      facet: 'env',
      op: '=',
      value: 'prod',
      source: 'env:(prod)',
    });
  });

  it('should support quoted values inside groups', () => {
    const result = parse('message:("hello world" OR "goodbye world")');

    expect(result).toEqual({
      type: 'or',
      left: {type: 'match', facet: 'message', op: '=', value: 'hello world', source: '"hello world"'},
      right: {type: 'match', facet: 'message', op: '=', value: 'goodbye world', source: '"goodbye world"'},
      source: 'message:("hello world" OR "goodbye world")',
    });
  });

  it('should support NOT inside groups', () => {
    const result = parse('env:(NOT prod)');

    expect(result).toEqual({
      type: 'not',
      expr: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'prod'},
      source: 'env:(NOT prod)',
    });
  });

  it('should negate a grouped value with -', () => {
    const result = parse('-env:(prod OR staging)');

    expect(result).toEqual({
      type: 'not',
      expr: {
        type: 'or',
        left: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'prod'},
        right: {type: 'match', facet: 'env', op: '=', value: 'staging', source: 'staging'},
        source: 'env:(prod OR staging)',
      },
      source: '-env:(prod OR staging)',
    });
  });

  it('should chain multiple ORs inside a group', () => {
    const result = parse('env:(dev OR staging OR prod)');

    expect(result).toEqual({
      type: 'or',
      left: {
        type: 'or',
        left: {type: 'match', facet: 'env', op: '=', value: 'dev', source: 'dev'},
        right: {type: 'match', facet: 'env', op: '=', value: 'staging', source: 'staging'},
        source: 'dev OR staging',
      },
      right: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'prod'},
      source: 'env:(dev OR staging OR prod)',
    });
  });

  it('should respect AND > OR precedence inside groups', () => {
    // env:(a b OR c) → env:((a AND b) OR c)
    const result = parse('env:(a b OR c)');

    expect(result).toEqual({
      type: 'or',
      left: {
        type: 'and',
        left: {type: 'match', facet: 'env', op: '=', value: 'a', source: 'a'},
        right: {type: 'match', facet: 'env', op: '=', value: 'b', source: 'b'},
        source: 'a b',
      },
      right: {type: 'match', facet: 'env', op: '=', value: 'c', source: 'c'},
      source: 'env:(a b OR c)',
    });
  });

  it('should combine grouped value with implicit AND', () => {
    const result = parse('status:200 env:(prod OR staging)');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'status', op: '=', value: '200', source: 'status:200'},
      right: {
        type: 'or',
        left: {type: 'match', facet: 'env', op: '=', value: 'prod', source: 'prod'},
        right: {type: 'match', facet: 'env', op: '=', value: 'staging', source: 'staging'},
        source: 'env:(prod OR staging)',
      },
      source: 'status:200 env:(prod OR staging)',
    });
  });

  it('should support dotted facets with grouped values', () => {
    const result = parse('http.method:(GET OR POST)');

    expect(result).toEqual({
      type: 'or',
      left: {type: 'match', facet: 'http.method', op: '=', value: 'GET', source: 'GET'},
      right: {type: 'match', facet: 'http.method', op: '=', value: 'POST', source: 'POST'},
      source: 'http.method:(GET OR POST)',
    });
  });

  // ── quoted free text ──────────────────────────────────────────────

  it('should support quoted free text', () => {
    const result = parse('"hello world"');

    expect(result).toEqual({
      type: 'text',
      value: 'hello world',
      source: '"hello world"',
    });
  });

  it('should support single-word quoted free text', () => {
    const result = parse('"hello"');

    expect(result).toEqual({
      type: 'text',
      value: 'hello',
      source: '"hello"',
    });
  });

  it('should implicitly AND quoted free text with facet:value', () => {
    const result = parse('"error occurred" service:api');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'text', value: 'error occurred', source: '"error occurred"'},
      right: {type: 'match', facet: 'service', op: '=', value: 'api', source: 'service:api'},
      source: '"error occurred" service:api',
    });
  });

  it('should implicitly AND facet:value with quoted free text', () => {
    const result = parse('service:api "error occurred"');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'match', facet: 'service', op: '=', value: 'api', source: 'service:api'},
      right: {type: 'text', value: 'error occurred', source: '"error occurred"'},
      source: 'service:api "error occurred"',
    });
  });

  it('should OR quoted free text terms', () => {
    const result = parse('"hello world" OR "goodbye world"');

    expect(result).toEqual({
      type: 'or',
      left: {type: 'text', value: 'hello world', source: '"hello world"'},
      right: {type: 'text', value: 'goodbye world', source: '"goodbye world"'},
      source: '"hello world" OR "goodbye world"',
    });
  });

  it('should negate quoted free text with NOT', () => {
    const result = parse('NOT "error message"');

    expect(result).toEqual({
      type: 'not',
      expr: {type: 'text', value: 'error message', source: '"error message"'},
      source: 'NOT "error message"',
    });
  });

  it('should AND unquoted and quoted free text', () => {
    const result = parse('error "status code"');

    expect(result).toEqual({
      type: 'and',
      left: {type: 'text', value: 'error', source: 'error'},
      right: {type: 'text', value: 'status code', source: '"status code"'},
      source: 'error "status code"',
    });
  });

  it('should support empty quoted free text', () => {
    const result = parse('""');

    expect(result).toEqual({
      type: 'text',
      value: '',
      source: '""',
    });
  });

  // ── edge cases ────────────────────────────────────────────────────

  it('should not treat ANDROID as AND keyword', () => {
    const result = parse('ANDROID:true');

    expect(result).toEqual({
      type: 'match',
      facet: 'ANDROID',
      op: '=',
      value: 'true',
      source: 'ANDROID:true',
    });
  });

  it('should not treat ORDER as OR keyword', () => {
    const result = parse('ORDER:asc');

    expect(result).toEqual({
      type: 'match',
      facet: 'ORDER',
      op: '=',
      value: 'asc',
      source: 'ORDER:asc',
    });
  });

  it('should return null for empty input', () => {
    const result = parse('');

    expect(result).toEqual(null);
  });

  it('should handle leading and trailing whitespace', () => {
    const result = parse('  status:success  ');

    expect(result).toEqual({
      type: 'match',
      facet: 'status',
      op: '=',
      value: 'success',
      source: 'status:success',
    });
  });
});
