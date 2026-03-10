import {
  type Counter,
  type Gauge,
  type Histogram,
  type Meter,
  type MetricAttributes,
  metrics,
  type Observable,
  type ObservableCallback,
  type ObservableCounter,
  type ObservableGauge,
  type ObservableResult,
  type ObservableUpDownCounter,
  type UpDownCounter,
} from '@opentelemetry/api';
import {shutdownInstanceInstrumentation} from './instance';
import {getServiceMetricsProvider, shutdownServiceMetrics} from './service';

export {contextWithMetadata, enrichSpanWithMetadata, getContextMetadata} from './context';
export {getFastifyInstrumentation, startInstanceInstrumentation} from './instance';
export {logger} from './logger';
export {extractContextFromAttributes, injectContextToAttributes} from './propagation';
export {startServiceMetrics} from './service';

export async function shutdownInstrumentation() {
  await shutdownInstanceInstrumentation();
  await shutdownServiceMetrics();
}

export {metrics as instanceMetrics, getServiceMetricsProvider};
export type {
  Counter,
  Histogram,
  Gauge,
  MetricAttributes,
  UpDownCounter,
  Observable,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  ObservableResult,
  ObservableCallback,
  Meter,
};
