import {instanceMetrics} from '@shipfox/node-opentelemetry';

const meter = instanceMetrics.getMeter('feature-flag');

export const jsonFeatureFlagValidationErrorCount = meter.createCounter<{key: string}>(
  'feature_flag_json_validation_error',
);
