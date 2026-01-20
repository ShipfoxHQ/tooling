import {describe, expect, it} from '@shipfox/vitest/vi';
import {renderHook} from '@testing-library/react';
import {useIntervalSelectorState} from './use-interval-selector-state';

describe('useIntervalSelectorState', () => {
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
