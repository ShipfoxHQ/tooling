export interface ShipQLFieldDef {
  name: string;
  label: string;
  type?: 'list' | 'range';
  values?: string[];
  min?: number;
  max?: number;
}

export interface SuggestionItem {
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode | null;
  selected: boolean;
  isNegated: boolean;
  type?: 'section-header' | 'duration-range';
  rangeField?: ShipQLFieldDef;
}

export type FetchSuggestions = (fieldName?: string) => Promise<ShipQLFieldDef[]>;
