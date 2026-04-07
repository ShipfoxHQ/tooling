import type {LDClient} from '@launchdarkly/node-server-sdk';
import {LaunchDarklyProvider} from '@launchdarkly/openfeature-node-server';
import type {Client} from '@openfeature/server-sdk';
import {OpenFeature, ProviderEvents} from '@openfeature/server-sdk';
import {createConfig, str} from '@shipfox/config';
import {log} from '@shipfox/node-log';

let _initialized = false;
let _provider: LaunchDarklyProvider | undefined;

const _listeners = new Map<string, Set<() => void>>();
let _eventHandlerRegistered = false;

export async function initFeatureFlagging(): Promise<void> {
  const env = createConfig({
    LAUNCH_DARKLY_SDK_KEY: str(),
    LAUNCH_DARKLY_BASE_URI: str({default: undefined}),
  });

  _provider = new LaunchDarklyProvider(env.LAUNCH_DARKLY_SDK_KEY, {
    logger: log,
    baseUri: env.LAUNCH_DARKLY_BASE_URI,
    streamUri: env.LAUNCH_DARKLY_BASE_URI,
    eventsUri: env.LAUNCH_DARKLY_BASE_URI,
  });

  await OpenFeature.setProviderAndWait(_provider);
  _initialized = true;
}

export function getOpenFeatureClient(): Client {
  if (!_initialized) throw new Error('Feature flag module has not been initialized');
  return OpenFeature.getClient();
}

export function getLaunchDarklyClient(): LDClient {
  if (!_provider) throw new Error('Feature flag module has not been initialized');
  return _provider.getClient() as LDClient;
}

export function dispatchFlagChanges(
  listeners: Map<string, Set<() => void>>,
  flagsChanged?: string[],
): void {
  const hasSpecificFlags = flagsChanged && flagsChanged.length > 0;

  if (hasSpecificFlags) {
    for (const key of flagsChanged) {
      const callbacks = listeners.get(key);
      if (!callbacks) continue;
      for (const callback of callbacks) {
        callback();
      }
    }
    return;
  }

  for (const callbacks of listeners.values()) {
    for (const callback of callbacks) {
      callback();
    }
  }
}

export function onFeatureFlagChange(key: string, callback: () => void): void {
  const callbacks = _listeners.get(key) ?? new Set();
  callbacks.add(callback);
  _listeners.set(key, callbacks);

  if (!_eventHandlerRegistered) {
    const client = getOpenFeatureClient();
    client.addHandler(ProviderEvents.ConfigurationChanged, (details) => {
      const flagsChanged = details?.flagsChanged as string[] | undefined;
      dispatchFlagChanges(_listeners, flagsChanged);
    });
    _eventHandlerRegistered = true;
  }
}
