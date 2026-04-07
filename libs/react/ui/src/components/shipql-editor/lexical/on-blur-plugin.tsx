import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import type {AstNode} from '@shipfox/shipql-parser';
import {hasTextNodes, parse} from '@shipfox/shipql-parser';
import {$getRoot, BLUR_COMMAND, COMMAND_PRIORITY_LOW} from 'lexical';
import {useEffect, useRef} from 'react';

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
    return editor.registerCommand(
      BLUR_COMMAND,
      () => {
        const text = editor.getEditorState().read(() => $getRoot().getTextContent());
        try {
          const ast = parse(text);
          if (ast) {
            if (!allowFreeTextRef.current && hasTextNodes(ast)) return false;
            onChangeRef.current?.(ast);
          }
        } catch {
          // Invalid query — do not call onChange.
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return null;
}
