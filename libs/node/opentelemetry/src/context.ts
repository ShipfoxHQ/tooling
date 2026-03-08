import {
  type Context,
  createContextKey,
  context as otelContext,
  propagation,
  type Span,
  trace,
} from '@opentelemetry/api';

const DEFAULT_PREFIX = 'sf.';

const contextKeyCache = new Map<string, symbol>();

function getOrCreateContextKey(name: string): symbol {
  let key = contextKeyCache.get(name);
  if (!key) {
    key = createContextKey(name);
    contextKeyCache.set(name, key);
  }
  return key;
}

export function contextWithMetadata(
  metadata: Record<string, string>,
  options?: {prefix?: string; parentContext?: Context},
): Context {
  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  let ctx = options?.parentContext ?? otelContext.active();

  let baggage = propagation.getBaggage(ctx) ?? propagation.createBaggage();

  for (const [key, value] of Object.entries(metadata)) {
    ctx = ctx.setValue(getOrCreateContextKey(key), value);
    baggage = baggage.setEntry(`${prefix}${key}`, {value});
  }

  ctx = propagation.setBaggage(ctx, baggage);
  return ctx;
}

export function getContextMetadata(ctx?: Context, prefix?: string): Record<string, string> {
  const resolvedCtx = ctx ?? otelContext.active();
  const resolvedPrefix = prefix ?? DEFAULT_PREFIX;

  const baggage = propagation.getBaggage(resolvedCtx);
  if (!baggage) return {};

  const result: Record<string, string> = {};

  for (const [baggageKey, entry] of baggage.getAllEntries()) {
    if (!baggageKey.startsWith(resolvedPrefix)) continue;
    const key = baggageKey.slice(resolvedPrefix.length);
    const contextValue = resolvedCtx.getValue(getOrCreateContextKey(key));
    result[key] = typeof contextValue === 'string' ? contextValue : entry.value;
  }

  return result;
}

export function enrichSpanWithMetadata(
  metadata?: Record<string, string>,
  options?: {prefix?: string; span?: Span},
): void {
  const span = options?.span ?? trace.getActiveSpan();
  if (!span) return;

  const prefix = options?.prefix ?? DEFAULT_PREFIX;
  const resolvedMetadata = metadata ?? getContextMetadata();

  for (const [key, value] of Object.entries(resolvedMetadata)) {
    span.setAttribute(`${prefix}${key}`, value);
  }
}
