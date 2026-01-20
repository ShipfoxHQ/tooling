import {afterEach, beforeEach, describe, expect, it, vi} from '@shipfox/vitest/vi';
import {act, renderHook} from '@testing-library/react';
import type {IntervalOption} from '../../interval-selector.utils';
import {useIntervalSelectorInput} from '../use-interval-selector-input';

describe('useIntervalSelectorInput', () => {
  const mockPastIntervals: IntervalOption[] = [
    {value: '5m', label: 'Past 5 Minutes', shortcut: '5m', type: 'past', duration: {minutes: 5}},
  ];

  const mockCalendarIntervals: IntervalOption[] = [];

  const mockProps = {
    pastIntervals: mockPastIntervals,
    resolvedCalendarIntervals: mockCalendarIntervals,
    inputValue: '',
    setInputValue: vi.fn(),
    setDetectedShortcut: vi.fn(),
    setConfirmedShortcut: vi.fn(),
    setIsInvalid: vi.fn(),
    setSelectedLabel: vi.fn(),
    setHighlightedIndex: vi.fn(),
    selectedValueRef: {current: undefined as string | undefined},
    detectShortcutFromInput: vi.fn(),
    applyIntervalDetection: vi.fn(),
    emitSelection: vi.fn(),
    onValueChange: vi.fn(),
    triggerShakeAnimation: vi.fn(),
    closeInputAndPopover: vi.fn(),
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

      mockProps.detectShortcutFromInput.mockReturnValue('5m');

      act(() => {
        result.current.handleInputChange({
          target: {value: '5m'},
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(mockProps.setInputValue).toHaveBeenCalledWith('5m');
      expect(mockProps.detectShortcutFromInput).toHaveBeenCalledWith('5m');
      expect(mockProps.setDetectedShortcut).toHaveBeenCalledWith('5m');
      expect(mockProps.setIsInvalid).toHaveBeenCalledWith(false);
    });

    it('should set invalid state for non-empty input without shortcut', () => {
      const {result} = renderHook(() => useIntervalSelectorInput(mockProps));

      mockProps.detectShortcutFromInput.mockReturnValue(undefined);

      act(() => {
        result.current.handleInputChange({
          target: {value: 'invalid'},
        } as React.ChangeEvent<HTMLInputElement>);
      });

      expect(mockProps.setDetectedShortcut).toHaveBeenCalledWith(undefined);
      expect(mockProps.setConfirmedShortcut).toHaveBeenCalledWith(undefined);
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

      expect(mockProps.emitSelection).toHaveBeenCalledWith({
        type: 'relative',
        duration: {minutes: 5},
      });
      expect(mockProps.onValueChange).toHaveBeenCalledWith('5m');
      expect(mockProps.closeInputAndPopover).toHaveBeenCalled();
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

      expect(mockProps.emitSelection).toHaveBeenCalled();
      expect(mockProps.applyIntervalDetection).toHaveBeenCalled();
      expect(mockProps.closeInputAndPopover).toHaveBeenCalled();
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
      expect(mockProps.setDetectedShortcut).toHaveBeenCalledWith(undefined);
    });
  });
});
