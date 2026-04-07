import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type {ReactNode} from 'react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ShipQLSuggestionsDropdown} from './shipql-suggestions-dropdown';
import type {SuggestionItem} from './types';

vi.mock('components/popover', () => ({
  PopoverContent: ({
    children,
    onInteractOutside,
    onPointerDownOutside,
  }: {
    children: ReactNode;
    onInteractOutside?: (event: {preventDefault: () => void}) => void;
    onPointerDownOutside?: (event: {preventDefault: () => void}) => void;
  }) => (
    <div data-testid="popover-content">
      <button type="button" onClick={() => onInteractOutside?.({preventDefault: vi.fn()})}>
        trigger interact outside
      </button>
      <button type="button" onClick={() => onPointerDownOutside?.({preventDefault: vi.fn()})}>
        trigger pointer outside
      </button>
      {children}
    </div>
  ),
}));

vi.mock('components/scroll-area', () => ({
  ScrollArea: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

vi.mock('components/skeleton', () => ({
  Skeleton: () => <div>loading</div>,
}));

const STATUS_BUTTON_RE = /status/;

describe('ShipQLSuggestionsDropdown', () => {
  beforeEach(() => {
    vi.useRealTimers();
    HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  const items: SuggestionItem[] = [
    {
      value: 'status',
      label: 'status',
      icon: null,
      selected: false,
    },
  ];

  function renderDropdown(isSelecting = false) {
    const isSelectingRef = {current: isSelecting};
    const onClose = vi.fn();
    const onSelect = vi.fn();

    render(
      <ShipQLSuggestionsDropdown
        items={items}
        selectedIndex={0}
        isSelectingRef={isSelectingRef}
        onSelect={onSelect}
        onClose={onClose}
        isNegated={false}
        onToggleNegate={vi.fn()}
        showValueActions={false}
        showSyntaxHelp={false}
        onToggleSyntaxHelp={vi.fn()}
        syntaxHintMode="value"
      />,
    );

    return {isSelectingRef, onClose, onSelect};
  }

  it('closes when interacting outside and no selection is in progress', async () => {
    const user = userEvent.setup();
    const {onClose} = renderDropdown(false);

    await user.click(screen.getByRole('button', {name: 'trigger interact outside'}));
    await user.click(screen.getByRole('button', {name: 'trigger pointer outside'}));

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('does not close when interacting outside during a selection', async () => {
    const user = userEvent.setup();
    const {onClose} = renderDropdown(true);

    await user.click(screen.getByRole('button', {name: 'trigger interact outside'}));
    await user.click(screen.getByRole('button', {name: 'trigger pointer outside'}));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('marks selection as transient while applying a suggestion', () => {
    vi.useFakeTimers();
    const {isSelectingRef, onSelect} = renderDropdown(false);

    fireEvent.mouseDown(screen.getByRole('button', {name: STATUS_BUTTON_RE}));

    expect(onSelect).toHaveBeenCalledWith('status');
    expect(isSelectingRef.current).toBe(true);

    vi.runAllTimers();

    expect(isSelectingRef.current).toBe(false);
  });
});
