---
"@shipfox/node-feature-flag": patch
---

Fix Unleash provider to throw on flag not found so MultiProvider falls through to LaunchDarkly

When a flag doesn't exist in Unleash, the provider now throws instead of returning a resolved
default value. This allows `FirstSuccessfulStrategy` to correctly fall through to the LaunchDarkly
provider, preventing flags missing from Unleash from silently returning hardcoded defaults.
