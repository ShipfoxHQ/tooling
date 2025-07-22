import {performance} from 'node:perf_hooks';
import {
  type Message,
  PubSub,
  type SubscriptionOptions as PubSubscriptionOptions,
  type Subscription,
} from '@google-cloud/pubsub';
import {captureException} from '@sentry/node';
import {getBooleanFeatureFlag, onFeatureFlagChange} from '@shipfox/feature-flag';
import {log} from '@shipfox/log';
import {config} from 'config';
import {messageProcessedCount, messageProcessingDurationMs, messageReceivedCount} from 'metrics';
import {merge} from 'ts-deepmerge';

export interface MessageMetadata {
  attributes: Message['attributes'];
  deliveryAttempt: Message['deliveryAttempt'];
}

const DEFAULT_PUBSUB_OPTIONS: PubSubscriptionOptions = {
  flowControl: {
    maxMessages: 100,
    allowExcessMessages: false,
  },
};

export type MessageListener = (
  content: Buffer,
  metadata: MessageMetadata,
) => unknown | Promise<unknown>;

const _pubsub = new PubSub({projectId: config.GOOGLE_CLOUD_PROJECT_ID});
const _listeners = new Map<string, MessageListener[]>();
const _subscriptions = new Map<string, Subscription>();

export interface SubscriptionConfig {
  pubSubOptions?: PubSubscriptionOptions;
  /** Automatically start listening for new message as soon as the subscription is registered (default: true | disabled if controlFlag is provided) */
  autoStart?: boolean;
  /** A boolean feature flag name, used to control the subscription processing */
  controlFlag?: string;
}

export function on(
  subscription: string,
  callback: MessageListener,
  config: SubscriptionConfig = {},
): void {
  log.debug({subscription}, 'Registering listener for subscription');
  const currentListeners = _listeners.get(subscription) ?? [];
  _listeners.set(subscription, [...currentListeners, callback]);

  const _subscription = createSubscription(subscription, config.pubSubOptions);
  const controlFlag = config.controlFlag;

  if (controlFlag) {
    linkToFeatureFlag(subscription, controlFlag).catch((error) => {
      log.error({error, controlFlag, subscription}, 'Failed to link subscription to feature flag');
      captureException(error, {tags: {subscription}});
    });
  } else if (config.autoStart ?? true) resumeSubscription(subscription);
}

function createSubscription(
  subscription: string,
  pubSubOptions: PubSubscriptionOptions = {},
): Subscription {
  const existingSubscription = _subscriptions.get(subscription);
  if (existingSubscription) return existingSubscription;

  const mergedOptions: PubSubscriptionOptions = merge(DEFAULT_PUBSUB_OPTIONS, pubSubOptions);
  const _subscription = _pubsub.subscription(subscription, mergedOptions);
  _subscriptions.set(subscription, _subscription);
  return _subscription;
}

export function pauseSubscription(subscription: string) {
  const _subscription = _subscriptions.get(subscription);
  if (!_subscription) throw new Error(`Subscription "${subscription}" not found`);
  log.info({subscription}, 'Pausing subscription');
  _subscription.removeAllListeners('message');
}

export function resumeSubscription(subscription: string): void {
  const _subscription = _subscriptions.get(subscription);
  if (!_subscription) throw new Error(`Subscription "${subscription}" not found`);
  log.info({subscription}, 'Resuming subscription');
  _subscription.addListener('message', (message) => onMessage(subscription, message));
}

async function linkToFeatureFlag(subscription: string, controlFlag: string) {
  const isActive = await getBooleanFeatureFlag(controlFlag, {kind: 'blank'});
  if (isActive) resumeSubscription(subscription);

  onFeatureFlagChange(controlFlag, async () => {
    const isActive = await getBooleanFeatureFlag(controlFlag, {kind: 'blank'});
    if (isActive) resumeSubscription(subscription);
    else pauseSubscription(subscription);
  });
}

async function onMessage(subscription: string, message: Message) {
  log.debug({subscription}, 'Received pub/sub message');
  messageReceivedCount.add(1, {subscription});

  const queueListeners = _listeners.get(subscription);
  if (!queueListeners) return;

  const start = performance.now();
  const content = message.data;
  const metadata = {
    attributes: message.attributes,
    deliveryAttempt: message.deliveryAttempt,
  };
  const results = await Promise.allSettled(
    queueListeners.map((listener) => listener(content, metadata)),
  );
  const success = results.every((result) => result.status === 'fulfilled');
  const duration = performance.now() - start;

  messageProcessedCount.add(1, {subscription, success});
  messageProcessingDurationMs.record(duration, {subscription, success});

  if (success) {
    log.debug({subscription}, 'Successfully processed message');
    await message.ack();
    return;
  }

  log.debug({subscription}, 'Failed to process message');

  for (const result of results) {
    if (result.status === 'rejected') {
      const errorData = {
        subscription,
        messageId: message.id,
        messageContent: content.toString(),
        error: JSON.stringify(result.reason, Object.getOwnPropertyNames(result.reason)),
      };
      log.error(errorData, `Failed to process message ${result.reason}`);
      await captureException(result.reason, {
        tags: {subscription, messageId: message.id},
        extra: errorData,
      });
    }
  }

  await message.ackFailed({
    name: 'Processing failed',
    errorCode: 'OTHER',
    message: 'Processing failed',
  });
}

export async function close(): Promise<void> {
  const subscriptionsArray = Array.from(_subscriptions.values());
  await subscriptionsArray.map((subscription) => subscription.close());
  subscriptionsArray.map((subscription) => subscription.removeAllListeners());
  _subscriptions.clear();
  _listeners.clear();
}
