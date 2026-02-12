import {useCallback} from 'react';
import type {QueryToken} from '../types';
import {durationRangeToInputValue} from '../utils';

function durationRangeToValues(newInputValue: string): {value: string; isNegated: boolean}[] {
  if (!newInputValue.trim()) return [];
  if (newInputValue.includes(',')) {
    const parts = newInputValue.split(',').map((p) => p.trim()).filter(Boolean);
    return parts.map((value) => ({value, isNegated: false}));
  }
  return [{value: newInputValue, isNegated: false}];
}

interface UseQueryBuilderDurationProps {
  editingTokenId: string | null;
  tokens: QueryToken[];
  setDurationRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setInputValue: (value: string) => void;
  setEditingTokenDurationValues: (values: {value: string; isNegated: boolean}[]) => void;
}

export function useQueryBuilderDuration({
  editingTokenId,
  tokens,
  setDurationRange,
  setInputValue,
  setEditingTokenDurationValues,
}: UseQueryBuilderDurationProps) {
  const applyRange = useCallback(
    (range: [number, number]) => {
      setDurationRange(range);
      setInputValue(durationRangeToInputValue(range));
    },
    [setDurationRange, setInputValue],
  );

  const handleDurationRangeChange = useCallback(
    (range: [number, number], hasInputError?: boolean) => {
      applyRange(range);
      if (hasInputError) return;
      const newInputValue = durationRangeToInputValue(range);
      if (!editingTokenId || !newInputValue) return;
      const token = tokens.find((t) => t.id === editingTokenId);
      if (token?.key === 'duration') {
        setEditingTokenDurationValues(durationRangeToValues(newInputValue));
      }
    },
    [applyRange, editingTokenId, tokens, setEditingTokenDurationValues],
  );

  const handleDurationRangeCommit = useCallback(
    (range: [number, number], hasInputError?: boolean) => {
      applyRange(range);
      const newInputValue = durationRangeToInputValue(range);
      if (hasInputError || !editingTokenId || !newInputValue) return;
      const token = tokens.find((t) => t.id === editingTokenId);
      if (token?.key === 'duration') {
        const values = durationRangeToValues(newInputValue);
        setEditingTokenDurationValues(values);
      }
    },
    [applyRange, editingTokenId, tokens, setEditingTokenDurationValues],
  );

  return {handleDurationRangeChange, handleDurationRangeCommit};
}
