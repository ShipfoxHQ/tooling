import {Type} from '@fastify/type-provider-typebox';
import {describe, expect, it} from '@shipfox/vitest/vi';
import {vi} from 'vitest';
import {isValidJsonFeatureFlagPayload} from './validation';

vi.mock('@shipfox/node-log', () => ({
  log: {error: vi.fn()},
}));

const testSchema = Type.Object({
  default: Type.String(),
  rules: Type.Array(
    Type.Object({
      arch: Type.String(),
      minCpu: Type.Number(),
      maxCpu: Type.Number(),
      executionEnvironment: Type.String(),
    }),
  ),
});

describe('isValidJsonFeatureFlagPayload', () => {
  it('validates a valid payload', () => {
    const payload = {default: 'virtual-machine', rules: []};

    const isValid = isValidJsonFeatureFlagPayload(testSchema, payload);

    expect(isValid).toBe(true);
  });

  it('validates a payload with rules', () => {
    const payload = {
      default: 'virtual-machine',
      rules: [{arch: 'amd64', minCpu: 1, maxCpu: 1, executionEnvironment: 'virtual-machine'}],
    };

    const isValid = isValidJsonFeatureFlagPayload(testSchema, payload);

    expect(isValid).toBe(true);
  });

  it('rejects an invalid payload', () => {
    const payload = {default: 'virtual-machine'};

    const isValid = isValidJsonFeatureFlagPayload(testSchema, payload);

    expect(isValid).toBe(false);
  });

  it('rejects a payload with wrong types', () => {
    const payload = {default: 123, rules: []};

    const isValid = isValidJsonFeatureFlagPayload(testSchema, payload);

    expect(isValid).toBe(false);
  });

  it('caches compiled schemas across calls', () => {
    const schema = Type.Object({name: Type.String()});

    isValidJsonFeatureFlagPayload(schema, {name: 'first'});
    isValidJsonFeatureFlagPayload(schema, {name: 'second'});

    // Both calls should succeed — caching doesn't break validation
    expect(isValidJsonFeatureFlagPayload(schema, {name: 'third'})).toBe(true);
    expect(isValidJsonFeatureFlagPayload(schema, {name: 123})).toBe(false);
  });
});
