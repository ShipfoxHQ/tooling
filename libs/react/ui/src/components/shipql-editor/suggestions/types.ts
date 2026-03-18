import type {AstNode} from '@shipfox/shipql-parser';

export interface RangeFacetConfig {
  type: 'range';
  min: string;
  max: string;
  step?: number;
  presets?: string[];
  format?: (value: string) => string;
}

export type FacetDef = string | {name: string; config: RangeFacetConfig};

export type FormatLeafDisplay = (source: string, node: AstNode) => string;

export interface SuggestionItem {
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode | null;
  selected: boolean;
  type?: 'section-header' | 'range-slider';
  rangeFacetConfig?: RangeFacetConfig;
  facetName?: string;
}
