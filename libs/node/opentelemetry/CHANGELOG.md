# @shipfox/node-opentelemetry

## 0.2.0

### Minor Changes

- 46ba174: Add context propagation, metadata baggage, and context-aware logger. Introduces `contextWithMetadata`/`getContextMetadata` for carrying business metadata through OTel context and W3C baggage, `injectContextToAttributes`/`extractContextFromAttributes` for serialising context into plain objects (queue payloads, headers), and a `logger()` helper that auto-enriches pino log lines with `traceId`, `spanId`, and business metadata from the active context.

## 0.1.0

### Minor Changes

- 35f3c64: Add CSS bundle

### Patch Changes

- @shipfox/config@1.2.0

## 0.0.2

### Patch Changes

- 674ecbb: Add README for all packages
- Updated dependencies [89dc459]
- Updated dependencies [674ecbb]
  - @shipfox/config@1.2.0

## 0.0.1

### Patch Changes

- 9bd640b: Modify repository structure
- Updated dependencies [9bd640b]
  - @shipfox/config@1.1.1
