import type {QueryToken} from '../types';
import {FIELD_RULES, parseDurationComparison} from './index';

export interface AutocompleteSuggestion {
  type:
    | 'field'
    | 'value'
    | 'operator'
    | 'complete'
    | 'wildcard'
    | 'custom'
    | 'preset'
    | 'section-header';
  value: string;
  label: string;
  field?: string;
  preview?: string;
  icon?: 'search' | 'check' | 'arrow' | 'negate' | 'plus' | 'clock';
  isNegated?: boolean;
  isSelected?: boolean;
  count?: number;
  section?: 'common' | 'recent';
  presetMs?: number;
}

export interface ParsedInput {
  field?: string;
  operator?: string;
  value?: string;
  isNegated?: boolean;
  isWildcard?: boolean;
  isComplete: boolean;
}

const DURATION_PRESETS = [
  {label: '< 30s', value: '<30s', ms: 30000},
  {label: '< 1min', value: '<1min', ms: 60000},
  {label: '< 2min', value: '<2min', ms: 120000},
  {label: '< 5min', value: '<5min', ms: 300000},
  {label: '< 10min', value: '<10min', ms: 600000},
  {label: '> 5min', value: '>5min', ms: 300000},
  {label: '> 10min', value: '>10min', ms: 600000},
];

export function parseInput(input: string): ParsedInput {
  const trimmed = input.trim();
  if (!trimmed) return {isComplete: false};

  const ALL_OPERATORS = [':', '!=', '>=', '<=', '>', '<', '='];

  for (const op of ALL_OPERATORS.sort((a, b) => b.length - a.length)) {
    const opIndex = trimmed.indexOf(op);
    if (opIndex > 0) {
      const field = trimmed.slice(0, opIndex).trim().toLowerCase();
      let value = trimmed.slice(opIndex + op.length).trim();
      const matchedField = FIELD_RULES.find(
        (f) => f.name.toLowerCase() === field || f.label.toLowerCase() === field,
      );

      if (matchedField) {
        if (value === '*') {
          return {
            field: matchedField.name,
            operator: op,
            value: '*',
            isWildcard: true,
            isComplete: true,
          };
        }

        let isNegated = false;
        if (value.startsWith('!') || value.startsWith('-')) {
          isNegated = true;
          value = value.slice(1);
        }

        const exactMatch = matchedField.enumValues?.find(
          (v) => v.toLowerCase() === value.toLowerCase(),
        );

        return {
          field: matchedField.name,
          operator: op,
          value: value || undefined,
          isNegated,
          isComplete: !!exactMatch,
        };
      }
    }
  }

  return {
    field: undefined,
    operator: undefined,
    value: trimmed,
    isComplete: false,
  };
}

export function generateSuggestions(
  input: string,
  existingTokens: QueryToken[],
  editingToken: QueryToken | null,
  valueCounts?: Record<string, Record<string, number>>,
  recentDurations?: string[],
): AutocompleteSuggestion[] {
  const parsed = parseInput(input);
  const suggestions: AutocompleteSuggestion[] = [];
  const usedFields = existingTokens.map((t) => t.key);
  const trimmedInput = input.trim().toLowerCase();
  const isTypingNegation = trimmedInput.startsWith('!') || trimmedInput.startsWith('-');
  const searchValue = isTypingNegation ? trimmedInput.slice(1) : trimmedInput;

  const isValueSelected = (token: QueryToken, value: string, negated: boolean): boolean => {
    return token.values.some((v) => v.value === value && v.isNegated === negated);
  };

  if (editingToken && !editingToken.isWildcard) {
    const field = FIELD_RULES.find((f) => f.name === editingToken.key);
    if (field?.enumValues) {
      if (field.name === 'duration') {
        const selectedDurations = editingToken.values.map((v) => v.value);

        if (searchValue) {
          const durationParsed = parseDurationComparison(searchValue);
          if (durationParsed) {
            const displayValue = `${durationParsed.operator}${durationParsed.rawValue}`;
            const isSelected = selectedDurations.includes(displayValue);
            suggestions.push({
              type: 'custom',
              value: displayValue,
              label: `Duration ${durationParsed.operator} ${durationParsed.rawValue}`,
              field: field.name,
              preview: `duration:${displayValue}`,
              icon: isSelected ? 'check' : 'plus',
              isNegated: false,
              isSelected,
            });
          } else if (
            searchValue.includes(',') &&
            searchValue.split(',').every((part) => parseDurationComparison(part.trim()))
          ) {
            suggestions.push({
              type: 'custom',
              value: searchValue,
              label: `Add "${searchValue}"`,
              field: field.name,
              preview: `duration:${searchValue}`,
              icon: 'plus',
              isNegated: false,
              isSelected: false,
            });
          }
        }

        const recentNotFavorites = recentDurations || [];
        if (recentNotFavorites.length > 0) {
          suggestions.push({
            type: 'section-header',
            value: 'recent-header',
            label: 'Recent',
            field: field.name,
          });
          recentNotFavorites.forEach((recent) => {
            const isSelected = selectedDurations.includes(recent);
            suggestions.push({
              type: 'preset',
              value: recent,
              label: `Duration ${recent}`,
              field: field.name,
              preview: `duration:${recent}`,
              icon: isSelected ? 'check' : 'clock',
              isSelected,
              section: 'recent',
            });
          });
        }

        const recentValues = new Set(recentNotFavorites);
        const filteredPresets = DURATION_PRESETS.filter(
          (preset) => !recentValues.has(preset.value),
        );

        if (filteredPresets.length > 0) {
          suggestions.push({
            type: 'section-header',
            value: 'common-header',
            label: 'Common',
            field: field.name,
          });
          filteredPresets.forEach((preset) => {
            const isSelected = selectedDurations.includes(preset.value);
            suggestions.push({
              type: 'preset',
              value: preset.value,
              label: `Duration ${preset.label}`,
              field: field.name,
              preview: `duration:${preset.value}`,
              icon: isSelected ? 'arrow' : 'arrow',
              isSelected,
              presetMs: preset.ms,
              section: 'common',
            });
          });
        }

        suggestions.push({
          type: 'wildcard',
          value: '*',
          label: '* (any value)',
          field: field.name,
          preview: `${field.name}:*`,
          icon: 'search',
        });

        return suggestions;
      }

      const matchingValues = field.enumValues.filter(
        (v) => !searchValue || v.toLowerCase().includes(searchValue),
      );

      matchingValues.forEach((v) => {
        const isSelected = isValueSelected(editingToken, v, false);
        const isNegatedSelected = isValueSelected(editingToken, v, true);
        const count = valueCounts?.[field.name]?.[v];

        if (isNegatedSelected) {
          suggestions.push({
            type: 'value',
            value: v,
            label: `-${v}`,
            field: field.name,
            preview: `${field.name}:!"${v}"`,
            icon: 'check',
            isNegated: true,
            isSelected: true,
            count,
          });
        } else {
          suggestions.push({
            type: 'value',
            value: v,
            label: v,
            field: field.name,
            preview: `${field.name}:"${v}"`,
            icon: isSelected ? 'check' : 'arrow',
            isNegated: false,
            isSelected,
            count,
          });

          if (isTypingNegation) {
            suggestions.push({
              type: 'value',
              value: v,
              label: `-${v}`,
              field: field.name,
              preview: `${field.name}:!"${v}"`,
              icon: 'negate',
              isNegated: true,
              isSelected: false,
              count,
            });
          }
        }
      });

      if (field.name === 'duration' && searchValue) {
        const durationParsed = parseDurationComparison(searchValue);
        if (durationParsed) {
          const displayValue = `${durationParsed.operator}${durationParsed.rawValue}`;
          suggestions.unshift({
            type: 'custom',
            value: displayValue,
            label: `Duration ${durationParsed.operator} ${durationParsed.rawValue}`,
            field: field.name,
            preview: `duration:${displayValue}`,
            icon: 'plus',
            isNegated: false,
          });
        }
      }

      if (searchValue && searchValue !== '*') {
        const isDurationComparison =
          field.name === 'duration' &&
          (parseDurationComparison(searchValue) ||
            (searchValue.includes(',') &&
              searchValue.split(',').every((part) => parseDurationComparison(part.trim()))));
        const exactEnumMatch = field.enumValues.some(
          (v) => v.toLowerCase() === searchValue.toLowerCase(),
        );
        if (isDurationComparison) {
          suggestions.unshift({
            type: 'custom',
            value: searchValue,
            label: `Add "${searchValue}"`,
            field: field.name,
            preview: `${field.name}:${searchValue}`,
            icon: 'plus',
            isNegated: isTypingNegation,
          });
        } else if (!exactEnumMatch) {
          suggestions.push({
            type: 'custom',
            value: searchValue,
            label: `Add "${searchValue}"`,
            field: field.name,
            preview: `${field.name}:"${searchValue}"`,
            icon: 'plus',
            isNegated: isTypingNegation,
          });
        }
      }

      if (!editingToken.values.length || searchValue === '*') {
        suggestions.push({
          type: 'wildcard',
          value: '*',
          label: '* (any value)',
          field: field.name,
          preview: `${field.name}:*`,
          icon: 'search',
        });
      }
    }
    return suggestions;
  }

  if (parsed.field && parsed.operator) {
    const field = FIELD_RULES.find((f) => f.name === parsed.field);
    if (field?.enumValues) {
      if (parsed.isWildcard || parsed.value === '*') {
        suggestions.push({
          type: 'wildcard',
          value: '*',
          label: `${field.name}:* (any value)`,
          field: field.name,
          preview: `${field.name}:*`,
          icon: 'check',
        });
        return suggestions;
      }

      const matchingValues = field.enumValues.filter((v) => {
        if (!parsed.value) return true;
        return v.toLowerCase().includes(parsed.value.toLowerCase());
      });

      const exactMatch = matchingValues.find(
        (v) => v.toLowerCase() === parsed.value?.toLowerCase(),
      );

      if (exactMatch) {
        suggestions.push({
          type: 'complete',
          value: exactMatch,
          label: `${field.name}${parsed.operator}${parsed.isNegated ? '!' : ''}"${exactMatch}"`,
          field: field.name,
          preview: `${field.name}${parsed.operator}${parsed.isNegated ? '!' : ''}"${exactMatch}"`,
          icon: 'check',
          isNegated: parsed.isNegated,
          count: valueCounts?.[field.name]?.[exactMatch],
        });
      }

      matchingValues
        .filter((v) => v !== exactMatch)
        .forEach((v) => {
          suggestions.push({
            type: 'value',
            value: v,
            label: parsed.isNegated ? `!${v}` : v,
            field: field.name,
            preview: `${field.name}${parsed.operator}${parsed.isNegated ? '!' : ''}"${v}"`,
            icon: parsed.isNegated ? 'negate' : 'arrow',
            isNegated: parsed.isNegated,
            count: valueCounts?.[field.name]?.[v],
          });
        });

      if (field.name === 'duration' && parsed.value) {
        const durationParsed = parseDurationComparison(parsed.value);
        if (durationParsed) {
          const displayValue = `${durationParsed.operator}${durationParsed.rawValue}`;
          suggestions.unshift({
            type: 'custom',
            value: displayValue,
            label: `Duration ${durationParsed.operator} ${durationParsed.rawValue}`,
            field: field.name,
            preview: `duration:${displayValue}`,
            icon: 'plus',
            isNegated: false,
          });
        }
      }

      if (parsed.value && parsed.value !== '*') {
        const isDurationComparison =
          field.name === 'duration' &&
          (parseDurationComparison(parsed.value) ||
            (parsed.value.includes(',') &&
              parsed.value.split(',').every((part) => parseDurationComparison(part.trim()))));
        const exactEnumMatch = field.enumValues.some(
          (v) => v.toLowerCase() === parsed.value?.toLowerCase(),
        );
        if (isDurationComparison) {
          suggestions.unshift({
            type: 'custom',
            value: parsed.value,
            label: `Add "${parsed.value}"`,
            field: field.name,
            preview: `${field.name}:${parsed.value}`,
            icon: 'plus',
            isNegated: parsed.isNegated,
          });
        } else if (!exactEnumMatch) {
          suggestions.push({
            type: 'custom',
            value: parsed.value,
            label: `Add "${parsed.value}"`,
            field: field.name,
            preview: `${field.name}${parsed.operator}${parsed.isNegated ? '!' : ''}"${parsed.value}"`,
            icon: 'plus',
            isNegated: parsed.isNegated,
          });
        }
      }

      if (!parsed.value || parsed.value === '*') {
        suggestions.push({
          type: 'wildcard',
          value: '*',
          label: '* (any value)',
          field: field.name,
          preview: `${field.name}:*`,
          icon: 'search',
        });
      }
    }
    return suggestions;
  }

  if (trimmedInput) {
    const matchingFields = FIELD_RULES.filter(
      (f) =>
        !usedFields.includes(f.name) &&
        (f.name.toLowerCase().includes(trimmedInput) ||
          f.label.toLowerCase().includes(trimmedInput)),
    );

    matchingFields.slice(0, 4).forEach((f) => {
      suggestions.push({
        type: 'field',
        value: f.name,
        label: f.name,
        preview: `${f.name}:`,
        icon: 'search',
      });
    });

    FIELD_RULES.forEach((f) => {
      if (usedFields.includes(f.name)) return;

      f.enumValues?.forEach((v) => {
        if (v.toLowerCase().includes(trimmedInput)) {
          suggestions.push({
            type: 'complete',
            value: v,
            label: `${f.name}:"${v}"`,
            field: f.name,
            preview: `${f.name}:"${v}"`,
            icon: 'check',
            count: valueCounts?.[f.name]?.[v],
          });
        }
      });
    });

    const seen = new Set<string>();
    return suggestions
      .filter((s) => {
        const key = s.preview || s.label;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }

  FIELD_RULES.filter((f) => !usedFields.includes(f.name))
    .slice(0, 6)
    .forEach((f) => {
      suggestions.push({
        type: 'field',
        value: f.name,
        label: f.name,
        preview: `${f.name}:`,
        icon: 'search',
      });
    });

  return suggestions;
}
