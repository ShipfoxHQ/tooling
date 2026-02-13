import {describe, expect, it} from '@shipfox/vitest/vi';
import {removeBadgeAndBuildFacets, selectedFacetsAndFreeTextToBadges} from './badges';

describe('badges', () => {
  describe('selectedFacetsAndFreeTextToBadges', () => {
    it('empty facets and freeText', () => {
      expect(selectedFacetsAndFreeTextToBadges({}, '')).toEqual([]);
    });

    it('list facet one value', () => {
      const facets = {
        status: {
          type: 'list' as const,
          methodology: 'include' as const,
          values: new Set(['success']),
        },
      };
      const badges = selectedFacetsAndFreeTextToBadges(facets, '');
      expect(badges).toHaveLength(1);
      expect(badges[0].type).toBe('facet');
      if (badges[0].type === 'facet') {
        expect(badges[0].facetId).toBe('status');
        expect(badges[0].value).toBe('success');
        expect(badges[0].methodology).toBe('include');
      }
    });

    it('list facet exclude', () => {
      const facets = {
        env: {type: 'list' as const, methodology: 'exclude' as const, values: new Set(['dev'])},
      };
      const badges = selectedFacetsAndFreeTextToBadges(facets, '');
      expect(badges[0].type).toBe('facet');
      if (badges[0].type === 'facet') {
        expect(badges[0].methodology).toBe('exclude');
      }
    });

    it('range facet', () => {
      const facets = {
        latency: {type: 'range' as const, min: 100, max: 500},
      };
      const badges = selectedFacetsAndFreeTextToBadges(facets, '');
      expect(badges).toHaveLength(1);
      expect(badges[0].type).toBe('facet');
      if (badges[0].type === 'facet') {
        expect(badges[0].displayValue).toBe('100–500');
      }
    });

    it('free text', () => {
      const badges = selectedFacetsAndFreeTextToBadges({}, 'hello');
      expect(badges).toHaveLength(1);
      expect(badges[0].type).toBe('freeText');
      if (badges[0].type === 'freeText') {
        expect(badges[0].value).toBe('hello');
        expect(badges[0].id).toBe('freeText:0');
      }
    });

    it('free text multiple words', () => {
      const badges = selectedFacetsAndFreeTextToBadges({}, 'a b c');
      expect(badges).toHaveLength(3);
      expect(badges[0].type).toBe('freeText');
      if (badges[0].type === 'freeText') {
        expect(badges[0].value).toBe('a');
        expect(badges[0].id).toBe('freeText:0');
      }
      if (badges[1].type === 'freeText') {
        expect(badges[1].value).toBe('b');
        expect(badges[1].id).toBe('freeText:1');
      }
      if (badges[2].type === 'freeText') {
        expect(badges[2].value).toBe('c');
        expect(badges[2].id).toBe('freeText:2');
      }
    });
  });

  describe('removeBadgeAndBuildFacets', () => {
    it('remove free text', () => {
      const {facets, freeText} = removeBadgeAndBuildFacets({}, 'hello', {
        id: 'freeText:0',
        type: 'freeText',
        value: 'hello',
        displayValue: 'hello',
      });
      expect(freeText).toBe('');
      expect(facets).toEqual({});
    });

    it('remove one of multiple free text words', () => {
      const {freeText} = removeBadgeAndBuildFacets({}, 'a b c', {
        id: 'freeText:1',
        type: 'freeText',
        value: 'b',
        displayValue: 'b',
      });
      expect(freeText).toBe('a c');
    });

    it('remove one list value', () => {
      const facets = {
        env: {
          type: 'list' as const,
          methodology: 'include' as const,
          values: new Set(['prod', 'staging']),
        },
      };
      const badge = selectedFacetsAndFreeTextToBadges(facets, '')[0];
      const {facets: next} = removeBadgeAndBuildFacets(facets, '', badge);
      expect(next.env?.type).toBe('list');
      if (next.env?.type === 'list') {
        expect(next.env.values.size).toBe(1);
      }
    });

    it('remove range', () => {
      const facets = {
        latency: {type: 'range' as const, min: 100, max: 500},
      };
      const badge = selectedFacetsAndFreeTextToBadges(facets, '')[0];
      const {facets: next} = removeBadgeAndBuildFacets(facets, '', badge);
      expect(next.latency).toBeUndefined();
    });
  });
});
