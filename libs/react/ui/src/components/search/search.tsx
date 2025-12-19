import {Command as CommandPrimitive} from 'cmdk';
import type {ReactNode} from 'react';
import {useCallback, useState} from 'react';
import {SearchContext, useControllableState, useKeyboardShortcut} from './search-context';

export type SearchProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  shortcutKey?: string;
};

export function Search({
  children,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  shortcutKey,
}: SearchProps) {
  const [open, setOpen] = useControllableState(controlledOpen, defaultOpen, onOpenChange);
  const [searchValue, setSearchValue] = useState('');

  const handleOpen = useCallback(() => setOpen(true), [setOpen]);

  useKeyboardShortcut(shortcutKey, handleOpen);

  const handleSetOpen = useCallback(
    (newOpen: boolean) => {
      if (!newOpen) {
        setSearchValue('');
      }
      setOpen(newOpen);
    },
    [setOpen],
  );

  return (
    <SearchContext.Provider value={{open, setOpen: handleSetOpen, searchValue, setSearchValue}}>
      <CommandPrimitive data-slot="search">{children}</CommandPrimitive>
    </SearchContext.Provider>
  );
}
