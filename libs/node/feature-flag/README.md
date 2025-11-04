# Shipfox Feature Flag

A thin wrapper around LaunchDarkly's Node SDK that standardizes initialization, context mapping, and flag access across [Shipfox](https://www.shipfox.io/) Node services.

## What it does

- **initFeatureFlagging()**: Initializes a singleton LaunchDarkly client from environment variables and resolves when ready.
- **Typed context helpers**: `BlankContext`, `OrganizationContext`, `UserContext` mapped to LaunchDarkly `LDContext`.
- **Flag getters**: `getBooleanFeatureFlag`, `getStringFeatureFlag`, `getNumberFeatureFlag`, `getJsonFeatureFlag<T>`.
- **Subscriptions**: `onFeatureFlagChange(key, callback)` listens for live updates of a specific flag.
- **Bulk fetch**: `getAllFeatureFlags(context)` returns a list of flag names and values for a context.

Environment variables:

- `LAUNCH_DARKLY_SDK_KEY` (required)
- `LAUNCH_DARKLY_BASE_URI` (optional; overrides `baseUri`, `streamUri`, and `eventsUri`)

## Installation

```bash
pnpm add @shipfox/node-feature-flag
# or
yarn add @shipfox/node-feature-flag
# or
npm install @shipfox/node-feature-flag
```

## Usage

```ts
import {
  initFeatureFlagging,
  getBooleanFeatureFlag,
  getStringFeatureFlag,
  getNumberFeatureFlag,
  getJsonFeatureFlag,
  onFeatureFlagChange,
  getAllFeatureFlags,
  type Context,
} from "@shipfox/node-feature-flag";

// 1) Initialize once at startup (resolves when the SDK is ready)
await initFeatureFlagging();

// 2) Build a context. Supported shapes:
// - BlankContext: { kind: 'blank' }
// - OrganizationContext: { kind: 'organization', id: string }
// - UserContext: { kind: 'user', id: string, organizationId: string }
const context: Context = {
  kind: "user",
  id: "user-123",
  organizationId: "org-456",
};

// 3) Read flags with sensible typed defaults
const enabled = await getBooleanFeatureFlag("new-dashboard", context, false);
const theme = await getStringFeatureFlag("theme", context, "light");
const sampleRate = await getNumberFeatureFlag("ingest-sample-rate", context, 1);
const payload = await getJsonFeatureFlag<{ variant: string }>(
  "experiment",
  context,
  { variant: "control" }
);

// 4) Subscribe to a single flag's updates
onFeatureFlagChange("new-dashboard", async () => {
  const latest = await getBooleanFeatureFlag("new-dashboard", context, false);
  // react to change
});

// 5) Fetch all flags for a context (excluding LD metadata)
const flags = await getAllFeatureFlags(context);
// -> [{ name: 'flag-key', value: true | 'str' | 123 | {} | null }, ...]
```

Configure via environment variables before starting your app:

```bash
export LAUNCH_DARKLY_SDK_KEY="sdk-123"
# Optional self-hosted / relay proxy base URL
export LAUNCH_DARKLY_BASE_URI="https://ld-relay.internal"
```
