import {Popover, PopoverTrigger} from 'components/popover';
import {createContext, useContext, useMemo} from 'react';
import {cn} from 'utils/cn';
import {QueryBuilderDropdown, QueryBuilderInput, QueryBuilderTextInput} from '../components';
import type {DropdownItem} from '../hooks';
import {useQueryBuilderCore} from '../hooks';
import type {SyntaxError as QuerySyntaxError, QueryToken} from '../types';

export interface QueryBuilderContextValue {
  tokens: QueryToken[];
  inputValue: string;
  editingTokenId: string | null;
  editingToken: QueryToken | null;
  isFocused: boolean;
  showDropdown: boolean;
  syntaxError: QuerySyntaxError | null;
  durationRange: [number, number];
  selectedDropdownIndex: number;
  dropdownItems: DropdownItem[];
  placeholder: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  editingTokenAnchorRef: React.RefObject<HTMLDivElement | null>;
  isSelectingRef: React.RefObject<boolean>;
  container: HTMLElement | null | undefined;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent) => void;
  onFocus: (e?: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInputAreaClick: (e: React.MouseEvent) => void;
  onTokenClick: (token: QueryToken) => void;
  onTokenDelete: (tokenId: string) => void;
  onClearAll: () => void;
  onToggleTextMode: () => void;
  onEditingTokenClick: () => void;
  onEditingTokenKeyDown: (e: React.KeyboardEvent) => void;
  onDropdownSelect: (value: string) => void;
  onDurationRangeChange: (range: [number, number], hasInputError?: boolean) => void;
  onDurationRangeCommit?: (range: [number, number], hasInputError?: boolean) => void;
  onToggleSyntaxHelp: () => void;
  onEscape: () => void;
  getDropdownHeader: () => string;
  showSyntaxHelp: boolean;
}

export interface QueryBuilderProviderProps {
  value?: string;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  className?: string;
  container?: HTMLElement | null;
}

const QueryBuilderContext = createContext<QueryBuilderContextValue | null>(null);

export function QueryBuilderProvider({
  value = '',
  onQueryChange,
  placeholder = 'Type to search: status, duration, branch...',
  className,
  container,
}: QueryBuilderProviderProps) {
  const {
    contextValue,
    textEditMode,
    containerRef,
    showDropdown,
    handlePopoverOpenChange,
    handleTextInputChange,
    handleTextInputKeyDown,
    handleTextInputBlur,
    handleToggleTextMode,
  } = useQueryBuilderCore({value, onQueryChange, placeholder, container});

  const memoContextValue = useMemo(() => contextValue, [contextValue]);

  if (textEditMode.isTextEditMode) {
    return (
      <div className={cn('w-full relative', className)} ref={containerRef}>
        <QueryBuilderTextInput
          value={textEditMode.textEditValue}
          onChange={handleTextInputChange}
          onKeyDown={handleTextInputKeyDown}
          onBlur={handleTextInputBlur}
          onToggleMode={handleToggleTextMode}
          error={textEditMode.textEditError}
          inputRef={textEditMode.textEditInputRef}
        />
      </div>
    );
  }

  return (
    <QueryBuilderContext.Provider value={memoContextValue}>
      <div className={cn('w-full relative', className)} ref={containerRef}>
        <Popover open={showDropdown} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <div className="w-full">
              <QueryBuilderInput />
            </div>
          </PopoverTrigger>
          {showDropdown && <QueryBuilderDropdown />}
        </Popover>
      </div>
    </QueryBuilderContext.Provider>
  );
}

export function useQueryBuilderContext(): QueryBuilderContextValue {
  const ctx = useContext(QueryBuilderContext);
  if (!ctx) {
    throw new Error('useQueryBuilderContext must be used within QueryBuilderProvider');
  }
  return ctx;
}
