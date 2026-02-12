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
    exitTextEditMode: () => void;
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
        textEditMode.exitTextEditMode();
        textEditMode.textEditInputRef.current?.blur();
      }
    },
    [textEditMode],
  );

  const handleTextInputBlur = useCallback(() => {
    textEditMode.exitTextEditMode();
  }, [textEditMode]);

  return {
    handleTextInputChange,
    handleTextInputKeyDown,
    handleTextInputBlur,
  };
}
