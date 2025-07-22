import {
  type Counter,
  type Gauge,
  type Histogram,
  type Meter,
  type Observable,
  type ObservableCallback,
  type ObservableCounter,
  type ObservableGauge,
  type ObservableResult,
  type ObservableUpDownCounter,
  type UpDownCounter,
  metrics,
} from '@opentelemetry/api';
import {shutdownInstanceInstrumentation} from './instance';
import {getServiceMetricsProvider, shutdownServiceMetrics} from './service';

export {startInstanceInstrumentation} from './instance';
export {startServiceMetrics} from './service';
export {getFastifyInstrumentation} from './instance';

export async function shutdownInstrumentation() {
  await shutdownInstanceInstrumentation();
  await shutdownServiceMetrics();
}

export {metrics as instanceMetrics, getServiceMetricsProvider};
export type {
  Counter,
  Histogram,
  Gauge,
  UpDownCounter,
  Observable,
  ObservableCounter,
  ObservableGauge,
  ObservableUpDownCounter,
  ObservableResult,
  ObservableCallback,
  Meter,
};
