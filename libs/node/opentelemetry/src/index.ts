import {
  type Context,
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
  type Span,
  type UpDownCounter,
} from '@opentelemetry/api';
import {shutdownInstanceInstrumentation} from './instance';
import {getServiceMetricsProvider, shutdownServiceMetrics} from './service';

import './diag';

export type {InstrumentationOptions} from './common';
export {contextWithMetadata, enrichSpanWithMetadata, getContextMetadata} from './context';
export {getFastifyInstrumentation, startInstanceInstrumentation} from './instance';
export {logger} from './logger';
export {extractContextFromAttributes, injectContextToAttributes} from './propagation';
export {startServiceMetrics} from './service';

export async function shutdownInstrumentation() {
  await shutdownInstanceInstrumentation();
  await shutdownServiceMetrics();
}

export type {
  Context,
  Counter,
  Gauge,
  Histogram,
  Meter,
  MetricAttributes,
  Observable,
  ObservableCallback,
  ObservableCounter,
  ObservableGauge,
  ObservableResult,
  ObservableUpDownCounter,
  Span,
  UpDownCounter,
};
export {getServiceMetricsProvider, metrics as instanceMetrics};
