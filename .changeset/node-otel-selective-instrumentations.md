---
"@shipfox/node-opentelemetry": minor
---

Add `InstrumentationOptions` to `startInstanceInstrumentation` for selective instrumentation loading.

Passing an `InstrumentationOptions` object enables only the specified instrumentations (via boolean flags) instead of loading all ~40 packages from `getNodeAutoInstrumentations()`. Each package is dynamically imported only when its flag is `true`, which significantly reduces startup time for apps using the ESM loader hook.

Existing callers that omit `instrumentations` are unaffected — auto-instrumentation remains the default.

`getFastifyInstrumentation()` now returns `FastifyOtelInstrumentation | undefined` instead of throwing when Fastify instrumentation is disabled.
