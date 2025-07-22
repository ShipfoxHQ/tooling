import {MeterProvider, type MetricReader} from '@opentelemetry/sdk-metrics';
import {type StartInstrumentationOptions, getMetricsReader, getResource} from './common';

let serviceMetricsProvider: MeterProvider | undefined;
let serviceMetricReader: MetricReader | undefined;

export function startServiceMetrics(options?: StartInstrumentationOptions) {
  if (serviceMetricsProvider) return serviceMetricsProvider;

  const resource = getResource(options?.serviceName);
  serviceMetricReader = getMetricsReader({
    port: 9474,
    endpoint: '/metrics',
    ...options?.exporter?.service,
  });
  serviceMetricsProvider = new MeterProvider({readers: [serviceMetricReader], resource});
  return serviceMetricsProvider;
}

export function getServiceMetricsProvider() {
  if (!serviceMetricsProvider) return startServiceMetrics();
  return serviceMetricsProvider;
}

export async function shutdownServiceMetrics() {
  await serviceMetricsProvider?.shutdown();
  serviceMetricsProvider = new MeterProvider();
  serviceMetricReader = undefined;
}
