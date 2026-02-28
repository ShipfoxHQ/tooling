import type {AstNode} from '@shipfox/shipql-parser';
import {lazy, Suspense, useCallback, useRef, useState} from 'react';
import {cn} from 'utils/cn';
import type {LeafAstNode} from './lexical/shipql-leaf-node';
import type {FacetDef} from './suggestions/types';

export type {FacetDef, RangeFacetConfig} from './suggestions/types';

export interface ShipQLEditorProps {
  defaultValue?: string;
  onChange?: (ast: AstNode) => void;
  onLeafFocus?: (node: LeafAstNode | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  facets?: FacetDef[];
  currentFacet?: string | null;
  setCurrentFacet?: (facet: string | null) => void;
  valueSuggestions?: string[];
  isLoadingValueSuggestions?: boolean;
}

export interface ShipQLEditorInnerProps extends ShipQLEditorProps {
  mode: 'editor' | 'text';
  text: string;
  editorKey: number;
  onTextChange: (text: string) => void;
  onClear: () => void;
  onToggleMode: () => void;
}

const ShipQLEditorInner = lazy(() => import('./shipql-editor-inner'));

export function ShipQLEditor({disabled, className, ...props}: ShipQLEditorProps) {
  const [mode, setMode] = useState<'editor' | 'text'>('editor');
  const [text, setText] = useState(props.defaultValue ?? '');
  const [editorKey, setEditorKey] = useState(0);
  const textRef = useRef(text);
  textRef.current = text;
  const clearingRef = useRef(false);

  const handleTextChange = useCallback((newText: string) => {
    if (clearingRef.current) {
      if (newText.trim() === '') clearingRef.current = false;
      return;
    }
    textRef.current = newText;
    setText(newText);
  }, []);

  const handleClear = useCallback(() => {
    clearingRef.current = true;
    setText('');
    textRef.current = '';
    setEditorKey((k) => k + 1);
  }, []);

  const handleToggleMode = useCallback(() => {
    setMode((m) => {
      if (m === 'editor') {
        setText(textRef.current);
        return 'text';
      }
      setEditorKey((k) => k + 1);
      return 'editor';
    });
  }, []);

  return (
    <Suspense
      fallback={
        <div
          className={cn(
            'h-28 w-full animate-pulse rounded-6 bg-background-components-base',
            className,
          )}
        />
      }
    >
      <ShipQLEditorInner
        {...props}
        className={className}
        disabled={disabled}
        mode={mode}
        text={text}
        editorKey={editorKey}
        onTextChange={handleTextChange}
        onClear={handleClear}
        onToggleMode={handleToggleMode}
      />
    </Suspense>
  );
}
