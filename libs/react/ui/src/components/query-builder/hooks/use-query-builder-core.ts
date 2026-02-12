import {useCallback, useEffect, useMemo, useRef} from 'react';
import type {QueryToken} from '../types';
import {parseQueryString, validateSyntax} from '../utils';
import {getDropdownHeader, getPlaceholder} from '../utils/helpers';
import {useQueryBuilderDuration} from './use-query-builder-duration';
import {useQueryBuilderKeyboard} from './use-query-builder-keyboard';
import {useQueryBuilderModifiers} from './use-query-builder-modifiers';
import {useQueryBuilderSelection} from './use-query-builder-selection';
import {useQueryBuilderState} from './use-query-builder-state';
import {useQueryBuilderSuggestions} from './use-query-builder-suggestions';
import {useQueryBuilderTextEdit} from './use-query-builder-text-edit';
import {useTextEditMode} from './use-text-edit-mode';

interface UseQueryBuilderCoreParams {
  value: string;
  onQueryChange?: (query: string) => void;
  placeholder: string;
  container?: HTMLElement | null;
}

export function useQueryBuilderCore({
  value,
  onQueryChange,
  placeholder,
  container,
}: UseQueryBuilderCoreParams) {
  const {isAltHeld, isShiftHeld} = useQueryBuilderModifiers();

  const state = useQueryBuilderState(value, onQueryChange);
  const textEditMode = useTextEditMode(state.tokens, state.setTokens);
  const {
    setTokens,
    inputValue,
    setInputValue,
    editingTokenId,
    setEditingTokenId,
    showDropdown,
    setShowDropdown,
    setSelectedDropdownIndex,
    showSyntaxHelp,
    setShowSyntaxHelp,
    syntaxError,
    setSyntaxError,
    syntaxHelpAutoOpened,
    setSyntaxHelpAutoOpened,
    setPendingMainInputFocus,
    inputRef,
    isSelectingRef,
    setIsFocused,
    setIsManualEdit,
    finalizeEditing,
    startEditingToken,
  } = state;

  useEffect(() => {
    setSelectedDropdownIndex(0);
  }, [setSelectedDropdownIndex]);

  useEffect(() => {
    const handleDocumentMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const container = state.containerRef.current;
      if (
        !container?.contains(target) &&
        !(target as HTMLElement).closest?.('[data-radix-popper-content-wrapper]')
      ) {
        if (textEditMode.isTextEditMode) {
          textEditMode.exitTextEditMode();
          textEditMode.textEditInputRef.current?.blur();
        } else {
          finalizeEditing();
          state.setIsFocused(false);
          setShowDropdown(false);
          inputRef.current?.blur();
        }
      }
    };
    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, [
    textEditMode.isTextEditMode,
    textEditMode.exitTextEditMode,
    textEditMode.textEditInputRef,
    finalizeEditing,
    state.setIsFocused,
    state.containerRef,
    setShowDropdown,
    inputRef,
  ]);

  useEffect(() => {
    if (!inputValue.trim()) {
      if (syntaxError) {
        setSyntaxError(null);
        if (syntaxHelpAutoOpened) {
          setShowSyntaxHelp(false);
          setSyntaxHelpAutoOpened(false);
        }
      }
      return;
    }
    const error = validateSyntax(inputValue);
    setSyntaxError(error);
    if (error) {
      if (showDropdown && !showSyntaxHelp) {
        setShowSyntaxHelp(true);
        setSyntaxHelpAutoOpened(true);
      }
    } else {
      if (syntaxHelpAutoOpened && showSyntaxHelp) {
        setShowSyntaxHelp(false);
        setSyntaxHelpAutoOpened(false);
      }
    }
  }, [
    inputValue,
    showDropdown,
    showSyntaxHelp,
    syntaxHelpAutoOpened,
    syntaxError,
    setSyntaxError,
    setShowSyntaxHelp,
    setSyntaxHelpAutoOpened,
  ]);

  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
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

  const handleFocus = useCallback(
    (_e?: React.FocusEvent<HTMLInputElement>) => {
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

      finalizeEditing();
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
    [isSelectingRef, inputRef, finalizeEditing, setIsFocused, setShowDropdown, setShowSyntaxHelp],
  );

  const handlePopoverOpenChange = useCallback(
    (open: boolean) => {
      if (!open && isSelectingRef.current) {
        return;
      }
      if (!open && inputRef.current && document.activeElement === inputRef.current) {
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
    [isSelectingRef, inputRef, setShowDropdown, setShowSyntaxHelp],
  );

  const handleClearAll = useCallback(() => {
    setTokens([]);
    setInputValue('');
    setShowDropdown(false);
    setShowSyntaxHelp(false);
    inputRef.current?.focus();
  }, [setTokens, setInputValue, setShowDropdown, setShowSyntaxHelp, inputRef]);

  const handleTokenClick = useCallback(
    (token: QueryToken) => {
      startEditingToken(token);
    },
    [startEditingToken],
  );

  const handleEditingTokenClick = useCallback(() => {
    setEditingTokenId(null);
    setInputValue('');
    setPendingMainInputFocus(true);
  }, [setEditingTokenId, setInputValue, setPendingMainInputFocus]);

  const handleEditingTokenKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || (e.key === ' ' && !e.shiftKey)) {
        e.preventDefault();
        e.stopPropagation();
        setEditingTokenId(null);
        setInputValue('');
        setPendingMainInputFocus(true);
      }
    },
    [setEditingTokenId, setInputValue, setPendingMainInputFocus],
  );

  const handleToggleSyntaxHelp = useCallback(() => {
    setShowSyntaxHelp((v: boolean) => !v);
    setSyntaxHelpAutoOpened(false);
  }, [setShowSyntaxHelp, setSyntaxHelpAutoOpened]);

  const handleEscape = useCallback(() => {
    finalizeEditing();
    setIsFocused(false);
    setShowDropdown(false);
    setShowSyntaxHelp(false);
    inputRef.current?.blur();
  }, [finalizeEditing, setIsFocused, setShowDropdown, setShowSyntaxHelp, inputRef]);

  const {dropdownItems} = useQueryBuilderSuggestions(
    inputValue,
    state.tokens,
    state.editingToken ?? null,
    isAltHeld,
    isShiftHeld,
    state.conflictHints,
    state.stableDropdownOrder,
    state.stableDropdownFieldRef,
    state.editingToken?.key === 'duration' ? state.durationRange : undefined,
  );

  const {handleDropdownSelect} = useQueryBuilderSelection({
    editingTokenId,
    tokens: state.tokens,
    isManualEdit: state.isManualEdit,
    inputRef,
    selectField: state.selectField,
    convertToWildcard: state.convertToWildcard,
    addValueToEditingToken: state.addValueToEditingToken,
    setEditingTokenDurationValues: state.setEditingTokenDurationValues,
    setEditingTokenId,
    setTokens: state.setTokens,
    setInputValue,
    setIsManualEdit: state.setIsManualEdit,
    finalizeEditing,
    setDurationRange: state.setDurationRange,
    setStableDropdownOrder: state.setStableDropdownOrder,
    setStableRecentDurations: state.setStableRecentDurations,
    stableDropdownFieldRef: state.stableDropdownFieldRef,
  });

  const {handleDurationRangeChange, handleDurationRangeCommit} = useQueryBuilderDuration({
    editingTokenId,
    tokens: state.tokens,
    setDurationRange: state.setDurationRange,
    setInputValue,
    setEditingTokenDurationValues: state.setEditingTokenDurationValues,
  });

  const {handleTextInputChange, handleTextInputKeyDown, handleTextInputBlur} =
    useQueryBuilderTextEdit({
      textEditMode,
    });

  const {handleKeyDown} = useQueryBuilderKeyboard({
    showDropdown,
    deferredDropdownItems: dropdownItems,
    selectedDropdownIndex: state.selectedDropdownIndex,
    setSelectedDropdownIndex: state.setSelectedDropdownIndex,
    handleDropdownSelect,
    inputValue,
    tokens: state.tokens,
    editingTokenId,
    addCompleteToken: state.addCompleteToken,
    finalizeEditing,
    deleteToken: state.deleteToken,
    setTokens: state.setTokens,
    setEditingTokenId,
    setInputValue,
    setShowDropdown,
    setIsFocused: state.setIsFocused,
    inputRef,
  });

  const contextValue = useMemo(
    () => ({
      tokens: state.tokens,
      inputValue,
      editingTokenId,
      editingToken: state.editingToken ?? null,
      isFocused: state.isFocused,
      showDropdown,
      syntaxError: state.syntaxError,
      durationRange: state.durationRange,
      selectedDropdownIndex: state.selectedDropdownIndex,
      dropdownItems,
      placeholder: getPlaceholder(state.tokens, placeholder),
      inputRef,
      containerRef: state.containerRef,
      editingTokenAnchorRef: state.editingTokenAnchorRef,
      isSelectingRef,
      container,
      onInputChange: handleInputChange,
      onKeyDown: handleKeyDown,
      onPaste: handlePaste,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onInputAreaClick: handleInputAreaClick,
      onTokenClick: handleTokenClick,
      onTokenDelete: state.deleteToken,
      onClearAll: handleClearAll,
      onToggleTextMode: textEditMode.toggleInputMode,
      onEditingTokenClick: handleEditingTokenClick,
      onEditingTokenKeyDown: handleEditingTokenKeyDown,
      onDropdownSelect: handleDropdownSelect,
      onDurationRangeChange: handleDurationRangeChange,
      onDurationRangeCommit: handleDurationRangeCommit,
      onToggleSyntaxHelp: handleToggleSyntaxHelp,
      onEscape: handleEscape,
      getDropdownHeader: () => getDropdownHeader(state.editingToken ?? null, inputValue),
      showSyntaxHelp,
    }),
    [
      state.tokens,
      inputValue,
      editingTokenId,
      state.editingToken,
      state.isFocused,
      showDropdown,
      state.syntaxError,
      state.durationRange,
      state.selectedDropdownIndex,
      dropdownItems,
      placeholder,
      container,
      handleInputChange,
      handleKeyDown,
      handlePaste,
      handleFocus,
      handleBlur,
      handleInputAreaClick,
      handleTokenClick,
      state.deleteToken,
      handleClearAll,
      handleEditingTokenClick,
      handleEditingTokenKeyDown,
      handleDropdownSelect,
      handleDurationRangeChange,
      handleDurationRangeCommit,
      handleToggleSyntaxHelp,
      handleEscape,
      showSyntaxHelp,
      inputRef,
      state.containerRef,
      state.editingTokenAnchorRef,
      isSelectingRef,
      textEditMode.toggleInputMode,
    ],
  );

  return {
    contextValue,
    textEditMode,
    containerRef: state.containerRef,
    showDropdown,
    handlePopoverOpenChange,
    handleTextInputChange,
    handleTextInputKeyDown,
    handleTextInputBlur,
    handleToggleTextMode: textEditMode.toggleInputMode,
  };
}
