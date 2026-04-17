# @shipfox/node-feature-flag

## 0.8.0

### Minor Changes

- 8967115: Add Unleash as primary feature flag provider with LaunchDarkly fallback using OpenFeature MultiProvider and FirstSuccessfulStrategy

## 0.7.0

### Minor Changes

- b383718: Migrate from direct LaunchDarkly SDK to OpenFeature Server SDK with LaunchDarkly provider. The public API is unchanged. Internally, the monolithic module is split into focused modules (client, context, evaluation, validation) and adds a WeakMap schema cache for Ajv validation.

## 0.6.9

### Patch Changes

- Updated dependencies [bce98f6]
  - @shipfox/node-opentelemetry@0.4.1

## 0.6.8

### Patch Changes

- Updated dependencies [df4506a]
  - @shipfox/node-opentelemetry@0.4.0

## 0.6.7

### Patch Changes

- Updated dependencies [4a118e9]
  - @shipfox/node-opentelemetry@0.3.0

## 0.6.6

### Patch Changes

- Updated dependencies [bc8636f]
  - @shipfox/node-opentelemetry@0.2.3
  - @shipfox/config@1.2.0
  - @shipfox/node-log@0.3.1

## 0.6.5

### Patch Changes

- Updated dependencies [6aaecd4]
  - @shipfox/node-opentelemetry@0.2.2

## 0.6.4

### Patch Changes

- Updated dependencies [ddd50b9]
  - @shipfox/node-opentelemetry@0.2.1

## 0.6.3

### Patch Changes

- Updated dependencies [46ba174]
  - @shipfox/node-opentelemetry@0.2.0

## 0.6.2

### Patch Changes

- Updated dependencies [a2b9add]
  - @shipfox/node-log@0.3.1

## 0.6.1

### Patch Changes

- Updated dependencies [fa38530]
  - @shipfox/node-log@0.3.0

## 0.6.0

### Minor Changes

- ae7bf24: downgrade typebox version

## 0.5.0

### Minor Changes

- 9e32782: Force release

## 0.4.0

### Minor Changes

- 627bb45: Add infrastructureProvider dimmension to runner context

## 0.3.0

### Minor Changes

- 35f3c64: Add CSS bundle

### Patch Changes

- Updated dependencies [35f3c64]
  - @shipfox/node-opentelemetry@0.1.0
  - @shipfox/config@1.2.0
  - @shipfox/node-log@0.2.0

## 0.2.0

### Minor Changes

- 817e1ce: Add a runner kind of context for flagging

## 0.1.0

### Minor Changes

- 306b6b2: Add schema for validation on JSON flags

### Patch Changes

- 674ecbb: Add README for all packages
- Updated dependencies [2b64d6d]
- Updated dependencies [89dc459]
- Updated dependencies [674ecbb]
  - @shipfox/node-log@0.2.0
  - @shipfox/config@1.2.0
  - @shipfox/node-opentelemetry@0.0.2

## 0.0.1

### Patch Changes

- 9bd640b: Modify repository structure
- Updated dependencies [0de5d1a]
- Updated dependencies [f0687b7]
- Updated dependencies [9bd640b]
  - @shipfox/node-log@0.1.0
  - @shipfox/config@1.1.1
