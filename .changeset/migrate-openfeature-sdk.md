---
"@shipfox/node-feature-flag": minor
---

Migrate from direct LaunchDarkly SDK to OpenFeature Server SDK with LaunchDarkly provider. The public API is unchanged. Internally, the monolithic module is split into focused modules (client, context, evaluation, validation) and adds a WeakMap schema cache for Ajv validation.
