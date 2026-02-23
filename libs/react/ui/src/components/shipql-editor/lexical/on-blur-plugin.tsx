import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import type {AstNode} from '@shipfox/shipql-parser';
import {parse} from '@shipfox/shipql-parser';
import {$getRoot, BLUR_COMMAND, COMMAND_PRIORITY_LOW} from 'lexical';
import {useEffect, useRef} from 'react';

interface OnBlurPluginProps {
  onChange?: (ast: AstNode) => void;
}

export function OnBlurPlugin({onChange}: OnBlurPluginProps): null {
  const [editor] = useLexicalComposerContext();

  // Keep latest callback accessible without re-registering the command.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    return editor.registerCommand(
      BLUR_COMMAND,
      () => {
        const text = editor.getEditorState().read(() => $getRoot().getTextContent());
        try {
          const ast = parse(text);
          if (ast) onChangeRef.current?.(ast);
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
