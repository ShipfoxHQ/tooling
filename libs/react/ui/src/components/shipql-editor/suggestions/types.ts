export interface RangeFacetConfig {
  type: 'range';
  min: string;
  max: string;
  presets?: string[];
  format?: (value: number) => string;
}

export type FacetDef = string | {name: string; config: RangeFacetConfig};

export type FormatLeafDisplay = (source: string) => string;

export interface SuggestionItem {
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode | null;
  selected: boolean;
  type?: 'section-header' | 'range-slider';
  rangeFacetConfig?: RangeFacetConfig;
  facetName?: string;
}
