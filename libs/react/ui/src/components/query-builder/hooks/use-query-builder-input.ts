import {useCallback} from 'react';
import type {QueryToken} from '../types';
import {parseQueryString} from '../utils';

interface UseQueryBuilderInputProps {
  editingTokenId: string | null;
  setInputValue: (value: string) => void;
  setShowDropdown: (value: boolean) => void;
  setIsManualEdit: (value: boolean) => void;
  setTokens: React.Dispatch<React.SetStateAction<QueryToken[]>>;
  finalizeEditing: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function useQueryBuilderInput({
  editingTokenId,
  setInputValue,
  setShowDropdown,
  setIsManualEdit,
  setTokens,
  finalizeEditing,
  inputRef,
}: UseQueryBuilderInputProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);
      setShowDropdown(true);
      if (editingTokenId) {
        setIsManualEdit(true);
      }
    },
    [editingTokenId, setInputValue, setShowDropdown, setIsManualEdit],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const pastedText = e.clipboardData.getData('text');
      if (pastedText.includes(' ') || pastedText.includes(':')) {
        e.preventDefault();
        const parsedTokens = parseQueryString(pastedText);
        if (parsedTokens.length > 0) {
          setTokens((prev) => {
            const newTokens = [...prev];
            parsedTokens.forEach((pt) => {
              const existingIndex = newTokens.findIndex((t) => t.key === pt.key);
              if (existingIndex >= 0) {
                pt.values.forEach((v) => {
                  if (
                    !newTokens[existingIndex].values.some(
                      (ev) => ev.value === v.value && ev.isNegated === v.isNegated,
                    )
                  ) {
                    newTokens[existingIndex].values.push(v);
                  }
                });
              } else {
                newTokens.push(pt);
              }
            });
            return newTokens;
          });
          setInputValue('');
        } else {
          setInputValue(pastedText);
        }
      }
    },
    [setTokens, setInputValue],
  );

  const handleInputAreaClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === inputRef.current || e.target === e.currentTarget) {
        if (editingTokenId) {
          finalizeEditing();
        }
        inputRef.current?.focus();
      }
    },
    [editingTokenId, finalizeEditing, inputRef],
  );

  return {
    handleInputChange,
    handlePaste,
    handleInputAreaClick,
  };
}
