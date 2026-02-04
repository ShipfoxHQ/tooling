import type {
  FieldRule,
  FilterType,
  Query,
  QueryFilter,
  SyntaxError as QuerySyntaxError,
  QueryToken,
  QueryValue,
  ValidationResult,
} from '../types';

export const FIELD_RULES: FieldRule[] = [
  {
    name: 'status',
    label: 'Status',
    operators: [':', '!=', '='],
    valueType: 'enum',
    enumValues: ['success', 'failed', 'cancelled', 'skipped', 'running', 'queued'],
    allowMultiSelect: true,
    allowNegation: true,
  },
  {
    name: 'duration',
    label: 'Duration',
    operators: [':', '>', '<', '>=', '<=', '='],
    valueType: 'enum',
    enumValues: ['< 1 min', '1–5 min', '5–10 min', '> 10 min'],
    allowMultiSelect: true,
    allowNegation: true,
  },
  {
    name: 'ci_pipeline',
    label: 'CI Pipeline',
    operators: [':'],
    valueType: 'enum',
    enumValues: ['build', 'test', 'deploy', 'lint', 'security-scan', 'release'],
    allowMultiSelect: true,
    allowNegation: true,
  },
  {
    name: 'repository',
    label: 'Repository',
    operators: [':'],
    valueType: 'enum',
    enumValues: ['shipfox-api', 'shipfox-web', 'shipfox-runner', 'shipfox-infra', 'docs'],
    allowMultiSelect: true,
    allowNegation: true,
  },
  {
    name: 'branch',
    label: 'Branch',
    operators: [':'],
    valueType: 'enum',
    enumValues: ['main', 'develop', 'staging', 'release/', 'feature/'],
    allowMultiSelect: true,
    allowNegation: true,
  },
  {
    name: 'runner',
    label: 'Runner',
    operators: [':'],
    valueType: 'enum',
    enumValues: [
      'hosted-linux',
      'hosted-macos',
      'self-hosted-eu',
      'self-hosted-us',
      'self-hosted-asia',
    ],
    allowMultiSelect: true,
    allowNegation: true,
  },
];

const REGEX_FIELD_OPERATOR = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*(>=|<=|!=|>|<|:|=)/;
const REGEX_DURATION_OPERATOR_PREFIX = /^(>=|<=|>|<)(.+)$/;
const REGEX_DURATION_PREFIX = /^(>=|<=|>|<)/;
const REGEX_INVALID_CHARS_DURATION = /[&'"!@#$%^*(){}[\]|\\;`~]/;
const REGEX_INVALID_CHARS_DEFAULT = /[&'"<>!@#$%^*(){}[\]|\\;`~]/;
const REGEX_QUERY_SPLIT = /\s*\+\s*|\s+/;
const REGEX_PILL_PART = /^(\w+)([:!=<>]+)(.+)$/;
const REGEX_DURATION_OPERATOR = /^(>=|<=|>|<)/;
const REGEX_PARSE_DURATION =
  /^(\d+(?:\.\d+)?)\s*(s|sec|seconds?|m|min|minutes?|h|hr|hours?|d|days?)$/;
const REGEX_LESS_THAN_RANGE = /^<(\d+)([smhd]|min|sec|hour|day)?$/i;
const REGEX_GREATER_THAN_RANGE = /^>(\d+)([smhd]|min|sec|hour|day)?$/i;
const REGEX_RANGE = /^(\d+)-(\d+)([smhd]|min|sec|hour|day)?$/i;

export function getFieldRule(fieldName: string): FieldRule | undefined {
  return FIELD_RULES.find((f) => f.name === fieldName);
}

export function validateSyntax(input: string): QuerySyntaxError | null {
  if (!input || !input.trim()) return null;

  const trimmed = input.trim();

  const operatorMatch = trimmed.match(REGEX_FIELD_OPERATOR);

  if (!operatorMatch) {
    const parts = trimmed
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p);
    if (parts.length > 0) {
      const allValidDuration = parts.every((part) => {
        const match = part.match(REGEX_DURATION_OPERATOR_PREFIX);
        if (!match) return false;
        return parseDuration(match[2]) !== null;
      });
      if (allValidDuration) {
        return null;
      }
    }

    const hasDurationPrefix = REGEX_DURATION_PREFIX.test(trimmed);
    const invalidCharsRegex = hasDurationPrefix
      ? REGEX_INVALID_CHARS_DURATION
      : REGEX_INVALID_CHARS_DEFAULT;
    if (invalidCharsRegex.test(trimmed)) {
      return {
        type: 'invalid_format',
        message: `Invalid characters in input`,
      };
    }
    return null;
  }

  const [, fieldName, operator] = operatorMatch;
  const fieldLower = fieldName.toLowerCase();

  const fieldRule = FIELD_RULES.find((f) => f.name.toLowerCase() === fieldLower);

  if (!fieldRule) {
    return {
      type: 'unknown_field',
      message: `Unknown field: ${fieldName}`,
      field: fieldName,
    };
  }

  if (!fieldRule.operators.includes(operator)) {
    return {
      type: 'invalid_operator',
      message: `Invalid operator "${operator}" for ${fieldRule.label}. Use: ${fieldRule.operators.join(', ')}`,
      field: fieldRule.name,
    };
  }

  if (fieldRule.name === 'duration' && ['>', '<', '>=', '<='].includes(operator)) {
    const valueStr = trimmed.slice(operatorMatch[0].length).trim();

    if (valueStr) {
      const durationMs = parseDuration(valueStr);
      if (durationMs === null) {
        return {
          type: 'invalid_format',
          message: `Invalid duration format: "${valueStr}". Use: 5s, 30m, 1h, 2d`,
          field: fieldRule.name,
        };
      }
    }
  }

  const valueStr = trimmed.slice(operatorMatch[0].length);
  if (valueStr && REGEX_INVALID_CHARS_DEFAULT.test(valueStr)) {
    return {
      type: 'invalid_format',
      message: `Invalid characters in value`,
      field: fieldRule.name,
    };
  }

  return null;
}

export function validateAddValue(
  clause: {field: string; values: QueryValue[]},
  newValue: QueryValue,
  fieldRule: FieldRule,
): ValidationResult {
  if (newValue.isNegated && !fieldRule.allowNegation) {
    return {
      valid: false,
      error: `Negation not allowed for ${fieldRule.label}`,
      errorType: 'contradiction',
    };
  }

  const isDuplicate = clause.values.some(
    (v) => v.value === newValue.value && v.isNegated === newValue.isNegated,
  );
  if (isDuplicate) {
    return {
      valid: false,
      error: 'Value already selected',
      errorType: 'duplicate',
      conflictingValue: newValue,
    };
  }

  const hasContradiction = clause.values.some(
    (v) => v.value === newValue.value && v.isNegated !== newValue.isNegated,
  );
  if (hasContradiction) {
    const conflicting = clause.values.find(
      (v) => v.value === newValue.value && v.isNegated !== newValue.isNegated,
    );
    return {
      valid: false,
      error: `Conflicts with ${conflicting?.isNegated ? '-' : ''}${newValue.value}`,
      errorType: 'contradiction',
      conflictingValue: conflicting,
    };
  }

  if (fieldRule.isSingleValue && clause.values.length > 0 && !newValue.isNegated) {
    return {
      valid: false,
      error: `${fieldRule.label} only allows one value`,
      errorType: 'single_select',
    };
  }

  return {valid: true};
}

export function parseQuery(text: string): Query {
  if (!text.trim()) return {filters: []};

  const filters: QueryFilter[] = [];
  const parts = text.split(REGEX_QUERY_SPLIT).filter(Boolean);

  for (const part of parts) {
    const pillMatch = part.match(REGEX_PILL_PART);
    if (!pillMatch) continue;

    const [, fieldName, _operator, valuesPart] = pillMatch;
    const field = FIELD_RULES.find((f) => f.name.toLowerCase() === fieldName.toLowerCase());
    if (!field) continue;

    if (valuesPart === '*') {
      filters.push({
        type: field.name as FilterType,
        values: [],
      });
      continue;
    }

    const values: QueryValue[] = [];
    const rawValues = valuesPart.split(',').filter(Boolean);

    for (const rawVal of rawValues) {
      let val = rawVal.trim();
      const isNegated = val.startsWith('-');
      if (isNegated) val = val.slice(1);
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }

      const matchedValue = field.enumValues?.find((v) => v.toLowerCase() === val.toLowerCase());
      if (matchedValue) {
        values.push({value: matchedValue, isNegated});
      } else {
        values.push({value: val, isNegated});
      }
    }

    if (values.length > 0) {
      filters.push({
        type: field.name as FilterType,
        values,
      });
    }
  }

  return {filters};
}

export function parseQueryString(input: string): QueryToken[] {
  const tokens: QueryToken[] = [];

  const pillParts = input.split(REGEX_QUERY_SPLIT).filter(Boolean);

  for (const pillPart of pillParts) {
    const pillMatch = pillPart.match(REGEX_PILL_PART);
    if (!pillMatch) continue;

    const [, fieldName, operator, valuesPart] = pillMatch;
    const field = FIELD_RULES.find((f) => f.name.toLowerCase() === fieldName.toLowerCase());
    if (!field) continue;

    if (valuesPart === '*') {
      tokens.push({
        id: `${Date.now()}-${Math.random()}`,
        key: field.name,
        operator,
        values: [],
        isBuilding: false,
        isWildcard: true,
      });
      continue;
    }

    const values: QueryValue[] = [];
    const rawValues = valuesPart.split(',').filter(Boolean);

    for (const rawVal of rawValues) {
      let val = rawVal.trim();
      const isNegated = val.startsWith('-');
      if (isNegated) val = val.slice(1);
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }

      const matchedValue = field.enumValues?.find((v) => v.toLowerCase() === val.toLowerCase());
      if (matchedValue) {
        values.push({value: matchedValue, isNegated});
      } else {
        values.push({value: val, isNegated});
      }
    }

    if (values.length > 0) {
      tokens.push({
        id: `${Date.now()}-${Math.random()}`,
        key: field.name,
        operator,
        values,
        isBuilding: false,
      });
    }
  }

  return tokens;
}

export function formatQuery(query: Query): string {
  return query.filters
    .map((f) => {
      const vals = f.values.map((v) => (v.isNegated ? `-${v.value}` : v.value)).join(',');
      return `${f.type}:${vals}`;
    })
    .join(' ');
}

export function serializeTokensToText(tokenList: QueryToken[]): string {
  return tokenList
    .map((token) => {
      if (token.isWildcard) {
        return `${token.key}:*`;
      }
      if (token.values.length === 0) return '';

      const valueStr = token.values
        .map((v) => {
          const negatePrefix = v.isNegated ? '-' : '';
          return `${negatePrefix}${v.value}`;
        })
        .join(',');
      return `${token.key}${token.operator}${valueStr}`;
    })
    .filter(Boolean)
    .join(' + ');
}

export function addFilterValue(
  filters: QueryFilter[],
  type: FilterType,
  value: string,
  negated: boolean,
  isOrMode = false,
): QueryFilter[] {
  const idx = filters.findIndex((f) => f.type === type);
  if (idx >= 0) {
    if (filters[idx].values.some((v) => v.value === value && v.isNegated === negated))
      return filters;
    const newFilters = [...filters];
    if (isOrMode) {
      newFilters[idx] = {
        ...filters[idx],
        values: [...filters[idx].values, {value, isNegated: negated}],
      };
    } else {
      newFilters[idx] = {type, values: [{value, isNegated: negated}]};
    }
    return newFilters;
  }
  return [...filters, {type, values: [{value, isNegated: negated}]}];
}

export function removeFilterValue(
  filters: QueryFilter[],
  type: FilterType,
  value: string,
): QueryFilter[] {
  const idx = filters.findIndex((f) => f.type === type);
  if (idx < 0) return filters;
  const newValues = filters[idx].values.filter((v) => v.value !== value);
  if (newValues.length === 0) return filters.filter((_, i) => i !== idx);
  const newFilters = [...filters];
  newFilters[idx] = {...filters[idx], values: newValues};
  return newFilters;
}

export function removeFilter(filters: QueryFilter[], type: FilterType): QueryFilter[] {
  return filters.filter((f) => f.type !== type);
}

export function parseDuration(input: string): number | null {
  const trimmed = input.trim().toLowerCase();

  const match = trimmed.match(REGEX_PARSE_DURATION);

  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's':
    case 'sec':
    case 'second':
    case 'seconds':
      return value * 1000;
    case 'm':
    case 'min':
    case 'minute':
    case 'minutes':
      return value * 60 * 1000;
    case 'h':
    case 'hr':
    case 'hour':
    case 'hours':
      return value * 60 * 60 * 1000;
    case 'd':
    case 'day':
    case 'days':
      return value * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

export function parseDurationComparison(input: string): {
  operator: string;
  durationMs: number;
  rawValue: string;
} | null {
  const trimmed = input.trim();

  const operatorMatch = trimmed.match(REGEX_DURATION_OPERATOR);
  if (!operatorMatch) return null;

  const operator = operatorMatch[1];
  const durationStr = trimmed.slice(operator.length).trim();
  const durationMs = parseDuration(durationStr);

  if (durationMs === null) return null;

  return {operator, durationMs, rawValue: durationStr};
}

export function formatDuration(ms: number): string {
  if (ms < 60000) {
    return `${Math.round(ms / 1000)}s`;
  } else if (ms < 3600000) {
    return `${Math.round(ms / 60000)}m`;
  } else if (ms < 86400000) {
    return `${Math.round(ms / 3600000)}h`;
  } else {
    return `${Math.round(ms / 86400000)}d`;
  }
}

export function parseNumericRange(value: string): {min: number | null; max: number | null} | null {
  const lessThanMatch = value.match(REGEX_LESS_THAN_RANGE);
  if (lessThanMatch) {
    return {min: null, max: parseInt(lessThanMatch[1], 10)};
  }

  const greaterThanMatch = value.match(REGEX_GREATER_THAN_RANGE);
  if (greaterThanMatch) {
    return {min: parseInt(greaterThanMatch[1], 10), max: null};
  }

  const rangeMatch = value.match(REGEX_RANGE);
  if (rangeMatch) {
    return {min: parseInt(rangeMatch[1], 10), max: parseInt(rangeMatch[2], 10)};
  }

  return null;
}

export function formatNumericRange(min: number | null, max: number | null): string {
  if (min !== null && max !== null) {
    return `${min}-${max}`;
  }
  if (min !== null) {
    return `>${min}`;
  }
  if (max !== null) {
    return `<${max}`;
  }
  return '';
}

export * from './helpers';
export * from './icon-renderer';
export * from './suggestions';
