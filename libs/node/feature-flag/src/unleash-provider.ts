import type {
  EvaluationContext,
  JsonValue,
  Logger,
  Provider,
  ResolutionDetails,
} from '@openfeature/server-sdk';
import {ErrorCode} from '@openfeature/server-sdk';
import {log} from '@shipfox/node-log';
import type {Unleash} from 'unleash-client';
import {startUnleash} from 'unleash-client';

export interface UnleashProviderOptions {
  url: string;
  apiKey: string;
  appName: string;
}

export class UnleashProvider implements Provider {
  public readonly runsOn = 'server';

  readonly metadata = {
    name: 'unleash',
  } as const;

  private client: Unleash | undefined;
  private readonly options: UnleashProviderOptions;

  constructor(options: UnleashProviderOptions) {
    this.options = options;
  }

  async initialize(): Promise<void> {
    this.client = await startUnleash({
      url: this.options.url,
      appName: this.options.appName,
      customHeaders: {Authorization: this.options.apiKey},
    });
    log.info('Unleash provider initialized');
  }

  async onClose(): Promise<void> {
    await this.client?.destroyWithFlush();
  }

  private getClient(): Unleash {
    if (!this.client) throw new Error('Unleash provider has not been initialized');
    return this.client;
  }

  resolveBooleanEvaluation(
    flagKey: string,
    defaultValue: boolean,
    context: EvaluationContext,
    _logger: Logger,
  ): Promise<ResolutionDetails<boolean>> {
    const client = this.getClient();
    const unleashContext = mapToUnleashContext(context);

    if (!client.getFeatureToggleDefinition(flagKey)) {
      return Promise.resolve({
        value: defaultValue,
        reason: 'DEFAULT',
        errorCode: ErrorCode.FLAG_NOT_FOUND,
      });
    }

    const value = client.isEnabled(flagKey, unleashContext, defaultValue);
    return Promise.resolve({value});
  }

  resolveStringEvaluation(
    flagKey: string,
    defaultValue: string,
    context: EvaluationContext,
    _logger: Logger,
  ): Promise<ResolutionDetails<string>> {
    const client = this.getClient();
    const unleashContext = mapToUnleashContext(context);
    const variant = client.getVariant(flagKey, unleashContext);

    if (!variant.enabled || !variant.payload) {
      return Promise.resolve({
        value: defaultValue,
        reason: 'DEFAULT',
        errorCode: ErrorCode.FLAG_NOT_FOUND,
      });
    }

    return Promise.resolve({value: variant.payload.value});
  }

  resolveNumberEvaluation(
    flagKey: string,
    defaultValue: number,
    context: EvaluationContext,
    _logger: Logger,
  ): Promise<ResolutionDetails<number>> {
    const client = this.getClient();
    const unleashContext = mapToUnleashContext(context);
    const variant = client.getVariant(flagKey, unleashContext);

    if (!variant.enabled || !variant.payload) {
      return Promise.resolve({
        value: defaultValue,
        reason: 'DEFAULT',
        errorCode: ErrorCode.FLAG_NOT_FOUND,
      });
    }

    const parsed = Number(variant.payload.value);
    if (Number.isNaN(parsed)) {
      log.warn(
        {flagKey, payload: variant.payload.value},
        'Unleash variant payload is not a valid number',
      );
      return Promise.resolve({
        value: defaultValue,
        reason: 'ERROR',
        errorCode: ErrorCode.TYPE_MISMATCH,
      });
    }

    return Promise.resolve({value: parsed});
  }

  resolveObjectEvaluation<T extends JsonValue>(
    flagKey: string,
    defaultValue: T,
    context: EvaluationContext,
    _logger: Logger,
  ): Promise<ResolutionDetails<T>> {
    const client = this.getClient();
    const unleashContext = mapToUnleashContext(context);
    const variant = client.getVariant(flagKey, unleashContext);

    if (!variant.enabled || !variant.payload) {
      return Promise.resolve({
        value: defaultValue,
        reason: 'DEFAULT',
        errorCode: ErrorCode.FLAG_NOT_FOUND,
      });
    }

    try {
      const parsed = JSON.parse(variant.payload.value) as T;
      return Promise.resolve({value: parsed});
    } catch {
      log.warn(
        {flagKey, payload: variant.payload.value},
        'Unleash variant payload is not valid JSON',
      );
      return Promise.resolve({
        value: defaultValue,
        reason: 'ERROR',
        errorCode: ErrorCode.PARSE_ERROR,
      });
    }
  }
}

function mapToUnleashContext(context: EvaluationContext): {
  userId?: string;
  properties?: Record<string, string>;
} {
  const userId = context.targetingKey;
  const properties: Record<string, string> = {};

  for (const [key, value] of Object.entries(context)) {
    if (key === 'targetingKey' || key === 'anonymous') continue;
    if (value !== undefined && value !== null) {
      properties[key] = String(value);
    }
  }

  return {
    userId,
    ...(Object.keys(properties).length > 0 ? {properties} : {}),
  };
}
