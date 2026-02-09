import {describe, expect, it} from '@shipfox/vitest/vi';
import {parse} from './index';
import {stringify} from './stringify';

// ── helpers ─────────────────────────────────────────────────────────

/** Parse → stringify → parse and assert the two ASTs are identical. */
function expectRoundTrip(input: string) {
  const ast = parse(input);
  const output = stringify(ast);
  const reparsed = parse(output);

  expect(reparsed).toEqual(ast);
}

describe('stringify', () => {
  // ── facet match ───────────────────────────────────────────────────

  it('should stringify a simple facet:value', () => {
    const result = stringify(parse('status:success'));

    expect(result).toBe('status:success');
  });

  it('should stringify a dotted facet', () => {
    const result = stringify(parse('http.status:200'));

    expect(result).toBe('http.status:200');
  });

  it('should quote values with spaces', () => {
    const result = stringify(parse('message:"hello world"'));

    expect(result).toBe('message:"hello world"');
  });

  it('should quote empty values', () => {
    const result = stringify(parse('field:""'));

    expect(result).toBe('field:""');
  });

  // ── comparison operators ──────────────────────────────────────────

  it('should stringify >= operator', () => {
    const result = stringify(parse('status:>=400'));

    expect(result).toBe('status:>=400');
  });

  it('should stringify > operator', () => {
    const result = stringify(parse('latency:>500'));

    expect(result).toBe('latency:>500');
  });

  it('should stringify <= operator', () => {
    const result = stringify(parse('status:<=299'));

    expect(result).toBe('status:<=299');
  });

  it('should stringify < operator', () => {
    const result = stringify(parse('latency:<100'));

    expect(result).toBe('latency:<100');
  });

  it('should stringify = operator', () => {
    const result = stringify(parse('status:=200'));

    expect(result).toBe('status:=200');
  });

  it('should quote comparison values with special characters', () => {
    const result = stringify(parse('timestamp:>="2025-01-01"'));

    expect(result).toBe('timestamp:>=2025-01-01');
  });

  // ── range queries ─────────────────────────────────────────────────

  it('should stringify a range query', () => {
    const result = stringify(parse('status:[200 TO 299]'));

    expect(result).toBe('status:[200 TO 299]');
  });

  it('should stringify a range query with quoted bounds', () => {
    const result = stringify(parse('timestamp:["2025-01-01" TO "2025-12-31"]'));

    expect(result).toBe('timestamp:[2025-01-01 TO 2025-12-31]');
  });

  // ── implicit AND ──────────────────────────────────────────────────

  it('should stringify implicit AND', () => {
    const result = stringify(parse('status:success env:prod'));

    expect(result).toBe('status:success env:prod');
  });

  it('should stringify explicit AND as implicit', () => {
    const result = stringify(parse('status:success AND env:prod'));

    expect(result).toBe('status:success env:prod');
  });

  it('should stringify chained ANDs', () => {
    const result = stringify(parse('a:1 b:2 c:3'));

    expect(result).toBe('a:1 b:2 c:3');
  });

  // ── OR ────────────────────────────────────────────────────────────

  it('should stringify OR', () => {
    const result = stringify(parse('status:success OR status:error'));

    expect(result).toBe('status:success OR status:error');
  });

  // ── precedence: AND > OR ──────────────────────────────────────────

  it('should add parens when OR is nested inside AND', () => {
    const result = stringify(parse('status:error AND (env:prod OR env:staging)'));

    expect(result).toBe('status:error (env:prod OR env:staging)');
  });

  it('should not add parens when AND is nested inside OR', () => {
    const result = stringify(parse('a:1 b:2 OR c:3'));

    expect(result).toBe('a:1 b:2 OR c:3');
  });

  // ── NOT ───────────────────────────────────────────────────────────

  it('should stringify NOT', () => {
    const result = stringify(parse('NOT status:error'));

    expect(result).toBe('NOT status:error');
  });

  it('should stringify dash negation as NOT', () => {
    const result = stringify(parse('-status:error'));

    expect(result).toBe('NOT status:error');
  });

  it('should wrap compound expressions inside NOT', () => {
    const result = stringify(parse('-env:(prod OR staging)'));

    expect(result).toBe('NOT (env:prod OR env:staging)');
  });

  it('should stringify NOT combined with AND', () => {
    const result = stringify(parse('env:prod NOT status:error'));

    expect(result).toBe('env:prod NOT status:error');
  });

  // ── free text ─────────────────────────────────────────────────────

  it('should stringify unquoted free text', () => {
    const result = stringify(parse('hello'));

    expect(result).toBe('hello');
  });

  it('should stringify quoted free text', () => {
    const result = stringify(parse('"hello world"'));

    expect(result).toBe('"hello world"');
  });

  it('should stringify empty quoted free text', () => {
    const result = stringify(parse('""'));

    expect(result).toBe('""');
  });

  // ── null / empty ──────────────────────────────────────────────────

  it('should return empty string for null', () => {
    const result = stringify(null);

    expect(result).toBe('');
  });

  // ── round-trip tests ──────────────────────────────────────────────

  it('round-trip: simple match', () => {
    expectRoundTrip('status:success');
  });

  it('round-trip: quoted value', () => {
    expectRoundTrip('message:"hello world"');
  });

  it('round-trip: comparison', () => {
    expectRoundTrip('latency:>=500');
  });

  it('round-trip: range', () => {
    expectRoundTrip('status:[200 TO 299]');
  });

  it('round-trip: implicit AND', () => {
    expectRoundTrip('status:success env:prod');
  });

  it('round-trip: OR', () => {
    expectRoundTrip('status:success OR status:error');
  });

  it('round-trip: NOT', () => {
    expectRoundTrip('NOT status:error');
  });

  it('round-trip: mixed precedence', () => {
    expectRoundTrip('a:1 b:2 OR c:3');
  });

  it('round-trip: parenthesized OR inside AND', () => {
    expectRoundTrip('status:error (env:prod OR env:staging)');
  });

  it('round-trip: negated OR', () => {
    expectRoundTrip('NOT (env:prod OR env:staging)');
  });

  it('round-trip: free text with match', () => {
    expectRoundTrip('error service:api');
  });

  it('round-trip: quoted free text', () => {
    expectRoundTrip('"hello world"');
  });

  it('round-trip: complex query', () => {
    expectRoundTrip('env:prod status:>=400 NOT latency:>1000');
  });

  it('round-trip: chained ORs', () => {
    expectRoundTrip('a:1 OR b:2 OR c:3');
  });
});
