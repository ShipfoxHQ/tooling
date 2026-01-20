import {describe, expect, it} from '@shipfox/vitest/vi';
import {renderHook} from '@testing-library/react';
import {useIntervalSelectorState} from './use-interval-selector-state';

describe('useIntervalSelectorState', () => {
  it('should initialize with default state', () => {
    const {result} = renderHook(() => useIntervalSelectorState());

    expect(result.current.isFocused).toBe(false);
    expect(result.current.popoverOpen).toBe(false);
    expect(result.current.calendarOpen).toBe(false);
    expect(result.current.inputValue).toBe('');
    expect(result.current.selectedLabel).toBeUndefined();
    expect(result.current.highlightedIndex).toBe(-1);
    expect(result.current.detectedShortcut).toBeUndefined();
    expect(result.current.confirmedShortcut).toBeUndefined();
    expect(result.current.isInvalid).toBe(false);
    expect(result.current.shouldShake).toBe(false);
  });

  it('should maintain refs across renders', () => {
    const {result, rerender} = renderHook(() => useIntervalSelectorState());

    const initialInputRef = result.current.inputRef;
    const initialSelectedValueRef = result.current.selectedValueRef;

    result.current.selectedValueRef.current = 'test-value';

    rerender();

    expect(result.current.inputRef).toBe(initialInputRef);
    expect(result.current.selectedValueRef).toBe(initialSelectedValueRef);
    expect(result.current.selectedValueRef.current).toBe('test-value');
  });
});
