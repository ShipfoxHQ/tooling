import {useCallback} from 'react';
import type {QueryToken} from '../types';

interface UseQueryBuilderHandlersProps {
  setTokens: React.Dispatch<React.SetStateAction<QueryToken[]>>;
  setInputValue: (value: string) => void;
  setEditingTokenId: (id: string | null) => void;
  setPendingMainInputFocus: (value: boolean) => void;
  setShowSyntaxHelp: (value: boolean | ((v: boolean) => boolean)) => void;
  setShowSyntaxHelpAutoOpened: (value: boolean) => void;
  setShowDropdown: (value: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  startEditingToken: (token: QueryToken, recentDurations: string[]) => void;
  deleteToken: (tokenId: string) => void;
  recentDurations: string[];
  toggleTextMode: () => void;
}

export function useQueryBuilderHandlers({
  setTokens,
  setInputValue,
  setEditingTokenId,
  setPendingMainInputFocus,
  setShowSyntaxHelp,
  setShowSyntaxHelpAutoOpened,
  setShowDropdown,
  inputRef,
  startEditingToken,
  deleteToken: _deleteToken,
  recentDurations,
  toggleTextMode,
}: UseQueryBuilderHandlersProps) {
  const handleClearAll = useCallback(() => {
    setTokens([]);
    setInputValue('');
    inputRef.current?.focus();
  }, [setTokens, setInputValue, inputRef]);

  const handleTokenClick = useCallback(
    (token: QueryToken) => {
      startEditingToken(token, recentDurations);
    },
    [startEditingToken, recentDurations],
  );

  const handleEditingTokenClick = useCallback(() => {
    setEditingTokenId(null);
    setInputValue('');
    setPendingMainInputFocus(true);
  }, [setEditingTokenId, setInputValue, setPendingMainInputFocus]);

  const handleEditingTokenKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        setEditingTokenId(null);
        setInputValue('');
        setPendingMainInputFocus(true);
      }
    },
    [setEditingTokenId, setInputValue, setPendingMainInputFocus],
  );

  const handleToggleSyntaxHelp = useCallback(() => {
    setShowSyntaxHelp((v) => !v);
    setShowSyntaxHelpAutoOpened(false);
  }, [setShowSyntaxHelp, setShowSyntaxHelpAutoOpened]);

  const handleEscape = useCallback(() => {
    setShowDropdown(false);
    setShowSyntaxHelp(false);
  }, [setShowDropdown, setShowSyntaxHelp]);

  return {
    handleClearAll,
    handleTokenClick,
    handleEditingTokenClick,
    handleEditingTokenKeyDown,
    handleToggleSyntaxHelp,
    handleEscape,
    handleToggleTextMode: toggleTextMode,
  };
}
