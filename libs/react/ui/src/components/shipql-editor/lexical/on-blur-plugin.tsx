import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import type {AstNode} from '@shipfox/shipql-parser';
import {hasTextNodes, parse} from '@shipfox/shipql-parser';
import {
  $getRoot,
  BLUR_COMMAND,
  COMMAND_PRIORITY_LOW,
  FOCUS_COMMAND,
  type ParagraphNode,
} from 'lexical';
import {useEffect, useRef} from 'react';
import {$isShipQLLeafNode, $setLeafFreeTextError} from './shipql-leaf-node';

interface OnBlurPluginProps {
  onChange?: (ast: AstNode) => void;
  allowFreeText?: boolean;
}

export function OnBlurPlugin({onChange, allowFreeText = true}: OnBlurPluginProps): null {
  const [editor] = useLexicalComposerContext();

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const allowFreeTextRef = useRef(allowFreeText);
  allowFreeTextRef.current = allowFreeText;

  useEffect(() => {
    const unregisterBlur = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        const text = editor.getEditorState().read(() => $getRoot().getTextContent());
        try {
          const ast = parse(text);
          if (ast) {
            const hasFreeText = hasTextNodes(ast);

            // Mark text-node leaves as errors when free text is disallowed.
            if (!allowFreeTextRef.current && hasFreeText) {
              editor.update(() => {
                const para = $getRoot().getFirstChild() as ParagraphNode | null;
                if (!para) return;
                for (const child of para.getChildren()) {
                  if (!$isShipQLLeafNode(child)) continue;
                  const leafAst = child.getShipQLNode();
                  if (leafAst.type === 'text') {
                    $setLeafFreeTextError(child, true);
                  }
                }
              });
              return false;
            }

            onChangeRef.current?.(ast);
          }
        } catch {
          // Invalid query — do not call onChange.
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    const unregisterFocus = editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        // Clear all freeTextError flags when the editor regains focus.
        editor.update(() => {
          const para = $getRoot().getFirstChild() as ParagraphNode | null;
          if (!para) return;
          for (const child of para.getChildren()) {
            if ($isShipQLLeafNode(child) && child.getLatest().__freeTextError) {
              $setLeafFreeTextError(child, false);
            }
          }
        });
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      unregisterBlur();
      unregisterFocus();
    };
  }, [editor]);

  return null;
}
