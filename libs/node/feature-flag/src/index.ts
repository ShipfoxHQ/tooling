import {init, type LDClient, type LDContext} from '@launchdarkly/node-server-sdk';
import {createConfig, str} from '@shipfox/config';
import {log} from '@shipfox/node-log';

let _client: LDClient | undefined;

export async function initFeatureFlagging() {
  return await new Promise((resolve) => {
    const env = createConfig({
      LAUNCH_DARKLY_SDK_KEY: str(),
      LAUNCH_DARKLY_BASE_URI: str({default: undefined}),
    });
    _client = init(env.LAUNCH_DARKLY_SDK_KEY, {
      logger: log,
      baseUri: env.LAUNCH_DARKLY_BASE_URI,
      streamUri: env.LAUNCH_DARKLY_BASE_URI,
      eventsUri: env.LAUNCH_DARKLY_BASE_URI,
    });
    _client.once('ready', () => resolve(_client));
  });
}

function getClient(): LDClient {
  if (!_client) throw new Error('Feature flag module has not been initialized');
  return _client;
}

export interface BlankContext {
  kind: 'blank';
}

export interface OrganizationContext {
  kind: 'organization';
  id: string;
}

export interface UserContext {
  kind: 'user';
  id: string;
  organizationId: string;
}

export type Context = BlankContext | OrganizationContext | UserContext;

function mapContext(context: Context): LDContext {
  if (context.kind === 'blank') return {kind: 'blank', anonymous: true, key: 'blank'};
  const {kind, id, ...rest} = context;
  return {
    kind,
    key: id,
    ...rest,
  };
}

export function getBooleanFeatureFlag(
  key: string,
  context: Context,
  defaultValue?: boolean,
): Promise<boolean> {
  return getClient().boolVariation(key, mapContext(context), defaultValue ?? false);
}

export function getStringFeatureFlag(
  key: string,
  context: Context,
  defaultValue?: string,
): Promise<string> {
  return getClient().stringVariation(key, mapContext(context), defaultValue ?? '');
}

export function getNumberFeatureFlag(
  key: string,
  context: Context,
  defaultValue?: number,
): Promise<number> {
  return getClient().numberVariation(key, mapContext(context), defaultValue ?? 0);
}

export function getJsonFeatureFlag<T = unknown>(
  key: string,
  context: Context,
  defaultValue?: T,
): Promise<T> {
  return getClient().jsonVariation(key, mapContext(context), defaultValue) as Promise<T>;
}

export function onFeatureFlagChange(key: string, callback: () => void) {
  const client = getClient();
  client.on(`update:${key}`, callback);
}

export type FeatureFlagValue = boolean | string | number | object | null;

export interface FeatureFlag {
  name: string;
  value: FeatureFlagValue;
}

export async function getAllFeatureFlags(context: Context): Promise<FeatureFlag[]> {
  const client = getClient();
  const ldContext = mapContext(context);

  const allFlags = await client.allFlagsState(ldContext);
  const flagValues = allFlags.toJSON();

  return Object.entries(flagValues)
    .filter(([key]) => !key.startsWith('$')) // Exclude all metadata properties
    .map(([key, value]) => ({
      name: key,
      value: value as FeatureFlagValue,
    }));
}
