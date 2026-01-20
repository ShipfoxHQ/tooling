import {useCallback} from 'react';
import {parseTextDurationShortcut, parseTextInterval} from 'utils/date';
import type {IntervalSelection} from '../types';

interface UseIntervalSelectorInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  setIsInvalid: (invalid: boolean) => void;
  setSelectedLabel: (label: string | undefined) => void;
  setHighlightedIndex: (index: number) => void;
  selectedValueRef: React.RefObject<string | undefined>;
  triggerShakeAnimation: () => void;
  onSelect: (selection: IntervalSelection) => void;
}

export function useIntervalSelectorInput({
  inputValue,
  setInputValue,
  setIsInvalid,
  setSelectedLabel,
  setHighlightedIndex,
  selectedValueRef,
  triggerShakeAnimation,
  onSelect,
}: UseIntervalSelectorInputProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      const shortcut = parseTextDurationShortcut(newValue);
      const interval = parseTextInterval(newValue);
      const isValid = shortcut || interval || newValue.trim() === '';
      setIsInvalid(!isValid);

      if (selectedValueRef.current) selectedValueRef.current = undefined;

      setSelectedLabel(undefined);
      setHighlightedIndex(-1);
    },
    [setInputValue, setIsInvalid, setSelectedLabel, setHighlightedIndex, selectedValueRef],
  );

  const handleConfirmInput = useCallback(() => {
    const shortcut = parseTextDurationShortcut(inputValue);
    if (shortcut) return onSelect({type: 'relative', duration: shortcut});
    const interval = parseTextInterval(inputValue);
    if (interval) return onSelect({type: 'interval', interval});
    triggerShakeAnimation();
  }, [inputValue, onSelect, triggerShakeAnimation]);

  return {
    handleInputChange,
    handleConfirmInput,
  };
}
