import {useCallback} from 'react';
import type {QueryToken} from '../types';
import {formatDuration} from '../utils';

interface UseQueryBuilderDurationProps {
  editingTokenId: string | null;
  tokens: QueryToken[];
  setDurationRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setInputValue: (value: string) => void;
  addValueToEditingToken: (value: string, isNegated: boolean) => void;
}

export function useQueryBuilderDuration({
  editingTokenId,
  tokens,
  setDurationRange,
  setInputValue,
  addValueToEditingToken,
}: UseQueryBuilderDurationProps) {
  const handleDurationRangeChange = useCallback(
    (range: [number, number], hasInputError?: boolean) => {
      setDurationRange(range);
      const [min, max] = range;
      const minAtEdge = min === 0;
      const maxAtEdge = max === 3600000;

      let newInputValue = '';
      if (minAtEdge && maxAtEdge) {
        newInputValue = '';
      } else if (minAtEdge) {
        newInputValue = `<${formatDuration(max)}`;
      } else if (maxAtEdge) {
        newInputValue = `>${formatDuration(min)}`;
      } else {
        newInputValue = `>${formatDuration(min)},<${formatDuration(max)}`;
      }
      setInputValue(newInputValue);

      if (!hasInputError && editingTokenId && newInputValue) {
        const token = tokens.find((t) => t.id === editingTokenId);
        if (token && token.key === 'duration') {
          if (newInputValue.includes(',')) {
            const parts = newInputValue
              .split(',')
              .map((p) => p.trim())
              .filter(Boolean);
            parts.forEach((part) => {
              addValueToEditingToken(part, false);
            });
          } else {
            addValueToEditingToken(newInputValue, false);
          }
        }
      }
    },
    [editingTokenId, tokens, addValueToEditingToken, setDurationRange, setInputValue],
  );

  return {handleDurationRangeChange};
}
