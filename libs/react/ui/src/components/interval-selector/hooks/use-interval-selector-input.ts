import {useCallback} from 'react';
import {parseTextInterval} from 'utils/date';
import type {IntervalSelection} from '../interval-selector';
import {
  detectShortcutFromCalendarInterval,
  type IntervalOption,
  parseRelativeTimeShortcut,
} from '../interval-selector.utils';

interface UseIntervalSelectorInputProps {
  pastIntervals: IntervalOption[];
  resolvedCalendarIntervals: IntervalOption[];
  inputValue: string;
  setInputValue: (value: string) => void;
  setDetectedShortcut: (shortcut: string | undefined) => void;
  setConfirmedShortcut: (shortcut: string | undefined) => void;
  setIsInvalid: (invalid: boolean) => void;
  setSelectedLabel: (label: string | undefined) => void;
  setHighlightedIndex: (index: number) => void;
  selectedValueRef: React.RefObject<string | undefined>;
  detectShortcutFromInput: (input: string) => string | undefined;
  applyIntervalDetection: (interval: import('date-fns').NormalizedInterval) => void;
  emitSelection: (selection: IntervalSelection) => void;
  onValueChange?: (value: string | undefined) => void;
  triggerShakeAnimation: () => void;
  closeInputAndPopover: () => void;
}

export function useIntervalSelectorInput({
  inputValue,
  setInputValue,
  setDetectedShortcut,
  setConfirmedShortcut,
  setIsInvalid,
  setSelectedLabel,
  setHighlightedIndex,
  selectedValueRef,
  detectShortcutFromInput,
  applyIntervalDetection,
  emitSelection,
  onValueChange,
  triggerShakeAnimation,
  closeInputAndPopover,
}: UseIntervalSelectorInputProps) {
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      const detectedShortcut = detectShortcutFromInput(newValue);
      if (detectedShortcut) {
        setDetectedShortcut(detectedShortcut);
        setIsInvalid(false);
      } else {
        setDetectedShortcut(undefined);
        if (newValue.trim()) {
          setConfirmedShortcut(undefined);
          setIsInvalid(true);
        } else {
          setConfirmedShortcut(undefined);
          setIsInvalid(false);
        }
      }

      if (selectedValueRef.current) {
        setSelectedLabel(undefined);
        selectedValueRef.current = undefined;
      }
      setHighlightedIndex(-1);
    },
    [
      setInputValue,
      detectShortcutFromInput,
      setDetectedShortcut,
      setIsInvalid,
      setConfirmedShortcut,
      setSelectedLabel,
      setHighlightedIndex,
      selectedValueRef,
    ],
  );

  const handleConfirmInput = useCallback(() => {
    const trimmedValue = inputValue.trim();

    const parsedShortcut = parseRelativeTimeShortcut(trimmedValue);
    if (parsedShortcut) {
      emitSelection({
        type: 'relative',
        duration: parsedShortcut.duration,
      });
      onValueChange?.(trimmedValue);
      setSelectedLabel(parsedShortcut.label);
      selectedValueRef.current = undefined;
      setConfirmedShortcut(parsedShortcut.shortcut);
      setDetectedShortcut(undefined);
      setIsInvalid(false);
      closeInputAndPopover();
      return;
    }

    const parsedInterval = parseTextInterval(trimmedValue);
    if (parsedInterval) {
      const calendarResult = detectShortcutFromCalendarInterval(parsedInterval);
      if (calendarResult?.value) {
        onValueChange?.(calendarResult.value);
      } else {
        onValueChange?.(undefined);
      }
      applyIntervalDetection(parsedInterval);
      emitSelection({
        type: 'interval',
        interval: parsedInterval,
      });
      setDetectedShortcut(undefined);
      setIsInvalid(false);
      closeInputAndPopover();
      return;
    }

    triggerShakeAnimation();
    setDetectedShortcut(undefined);
  }, [
    inputValue,
    emitSelection,
    onValueChange,
    setSelectedLabel,
    setConfirmedShortcut,
    setDetectedShortcut,
    setIsInvalid,
    applyIntervalDetection,
    triggerShakeAnimation,
    closeInputAndPopover,
    selectedValueRef,
  ]);

  return {
    handleInputChange,
    handleConfirmInput,
  };
}
