export interface RangeFacetConfig {
  type: 'range';
  min: string;
  max: string;
  presets?: string[];
}

export type FacetDef = string | {name: string; config: RangeFacetConfig};

export interface SuggestionItem {
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode | null;
  selected: boolean;
  type?: 'section-header' | 'range-slider';
  rangeFacetConfig?: RangeFacetConfig;
  facetName?: string;
}
