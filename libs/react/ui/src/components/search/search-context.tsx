import {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {SHORTCUT_KEY_REGEX} from './search-variants';

export type SearchContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
};

export const SearchContext = createContext<SearchContextValue | null>(null);

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('Search components must be used within a Search component');
  }
  return context;
}

export function useControllableState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  return [value, setValue];
}

export function useKeyboardShortcut(shortcutKey: string | undefined, onTrigger: () => void) {
  useEffect(() => {
    if (!shortcutKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = shortcutKey.toLowerCase();
      const isMetaKey = key.startsWith('meta+') || key.startsWith('cmd+') || key.startsWith('⌘');
      const isCtrlKey = key.startsWith('ctrl+');
      const targetKey = key.replace(SHORTCUT_KEY_REGEX, '');

      const shouldTrigger =
        (isMetaKey && e.metaKey && e.key.toLowerCase() === targetKey) ||
        (isCtrlKey && e.ctrlKey && e.key.toLowerCase() === targetKey) ||
        (!isMetaKey && !isCtrlKey && e.key.toLowerCase() === targetKey && !e.metaKey && !e.ctrlKey);

      if (!shouldTrigger) return;

      if (!isMetaKey && !isCtrlKey) {
        const target = e.target as HTMLElement;
        if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      e.preventDefault();
      onTrigger();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcutKey, onTrigger]);
}
