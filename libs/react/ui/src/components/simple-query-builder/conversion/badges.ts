import type {SelectedFacets} from '../types';
import {formatFacetListValueForDisplay} from './shipql-facets';

const FREE_TEXT_PART_SPLIT = /\s+/;
const FREE_TEXT_ID_PREFIX = /^freeText:/;

export interface FacetBadge {
  id: string;
  type: 'facet';
  facetId: string;
  methodology: 'include' | 'exclude';
  value: string;
  displayValue: string;
}

export interface FreeTextBadge {
  id: string;
  type: 'freeText';
  value: string;
  displayValue: string;
}

export type QueryBadge = FacetBadge | FreeTextBadge;

function badgeOrderKey(badge: QueryBadge): string {
  if (badge.type === 'freeText') return badge.id;
  if (badge.id.startsWith('range:')) return badge.id;
  return `list:${badge.facetId}:${badge.value}:${badge.methodology}`;
}

export function selectedFacetsAndFreeTextToBadges(
  facets: SelectedFacets,
  freeText: string,
  termOrder?: string[],
): QueryBadge[] {
  const badges: QueryBadge[] = [];
  let listIndex = 0;
  for (const [facetId, selection] of Object.entries(facets)) {
    if (selection.type === 'list') {
      for (const v of selection.values) {
        const value = v ?? '';
        badges.push({
          id: `list:${facetId}:${listIndex++}:${selection.methodology}`,
          type: 'facet',
          facetId,
          methodology: selection.methodology,
          value,
          displayValue: formatFacetListValueForDisplay(value),
        });
      }
    } else {
      const value = `${selection.min}-${selection.max}`;
      badges.push({
        id: `range:${facetId}`,
        type: 'facet',
        facetId,
        methodology: 'include',
        value,
        displayValue: `${selection.min}–${selection.max}`,
      });
    }
  }
  const freeTextParts = freeText.trim().split(FREE_TEXT_PART_SPLIT).filter(Boolean);
  for (let i = 0; i < freeTextParts.length; i++) {
    const value = freeTextParts[i];
    if (value === undefined) continue;
    badges.push({
      id: `freeText:${i}`,
      type: 'freeText',
      value,
      displayValue: value,
    });
  }
  if (termOrder?.length) {
    const orderIndex = new Map<string, number>();
    for (let i = 0; i < termOrder.length; i++) orderIndex.set(termOrder[i], i);
    badges.sort((a, b) => {
      const keyA = badgeOrderKey(a);
      const keyB = badgeOrderKey(b);
      const iA = orderIndex.get(keyA) ?? Number.MAX_SAFE_INTEGER;
      const iB = orderIndex.get(keyB) ?? Number.MAX_SAFE_INTEGER;
      return iA - iB;
    });
  }
  return badges;
}

export function removeBadgeAndBuildFacets(
  facets: SelectedFacets,
  freeText: string,
  badge: QueryBadge,
): {facets: SelectedFacets; freeText: string} {
  if (badge.type === 'freeText') {
    const parts = freeText.trim().split(FREE_TEXT_PART_SPLIT).filter(Boolean);
    const index = parseInt(badge.id.replace(FREE_TEXT_ID_PREFIX, ''), 10);
    if (Number.isNaN(index) || index < 0 || index >= parts.length) {
      return {facets: {...facets}, freeText: ''};
    }
    const nextParts = parts.filter((_, i) => i !== index);
    return {facets: {...facets}, freeText: nextParts.join(' ')};
  }
  const nextFacets = {...facets};
  const sel = nextFacets[badge.facetId];
  if (!sel) return {facets: nextFacets, freeText};
  if (sel.type === 'range') {
    delete nextFacets[badge.facetId];
    return {facets: nextFacets, freeText};
  }
  const nextValues = new Set(sel.values);
  nextValues.delete(badge.value);
  if (nextValues.size === 0) {
    delete nextFacets[badge.facetId];
  } else {
    nextFacets[badge.facetId] = {...sel, values: nextValues};
  }
  return {facets: nextFacets, freeText};
}
