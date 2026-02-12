import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {SyntaxError as QuerySyntaxError, QueryToken} from '../types';
import {
  FIELD_RULES,
  getFieldRule,
  parseDurationComparison,
  parseQueryString,
  serializeTokensToText,
  validateAddValue,
} from '../utils';

export function useQueryBuilderState(value: string, onQueryChange?: (query: string) => void) {
  const [tokens, setTokens] = useState<QueryToken[]>(() => parseQueryString(value));
  const [inputValue, setInputValue] = useState('');
  const [editingTokenId, setEditingTokenIdInternal] = useState<string | null>(null);
  const setEditingTokenId = useCallback((id: string | null) => {
    setEditingTokenIdInternal(id);
  }, []);
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedDropdownIndex, setSelectedDropdownIndex] = useState(0);
  const [showSyntaxHelp, setShowSyntaxHelp] = useState(false);
  const [syntaxError, setSyntaxError] = useState<QuerySyntaxError | null>(null);
  const [syntaxHelpAutoOpened, setSyntaxHelpAutoOpened] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [pendingMainInputFocus, setPendingMainInputFocus] = useState(false);
  const [durationRange, setDurationRange] = useState<[number, number]>([0, 3600000]);
  const [conflictHints, setConflictHints] = useState<Record<string, string>>({});
  const [stableDropdownOrder, setStableDropdownOrder] = useState<string[] | null>(null);
  const stableDropdownFieldRef = useRef<string | null>(null);
  const [stableRecentDurations, setStableRecentDurations] = useState<string[] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editingTokenAnchorRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);
  const lastSyncedValueRef = useRef<string>(value);
  const isInternalUpdateRef = useRef(false);

  const serializeTokensToQuery = useCallback((tokenList: QueryToken[]): string => {
    return serializeTokensToText(tokenList);
  }, []);

  useEffect(() => {
    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }
    const queryText = serializeTokensToQuery(tokens);
    if (queryText !== lastSyncedValueRef.current) {
      lastSyncedValueRef.current = queryText;
      onQueryChange?.(queryText);
    }
  }, [tokens, serializeTokensToQuery, onQueryChange]);

  useEffect(() => {
    if (value === undefined || value === lastSyncedValueRef.current) {
      return;
    }
    isInternalUpdateRef.current = true;
    lastSyncedValueRef.current = value;
    setTokens(parseQueryString(value));
  }, [value]);

  useEffect(() => {
    if (pendingMainInputFocus && editingTokenId === null) {
      inputRef.current?.focus();
      setPendingMainInputFocus(false);
    }
  }, [pendingMainInputFocus, editingTokenId]);

  useEffect(() => {
    if (isFocused) {
      setShowDropdown(true);
    }
  }, [isFocused]);

  const editingToken = useMemo(
    () => (editingTokenId ? tokens.find((t) => t.id === editingTokenId) || null : null),
    [editingTokenId, tokens],
  );

  const addCompleteToken = useCallback(
    (
      fieldName: string,
      value: string,
      operator: string = ':',
      isNegated: boolean = false,
      isWildcard: boolean = false,
    ) => {
      setTokens((prev) => {
        if (isWildcard) {
          const filtered = prev.filter((t) => t.key !== fieldName);
          return [
            ...filtered,
            {
              id: `${Date.now()}-${Math.random()}`,
              key: fieldName,
              operator,
              values: [],
              isBuilding: false,
              isWildcard: true,
            },
          ];
        }

        const existingIndex = prev.findIndex((t) => t.key === fieldName && !t.isWildcard);
        if (existingIndex >= 0) {
          const existing = prev[existingIndex];
          const valueExists = existing.values.some(
            (v) => v.value === value && v.isNegated === isNegated,
          );
          if (valueExists) return prev;
          return prev.map((t, i) =>
            i === existingIndex ? {...t, values: [...t.values, {value, isNegated}]} : t,
          );
        }
        return [
          ...prev,
          {
            id: `${Date.now()}-${Math.random()}`,
            key: fieldName,
            operator,
            values: [{value, isNegated}],
            isBuilding: false,
          },
        ];
      });
      setInputValue('');
      setEditingTokenId(null);
    },
    [setEditingTokenId],
  );

  const setEditingTokenDurationValues = useCallback(
    (values: {value: string; isNegated: boolean}[]) => {
      if (!editingTokenId) return;
      setTokens((prev) =>
        prev.map((t) => {
          if (t.id !== editingTokenId || t.key !== 'duration') return t;
          return {...t, values: values.map((v) => ({value: v.value, isNegated: v.isNegated}))};
        }),
      );
      setInputValue('');
      setShowDropdown(true);
    },
    [editingTokenId],
  );

  const addValueToEditingToken = useCallback(
    (value: string, isNegated: boolean = false): boolean => {
      if (!editingTokenId) return false;

      const token = tokens.find((t) => t.id === editingTokenId);
      if (!token) return false;

      const valueIndex = token.values.findIndex(
        (v) => v.value === value && v.isNegated === isNegated,
      );
      if (valueIndex >= 0) {
        setTokens((prev) =>
          prev.map((t) =>
            t.id === editingTokenId
              ? {...t, values: t.values.filter((_, i) => i !== valueIndex)}
              : t,
          ),
        );
        setConflictHints((prev) => {
          const next = {...prev};
          delete next[`${value}-${isNegated}`];
          return next;
        });
        setInputValue('');
        setShowDropdown(true);
        return true;
      }

      const fieldRule = getFieldRule(token.key);
      if (fieldRule) {
        const clause = {
          field: token.key,
          values: token.values,
        };
        const validation = validateAddValue(clause, {value, isNegated}, fieldRule);

        if (!validation.valid) {
          if (validation.errorType === 'contradiction' && validation.conflictingValue) {
            setTokens((prev) =>
              prev.map((t) => {
                if (t.id === editingTokenId) {
                  const filteredValues = t.values.filter((v) => {
                    if (!validation.conflictingValue) return true;
                    return !(
                      v.value === validation.conflictingValue.value &&
                      v.isNegated === validation.conflictingValue.isNegated
                    );
                  });
                  return {...t, values: [...filteredValues, {value, isNegated}]};
                }
                return t;
              }),
            );
            setInputValue('');
            setShowDropdown(true);
            return true;
          }

          const hintKey = `${value}-${isNegated}`;
          setConflictHints((prev) => ({...prev, [hintKey]: validation.error || 'Invalid'}));
          setTimeout(() => {
            setConflictHints((prev) => {
              const next = {...prev};
              delete next[hintKey];
              return next;
            });
          }, 2000);
          return false;
        }
      }

      setTokens((prev) =>
        prev.map((t) => {
          if (t.id === editingTokenId) {
            const valueExists = t.values.some(
              (v) => v.value === value && v.isNegated === isNegated,
            );
            if (valueExists) {
              return t;
            }

            if (t.key === 'duration') {
              const isGreaterThan = value.startsWith('>');
              const isLessThan = value.startsWith('<');
              if (isGreaterThan || isLessThan) {
                const filteredValues = t.values.filter((v) => {
                  if (isGreaterThan && v.value.startsWith('>')) return false;
                  if (isLessThan && v.value.startsWith('<')) return false;
                  return true;
                });
                return {...t, values: [...filteredValues, {value, isNegated}]};
              }
            }

            return {...t, values: [...t.values, {value, isNegated}]};
          }
          return t;
        }),
      );
      setInputValue('');
      setShowDropdown(true);
      return true;
    },
    [editingTokenId, tokens],
  );

  const convertToWildcard = useCallback(
    (fieldName: string) => {
      if (editingTokenId) {
        setTokens((prev) =>
          prev.map((token) =>
            token.id === editingTokenId ? {...token, values: [], isWildcard: true} : token,
          ),
        );
      } else {
        addCompleteToken(fieldName, '*', ':', false, true);
      }
      setInputValue('');
      setEditingTokenId(null);
      setShowDropdown(true);
    },
    [editingTokenId, addCompleteToken, setEditingTokenId],
  );

  const startEditingToken = useCallback(
    (token: QueryToken) => {
      setEditingTokenId(token.id);
      setInputValue('');
      setShowDropdown(true);

      const field = FIELD_RULES.find((f) => f.name === token.key);
      if (field?.enumValues) {
        setStableDropdownOrder([...field.enumValues]);
        stableDropdownFieldRef.current = token.key;
      }
      if (token.key === 'duration') {
        setStableRecentDurations(null);
        let minVal = 0;
        let maxVal = 3600000;
        token.values.forEach((v) => {
          const parsed = parseDurationComparison(v.value);
          if (parsed) {
            if (parsed.operator === '<' || parsed.operator === '<=') {
              maxVal = Math.min(parsed.durationMs, 3600000);
            } else if (parsed.operator === '>' || parsed.operator === '>=') {
              minVal = Math.min(parsed.durationMs, 3600000);
            }
          }
        });
        setDurationRange([minVal, maxVal]);
      }

      inputRef.current?.focus();
    },
    [setEditingTokenId],
  );

  const finalizeEditing = useCallback(() => {
    if (editingTokenId) {
      setTokens((prev) => {
        const token = prev.find((t) => t.id === editingTokenId);
        if (token && token.values.length === 0 && !token.isWildcard) {
          return prev.filter((t) => t.id !== editingTokenId);
        }
        return prev.map((t) => (t.id === editingTokenId ? {...t, isBuilding: false} : t));
      });
    }
    setEditingTokenId(null);
    setInputValue('');
    setSyntaxError(null);
    if (syntaxHelpAutoOpened) {
      setShowSyntaxHelp(false);
      setSyntaxHelpAutoOpened(false);
    }
    setStableDropdownOrder(null);
    stableDropdownFieldRef.current = null;
    setStableRecentDurations(null);
  }, [editingTokenId, syntaxHelpAutoOpened, setEditingTokenId]);

  const deleteToken = useCallback(
    (tokenId: string) => {
      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
      if (editingTokenId === tokenId) {
        setEditingTokenId(null);
      }
      inputRef.current?.focus();
    },
    [editingTokenId, setEditingTokenId],
  );

  const selectField = useCallback(
    (fieldName: string) => {
      const newTokenId = `${Date.now()}-${Math.random()}`;
      const newToken: QueryToken = {
        id: newTokenId,
        key: fieldName,
        operator: ':',
        values: [],
        isBuilding: true,
      };
      setTokens((prev) => [...prev, newToken]);
      setEditingTokenId(newTokenId);
      setInputValue('');
      setIsManualEdit(false);

      const field = FIELD_RULES.find((f) => f.name === fieldName);
      if (field?.enumValues) {
        setStableDropdownOrder([...field.enumValues]);
        stableDropdownFieldRef.current = fieldName;
      }
      if (fieldName === 'duration') {
        setStableRecentDurations(null);
      }

      setTimeout(() => {
        setShowDropdown(true);
        setSelectedDropdownIndex(0);
      }, 100);
    },
    [setEditingTokenId],
  );

  return {
    tokens,
    setTokens,
    inputValue,
    setInputValue,
    editingTokenId,
    setEditingTokenId,
    isFocused,
    setIsFocused,
    showDropdown,
    setShowDropdown,
    selectedDropdownIndex,
    setSelectedDropdownIndex,
    showSyntaxHelp,
    setShowSyntaxHelp,
    syntaxError,
    setSyntaxError,
    syntaxHelpAutoOpened,
    setSyntaxHelpAutoOpened,
    isManualEdit,
    setIsManualEdit,
    pendingMainInputFocus,
    setPendingMainInputFocus,
    durationRange,
    setDurationRange,
    conflictHints,
    stableDropdownOrder,
    setStableDropdownOrder,
    stableDropdownFieldRef,
    stableRecentDurations,
    setStableRecentDurations,
    inputRef,
    containerRef,
    editingTokenAnchorRef,
    isSelectingRef,
    editingToken,
    addCompleteToken,
    addValueToEditingToken,
    setEditingTokenDurationValues,
    convertToWildcard,
    startEditingToken,
    finalizeEditing,
    deleteToken,
    selectField,
  };
}
