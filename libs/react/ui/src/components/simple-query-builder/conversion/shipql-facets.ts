import type {
  AndNode,
  AstNode,
  MatchNode,
  NotNode,
  RangeNode,
  TextNode,
} from '@shipfox/shipql-parser';
import {stringify} from '@shipfox/shipql-parser';
import type {SelectedFacets} from '../types';

export interface AstToFacetsResult {
  facets: SelectedFacets;
  freeText: string;
  termOrder: string[];
}

const TERM_ORDER_TEXT_SPLIT = /\s+/;

function collectTermOrder(ast: AstNode): string[] {
  const keys: string[] = [];
  function walk(node: AstNode, negated: boolean): void {
    switch (node.type) {
      case 'match': {
        const methodology = negated ? 'exclude' : 'include';
        const storedValue = node.op === '=' ? node.value : `${node.op}${node.value}`;
        keys.push(`list:${node.facet}:${storedValue}:${methodology}`);
        break;
      }
      case 'range':
        if (negated) {
          keys.push(`list:${node.facet}:[${node.min} TO ${node.max}]:exclude`);
        } else {
          keys.push(`range:${node.facet}`);
        }
        break;
      case 'text': {
        const parts = node.value.trim().split(TERM_ORDER_TEXT_SPLIT).filter(Boolean);
        for (let i = 0; i < parts.length; i++) keys.push(`freeText:${i}`);
        break;
      }
      case 'not':
        walk(node.expr, !negated);
        break;
      case 'and':
      case 'or':
        walk(node.left, negated);
        walk(node.right, negated);
        break;
    }
  }
  walk(ast, false);
  return keys;
}

const COMPARISON_OPS = ['>=', '<=', '>', '<'] as const;

function collectMatches(
  ast: AstNode,
  negated: boolean,
): Array<{facet: string; value: string; negated: boolean; op: '>=' | '<=' | '>' | '<' | '='}> {
  const out: Array<{
    facet: string;
    value: string;
    negated: boolean;
    op: '>=' | '<=' | '>' | '<' | '=';
  }> = [];

  function walk(node: AstNode, isNegated: boolean): void {
    switch (node.type) {
      case 'match':
        out.push({
          facet: node.facet,
          value: node.value,
          negated: isNegated,
          op: node.op,
        });
        break;
      case 'range':
      case 'text':
        break;
      case 'not':
        walk(node.expr, !isNegated);
        break;
      case 'and':
      case 'or':
        walk(node.left, isNegated);
        walk(node.right, isNegated);
        break;
    }
  }

  walk(ast, negated);
  return out;
}

function collectRanges(
  ast: AstNode,
  negated: boolean,
): Array<{facet: string; min: string; max: string; negated: boolean}> {
  const out: Array<{facet: string; min: string; max: string; negated: boolean}> = [];

  function walk(node: AstNode, isNegated: boolean): void {
    switch (node.type) {
      case 'range':
        out.push({
          facet: node.facet,
          min: node.min,
          max: node.max,
          negated: isNegated,
        });
        break;
      case 'match':
      case 'text':
        break;
      case 'not':
        walk(node.expr, !isNegated);
        break;
      case 'and':
      case 'or':
        walk(node.left, isNegated);
        walk(node.right, isNegated);
        break;
    }
  }

  walk(ast, negated);
  return out;
}

function collectText(ast: AstNode): string[] {
  const out: string[] = [];

  function walk(node: AstNode): void {
    switch (node.type) {
      case 'text':
        out.push(node.value);
        break;
      case 'match':
      case 'range':
        break;
      case 'not':
        walk(node.expr);
        break;
      case 'and':
      case 'or':
        walk(node.left);
        walk(node.right);
        break;
    }
  }

  walk(ast);
  return out;
}

function parseRangeNumber(s: string): number {
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export function astToSelectedFacets(ast: AstNode | null): AstToFacetsResult {
  const facets: SelectedFacets = {};

  if (ast === null) {
    return {facets, freeText: '', termOrder: []};
  }

  const matches = collectMatches(ast, false);
  const byFacet = new Map<string, Array<{value: string; negated: boolean}>>();
  for (const m of matches) {
    const storedValue = m.op === '=' ? m.value : `${m.op}${m.value}`;
    let arr = byFacet.get(m.facet);
    if (!arr) {
      arr = [];
      byFacet.set(m.facet, arr);
    }
    arr.push({value: storedValue, negated: m.negated});
  }

  for (const [facetId, entries] of byFacet) {
    const negatedValues = entries.filter((e) => e.negated).map((e) => e.value);
    const includeValues = entries.filter((e) => !e.negated).map((e) => e.value);
    if (negatedValues.length > 0 && includeValues.length === 0) {
      facets[facetId] = {
        type: 'list',
        methodology: 'exclude',
        values: new Set(negatedValues),
      };
    } else if (includeValues.length > 0) {
      facets[facetId] = {
        type: 'list',
        methodology: 'include',
        values: new Set(includeValues),
      };
    }
  }

  const ranges = collectRanges(ast, false);
  for (const r of ranges) {
    if (r.negated) {
      const rangeStr = `[${r.min} TO ${r.max}]`;
      const existing = facets[r.facet];
      if (existing?.type === 'list' && existing.methodology === 'exclude') {
        facets[r.facet] = {
          type: 'list',
          methodology: 'exclude',
          values: new Set([...existing.values, rangeStr]),
        };
      } else {
        facets[r.facet] = {type: 'list', methodology: 'exclude', values: new Set([rangeStr])};
      }
    } else {
      const min = parseRangeNumber(r.min);
      const max = parseRangeNumber(r.max);
      facets[r.facet] = {type: 'range', min, max};
    }
  }

  const freeText = collectText(ast).join(' ').trim();
  const termOrder = collectTermOrder(ast);
  return {facets, freeText, termOrder};
}

function parseComparisonValue(s: string): {op: '>=' | '<=' | '>' | '<' | '='; value: string} {
  for (const op of COMPARISON_OPS) {
    if (s.startsWith(op)) {
      return {op, value: s.slice(op.length).trim()};
    }
  }
  return {op: '=', value: s};
}

const RANGE_EXCLUDE_PATTERN = /^\[(.+)\s+TO\s+(.+)\]$/;

function parseRangeExcludeValue(s: string): {min: string; max: string} | null {
  const m = s.match(RANGE_EXCLUDE_PATTERN);
  if (!m) return null;
  return {min: m[1].trim(), max: m[2].trim()};
}

export function selectedFacetsAndFreeTextToAst(
  facets: SelectedFacets,
  freeText: string,
): AstNode | null {
  const nodes: AstNode[] = [];

  for (const [facetId, selection] of Object.entries(facets)) {
    if (selection.type === 'list') {
      const values = [...selection.values];
      if (values.length === 0) continue;
      if (selection.methodology === 'include') {
        for (const v of values) {
          const parsed = parseComparisonValue(v ?? '');
          nodes.push({
            type: 'match',
            facet: facetId,
            op: parsed.op,
            value: parsed.value,
          } as MatchNode);
        }
      } else {
        for (const v of values) {
          const val = v ?? '';
          const rangePart = parseRangeExcludeValue(val);
          if (rangePart) {
            nodes.push({
              type: 'not',
              expr: {
                type: 'range',
                facet: facetId,
                min: rangePart.min,
                max: rangePart.max,
              } as RangeNode,
            } as NotNode);
          } else {
            const parsed = parseComparisonValue(val);
            nodes.push({
              type: 'not',
              expr: {
                type: 'match',
                facet: facetId,
                op: parsed.op,
                value: parsed.value,
              } as MatchNode,
            } as NotNode);
          }
        }
      }
    } else {
      nodes.push({
        type: 'range',
        facet: facetId,
        min: String(selection.min),
        max: String(selection.max),
      } as RangeNode);
    }
  }

  if (freeText.trim()) {
    nodes.push({type: 'text', value: freeText.trim()} as TextNode);
  }

  if (nodes.length === 0) return null;
  const first = nodes[0];
  if (nodes.length === 1 || !first) return first ?? null;

  let acc: AstNode = first;
  for (let i = 1; i < nodes.length; i++) {
    const right = nodes[i];
    if (right) acc = {type: 'and', left: acc, right} as AndNode;
  }
  return acc;
}

export function selectedFacetsAndFreeTextToString(
  facets: SelectedFacets,
  freeText: string,
): string {
  const ast = selectedFacetsAndFreeTextToAst(facets, freeText);
  return stringify(ast);
}

export function formatFacetListValueForDisplay(value: string): string {
  if (value.startsWith('>=')) return `≥${value.slice(2)}`;
  if (value.startsWith('<=')) return `≤${value.slice(2)}`;
  return value;
}
