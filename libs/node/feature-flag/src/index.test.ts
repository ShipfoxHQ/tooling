import {Type} from '@fastify/type-provider-typebox';
import {describe, expect, it} from '@shipfox/vitest/vi';
import {isValidJsonFeatureFlagPayload} from './index';

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

const validSchema = {
  default: 'virtual-machine',
  rules: [{arch: 'amd64', minCpu: 1, maxCpu: 1, executionEnvironment: 'virtual-machine'}],
};

describe('feature-flag', () => {
  it('should validate a JSON feature flag', () => {
    const payload = {default: 'virtual-machine', rules: []};
    const isValid = isValidJsonFeatureFlagPayload(testSchema, payload);
    expect(isValid).toBe(true);
  });

  it('should validate a JSON feature flag with rules', () => {
    const payload = validSchema;
    const isValid = isValidJsonFeatureFlagPayload(testSchema, payload);
    expect(isValid).toBe(true);
  });

  it('should not validate a JSON feature flag', () => {
    const payload = {default: 'virtual-machine'};
    const isValid = isValidJsonFeatureFlagPayload(testSchema, payload);
    expect(isValid).toBe(false);
  });
});
