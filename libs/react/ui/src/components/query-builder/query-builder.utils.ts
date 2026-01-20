/**
 * Query Builder Utilities
 *
 * Handles parsing and serialization of query strings with support for:
 * - Property:value filters
 * - OR logic within pills (comma-separated values)
 * - AND logic between pills (space-separated)
 * - Negation with - prefix
 * - Numeric ranges
 */

export type QueryFilterValue = {
  value: string;
  negated: boolean;
};

export type QueryFilter = {
  property: string;
  values: QueryFilterValue[];
};

export type QueryAST = {
  filters: QueryFilter[];
};

// Regex patterns
const QUERY_SPLIT_REGEX = /\s+(?![^"]*"(?:\s|$))/;
const NUMERIC_LESS_THAN_REGEX = /^<(\d+)\s*([a-z]+)?$/;
const NUMERIC_GREATER_THAN_REGEX = /^>(\d+)\s*([a-z]+)?$/;
const NUMERIC_RANGE_REGEX = /^(\d+)\s*-\s*(\d+)\s*([a-z]+)?$/;
const NUMERIC_SINGLE_REGEX = /^(\d+)\s*([a-z]+)?$/;

/**
 * Parse a query string into an AST
 * Format: property:value1,value2 property2:value3
 * Negation: property:-value or property:value1,-value2
 */
export function parseQuery(query: string): QueryAST {
  const filters: QueryFilter[] = [];

  if (!query.trim()) {
    return {filters: []};
  }

  // Split by spaces to get individual filters (AND logic)
  const filterStrings = query.split(QUERY_SPLIT_REGEX).filter(Boolean);

  for (const filterString of filterStrings) {
    const colonIndex = filterString.indexOf(':');
    if (colonIndex === -1) {
      // No property specified, treat as a general search term
      continue;
    }

    const property = filterString.slice(0, colonIndex).trim();
    const valuesString = filterString.slice(colonIndex + 1).trim();

    if (!property || !valuesString) {
      continue;
    }

    // Split values by comma (OR logic within a filter)
    const valueStrings = valuesString
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
    const values: QueryFilterValue[] = valueStrings.map((valueStr) => {
      const negated = valueStr.startsWith('-');
      const value = negated ? valueStr.slice(1) : valueStr;
      return {value, negated};
    });

    if (values.length > 0) {
      filters.push({property, values});
    }
  }

  return {filters};
}

/**
 * Serialize an AST back to a query string
 */
export function serializeQuery(ast: QueryAST): string {
  return ast.filters
    .map((filter) => {
      const valuesString = filter.values
        .map((v) => (v.negated ? `-${v.value}` : v.value))
        .join(',');
      return `${filter.property}:${valuesString}`;
    })
    .join(' ');
}

/**
 * Find a filter by property name
 */
export function findFilterByProperty(ast: QueryAST, property: string): QueryFilter | undefined {
  return ast.filters.find((f) => f.property === property);
}

/**
 * Add or update a filter value
 */
export function addFilterValue(
  ast: QueryAST,
  property: string,
  value: string,
  options?: {negated?: boolean; useOr?: boolean},
): QueryAST {
  const {negated = false, useOr = true} = options || {};
  const newAST = {...ast, filters: [...ast.filters]};

  const existingFilter = findFilterByProperty(newAST, property);

  if (existingFilter) {
    // Check if value already exists
    const existingValueIndex = existingFilter.values.findIndex((v) => v.value === value);

    if (existingValueIndex >= 0) {
      // Update existing value (toggle negation if same value)
      if (existingFilter.values[existingValueIndex].negated !== negated) {
        existingFilter.values[existingValueIndex].negated = negated;
      }
    } else if (useOr) {
      // Add to existing filter (OR logic)
      existingFilter.values.push({value, negated});
    } else {
      // Replace existing filter (AND logic)
      existingFilter.values = [{value, negated}];
    }
  } else {
    // Create new filter
    newAST.filters.push({
      property,
      values: [{value, negated}],
    });
  }

  return newAST;
}

/**
 * Remove a filter value
 */
export function removeFilterValue(ast: QueryAST, property: string, value: string): QueryAST {
  const newAST = {...ast, filters: [...ast.filters]};
  const filter = findFilterByProperty(newAST, property);

  if (filter) {
    filter.values = filter.values.filter((v) => v.value !== value);

    // Remove filter if no values left
    if (filter.values.length === 0) {
      newAST.filters = newAST.filters.filter((f) => f.property !== property);
    }
  }

  return newAST;
}

/**
 * Remove an entire filter
 */
export function removeFilter(ast: QueryAST, property: string): QueryAST {
  return {
    ...ast,
    filters: ast.filters.filter((f) => f.property !== property),
  };
}

/**
 * Check if a value exists in a filter
 */
export function hasFilterValue(ast: QueryAST, property: string, value: string): boolean {
  const filter = findFilterByProperty(ast, property);
  return filter?.values.some((v) => v.value === value) ?? false;
}

/**
 * Get all values for a property
 */
export function getFilterValues(ast: QueryAST, property: string): QueryFilterValue[] {
  const filter = findFilterByProperty(ast, property);
  return filter?.values ?? [];
}

/**
 * Parse numeric range from string (e.g., "<30s", ">12min", "1-5 min")
 */
export type NumericRange = {
  min?: number;
  max?: number;
  unit?: string;
};

const UNIT_MULTIPLIERS: Record<string, number> = {
  s: 1,
  sec: 1,
  second: 1,
  seconds: 1,
  m: 60,
  min: 60,
  minute: 60,
  minutes: 60,
  h: 3600,
  hr: 3600,
  hour: 3600,
  hours: 3600,
  d: 86400,
  day: 86400,
  days: 86400,
};

export function parseNumericRange(input: string): NumericRange | null {
  const trimmed = input.trim().toLowerCase();

  // Match patterns like "<30s", ">12min", "1-5 min", "30s", "1h"
  const lessThanMatch = trimmed.match(NUMERIC_LESS_THAN_REGEX);
  if (lessThanMatch) {
    const value = Number.parseInt(lessThanMatch[1], 10);
    const unit = lessThanMatch[2] || 's';
    const multiplier = UNIT_MULTIPLIERS[unit] || 1;
    return {max: value * multiplier, unit};
  }

  const greaterThanMatch = trimmed.match(NUMERIC_GREATER_THAN_REGEX);
  if (greaterThanMatch) {
    const value = Number.parseInt(greaterThanMatch[1], 10);
    const unit = greaterThanMatch[2] || 's';
    const multiplier = UNIT_MULTIPLIERS[unit] || 1;
    return {min: value * multiplier, unit};
  }

  const rangeMatch = trimmed.match(NUMERIC_RANGE_REGEX);
  if (rangeMatch) {
    const min = Number.parseInt(rangeMatch[1], 10);
    const max = Number.parseInt(rangeMatch[2], 10);
    const unit = rangeMatch[3] || 's';
    const multiplier = UNIT_MULTIPLIERS[unit] || 1;
    return {min: min * multiplier, max: max * multiplier, unit};
  }

  const singleMatch = trimmed.match(NUMERIC_SINGLE_REGEX);
  if (singleMatch) {
    const value = Number.parseInt(singleMatch[1], 10);
    const unit = singleMatch[2] || 's';
    const multiplier = UNIT_MULTIPLIERS[unit] || 1;
    return {min: value * multiplier, max: value * multiplier, unit};
  }

  return null;
}

/**
 * Format numeric range for display
 */
export function formatNumericRange(range: NumericRange): string {
  if (range.min !== undefined && range.max !== undefined) {
    if (range.min === range.max) {
      return `${range.min}${range.unit || 's'}`;
    }
    return `${range.min}-${range.max}${range.unit || 's'}`;
  }
  if (range.min !== undefined) {
    return `>${range.min}${range.unit || 's'}`;
  }
  if (range.max !== undefined) {
    return `<${range.max}${range.unit || 's'}`;
  }
  return '';
}
