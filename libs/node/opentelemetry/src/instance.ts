import FastifyOtelInstrumentation from '@fastify/otel';
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {NodeSDK} from '@opentelemetry/sdk-node';
import {env, getMetricsReader, type StartInstrumentationOptions} from './common';

let instanceInstrumentation: NodeSDK | undefined;
let fastifyInstrumentation: FastifyOtelInstrumentation | undefined;

export function startInstanceInstrumentation(options: StartInstrumentationOptions) {
  if (instanceInstrumentation) throw new Error('Instrumentation already initialized');
  const metricReader = getMetricsReader({
    port: 9464,
    endpoint: '/metrics',
    ...options.exporter?.instance,
  });
  fastifyInstrumentation = new FastifyOtelInstrumentation();
  instanceInstrumentation = new NodeSDK({
    serviceName: options.serviceName,
    metricReader,
    instrumentations: [fastifyInstrumentation, ...getNodeAutoInstrumentations()],
    traceExporter: env.TRACES_COLLECTOR_URL
      ? new OTLPTraceExporter({url: env.TRACES_COLLECTOR_URL})
      : undefined,
  });
  instanceInstrumentation.start();
}

export function getFastifyInstrumentation() {
  if (!fastifyInstrumentation) throw new Error('Instrumentation not initialized');
  return fastifyInstrumentation;
}

export async function shutdownInstanceInstrumentation() {
  await instanceInstrumentation?.shutdown();
  instanceInstrumentation = undefined;
}
