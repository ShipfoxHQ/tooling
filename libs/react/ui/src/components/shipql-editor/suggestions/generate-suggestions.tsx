import {type AstNode, parse} from '@shipfox/shipql-parser';
import {Icon} from 'components/icon';
import type {LeafAstNode} from '../lexical/shipql-leaf-node';
import type {FacetDef, RangeFacetConfig, SuggestionItem} from './types';

// ─── Parse helper ─────────────────────────────────────────────────────────────

export function tryParse(text: string): AstNode | null {
  try {
    return parse(text);
  } catch {
    return null;
  }
}

// ─── Facet normalization ───────────────────────────────────────────────────────

export function normalizeFacets(facets: FacetDef[]): string[] {
  return facets.map((f) => (typeof f === 'string' ? f : f.name));
}

export function getFacetConfig(facets: FacetDef[], name: string): RangeFacetConfig | undefined {
  for (const f of facets) {
    if (typeof f !== 'string' && f.name.toLowerCase() === name.toLowerCase()) return f.config;
  }
  return undefined;
}

// ─── Leaf helpers ─────────────────────────────────────────────────────────────

export function extractFacetFromLeaf(leaf: LeafAstNode): string | undefined {
  if (leaf.type === 'match') return leaf.facet;
  if (leaf.type === 'range') return leaf.facet;
  if (leaf.type === 'not') {
    const inner = leaf.expr;
    if (inner.type === 'match' || inner.type === 'range') return inner.facet;
  }
  return undefined;
}

function extractValueFromLeaf(leaf: LeafAstNode): string | undefined {
  if (leaf.type === 'match') return leaf.value;
  if (leaf.type === 'not' && leaf.expr.type === 'match') return leaf.expr.value;
  return undefined;
}

// ─── Negation prefix detection ────────────────────────────────────────────────

const NOT_PREFIX_RE = /^(NOT\s+)(.*)/i;

/** Extracts the negation prefix used in a `not` node's source (either 'NOT ' or '-'). */
export function negationPrefixFromSource(source: string): string {
  return source.trimStart().startsWith('-') ? '-' : 'NOT ';
}

/** Strips a leading NOT or - negation prefix from activeText and returns it. */
export function stripNegationPrefix(activeText: string): {prefix: string; stripped: string} {
  const notMatch = NOT_PREFIX_RE.exec(activeText);
  if (notMatch) return {prefix: 'NOT ', stripped: notMatch[2] ?? ''};
  if (activeText.startsWith('-')) return {prefix: '-', stripped: activeText.slice(1)};
  return {prefix: '', stripped: activeText};
}

// ─── Facet context detection ──────────────────────────────────────────────────

export interface FacetContext {
  facet: string;
  partialValue: string;
  negationPrefix: string;
}

export function detectFacetContext(activeText: string, facets: string[]): FacetContext | null {
  const {prefix, stripped} = stripNegationPrefix(activeText);
  const colonIdx = stripped.indexOf(':');
  if (colonIdx <= 0) return null;
  const candidate = stripped.slice(0, colonIdx).trim().toLowerCase();
  const facet = facets.find((f) => f.toLowerCase() === candidate);
  if (!facet) return null;
  return {facet, partialValue: stripped.slice(colonIdx + 1), negationPrefix: prefix};
}

// ─── Suggestion builder ───────────────────────────────────────────────────────

export function buildSuggestionItems(
  facets: FacetDef[],
  valueSuggestions: string[],
  activeText: string,
  focusedLeaf: LeafAstNode | null,
): SuggestionItem[] {
  const facetNames = normalizeFacets(facets);

  const header = (label: string): SuggestionItem => ({
    value: `__header__${label}`,
    label,
    icon: null,
    selected: false,
    type: 'section-header',
  });

  // Focused leaf — show values with current value marked selected.
  // Text-type leaves (bare words) are not facet:value matches, so fall through
  // to facet filtering using the leaf's text as the partial query.
  if (focusedLeaf && focusedLeaf.type !== 'text') {
    const facetName = extractFacetFromLeaf(focusedLeaf) ?? '';
    const rangeCfg = getFacetConfig(facets, facetName);
    if (rangeCfg) {
      return [
        {
          value: `__range__${facetName}`,
          label: facetName,
          icon: null,
          selected: false,
          type: 'range-slider',
          rangeFacetConfig: rangeCfg,
          facetName,
        },
      ];
    }
    const currentValue = extractValueFromLeaf(focusedLeaf);
    if (valueSuggestions.length === 0) return [];
    return [
      header(facetName.toUpperCase()),
      ...valueSuggestions.map((v) => {
        const selected = v === currentValue;
        return {
          value: v,
          label: v,
          icon: (
            <Icon
              name={selected ? 'checkLine' : 'arrowRightLongFill'}
              className={
                selected
                  ? 'size-16 text-foreground-neutral-base'
                  : 'size-16 text-foreground-neutral-subtle'
              }
            />
          ),
          selected,
        };
      }),
    ];
  }

  const facetCtx = detectFacetContext(activeText, facetNames);

  // Typing field:value — check for range-type facet first
  if (facetCtx) {
    const rangeCfg = getFacetConfig(facets, facetCtx.facet);
    if (rangeCfg) {
      return [
        {
          value: `__range__${facetCtx.facet}`,
          label: facetCtx.facet,
          icon: null,
          selected: false,
          type: 'range-slider',
          rangeFacetConfig: rangeCfg,
          facetName: facetCtx.facet,
        },
      ];
    }

    // Regular facet — show value suggestions (parent is responsible for filtering)
    if (valueSuggestions.length === 0) return [];
    return [
      header(facetCtx.facet.toUpperCase()),
      ...valueSuggestions.map((v) => ({
        value: v,
        label: v,
        icon: <Icon name="arrowRightLongFill" className="size-16 text-foreground-neutral-subtle" />,
        selected: false,
      })),
    ];
  }

  // Otherwise show filtered facets. When cursor is inside a bare-word text
  // leaf chip, use that leaf's value as the filter term. Strip any NOT/- prefix
  // before matching so "NOT sta" still suggests "status", "-sta" suggests "status", etc.
  const rawPartial = focusedLeaf?.type === 'text' ? focusedLeaf.value : activeText;
  const partial = stripNegationPrefix(rawPartial.trim()).stripped.toLowerCase();
  const filtered = partial
    ? facetNames.filter((f) => f.toLowerCase().includes(partial))
    : facetNames;
  if (filtered.length === 0) return [];
  return [
    header('TYPE'),
    ...filtered.slice(0, 8).map((f) => ({
      value: f,
      label: f,
      icon: <Icon name="searchLine" className="size-16 text-foreground-neutral-subtle" />,
      selected: false,
    })),
  ];
}
