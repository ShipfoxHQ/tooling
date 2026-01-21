import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {act, renderHook} from '@testing-library/react';
import type {RelativeSuggestion} from '../types';
import {useIntervalSelectorInput} from './use-interval-selector-input';

describe('useIntervalSelectorInput', () => {
  const mockPastIntervals: RelativeSuggestion[] = [{type: 'relative', duration: {minutes: 5}}];

  const mockProps = {
    relativeSuggestions: mockPastIntervals,
    inputValue: '',
    setInputValue: vi.fn(),
    setDetectedShortcut: vi.fn(),
    setConfirmedShortcut: vi.fn(),
    setIsInvalid: vi.fn(),
    setSelectedLabel: vi.fn(),
    setHighlightedIndex: vi.fn(),
    selectedValueRef: {current: undefined as string | undefined},
    triggerShakeAnimation: vi.fn(),
    onSelect: vi.fn(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-19T17:45:00Z'));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('handleInputChange', () => {
    it('should update input value and detect shortcut', () => {
      const {result} = renderHook(() => useIntervalSelectorInput(mockProps));

      act(() => {
        result.current.handleInputChange({
          target: {value: '5m'},
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(mockProps.setInputValue).toHaveBeenCalledWith('5m');
      expect(mockProps.setIsInvalid).toHaveBeenCalledWith(false);
    });

    it('should set invalid state for non-empty input without shortcut', () => {
      const {result} = renderHook(() => useIntervalSelectorInput(mockProps));

      act(() => {
        result.current.handleInputChange({
          target: {value: 'invalid'},
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(mockProps.setIsInvalid).toHaveBeenCalledWith(true);
    });

    it('should clear selection when input changes', () => {
      mockProps.selectedValueRef.current = '5m';
      const {result} = renderHook(() => useIntervalSelectorInput(mockProps));

      act(() => {
        result.current.handleInputChange({
          target: {value: 'new'},
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(mockProps.setSelectedLabel).toHaveBeenCalledWith(undefined);
      expect(mockProps.selectedValueRef.current).toBeUndefined();
      expect(mockProps.setHighlightedIndex).toHaveBeenCalledWith(-1);
    });

    it('should clear selectedLabel even when selectedValueRef.current is undefined', () => {
      mockProps.selectedValueRef.current = undefined;
      const {result} = renderHook(() => useIntervalSelectorInput(mockProps));

      act(() => {
        result.current.handleInputChange({
          target: {value: 'new'},
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(mockProps.setSelectedLabel).toHaveBeenCalledWith(undefined);
      expect(mockProps.setHighlightedIndex).toHaveBeenCalledWith(-1);
    });
  });

  describe('handleConfirmInput', () => {
    it('should handle relative time shortcut input', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorInput({
          ...mockProps,
          inputValue: '5m',
        }),
      );

      act(() => {
        result.current.handleConfirmInput();
      });

      expect(mockProps.onSelect).toHaveBeenCalledWith({
        type: 'relative',
        duration: {minutes: 5},
      });
    });

    it('should handle parsed interval input', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorInput({
          ...mockProps,
          inputValue: 'Jan 1 2026 - Jan 15 2026',
        }),
      );

      act(() => {
        result.current.handleConfirmInput();
      });

      expect(mockProps.onSelect).toHaveBeenCalled();
    });

    it('should trigger shake animation for invalid input', () => {
      const {result} = renderHook(() =>
        useIntervalSelectorInput({
          ...mockProps,
          inputValue: 'invalid input',
        }),
      );

      act(() => {
        result.current.handleConfirmInput();
      });

      expect(mockProps.triggerShakeAnimation).toHaveBeenCalled();
    });
  });
});
