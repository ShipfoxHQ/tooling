import {useCallback} from 'react';
import type {QueryToken} from '../types';
import {FIELD_RULES} from '../utils';
import {parseInput} from '../utils/suggestions';

interface UseQueryBuilderKeyboardProps {
  showDropdown: boolean;
  deferredDropdownItems: Array<{value: string}>;
  selectedDropdownIndex: number;
  setSelectedDropdownIndex: (index: number | ((prev: number) => number)) => void;
  handleDropdownSelect: (value: string) => void;
  inputValue: string;
  tokens: QueryToken[];
  editingTokenId: string | null;
  addCompleteToken: (fieldName: string, value: string, operator?: string) => void;
  finalizeEditing: () => void;
  deleteToken: (tokenId: string) => void;
  setTokens: React.Dispatch<React.SetStateAction<QueryToken[]>>;
  setEditingTokenId: (id: string | null) => void;
  setInputValue: (value: string) => void;
  setShowDropdown: (show: boolean) => void;
  setIsFocused: (value: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function useQueryBuilderKeyboard({
  showDropdown,
  deferredDropdownItems,
  selectedDropdownIndex,
  setSelectedDropdownIndex,
  handleDropdownSelect,
  inputValue,
  tokens,
  editingTokenId,
  addCompleteToken,
  finalizeEditing,
  deleteToken,
  setTokens,
  setEditingTokenId,
  setInputValue,
  setShowDropdown,
  setIsFocused,
  inputRef,
}: UseQueryBuilderKeyboardProps) {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (showDropdown && deferredDropdownItems.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedDropdownIndex((prev) =>
            prev < deferredDropdownItems.length - 1 ? prev + 1 : prev,
          );
          return;
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedDropdownIndex((prev) => (prev > 0 ? prev - 1 : prev));
          return;
        }
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        if (editingTokenId) {
          setTokens((prev) => {
            const token = prev.find((t) => t.id === editingTokenId);
            if (token && token.values.length === 0) {
              return prev.filter((t) => t.id !== editingTokenId);
            }
            return prev.map((t) => (t.id === editingTokenId ? {...t, isBuilding: false} : t));
          });
          setEditingTokenId(null);
        }
        setInputValue('');
        setShowDropdown(true);
        setTimeout(() => inputRef.current?.focus(), 0);
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();

        if (showDropdown && deferredDropdownItems.length > 0) {
          handleDropdownSelect(deferredDropdownItems[selectedDropdownIndex].value);
          return;
        }

        if (inputValue.trim()) {
          const parsed = parseInput(inputValue);
          if (parsed.field && parsed.value) {
            const field = FIELD_RULES.find((f) => f.name === parsed.field);
            const matchedValue = field?.enumValues?.find(
              (v) => v.toLowerCase() === parsed.value?.toLowerCase(),
            );
            if (matchedValue && parsed.field) {
              addCompleteToken(parsed.field, matchedValue, parsed.operator || ':');
              return;
            }
          }
        }

        if (editingTokenId) {
          finalizeEditing();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        finalizeEditing();
        setIsFocused(false);
        setShowDropdown(false);
        inputRef.current?.blur();
        return;
      }

      if (e.key === '?' && !editingTokenId) {
        e.preventDefault();
        return;
      }

      if (e.key === 'Backspace' && !inputValue && tokens.length > 0) {
        e.preventDefault();
        const lastToken = tokens[tokens.length - 1];
        if (lastToken.values.length > 1) {
          setTokens((prev) =>
            prev.map((t, i) => (i === prev.length - 1 ? {...t, values: t.values.slice(0, -1)} : t)),
          );
        } else {
          deleteToken(lastToken.id);
        }
        return;
      }

      if (e.key === ',' || e.key === ';') {
        e.preventDefault();
        if (editingTokenId) {
          setTokens((prev) => {
            const token = prev.find((t) => t.id === editingTokenId);
            if (token && token.values.length === 0) {
              return prev.filter((t) => t.id !== editingTokenId);
            }
            return prev.map((t) => (t.id === editingTokenId ? {...t, isBuilding: false} : t));
          });
          setEditingTokenId(null);
        }
        setInputValue('');
        setShowDropdown(true);
        return;
      }
    },
    [
      showDropdown,
      deferredDropdownItems,
      selectedDropdownIndex,
      setSelectedDropdownIndex,
      handleDropdownSelect,
      inputValue,
      tokens,
      editingTokenId,
      addCompleteToken,
      finalizeEditing,
      deleteToken,
      setTokens,
      setEditingTokenId,
      setInputValue,
      setShowDropdown,
      setIsFocused,
      inputRef,
    ],
  );

  return {handleKeyDown};
}
