import {parse} from '@shipfox/shipql-parser';
import {describe, expect, it} from '@shipfox/vitest/vi';
import {
  astToSelectedFacets,
  formatFacetListValueForDisplay,
  selectedFacetsAndFreeTextToString,
} from './shipql-facets';

function roundTrip(query: string): string {
  const ast = parse(query);
  if (!ast) return '';
  const {facets, freeText} = astToSelectedFacets(ast);
  return selectedFacetsAndFreeTextToString(facets, freeText);
}

describe('shipql-facets', () => {
  describe('astToSelectedFacets', () => {
    it('simple match', () => {
      const ast = parse('status:success');
      if (!ast) throw new Error('expected non-null ast');
      const {facets, freeText} = astToSelectedFacets(ast);
      expect(freeText).toBe('');
      expect(facets.status?.type).toBe('list');
      if (facets.status?.type === 'list') {
        expect(facets.status.methodology).toBe('include');
        expect([...facets.status.values]).toContain('success');
      }
    });

    it('comparison ops', () => {
      const ast = parse('latency:>500');
      if (!ast) throw new Error('expected non-null ast');
      const {facets} = astToSelectedFacets(ast);
      expect(facets.latency?.type).toBe('list');
      if (facets.latency?.type === 'list') {
        expect([...facets.latency.values]).toContain('>500');
      }
    });

    it('range', () => {
      const ast = parse('status:[200 TO 299]');
      if (!ast) throw new Error('expected non-null ast');
      const {facets} = astToSelectedFacets(ast);
      expect(facets.status?.type).toBe('range');
      if (facets.status?.type === 'range') {
        expect(facets.status.min).toBe(200);
        expect(facets.status.max).toBe(299);
      }
    });

    it('free text', () => {
      const ast = parse('hello');
      if (!ast) throw new Error('expected non-null ast');
      const {facets, freeText} = astToSelectedFacets(ast);
      expect(freeText).toBe('hello');
      expect(Object.keys(facets)).toHaveLength(0);
    });

    it('NOT facet', () => {
      const ast = parse('NOT status:error');
      if (!ast) throw new Error('expected non-null ast');
      const {facets} = astToSelectedFacets(ast);
      expect(facets.status?.type).toBe('list');
      if (facets.status?.type === 'list') {
        expect(facets.status.methodology).toBe('exclude');
        expect([...facets.status.values]).toContain('error');
      }
    });

    it('null ast', () => {
      const {facets, freeText, termOrder} = astToSelectedFacets(null);
      expect(facets).toEqual({});
      expect(freeText).toBe('');
      expect(termOrder).toEqual([]);
    });

    it('termOrder reflects query order', () => {
      const ast = parse('status:success env:prod error service:api');
      if (!ast) throw new Error('expected non-null ast');
      const {termOrder} = astToSelectedFacets(ast);
      expect(termOrder).toEqual([
        'list:status:success:include',
        'list:env:prod:include',
        'freeText:0',
        'list:service:api:include',
      ]);
    });
  });

  describe('selectedFacetsAndFreeTextToString round-trip', () => {
    it('simple match', () => {
      expect(roundTrip('status:success')).toBe('status:success');
    });

    it('comparison', () => {
      expect(roundTrip('latency:>=500')).toBe('latency:>=500');
    });

    it('range', () => {
      expect(roundTrip('status:[200 TO 299]')).toBe('status:[200 TO 299]');
    });

    it('implicit AND', () => {
      expect(roundTrip('status:success env:prod')).toBe('status:success env:prod');
    });

    it('NOT', () => {
      expect(roundTrip('NOT status:error')).toBe('NOT status:error');
    });

    it('free text with match', () => {
      const out = roundTrip('error service:api');
      const ast = parse(out);
      if (!ast) throw new Error('expected non-null ast');
      const {facets, freeText} = astToSelectedFacets(ast);
      expect(freeText).toBe('error');
      expect(facets.service?.type).toBe('list');
      if (facets.service?.type === 'list') {
        expect([...facets.service.values]).toContain('api');
      }
    });

    it('negated range', () => {
      expect(roundTrip('-status:[400 TO 599]')).toBe('NOT status:[400 TO 599]');
    });
  });

  describe('formatFacetListValueForDisplay', () => {
    it('>= to ≥', () => {
      expect(formatFacetListValueForDisplay('>=400')).toBe('≥400');
    });

    it('<= to ≤', () => {
      expect(formatFacetListValueForDisplay('<=299')).toBe('≤299');
    });

    it('plain value unchanged', () => {
      expect(formatFacetListValueForDisplay('success')).toBe('success');
    });
  });
});
