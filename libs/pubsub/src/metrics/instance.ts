import {instanceMetrics} from '@shipfox/opentelemetry';

const meter = instanceMetrics.getMeter('pubsub');

export const messageReceivedCount = meter.createCounter<{subscription: string}>(
  'pubsub_message_received',
);

export const messageProcessedCount = meter.createCounter<{subscription: string; success: boolean}>(
  'pubsub_message_processed',
);

export const messageProcessingDurationMs = meter.createHistogram<{
  subscription: string;
  success: boolean;
}>('pubsub_message_processing_duration', {
  advice: {
    explicitBucketBoundaries: [
      5, 10, 25, 50, 75, 100, 250, 500, 750, 1_000, 2_500, 5_000, 7_500, 10_000,
    ],
  },
  unit: 'ms',
});

export const messageSentCount = meter.createCounter<{topic: string; success: string}>(
  'pubsub_message_sent',
);
