import {useCallback, useEffect, useRef, useState} from 'react';
import type {QueryAST} from './query-builder.utils';
import {
  addFilterValue,
  parseQuery,
  removeFilter,
  removeFilterValue,
  serializeQuery,
} from './query-builder.utils';

export interface QueryBuilderSuggestion {
  property: string;
  value: string;
  label: string;
  count?: number;
  negated?: boolean;
}

export interface UseQueryBuilderProps {
  value?: string;
  onValueChange?: (value: string) => void;
  suggestions?: QueryBuilderSuggestion[];
  onQueryChange?: (query: string) => void;
}

export function useQueryBuilder({
  value = '',
  onValueChange,
  suggestions = [],
  onQueryChange,
}: UseQueryBuilderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [textEditMode, setTextEditMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [currentProperty, setCurrentProperty] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('');
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isAltPressed, setIsAltPressed] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef(false);
  const queryASTRef = useRef<QueryAST>(parseQuery(value));

  // Update AST when value prop changes
  useEffect(() => {
    if (!isFocused && !isSelectingRef.current) {
      queryASTRef.current = parseQuery(value);
      setInputValue('');
      setCurrentProperty('');
      setCurrentValue('');
    }
  }, [value, isFocused]);

  // Get filtered suggestions based on current input
  const getFilteredSuggestions = useCallback((): QueryBuilderSuggestion[] => {
    if (!inputValue.trim()) {
      return suggestions;
    }

    const lowerInput = inputValue.toLowerCase();
    const colonIndex = lowerInput.indexOf(':');

    if (colonIndex === -1) {
      // Filtering by property name
      return suggestions.filter((s) => s.property.toLowerCase().includes(lowerInput));
    }

    const propertyPart = lowerInput.slice(0, colonIndex).trim();
    const valuePart = lowerInput.slice(colonIndex + 1).trim();

    return suggestions.filter((s) => {
      const propertyMatch = !propertyPart || s.property.toLowerCase().includes(propertyPart);
      const valueMatch =
        !valuePart ||
        s.value.toLowerCase().includes(valuePart) ||
        s.label.toLowerCase().includes(valuePart);
      return propertyMatch && valueMatch;
    });
  }, [inputValue, suggestions]);

  const filteredSuggestions = getFilteredSuggestions();

  // Parse current input to extract property and value
  useEffect(() => {
    if (!inputValue.trim()) {
      setCurrentProperty('');
      setCurrentValue('');
      return;
    }

    const colonIndex = inputValue.indexOf(':');
    if (colonIndex === -1) {
      setCurrentProperty(inputValue.trim());
      setCurrentValue('');
    } else {
      setCurrentProperty(inputValue.slice(0, colonIndex).trim());
      setCurrentValue(inputValue.slice(colonIndex + 1).trim());
    }
  }, [inputValue]);

  // Handle keyboard modifiers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(true);
      if (e.key === 'Alt' || e.key === 'Option') setIsAltPressed(true);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') setIsShiftPressed(false);
      if (e.key === 'Alt' || e.key === 'Option') setIsAltPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const updateQuery = useCallback(
    (newAST: QueryAST) => {
      queryASTRef.current = newAST;
      const queryString = serializeQuery(newAST);
      onValueChange?.(queryString);
      onQueryChange?.(queryString);
    },
    [onValueChange, onQueryChange],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setPopoverOpen(true);
    setInputValue('');
    setHighlightedIndex(-1);
  }, []);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('[role="dialog"]')) {
      return;
    }

    setTimeout(() => {
      setIsFocused(false);
      setPopoverOpen(false);
      setInputValue('');
      setCurrentProperty('');
      setCurrentValue('');
      setHighlightedIndex(-1);
    }, 200);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setHighlightedIndex(-1);

      if (textEditMode) {
        // In text edit mode, update query directly
        updateQuery(parseQuery(newValue));
      }
    },
    [textEditMode, updateQuery],
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: QueryBuilderSuggestion) => {
      isSelectingRef.current = true;

      const negated = isAltPressed || suggestion.negated || false;
      const useOr = !isShiftPressed; // Default to OR (comma-separated within pill)

      const newAST = addFilterValue(queryASTRef.current, suggestion.property, suggestion.value, {
        negated,
        useOr,
      });

      updateQuery(newAST);
      setInputValue('');
      setCurrentProperty('');
      setCurrentValue('');
      setPopoverOpen(false);
      setIsFocused(false);

      // Move cursor for next facet selection
      setTimeout(() => {
        inputRef.current?.focus();
        setPopoverOpen(true);
        setIsFocused(true);
        isSelectingRef.current = false;
      }, 50);
    },
    [isAltPressed, isShiftPressed, updateQuery],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (textEditMode) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setTextEditMode(false);
          setInputValue('');
          setPopoverOpen(false);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // Update query and exit text edit mode
          updateQuery(parseQuery(inputValue));
          setTextEditMode(false);
          setInputValue('');
          setPopoverOpen(false);
          inputRef.current?.blur();
        }
        return;
      }

      if (popoverOpen && filteredSuggestions.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
          return;
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
          return;
        }

        if (
          e.key === 'Enter' &&
          highlightedIndex >= 0 &&
          highlightedIndex < filteredSuggestions.length
        ) {
          e.preventDefault();
          const suggestion = filteredSuggestions[highlightedIndex];
          handleSuggestionSelect(suggestion);
          return;
        }
      }

      if (e.key === 'Tab' && currentProperty && currentValue) {
        e.preventDefault();
        // Finalize current filter and start new one
        const newAST = addFilterValue(queryASTRef.current, currentProperty, currentValue, {
          negated: isAltPressed,
          useOr: !isShiftPressed,
        });
        updateQuery(newAST);
        setInputValue('');
        setCurrentProperty('');
        setCurrentValue('');
        setHighlightedIndex(-1);
        return;
      }

      if (e.key === 'Enter' && currentProperty && currentValue && highlightedIndex === -1) {
        e.preventDefault();
        // Add current input as filter (manual entry)
        const newAST = addFilterValue(queryASTRef.current, currentProperty, currentValue, {
          negated: isAltPressed,
          useOr: !isShiftPressed,
        });
        updateQuery(newAST);
        setInputValue('');
        setCurrentProperty('');
        setCurrentValue('');
        setPopoverOpen(false);
        // Keep cursor in place (don't blur)
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        setPopoverOpen(false);
        setInputValue('');
        setCurrentProperty('');
        setCurrentValue('');
        setHighlightedIndex(-1);
        inputRef.current?.blur();
      }
    },
    [
      textEditMode,
      popoverOpen,
      filteredSuggestions,
      highlightedIndex,
      currentProperty,
      currentValue,
      isAltPressed,
      isShiftPressed,
      inputValue,
      updateQuery,
      handleSuggestionSelect,
    ],
  );

  const handleRemoveFilter = useCallback(
    (property: string, value: string) => {
      const newAST = removeFilterValue(queryASTRef.current, property, value);
      updateQuery(newAST);
    },
    [updateQuery],
  );

  const handleRemoveFilterProperty = useCallback(
    (property: string) => {
      const newAST = removeFilter(queryASTRef.current, property);
      updateQuery(newAST);
    },
    [updateQuery],
  );

  const handleToggleTextEditMode = useCallback(() => {
    if (textEditMode) {
      // Exit text edit mode
      setTextEditMode(false);
      setInputValue('');
      setPopoverOpen(false);
    } else {
      // Enter text edit mode
      setTextEditMode(true);
      setInputValue(serializeQuery(queryASTRef.current));
      setPopoverOpen(false);
      setTimeout(() => {
        inputRef.current?.select();
      }, 0);
    }
  }, [textEditMode]);

  const getDisplayValue = useCallback((): string => {
    if (textEditMode) {
      return inputValue;
    }
    if (isFocused) {
      return inputValue;
    }
    return serializeQuery(queryASTRef.current);
  }, [textEditMode, isFocused, inputValue]);

  return {
    isFocused,
    popoverOpen,
    textEditMode,
    inputValue: getDisplayValue(),
    highlightedIndex,
    currentProperty,
    currentValue,
    isShiftPressed,
    isAltPressed,
    filteredSuggestions,
    queryAST: queryASTRef.current,
    inputRef,
    handleFocus,
    handleBlur,
    handleInputChange,
    handleKeyDown,
    handleSuggestionSelect,
    handleRemoveFilter,
    handleRemoveFilterProperty,
    handleToggleTextEditMode,
    setPopoverOpen,
  };
}
