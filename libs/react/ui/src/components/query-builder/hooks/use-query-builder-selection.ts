import {useCallback} from 'react';
import type {QueryToken} from '../types';
import {FIELD_RULES, parseDurationComparison} from '../utils';

interface UseQueryBuilderSelectionProps {
  editingTokenId: string | null;
  tokens: QueryToken[];
  isManualEdit: boolean;
  recentDurations: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  selectField: (fieldName: string, recentDurations: string[]) => void;
  convertToWildcard: (fieldName: string) => void;
  addValueToEditingToken: (value: string, isNegated: boolean) => void;
  setEditingTokenId: (id: string | null) => void;
  setTokens: React.Dispatch<React.SetStateAction<QueryToken[]>>;
  setInputValue: (value: string) => void;
  setIsManualEdit: (value: boolean) => void;
  finalizeEditing: () => void;
  setDurationRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setStableDropdownOrder: (order: string[] | null) => void;
  setStableRecentDurations: (durations: string[] | null) => void;
  stableDropdownFieldRef: React.RefObject<string | null>;
}

export function useQueryBuilderSelection({
  editingTokenId,
  tokens,
  isManualEdit,
  recentDurations,
  inputRef,
  selectField,
  convertToWildcard,
  addValueToEditingToken,
  setEditingTokenId,
  setTokens,
  setInputValue,
  setIsManualEdit,
  finalizeEditing,
  setDurationRange,
  setStableDropdownOrder,
  setStableRecentDurations,
  stableDropdownFieldRef,
}: UseQueryBuilderSelectionProps) {
  const handleFieldSelect = useCallback(
    (fieldName: string) => {
      selectField(fieldName, recentDurations);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [selectField, recentDurations, inputRef],
  );

  const handleWildcardSelect = useCallback(
    (fieldName: string) => {
      convertToWildcard(fieldName);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [convertToWildcard, inputRef],
  );

  const handleCompleteValueSelect = useCallback(
    (fieldName: string, fieldValue: string, isNegated: boolean) => {
      const wasManualEdit = isManualEdit;

      if (editingTokenId) {
        if (fieldName === 'duration' && fieldValue.includes(',')) {
          const durationParts = fieldValue
            .split(',')
            .map((p) => p.trim())
            .filter(Boolean);
          durationParts.forEach((part) => {
            addValueToEditingToken(part, isNegated);
          });
        } else {
          addValueToEditingToken(fieldValue, isNegated);
        }
        setIsManualEdit(false);
      } else {
        const existingToken = tokens.find((t) => t.key === fieldName && !t.isWildcard);
        if (existingToken) {
          setEditingTokenId(existingToken.id);
          setTokens((prev) =>
            prev.map((t) => {
              if (t.id === existingToken.id) {
                const valueExists = t.values.some(
                  (v) => v.value === fieldValue && v.isNegated === isNegated,
                );
                if (!valueExists) {
                  return {...t, values: [...t.values, {value: fieldValue, isNegated}]};
                }
              }
              return t;
            }),
          );
        } else {
          const newTokenId = `${Date.now()}-${Math.random()}`;
          setTokens((prev) => [
            ...prev,
            {
              id: newTokenId,
              key: fieldName,
              operator: ':',
              values: [{value: fieldValue, isNegated}],
              isBuilding: true,
            },
          ]);
          setEditingTokenId(newTokenId);
          const field = FIELD_RULES.find((f) => f.name === fieldName);
          if (field?.enumValues) {
            setStableDropdownOrder([...field.enumValues]);
            stableDropdownFieldRef.current = fieldName;
          }
          if (fieldName === 'duration') {
            setStableRecentDurations([...recentDurations]);
          }
        }
        setInputValue('');
      }

      if (!wasManualEdit && editingTokenId) {
        finalizeEditing();
        setEditingTokenId(null);
        setInputValue('');
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [
      editingTokenId,
      tokens,
      isManualEdit,
      addValueToEditingToken,
      setEditingTokenId,
      setTokens,
      setInputValue,
      setIsManualEdit,
      finalizeEditing,
      setStableDropdownOrder,
      setStableRecentDurations,
      stableDropdownFieldRef,
      recentDurations,
      inputRef,
    ],
  );

  const handlePresetSelect = useCallback(
    (fieldName: string, presetValue: string) => {
      const wasManualEdit = isManualEdit;

      if (editingTokenId) {
        addValueToEditingToken(presetValue, false);
        setIsManualEdit(false);

        if (fieldName === 'duration') {
          const parsed = parseDurationComparison(presetValue);
          if (parsed) {
            setDurationRange((prev) => {
              if (parsed.operator === '<' || parsed.operator === '<=') {
                return [prev[0], Math.min(parsed.durationMs, 3600000)];
              } else if (parsed.operator === '>' || parsed.operator === '>=') {
                return [Math.min(parsed.durationMs, 3600000), prev[1]];
              }
              return prev;
            });
          }
        }
      }
      setInputValue('');

      if (!wasManualEdit && editingTokenId) {
        finalizeEditing();
        setEditingTokenId(null);
        setInputValue('');
      }

      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    },
    [
      editingTokenId,
      isManualEdit,
      addValueToEditingToken,
      setIsManualEdit,
      setDurationRange,
      setInputValue,
      finalizeEditing,
      setEditingTokenId,
      inputRef,
    ],
  );

  const handleDropdownSelect = useCallback(
    (value: string) => {
      if (value.startsWith('__field__')) {
        const fieldName = value.replace('__field__', '');
        handleFieldSelect(fieldName);
      } else if (value.startsWith('__wildcard__')) {
        const fieldName = value.replace('__wildcard__', '');
        handleWildcardSelect(fieldName);
      } else if (value.startsWith('__complete__')) {
        const parts = value.replace('__complete__', '').split('__');
        const [fieldName, fieldValue, negatedFlag] = parts;
        const isNegated = negatedFlag === '1';
        handleCompleteValueSelect(fieldName, fieldValue, isNegated);
      } else if (value.startsWith('__value__')) {
        const parts = value.replace('__value__', '').split('__');
        const [fieldName, fieldValue, negatedFlag] = parts;
        const isNegated = negatedFlag === '1';
        handleCompleteValueSelect(fieldName, fieldValue, isNegated);
      } else if (value.startsWith('__preset__')) {
        const parts = value.replace('__preset__', '').split('__');
        const [fieldName, presetValue] = parts;
        handlePresetSelect(fieldName, presetValue);
      }
    },
    [handleFieldSelect, handleWildcardSelect, handleCompleteValueSelect, handlePresetSelect],
  );

  return {handleDropdownSelect};
}
