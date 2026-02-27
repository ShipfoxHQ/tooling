import {Icon} from 'components/icon';
import type {LeafAstNode} from '../lexical/shipql-leaf-node';
import type {SuggestionItem} from './types';

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

// ─── Facet context detection ──────────────────────────────────────────────────

export interface FacetContext {
  facet: string;
  partialValue: string;
}

export function detectFacetContext(activeText: string, facets: string[]): FacetContext | null {
  const colonIdx = activeText.indexOf(':');
  if (colonIdx <= 0) return null;
  const candidate = activeText.slice(0, colonIdx).trim().toLowerCase();
  const facet = facets.find((f) => f.toLowerCase() === candidate);
  if (!facet) return null;
  return {facet, partialValue: activeText.slice(colonIdx + 1)};
}

// ─── Suggestion builder ───────────────────────────────────────────────────────

export function buildSuggestionItems(
  facets: string[],
  valueSuggestions: string[],
  activeText: string,
  focusedLeaf: LeafAstNode | null,
): SuggestionItem[] {
  // Focused leaf — show values with current value marked selected.
  // Text-type leaves (bare words) are not facet:value matches, so fall through
  // to facet filtering using the leaf's text as the partial query.
  if (focusedLeaf && focusedLeaf.type !== 'text') {
    const currentValue = extractValueFromLeaf(focusedLeaf);
    return valueSuggestions.map((v) => ({
      value: v,
      label: v,
      icon: <Icon name="arrowRightLongFill" className="size-16 text-foreground-neutral-subtle" />,
      selected: v === currentValue,
    }));
  }

  const facetCtx = detectFacetContext(activeText, facets);

  // Typing field:value — show filtered value suggestions
  if (facetCtx) {
    const partial = facetCtx.partialValue.toLowerCase();
    const filtered = partial
      ? valueSuggestions.filter((v) => v.toLowerCase().includes(partial))
      : valueSuggestions;
    return filtered.map((v) => ({
      value: v,
      label: v,
      icon: <Icon name="arrowRightLongFill" className="size-16 text-foreground-neutral-subtle" />,
      selected: false,
    }));
  }

  // Otherwise show filtered facets. When cursor is inside a bare-word text
  // leaf chip, use that leaf's value as the filter term.
  const partial = (focusedLeaf?.type === 'text' ? focusedLeaf.value : activeText)
    .trim()
    .toLowerCase();
  const filtered = partial ? facets.filter((f) => f.toLowerCase().includes(partial)) : facets;
  return filtered.slice(0, 8).map((f) => ({
    value: f,
    label: f,
    icon: <Icon name="searchLine" className="size-16 text-foreground-neutral-subtle" />,
    selected: false,
  }));
}
