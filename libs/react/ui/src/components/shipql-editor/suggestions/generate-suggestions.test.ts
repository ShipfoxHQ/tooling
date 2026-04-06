import {describe, expect, it} from 'vitest';
import {
  buildSuggestionItems,
  detectFacetContext,
  getFacetConfig,
  getFacetMetadata,
  normalizeFacets,
  stripNegationPrefix,
} from './generate-suggestions';
import type {FacetDef} from './types';

// ─── normalizeFacets ───────────────────────────────────────────────────────────

describe('normalizeFacets', () => {
  it('extracts names from string and object facets', () => {
    const facets: FacetDef[] = [
      'status',
      {name: 'duration', config: {type: 'range', min: '0', max: '100'}},
      {name: 'pipeline.name', metadata: {label: 'Pipeline'}},
    ];

    const result = normalizeFacets(facets);

    expect(result).toEqual(['status', 'duration', 'pipeline.name']);
  });
});

// ─── getFacetConfig ────────────────────────────────────────────────────────────

describe('getFacetConfig', () => {
  it('returns config for a matching facet (case-insensitive)', () => {
    const config = {type: 'range' as const, min: '0', max: '1000'};
    const facets: FacetDef[] = [{name: 'duration', config}];

    const result = getFacetConfig(facets, 'Duration');

    expect(result).toBe(config);
  });

  it('returns undefined when facet has no config', () => {
    const facets: FacetDef[] = [{name: 'pipeline.name', metadata: {label: 'Pipeline'}}];

    const result = getFacetConfig(facets, 'pipeline.name');

    expect(result).toBeUndefined();
  });

  it('returns undefined when facet is not found', () => {
    const facets: FacetDef[] = ['status'];

    const result = getFacetConfig(facets, 'unknown');

    expect(result).toBeUndefined();
  });
});

// ─── getFacetMetadata ──────────────────────────────────────────────────────────

describe('getFacetMetadata', () => {
  it('returns metadata for a known facet', () => {
    const metadata = {label: 'Pipeline', group: 'pipeline', groupOrder: 1};
    const facets: FacetDef[] = [{name: 'pipeline.name', metadata}];

    const result = getFacetMetadata(facets, 'pipeline.name');

    expect(result).toBe(metadata);
  });

  it('returns undefined for string facets', () => {
    const facets: FacetDef[] = ['status'];

    const result = getFacetMetadata(facets, 'status');

    expect(result).toBeUndefined();
  });

  it('returns undefined for unknown facets', () => {
    const facets: FacetDef[] = [{name: 'pipeline.name', metadata: {label: 'Pipeline'}}];

    const result = getFacetMetadata(facets, 'unknown');

    expect(result).toBeUndefined();
  });

  it('matches by exact name (case-sensitive)', () => {
    const facets: FacetDef[] = [{name: 'pipeline.name', metadata: {label: 'Pipeline'}}];

    expect(getFacetMetadata(facets, 'Pipeline.Name')).toBeUndefined();
    expect(getFacetMetadata(facets, 'pipeline.name')).toBeDefined();
  });
});

// ─── detectFacetContext ────────────────────────────────────────────────────────

describe('detectFacetContext', () => {
  it('detects a facet:value context', () => {
    const result = detectFacetContext('status:succ', ['status', 'env']);

    expect(result).toEqual({facet: 'status', partialValue: 'succ', negationPrefix: ''});
  });

  it('detects negated facet:value with NOT prefix', () => {
    const result = detectFacetContext('NOT status:fail', ['status']);

    expect(result).toEqual({facet: 'status', partialValue: 'fail', negationPrefix: 'NOT '});
  });

  it('detects negated facet:value with dash prefix', () => {
    const result = detectFacetContext('-status:fail', ['status']);

    expect(result).toEqual({facet: 'status', partialValue: 'fail', negationPrefix: '-'});
  });

  it('returns null when no colon', () => {
    const result = detectFacetContext('status', ['status']);

    expect(result).toBeNull();
  });

  it('returns null when facet not in list', () => {
    const result = detectFacetContext('unknown:value', ['status']);

    expect(result).toBeNull();
  });
});

// ─── stripNegationPrefix ──────────────────────────────────────────────────────

describe('stripNegationPrefix', () => {
  it('strips NOT prefix', () => {
    expect(stripNegationPrefix('NOT status')).toEqual({prefix: 'NOT ', stripped: 'status'});
  });

  it('strips dash prefix', () => {
    expect(stripNegationPrefix('-status')).toEqual({prefix: '-', stripped: 'status'});
  });

  it('returns empty prefix when no negation', () => {
    expect(stripNegationPrefix('status')).toEqual({prefix: '', stripped: 'status'});
  });
});

// ─── buildSuggestionItems ─────────────────────────────────────────────────────

describe('buildSuggestionItems', () => {
  describe('without metadata (backward compat)', () => {
    const facets: FacetDef[] = ['status', 'env', 'service'];

    it('produces flat TYPE header', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      expect(result[0]).toMatchObject({type: 'section-header', label: 'TYPE'});
      expect(result.slice(1).map((i) => i.value)).toEqual(['status', 'env', 'service']);
    });

    it('filters facets by partial text', () => {
      const result = buildSuggestionItems(facets, [], 'sta', null);

      expect(result[0]).toMatchObject({type: 'section-header'});
      expect(result.slice(1).map((i) => i.value)).toEqual(['status']);
    });

    it('returns empty array when no match', () => {
      const result = buildSuggestionItems(facets, [], 'zzz', null);

      expect(result).toHaveLength(0);
    });
  });

  describe('with metadata (grouped mode)', () => {
    const facets: FacetDef[] = [
      {
        name: 'status',
        metadata: {label: 'Status', group: 'execution', groupLabel: 'Execution', groupOrder: 0},
      },
      {
        name: 'pipeline.name',
        metadata: {label: 'Pipeline', group: 'pipeline', groupLabel: 'Pipeline', groupOrder: 1},
      },
      {
        name: 'pipeline.id',
        metadata: {label: 'Pipeline ID', group: 'pipeline', groupLabel: 'Pipeline', groupOrder: 1},
      },
      {
        name: 'vcs.ref.head.name',
        metadata: {
          label: 'Branch',
          description: 'Branch or tag name',
          group: 'vcs',
          groupLabel: 'VCS',
          groupOrder: 5,
        },
      },
    ];

    it('produces grouped output with section headers', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      const headers = result.filter((i) => i.type === 'section-header');
      expect(headers.map((h) => h.label)).toEqual(['Execution', 'Pipeline', 'VCS']);
    });

    it('sorts groups by groupOrder', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      const headerIndices = result
        .map((item, idx) => ({item, idx}))
        .filter(({item}) => item.type === 'section-header')
        .map(({idx}) => idx);

      expect(headerIndices[0]).toBeLessThan(headerIndices[1] ?? Infinity);
      expect(headerIndices[1]).toBeLessThan(headerIndices[2] ?? Infinity);
    });

    it('sorts items within a group alphabetically by label', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      const pipelineHeaderIdx = result.findIndex(
        (i) => i.type === 'section-header' && i.label === 'Pipeline',
      );
      const pipelineGroupItems: typeof result = [];
      for (let i = pipelineHeaderIdx + 1; i < result.length; i++) {
        const item = result[i];
        if (!item || item.type === 'section-header') break;
        pipelineGroupItems.push(item);
      }

      expect(pipelineGroupItems.map((i) => i.label)).toEqual(['Pipeline', 'Pipeline ID']);
    });

    it('sets value to raw facet ID even when label differs', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      const pipelineItem = result.find(
        (i) => i.type !== 'section-header' && i.label === 'Pipeline',
      );
      expect(pipelineItem?.value).toBe('pipeline.name');
    });

    it('populates description field from metadata', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      const branchItem = result.find((i) => i.value === 'vcs.ref.head.name');
      expect(branchItem?.description).toBe('Branch or tag name');
    });

    it('filters by raw name', () => {
      const result = buildSuggestionItems(facets, [], 'pipeline', null);

      const nonHeaders = result.filter((i) => i.type !== 'section-header');
      expect(nonHeaders.map((i) => i.value)).toContain('pipeline.name');
      expect(nonHeaders.map((i) => i.value)).not.toContain('status');
    });

    it('filters by metadata label', () => {
      const result = buildSuggestionItems(facets, [], 'Branch', null);

      const nonHeaders = result.filter((i) => i.type !== 'section-header');
      expect(nonHeaders.map((i) => i.value)).toEqual(['vcs.ref.head.name']);
    });

    it('hides empty groups after filtering', () => {
      const result = buildSuggestionItems(facets, [], 'status', null);

      const headers = result.filter((i) => i.type === 'section-header');
      expect(headers).toHaveLength(1);
      expect(headers[0]?.label).toBe('Execution');
    });
  });

  describe('mixed state (some with metadata, some without)', () => {
    const facets: FacetDef[] = [
      {
        name: 'status',
        metadata: {label: 'Status', group: 'execution', groupLabel: 'Execution', groupOrder: 0},
      },
      'custom.field',
    ];

    it('ungrouped facets land in Other', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      const headers = result.filter((i) => i.type === 'section-header');
      const headerLabels = headers.map((h) => h.label);
      expect(headerLabels).toContain('Execution');
      expect(headerLabels).toContain('Other');
    });

    it('ungrouped facets use raw name as label', () => {
      const result = buildSuggestionItems(facets, [], '', null);

      const customItem = result.find((i) => i.value === 'custom.field');
      expect(customItem?.label).toBe('custom.field');
    });
  });

  describe('value suggestions', () => {
    it('shows value suggestions in facet context', () => {
      const result = buildSuggestionItems(['status'], ['success', 'failed'], 'status:', null);

      const nonHeaders = result.filter((i) => i.type !== 'section-header');
      expect(nonHeaders.map((i) => i.value)).toEqual(['success', 'failed']);
    });

    it('returns empty when no value suggestions in facet context', () => {
      const result = buildSuggestionItems(['status'], [], 'status:', null);

      expect(result).toHaveLength(0);
    });
  });
});
