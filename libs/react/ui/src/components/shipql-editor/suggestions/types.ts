import type {AstNode} from '@shipfox/shipql-parser';

export interface RangeFacetConfig {
  type: 'range';
  min: string;
  max: string;
  step?: number;
  presets?: string[];
  format?: (value: string) => string;
}

export interface FacetMetadata {
  label?: string;
  description?: string;
  group?: string;
  groupLabel?: string;
  groupOrder?: number;
  groupIcon?: string;
}

export type FacetDef = string | {id: string; config?: RangeFacetConfig; metadata?: FacetMetadata};

export type FormatLeafDisplay = (source: string, node: AstNode) => string;

export interface SuggestionItem {
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode | null;
  selected: boolean;
  type?: 'section-header' | 'range-slider' | 'facet-context';
  rangeFacetConfig?: RangeFacetConfig;
  facetName?: string;
  description?: string;
  /** For facet-context items: the group label shown above the facet name */
  sectionLabel?: string;
}
