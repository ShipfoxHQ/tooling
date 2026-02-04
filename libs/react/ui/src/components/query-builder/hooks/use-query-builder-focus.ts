import {useCallback, useEffect, useRef} from 'react';

interface UseQueryBuilderFocusProps {
  showDropdown: boolean;
  isSelectingRef: React.RefObject<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
  setIsFocused: (value: boolean) => void;
  setShowDropdown: (value: boolean) => void;
  setShowSyntaxHelp: (value: boolean) => void;
}

export function useQueryBuilderFocus({
  showDropdown,
  isSelectingRef,
  inputRef,
  setIsFocused,
  setShowDropdown,
  setShowSyntaxHelp,
}: UseQueryBuilderFocusProps) {
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleFocus = useCallback(
    (e?: React.FocusEvent<HTMLInputElement>) => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      setIsFocused(true);
      if (!showDropdown) {
        setShowDropdown(true);
      }
    },
    [showDropdown, setIsFocused, setShowDropdown],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const relatedTarget = e.relatedTarget as HTMLElement;
      const isClickingDropdown = relatedTarget?.closest('[data-radix-popper-content-wrapper]');
      const isClickingInput =
        relatedTarget === inputRef.current || inputRef.current?.contains(relatedTarget);

      if (isClickingDropdown || isClickingInput || isSelectingRef.current) {
        return;
      }

      setIsFocused(false);
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
      blurTimeoutRef.current = setTimeout(() => {
        const activeElement = document.activeElement;
        const popoverContent = activeElement?.closest('[data-radix-popper-content-wrapper]');
        if (!popoverContent && !isSelectingRef.current && activeElement !== inputRef.current) {
          setShowDropdown(false);
          setShowSyntaxHelp(false);
        }
      }, 150);
    },
    [isSelectingRef, inputRef, setIsFocused, setShowDropdown, setShowSyntaxHelp],
  );

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (!open && isSelectingRef.current) {
        return;
      }
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
        blurTimeoutRef.current = null;
      }
      setShowDropdown(open);
      if (!open) {
        setShowSyntaxHelp(false);
      }
    },
    [isSelectingRef, setShowDropdown, setShowSyntaxHelp],
  );

  return {
    handleFocus,
    handleBlur,
    handlePopoverOpenChange,
  };
}
