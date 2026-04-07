import type {Static, TSchema} from '@fastify/type-provider-typebox';
import {jsonFeatureFlagValidationErrorCount} from 'metrics';
import {getLaunchDarklyClient, getOpenFeatureClient} from './client';
import {type Context, mapContext, mapContextToLDContext} from './context';
import {isValidJsonFeatureFlagPayload} from './validation';

export type FeatureFlagValue = boolean | string | number | object | null;

export interface FeatureFlag {
  name: string;
  value: FeatureFlagValue;
}

export function getBooleanFeatureFlag(
  key: string,
  context: Context,
  defaultValue?: boolean,
): Promise<boolean> {
  return getOpenFeatureClient().getBooleanValue(key, defaultValue ?? false, mapContext(context));
}

export function getStringFeatureFlag(
  key: string,
  context: Context,
  defaultValue?: string,
): Promise<string> {
  return getOpenFeatureClient().getStringValue(key, defaultValue ?? '', mapContext(context));
}

export function getNumberFeatureFlag(
  key: string,
  context: Context,
  defaultValue?: number,
): Promise<number> {
  return getOpenFeatureClient().getNumberValue(key, defaultValue ?? 0, mapContext(context));
}

export async function getJsonFeatureFlag<T extends TSchema>(
  key: string,
  context: Context,
  schema: T,
  defaultValue: Static<T>,
): Promise<Static<T>> {
  const response = await getOpenFeatureClient().getObjectValue(
    key,
    defaultValue,
    mapContext(context),
  );
  if (!isValidJsonFeatureFlagPayload(schema, response)) {
    jsonFeatureFlagValidationErrorCount.add(1, {key});
    return defaultValue;
  }
  return response as Static<T>;
}

// Provider-specific: uses underlying LaunchDarkly client directly.
// OpenFeature has no "get all flags" equivalent.
export async function getAllFeatureFlags(context: Context): Promise<FeatureFlag[]> {
  const ldClient = getLaunchDarklyClient();
  const ldContext = mapContextToLDContext(context);
  const allFlags = await ldClient.allFlagsState(ldContext);
  const flagValues = allFlags.toJSON();
  return Object.entries(flagValues)
    .filter(([key]) => !key.startsWith('$'))
    .map(([key, value]) => ({
      name: key,
      value: value as FeatureFlagValue,
    }));
}
