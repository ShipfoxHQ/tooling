import {Popover, PopoverTrigger} from 'components/popover';
import {useEffect} from 'react';
import {cn} from 'utils/cn';
import {QueryBuilderDropdown, QueryBuilderInput, QueryBuilderTextInput} from './components';
import {
  useQueryBuilderDuration,
  useQueryBuilderFocus,
  useQueryBuilderHandlers,
  useQueryBuilderInput,
  useQueryBuilderKeyboard,
  useQueryBuilderModifiers,
  useQueryBuilderSelection,
  useQueryBuilderState,
  useQueryBuilderSuggestions,
  useQueryBuilderSyntax,
  useQueryBuilderTextEdit,
  useRecentDurations,
  useTextEditMode,
} from './hooks';
import {getDropdownHeader, getPlaceholder} from './utils/helpers';

export interface QueryBuilderProps {
  value?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
  container?: HTMLElement | null;
}

export function QueryBuilder({
  value = '',
  onQueryChange,
  placeholder = 'Type to search: status, duration, branch...',
  className,
  container,
}: QueryBuilderProps) {
  const {recentDurations, addToRecentDurations} = useRecentDurations();
  const {isAltHeld} = useQueryBuilderModifiers();

  const state = useQueryBuilderState(value, onQueryChange, addToRecentDurations);
  const {
    tokens,
    setTokens,
    inputValue,
    setInputValue,
    editingTokenId,
    setEditingTokenId,
    isFocused,
    setIsFocused,
    showDropdown,
    setShowDropdown,
    selectedDropdownIndex,
    setSelectedDropdownIndex,
    showSyntaxHelp,
    setShowSyntaxHelp,
    syntaxError,
    setSyntaxError,
    syntaxHelpAutoOpened,
    setSyntaxHelpAutoOpened,
    isManualEdit,
    setIsManualEdit,
    pendingMainInputFocus: _pendingMainInputFocus,
    setPendingMainInputFocus,
    durationRange,
    setDurationRange,
    conflictHints,
    stableDropdownOrder,
    setStableDropdownOrder,
    stableDropdownFieldRef,
    stableRecentDurations,
    setStableRecentDurations,
    inputRef,
    containerRef,
    editingTokenAnchorRef,
    isSelectingRef,
    editingToken,
    addCompleteToken,
    addValueToEditingToken,
    convertToWildcard,
    startEditingToken,
    finalizeEditing,
    deleteToken,
    selectField,
  } = state;

  const {dropdownItems} = useQueryBuilderSuggestions(
    inputValue,
    tokens,
    editingToken,
    isAltHeld,
    conflictHints,
    stableDropdownOrder,
    stableDropdownFieldRef,
    stableRecentDurations,
    recentDurations,
  );

  const textEditMode = useTextEditMode(tokens, setTokens);

  useEffect(() => {
    setSelectedDropdownIndex(0);
  }, [setSelectedDropdownIndex]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [inputRef]);

  useQueryBuilderSyntax({
    inputValue,
    showDropdown,
    showSyntaxHelp,
    syntaxHelpAutoOpened,
    syntaxError,
    setSyntaxError,
    setShowSyntaxHelp,
    setSyntaxHelpAutoOpened,
  });

  const {handleDropdownSelect} = useQueryBuilderSelection({
    editingTokenId,
    tokens,
    isManualEdit,
    recentDurations,
    inputRef,
    selectField,
    convertToWildcard,
    addValueToEditingToken,
    setEditingTokenId,
    setTokens,
    setInputValue,
    setIsManualEdit,
    finalizeEditing,
    setDurationRange,
    setStableDropdownOrder,
    setStableRecentDurations,
    stableDropdownFieldRef,
  });

  const {handleInputChange, handlePaste, handleInputAreaClick} = useQueryBuilderInput({
    editingTokenId,
    setInputValue,
    setShowDropdown,
    setIsManualEdit,
    setTokens,
    finalizeEditing,
    inputRef,
  });

  const {handleDurationRangeChange} = useQueryBuilderDuration({
    editingTokenId,
    tokens,
    setDurationRange,
    setInputValue,
    addValueToEditingToken,
  });

  const {handleFocus, handleBlur, handlePopoverOpenChange} = useQueryBuilderFocus({
    showDropdown,
    isSelectingRef,
    inputRef,
    setIsFocused,
    setShowDropdown,
    setShowSyntaxHelp,
  });

  const {
    handleClearAll,
    handleTokenClick,
    handleEditingTokenClick,
    handleEditingTokenKeyDown,
    handleToggleSyntaxHelp,
    handleEscape,
    handleToggleTextMode,
  } = useQueryBuilderHandlers({
    setTokens,
    setInputValue,
    setEditingTokenId,
    setPendingMainInputFocus,
    setShowSyntaxHelp,
    setShowSyntaxHelpAutoOpened: setSyntaxHelpAutoOpened,
    setShowDropdown,
    inputRef,
    startEditingToken,
    deleteToken,
    recentDurations,
    toggleTextMode: textEditMode.toggleInputMode,
  });

  const {handleTextInputChange, handleTextInputKeyDown} = useQueryBuilderTextEdit({
    textEditMode,
  });

  const {handleKeyDown} = useQueryBuilderKeyboard({
    showDropdown,
    deferredDropdownItems: dropdownItems,
    selectedDropdownIndex,
    setSelectedDropdownIndex,
    handleDropdownSelect,
    inputValue,
    tokens,
    editingTokenId,
    addCompleteToken,
    finalizeEditing,
    deleteToken,
    setTokens,
    setEditingTokenId,
    setInputValue,
    setShowDropdown,
    inputRef,
  });

  if (textEditMode.isTextEditMode) {
    return (
      <div className={cn('w-full relative', className)} ref={containerRef}>
        <QueryBuilderTextInput
          value={textEditMode.textEditValue}
          onChange={handleTextInputChange}
          onKeyDown={handleTextInputKeyDown}
          onToggleMode={handleToggleTextMode}
          error={textEditMode.textEditError}
          inputRef={textEditMode.textEditInputRef}
        />
      </div>
    );
  }

  return (
    <div className={cn('w-full relative', className)} ref={containerRef}>
      <Popover open={showDropdown} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <div className="w-full">
            <QueryBuilderInput
              tokens={tokens}
              inputValue={inputValue}
              editingTokenId={editingTokenId}
              isFocused={isFocused}
              syntaxError={syntaxError}
              placeholder={getPlaceholder(tokens, placeholder)}
              inputRef={inputRef}
              containerRef={containerRef}
              editingTokenAnchorRef={editingTokenAnchorRef}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onInputAreaClick={handleInputAreaClick}
              onTokenClick={handleTokenClick}
              onTokenDelete={deleteToken}
              onClearAll={handleClearAll}
              onToggleTextMode={handleToggleTextMode}
              onEditingTokenClick={handleEditingTokenClick}
              onEditingTokenKeyDown={handleEditingTokenKeyDown}
            />
          </div>
        </PopoverTrigger>
        {showDropdown && (
          <QueryBuilderDropdown
            showDropdown={showDropdown}
            showSyntaxHelp={showSyntaxHelp}
            syntaxError={syntaxError}
            editingToken={editingToken}
            inputValue={inputValue}
            durationRange={durationRange}
            selectedDropdownIndex={selectedDropdownIndex}
            dropdownItems={dropdownItems}
            inputRef={inputRef}
            containerRef={containerRef}
            editingTokenAnchorRef={editingTokenAnchorRef}
            container={container}
            isSelectingRef={isSelectingRef}
            onSelect={handleDropdownSelect}
            onDurationRangeChange={handleDurationRangeChange}
            onToggleSyntaxHelp={handleToggleSyntaxHelp}
            onEscape={handleEscape}
            getDropdownHeader={() => getDropdownHeader(editingToken, inputValue)}
          />
        )}
      </Popover>
    </div>
  );
}
