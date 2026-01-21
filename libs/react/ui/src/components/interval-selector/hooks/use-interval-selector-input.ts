import {useCallback, useRef, useState} from 'react';
import {parseTextDurationShortcut, parseTextInterval} from 'utils/date';
import type {IntervalSelection} from '../types';
import {formatSelection, formatSelectionForInput, formatShortcut} from '../utils/format';

export interface UseNewIntervalSelectorInputProps {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onSelect: (selection: IntervalSelection) => void;
  selection: IntervalSelection;
  isNavigating: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isFocused: boolean;
  setIsFocused: (isFocused: boolean) => void;
}

export function useIntervalSelectorInput({
  onChange: onChangeProp,
  onKeyDown: onKeyDownProp,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  onSelect,
  selection,
  isNavigating,
  inputRef,
  isFocused,
  setIsFocused,
}: UseNewIntervalSelectorInputProps) {
  const [value, setValue] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMouseDownOnInputRef = useRef(false);

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      const shortcut = parseTextDurationShortcut(newValue);
      const interval = parseTextInterval(newValue);
      const isValid = shortcut || interval || newValue.trim() === '';
      setIsInvalid(!isValid);
      onChangeProp?.(e);
    },
    [onChangeProp],
  );

  const triggerShakeAnimation = useCallback(() => {
    if (shakeTimeoutRef.current) clearTimeout(shakeTimeoutRef.current);
    setIsInvalid(true);
    setShouldShake(true);
    shakeTimeoutRef.current = setTimeout(() => {
      setShouldShake(false);
      shakeTimeoutRef.current = null;
    }, 500);
  }, []);

  const handleConfirmInput = useCallback(() => {
    const shortcut = parseTextDurationShortcut(value);
    if (shortcut) return onSelect({type: 'relative', duration: shortcut});
    const interval = parseTextInterval(value);
    if (interval) return onSelect({type: 'interval', interval});
    triggerShakeAnimation();
  }, [value, onSelect, triggerShakeAnimation]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isNavigating && e.key === 'Enter') {
        e.preventDefault();
        handleConfirmInput();
      }
      onKeyDownProp?.(e);
    },
    [isNavigating, handleConfirmInput, onKeyDownProp],
  );

  const onFocus = useCallback(() => {
    setIsFocused(true);
    setValue(formatSelectionForInput(selection));
    setIsInvalid(false);
    requestAnimationFrame(() => {
      inputRef.current?.select();
    });
    onFocusProp?.();
  }, [selection, onFocusProp, inputRef, setIsFocused]);

  const onMouseDown = useCallback(() => {
    isMouseDownOnInputRef.current = true;
  }, []);

  const onMouseUp = useCallback(() => {
    setTimeout(() => {
      isMouseDownOnInputRef.current = false;
    });
  }, []);

  const onBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (relatedTarget?.closest('[role="dialog"]')) {
        return;
      }
      if (isMouseDownOnInputRef.current) {
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
      setIsFocused(false);
      onBlurProp?.(e);
    },
    [onBlurProp, inputRef, setIsFocused],
  );

  const displayValue = formatSelection({
    selection,
    isFocused: isFocused,
    inputValue: value,
  });

  const shortcutValue = formatShortcut({
    selection,
    inputValue: value,
    isFocused: isFocused,
  });

  return {
    value,
    shouldShake,
    isFocused,
    isInvalid,
    displayValue,
    shortcutValue,
    setValue,
    onChange,
    onKeyDown,
    onFocus,
    onMouseDown,
    onMouseUp,
    onBlur,
    inputRef,
  };
}
