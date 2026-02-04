export type FilterType = 'status' | 'duration' | 'ci_pipeline' | 'repository' | 'branch' | 'runner';

export interface QueryValue {
  value: string;
  isNegated: boolean;
}

export interface QueryToken {
  id: string;
  key: string;
  operator: string;
  values: QueryValue[];
  isBuilding?: boolean;
  isWildcard?: boolean;
}

export interface QueryFilter {
  type: FilterType;
  values: QueryValue[];
}

export interface Query {
  filters: QueryFilter[];
}

export interface FilterSuggestion {
  type: FilterType;
  label: string;
}

export interface ValueSuggestion {
  value: string;
  label: string;
  selected?: boolean;
  count?: number;
  category?: 'recent' | 'common';
}

export interface NumericRange {
  min: number | null;
  max: number | null;
}

export interface FieldRule {
  name: string;
  label: string;
  operators: string[];
  valueType: 'enum' | 'text' | 'number' | 'range';
  enumValues?: string[];
  allowMultiSelect: boolean;
  allowNegation: boolean;
  isSingleValue?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorType?: 'contradiction' | 'duplicate' | 'invalid_range' | 'single_select';
  conflictingValue?: QueryValue;
}

export interface SyntaxError {
  type: 'unknown_field' | 'invalid_operator' | 'invalid_format';
  message: string;
  field?: string;
}
