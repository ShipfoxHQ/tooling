import {trace} from '@opentelemetry/api';
import {createLogger} from '@shipfox/node-log';
import {getContextMetadata} from './context';

type Logger = ReturnType<typeof createLogger>;

let baseLogger: Logger | undefined;

function getBaseLogger(): Logger {
  if (!baseLogger) {
    baseLogger = createLogger({});
  }
  return baseLogger;
}

export function logger(): Logger {
  const base = getBaseLogger();
  const span = trace.getActiveSpan();
  const metadata = getContextMetadata();
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
