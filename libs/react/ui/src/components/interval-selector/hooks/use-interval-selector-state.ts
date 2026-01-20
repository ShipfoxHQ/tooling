import {useRef, useState} from 'react';

export function useIntervalSelectorState() {
  const [isFocused, setIsFocused] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [detectedShortcut, setDetectedShortcut] = useState<string | undefined>(undefined);
  const [confirmedShortcut, setConfirmedShortcut] = useState<string | undefined>(undefined);
  const [isInvalid, setIsInvalid] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  const selectedValueRef = useRef<string | undefined>(undefined);
  const isSelectingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const shakeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMouseDownOnInputRef = useRef(false);

  return {
    isFocused,
    setIsFocused,
    popoverOpen,
    setPopoverOpen,
    calendarOpen,
    setCalendarOpen,
    inputValue,
    setInputValue,
    selectedLabel,
    setSelectedLabel,
    highlightedIndex,
    setHighlightedIndex,
    detectedShortcut,
    setDetectedShortcut,
    confirmedShortcut,
    setConfirmedShortcut,
    isInvalid,
    setIsInvalid,
    shouldShake,
    setShouldShake,
    selectedValueRef,
    isSelectingRef,
    inputRef,
    shakeTimeoutRef,
    isMouseDownOnInputRef,
  };
}
