import {useLayoutEffect, useState} from 'react';
import type {QueryToken} from '../types';

const SIDE_OFFSET = 4;

function measure(anchor: HTMLElement, container: HTMLElement): {left: number; top: number} {
  const anchorRect = anchor.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  return {
    left: anchorRect.left - containerRect.left,
    top: SIDE_OFFSET,
  };
}

export function useDropdownPosition(
  editingToken: QueryToken | null,
  tokenAnchorRef: React.RefObject<HTMLDivElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  containerRef: React.RefObject<HTMLDivElement | null>,
): {left: number; top: number} | null {
  const [style, setStyle] = useState<{
    left: number;
    top: number;
  } | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      const anchor =
        editingToken && tokenAnchorRef.current ? tokenAnchorRef.current : inputRef.current;
      if (!anchor) return;
      setStyle(measure(anchor, container));
    };

    update();
    const id = requestAnimationFrame(update);
    return () => cancelAnimationFrame(id);
  }, [editingToken, tokenAnchorRef, inputRef, containerRef]);

  return style;
}
