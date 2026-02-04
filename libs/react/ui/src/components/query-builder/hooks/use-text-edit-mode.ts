import {useCallback, useRef, useState} from 'react';
import type {QueryToken} from '../types';
import {parseQueryString, serializeTokensToText} from '../utils';

export function useTextEditMode(
  tokens: QueryToken[],
  onTokensChange: (tokens: QueryToken[]) => void,
) {
  const [isTextEditMode, setIsTextEditMode] = useState(false);
  const [textEditValue, setTextEditValue] = useState('');
  const [textEditError, setTextEditError] = useState<string | null>(null);
  const textEditInputRef = useRef<HTMLInputElement>(null);

  const serializeTokensToQuery = useCallback((tokenList: QueryToken[]): string => {
    return serializeTokensToText(tokenList);
  }, []);

  const toggleInputMode = useCallback(() => {
    if (isTextEditMode) {
      if (textEditValue.trim()) {
        const parsedTokens = parseQueryString(textEditValue);
        if (parsedTokens.length > 0) {
          onTokensChange(parsedTokens);
          setTextEditError(null);
        } else {
          setTextEditError('Could not parse query. Switching to builder with empty query.');
          onTokensChange([]);
        }
      } else {
        onTokensChange([]);
      }
      setIsTextEditMode(false);
      setTextEditValue('');
    } else {
      const text = serializeTokensToQuery(tokens);
      setTextEditValue(text);
      setTextEditError(null);
      setIsTextEditMode(true);
    }
  }, [isTextEditMode, textEditValue, tokens, serializeTokensToQuery, onTokensChange]);

  const applyTextChanges = useCallback(() => {
    if (textEditValue.trim()) {
      const parsedTokens = parseQueryString(textEditValue);
      if (parsedTokens.length > 0) {
        onTokensChange(parsedTokens);
        setTextEditError(null);
      } else {
        setTextEditError('Could not parse query. Check syntax.');
      }
    } else {
      onTokensChange([]);
      setTextEditError(null);
    }
  }, [textEditValue, onTokensChange]);

  const revertTextChanges = useCallback(() => {
    const text = serializeTokensToQuery(tokens);
    setTextEditValue(text);
    setTextEditError(null);
  }, [tokens, serializeTokensToQuery]);

  return {
    isTextEditMode,
    textEditValue,
    textEditError,
    textEditInputRef,
    setTextEditValue,
    setTextEditError,
    toggleInputMode,
    applyTextChanges,
    revertTextChanges,
  };
}
