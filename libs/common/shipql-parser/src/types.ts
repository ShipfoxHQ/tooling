export type MatchNode = {
  type: 'match';
  facet: string;
  op: '>=' | '<=' | '>' | '<' | '=';
  value: string;
  source: string;
};

export type RangeNode = {
  type: 'range';
  facet: string;
  min: string;
  max: string;
  source: string;
};

export type TextNode = {
  type: 'text';
  value: string;
  source: string;
};

export type AndNode = {
  type: 'and';
  left: AstNode;
  right: AstNode;
  source: string;
};

export type OrNode = {
  type: 'or';
  left: AstNode;
  right: AstNode;
  source: string;
};

export type NotNode = {
  type: 'not';
  expr: AstNode;
  source: string;
};

export type AstNode = MatchNode | RangeNode | TextNode | AndNode | OrNode | NotNode;
