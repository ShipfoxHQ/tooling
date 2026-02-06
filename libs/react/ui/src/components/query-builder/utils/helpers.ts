import type {QueryToken} from '../types';
import {FIELD_RULES} from './index';
import {parseInput} from './suggestions';

export function getPlaceholder(tokens: QueryToken[], defaultPlaceholder: string): string {
  if (tokens.length === 0) {
    return defaultPlaceholder;
  }
  const usedFields = new Set(tokens.map((t) => t.key));
  if (usedFields.size >= FIELD_RULES.length) {
    return '';
  }
  return 'Add filter...';
}

export function getDropdownHeader(editingToken: QueryToken | null, inputValue: string): string {
  if (editingToken) {
    return FIELD_RULES.find((f) => f.name === editingToken.key)?.label || editingToken.key;
  }
  if (inputValue.trim()) {
    const parsed = parseInput(inputValue);
    if (parsed.field) {
      return FIELD_RULES.find((f) => f.name === parsed.field)?.label || 'Values';
    }
    return 'Suggestions';
  }
  return 'Type';
}
