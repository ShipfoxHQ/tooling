import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getRoot} from 'lexical';
import {useEffect, useRef} from 'react';

interface OnTextChangePluginProps {
  onTextChange: (text: string) => void;
}

export function OnTextChangePlugin({onTextChange}: OnTextChangePluginProps) {
  const [editor] = useLexicalComposerContext();
  const callbackRef = useRef(onTextChange);
  callbackRef.current = onTextChange;

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        callbackRef.current(text);
      });
    });
  }, [editor]);

  return null;
}
