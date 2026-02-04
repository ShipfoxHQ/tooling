import {useDeferredValue, useMemo} from 'react';
import type {QueryToken} from '../types';
import {renderSuggestionIcon, renderSuggestionLabel} from '../utils/icon-renderer';
import {type AutocompleteSuggestion, generateSuggestions} from '../utils/suggestions';

export interface DropdownItem {
  value: string;
  label: React.ReactNode;
  icon: React.ReactNode | null;
  selected: boolean;
  preview?: string;
  isNegated: boolean;
  count?: number;
  conflictHint?: string;
  isValueType: boolean;
  type?: 'preset' | 'section-header';
}

export function useQueryBuilderSuggestions(
  inputValue: string,
  tokens: QueryToken[],
  editingToken: QueryToken | null,
  isAltHeld: boolean,
  conflictHints: Record<string, string>,
  stableDropdownOrder: string[] | null,
  stableDropdownFieldRef: React.MutableRefObject<string | null>,
  stableRecentDurations: string[] | null,
  recentDurations: string[],
) {
  const suggestions = useMemo(
    () =>
      generateSuggestions(
        inputValue,
        tokens,
        editingToken,
        undefined,
        stableRecentDurations || recentDurations,
      ),
    [inputValue, tokens, editingToken, stableRecentDurations, recentDurations],
  );

  let orderedSuggestions = [...suggestions];

  if (isAltHeld) {
    orderedSuggestions = orderedSuggestions.filter((s) => {
      if (s.type !== 'value' && s.type !== 'complete') return true;
      if (s.isNegated && s.isSelected) return true;
      return !s.isNegated;
    });
  }

  if (!editingToken) {
    orderedSuggestions = orderedSuggestions.filter(
      (s) => s.type !== 'preset' && s.type !== 'section-header',
    );
  }

  if (stableDropdownOrder && editingToken && stableDropdownFieldRef.current === editingToken.key) {
    orderedSuggestions.sort((a, b) => {
      if (
        a.type === 'field' ||
        a.type === 'wildcard' ||
        b.type === 'field' ||
        b.type === 'wildcard'
      ) {
        return 0;
      }
      const aIndex = stableDropdownOrder.indexOf(a.value);
      const bIndex = stableDropdownOrder.indexOf(b.value);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }

  const dropdownItems = useMemo(() => {
    return orderedSuggestions.map((s) => {
      if (s.type === 'section-header') {
        return {
          value: s.value,
          label: s.label,
          icon: null,
          selected: false,
          type: 'section-header' as const,
          isValueType: false,
          isNegated: false,
        };
      }

      const isValueType = s.type === 'value' || s.type === 'complete';
      const isPreset = s.type === 'preset';
      const applyNegation = isAltHeld && isValueType && !s.isNegated && !s.isSelected;
      const effectiveNegated = applyNegation ? true : s.isNegated;

      let encodedValue: string;
      if (s.type === 'field') {
        encodedValue = `__field__${s.value}`;
      } else if (s.type === 'wildcard') {
        encodedValue = `__wildcard__${s.field}`;
      } else if (s.type === 'complete') {
        encodedValue = `__complete__${s.field}__${s.value}__${effectiveNegated ? '1' : '0'}`;
      } else if (s.type === 'preset') {
        encodedValue = `__preset__${s.field}__${s.value}`;
      } else {
        encodedValue = `__value__${s.field}__${s.value}__${effectiveNegated ? '1' : '0'}`;
      }

      const icon = renderSuggestionIcon(s);
      const isSelected = s.isSelected || s.icon === 'check';
      const label = renderSuggestionLabel(s, isValueType, isSelected, applyNegation);

      const hintKey = `${s.value}-${effectiveNegated}`;
      const conflictHint = isValueType ? conflictHints[hintKey] : undefined;

      return {
        value: encodedValue,
        label,
        icon,
        selected: isSelected,
        preview: s.preview,
        isNegated: effectiveNegated,
        count: s.count,
        conflictHint,
        isValueType,
        type: isPreset ? ('preset' as const) : undefined,
      };
    });
  }, [orderedSuggestions, isAltHeld, conflictHints, editingToken]);

  const deferredDropdownItems = useDeferredValue(dropdownItems);

  return {suggestions, dropdownItems: deferredDropdownItems};
}
