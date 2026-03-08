import {trace} from '@opentelemetry/api';
import {settings} from '@shipfox/node-log';
import pino, {type Logger as PinoLogger} from 'pino';
import {getContextMetadata} from './context';

let baseLogger: PinoLogger | undefined;

function getBaseLogger(): PinoLogger {
  if (!baseLogger) {
    baseLogger = pino(settings);
  }
  return baseLogger;
}

export function logger(prefix?: string): PinoLogger {
  const base = getBaseLogger();
  const span = trace.getActiveSpan();
  const metadata = getContextMetadata(undefined, prefix);
  const hasMetadata = Object.keys(metadata).length > 0;

  if (!span && !hasMetadata) {
    return base;
  }

  const bindings: Record<string, string> = {...metadata};

  if (span) {
    const spanContext = span.spanContext();
    bindings.traceId = spanContext.traceId;
    bindings.spanId = spanContext.spanId;
  }

  return base.child(bindings);
}
