import {describe, expect, it, vi} from '@shipfox/vitest/vi';
import {dispatchFlagChanges} from './client';

describe('dispatchFlagChanges', () => {
  it('fires only matching callbacks when flagsChanged has specific keys', () => {
    const listeners = new Map<string, Set<() => void>>();
    const callbackA = vi.fn();
    const callbackB = vi.fn();
    listeners.set('flag_a', new Set([callbackA]));
    listeners.set('flag_b', new Set([callbackB]));

    dispatchFlagChanges(listeners, ['flag_a']);

    expect(callbackA).toHaveBeenCalledOnce();
    expect(callbackB).not.toHaveBeenCalled();
  });

  it('fires all callbacks when flagsChanged is undefined', () => {
    const listeners = new Map<string, Set<() => void>>();
    const callbackA = vi.fn();
    const callbackB = vi.fn();
    listeners.set('flag_a', new Set([callbackA]));
    listeners.set('flag_b', new Set([callbackB]));

    dispatchFlagChanges(listeners, undefined);

    expect(callbackA).toHaveBeenCalledOnce();
    expect(callbackB).toHaveBeenCalledOnce();
  });

  it('fires all callbacks when flagsChanged is an empty array', () => {
    const listeners = new Map<string, Set<() => void>>();
    const callbackA = vi.fn();
    const callbackB = vi.fn();
    listeners.set('flag_a', new Set([callbackA]));
    listeners.set('flag_b', new Set([callbackB]));

    dispatchFlagChanges(listeners, []);

    expect(callbackA).toHaveBeenCalledOnce();
    expect(callbackB).toHaveBeenCalledOnce();
  });

  it('fires multiple listeners on the same key', () => {
    const listeners = new Map<string, Set<() => void>>();
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    listeners.set('flag_a', new Set([callback1, callback2]));

    dispatchFlagChanges(listeners, ['flag_a']);

    expect(callback1).toHaveBeenCalledOnce();
    expect(callback2).toHaveBeenCalledOnce();
  });

  it('does not fire callbacks for non-matching keys', () => {
    const listeners = new Map<string, Set<() => void>>();
    const callback = vi.fn();
    listeners.set('flag_a', new Set([callback]));

    dispatchFlagChanges(listeners, ['flag_b']);

    expect(callback).not.toHaveBeenCalled();
  });
});
