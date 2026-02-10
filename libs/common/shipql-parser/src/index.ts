import {parse as _parse} from './parser';

export const parse = _parse as (input: string) => AstNode | null;
export {stringify} from './stringify';

// ── AST node types ──────────────────────────────────────────────────

export type MatchNode = {
  type: 'match';
  facet: string;
  op: '>=' | '<=' | '>' | '<' | '=';
  value: string;
};

export type RangeNode = {
  type: 'range';
  facet: string;
  min: string;
  max: string;
};

export type TextNode = {
  type: 'text';
  value: string;
};

export type AndNode = {
  type: 'and';
  left: AstNode;
  right: AstNode;
};

export type OrNode = {
  type: 'or';
  left: AstNode;
  right: AstNode;
};

export type NotNode = {
  type: 'not';
  expr: AstNode;
};

export type AstNode = MatchNode | RangeNode | TextNode | AndNode | OrNode | NotNode;
