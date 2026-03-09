---
"@shipfox/node-opentelemetry": minor
---

Add context propagation, metadata baggage, and context-aware logger. Introduces `contextWithMetadata`/`getContextMetadata` for carrying business metadata through OTel context and W3C baggage, `injectContextToAttributes`/`extractContextFromAttributes` for serialising context into plain objects (queue payloads, headers), and a `logger()` helper that auto-enriches pino log lines with `traceId`, `spanId`, and business metadata from the active context.
