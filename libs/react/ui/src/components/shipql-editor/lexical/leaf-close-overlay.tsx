import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useCallback, useEffect, useRef, useState} from 'react';
import {cn} from '../../../utils/cn';
import {Button} from '../../button/button';
import {REMOVE_LEAF_COMMAND} from './shipql-plugin';

interface HoveredLeaf {
  key: string;
  top: number;
  left: number;
}

const LEAF_ACTIVE_CLASSES = 'ring-1 ring-border-highlights-interactive rounded-r-none';

export function LeafCloseOverlay() {
  const [editor] = useLexicalComposerContext();
  const [hovered, setHovered] = useState<HoveredLeaf | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosRef = useRef({top: 0, left: 0});
  const activeLeafElRef = useRef<HTMLElement | null>(null);

  const activateLeaf = useCallback((el: HTMLElement | null) => {
    if (activeLeafElRef.current && activeLeafElRef.current !== el) {
      for (const cls of LEAF_ACTIVE_CLASSES.split(' ')) {
        activeLeafElRef.current.classList.remove(cls);
      }
    }
    if (el) {
      for (const cls of LEAF_ACTIVE_CLASSES.split(' ')) {
        el.classList.add(cls);
      }
    }
    activeLeafElRef.current = el;
  }, []);

  const resolvePosition = useCallback((leafRect: DOMRect) => {
    const container = containerRef.current?.parentElement;
    if (!container) return null;
    const containerRect = container.getBoundingClientRect();
    return {
      top: leafRect.top - containerRect.top - 1,
      left: leafRect.right - containerRect.left - 1,
    };
  }, []);

  const handleMouseOver = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as Node)) return;

      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-shipql-leaf]');
      if (target) {
        const key = target.getAttribute('data-shipql-key');
        if (key) {
          activateLeaf(target);
          const pos = resolvePosition(target.getBoundingClientRect());
          if (pos) {
            lastPosRef.current = pos;
            setHovered({key, ...pos});
          }
          return;
        }
      }
      activateLeaf(null);
      setHovered(null);
    },
    [activateLeaf, resolvePosition],
  );

  const handleMouseLeave = useCallback(() => {
    activateLeaf(null);
    setHovered(null);
  }, [activateLeaf]);

  useEffect(() => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const container = rootElement.closest<HTMLElement>('[data-shipql-editor]');
    const target = container ?? rootElement;

    target.addEventListener('mouseover', handleMouseOver);
    target.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      target.removeEventListener('mouseover', handleMouseOver);
      target.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [editor, handleMouseOver, handleMouseLeave]);

  const {top, left} = hovered ?? lastPosRef.current;

  return (
    <div ref={containerRef}>
      <Button
        variant="danger"
        size="xs"
        iconLeft="closeLine"
        aria-label="Remove filter"
        className={cn(
          'absolute z-10 min-w-0! p-0! shadow-none! h-23!',
          'bg-background-highlight-interactive!',
          'overflow-hidden rounded-l-none! rounded-r-6!',
          'transition-[width,opacity] duration-150 ease-out',
          hovered ? 'w-23! opacity-100!' : 'w-0! opacity-0!',
        )}
        style={{top, left}}
        onMouseDown={(e) => {
          e.preventDefault();
          if (hovered) {
            activateLeaf(null);
            editor.dispatchCommand(REMOVE_LEAF_COMMAND, hovered.key);
            setHovered(null);
          }
        }}
      />
    </div>
  );
}
