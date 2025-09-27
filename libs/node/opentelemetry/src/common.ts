import {
  PrometheusExporter,
  type ExporterConfig as PrometheusExporterConfig,
} from '@opentelemetry/exporter-prometheus';
import {
  type Resource,
  detectResources,
  envDetector,
  hostDetector,
  osDetector,
  processDetector,
  resourceFromAttributes,
} from '@opentelemetry/resources';
import {ATTR_SERVICE_NAME} from '@opentelemetry/semantic-conventions';
import {url, createConfig, str} from '@shipfox/config';

export const env = createConfig({
  OTEL_SERVICE_NAME: str({default: undefined}),
  TRACES_COLLECTOR_URL: url({default: undefined}),
});

export interface StartInstrumentationOptions {
  serviceName?: string;
  exporter?: {
    instance: PrometheusExporterConfig;
    service: PrometheusExporterConfig;
  };
}

export function getMetricsReader(config: PrometheusExporterConfig): PrometheusExporter {
  return new PrometheusExporter(config);
}

export function getResource(serviceName?: string): Resource {
  return detectResources({
    detectors: [envDetector, processDetector, hostDetector, osDetector],
  }).merge(resourceFromAttributes({[ATTR_SERVICE_NAME]: serviceName ?? env.OTEL_SERVICE_NAME}));
}
