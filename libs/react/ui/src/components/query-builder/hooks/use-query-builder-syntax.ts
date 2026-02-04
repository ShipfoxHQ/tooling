import {useEffect} from 'react';
import type {SyntaxError as QuerySyntaxError} from '../types';
import {validateSyntax} from '../utils';

interface UseQueryBuilderSyntaxProps {
  inputValue: string;
  showDropdown: boolean;
  showSyntaxHelp: boolean;
  syntaxHelpAutoOpened: boolean;
  syntaxError: QuerySyntaxError | null;
  setSyntaxError: React.Dispatch<React.SetStateAction<QuerySyntaxError | null>>;
  setShowSyntaxHelp: (value: boolean) => void;
  setSyntaxHelpAutoOpened: (value: boolean) => void;
}

export function useQueryBuilderSyntax({
  inputValue,
  showDropdown,
  showSyntaxHelp,
  syntaxHelpAutoOpened,
  syntaxError,
  setSyntaxError,
  setShowSyntaxHelp,
  setSyntaxHelpAutoOpened,
}: UseQueryBuilderSyntaxProps) {
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
}
