import {useCallback} from 'react';

interface UseQueryBuilderTextEditProps {
  textEditMode: {
    isTextEditMode: boolean;
    textEditValue: string;
    textEditError: string | null;
    textEditInputRef: React.RefObject<HTMLInputElement | null>;
    setTextEditValue: (value: string) => void;
    setTextEditError: (error: string | null) => void;
    applyTextChanges: () => void;
    revertTextChanges: () => void;
    toggleInputMode: () => void;
  };
}

export function useQueryBuilderTextEdit({textEditMode}: UseQueryBuilderTextEditProps) {
  const handleTextInputChange = useCallback(
    (value: string) => {
      textEditMode.setTextEditValue(value);
      textEditMode.setTextEditError(null);
    },
    [textEditMode],
  );

  const handleTextInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        textEditMode.applyTextChanges();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        textEditMode.revertTextChanges();
      }
    },
    [textEditMode],
  );

  return {
    handleTextInputChange,
    handleTextInputKeyDown,
  };
}
