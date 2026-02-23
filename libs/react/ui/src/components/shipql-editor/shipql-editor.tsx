import type {AstNode} from '@shipfox/shipql-parser';
import {lazy, Suspense} from 'react';
import type {LeafAstNode} from './lexical/shipql-leaf-node';

export interface ShipQLEditorProps {
  /** Initial ShipQL string value (uncontrolled). To reset programmatically, change the `key` prop. */
  defaultValue?: string;
  /** Called on blur when the full expression parses to a valid AST. */
  onChange?: (ast: AstNode) => void;
  /** Called when the cursor enters or leaves a leaf node. Useful for driving autocomplete. */
  onLeafFocus?: (node: LeafAstNode | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const ShipQLEditorInner = lazy(() => import('./shipql-editor-inner'));

export function ShipQLEditor(props: ShipQLEditorProps) {
  return (
    <Suspense
      fallback={
        <div className="h-9 w-full animate-pulse rounded-6 bg-background-components-base" />
      }
    >
      <ShipQLEditorInner {...props} />
    </Suspense>
  );
}
