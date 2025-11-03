# Shipfox ClickHouse

A thin wrapper around `@clickhouse/client` with sane defaults, environment-based configuration, and convenient helpers for lifecycle and health checks. It should be used with other packages from [Shipfox](https://www.shipfox.io/).

### What it does

- **createClickHouseClient(options?)**: Creates and stores a singleton `ClickHouseClient` configured from environment variables and safe defaults.
- **chClient()**: Returns the previously created client instance; throws if not initialized.
- **closeClickHouseClient()**: Closes and clears the stored client instance.
- **isClickhouseHealthy()**: Pings the server and returns a boolean for simple readiness checks.
- **Re-exports all types/exports from `@clickhouse/client`** for direct usage.

Environment variables (with defaults):

- `CLICKHOUSE_URL` (default: `http://localhost:8123`)
- `CLICKHOUSE_USERNAME` (default: `shipfox`)
- `CLICKHOUSE_PASSWORD` (default: `password`)
- `CLICKHOUSE_DATABASE` (default: `api`)

### Installation

```bash
pnpm add @shipfox/node-clickhouse
# or
yarn add @shipfox/node-clickhouse
# or
npm install @shipfox/node-clickhouse
```

### Usage

```ts
import {
  createClickHouseClient,
  chClient,
  closeClickHouseClient,
  isClickhouseHealthy,
  type ClickHouseClient,
} from "@shipfox/node-clickhouse";

// 1) Create the client at startup (optionally pass @clickhouse/client options)
const client: ClickHouseClient = createClickHouseClient({
  // Overrides are optional; env-driven base config is applied automatically
  // request_timeout: 30_000,
});

// 2) Use the client elsewhere without passing it around
async function getRowCount() {
  const ch = chClient();
  const result = await ch.query({
    query: "SELECT count() AS c FROM system.tables",
    format: "JSONEachRow",
  });
  const rows = await result.json<{ c: number }>();
  return rows[0]?.c ?? 0;
}

// 3) Simple health check (e.g., in a readiness endpoint)
async function ready() {
  return await isClickhouseHealthy();
}

// 4) Clean shutdown
async function shutdown() {
  await closeClickHouseClient();
}
```

If you need to customize the connection, you can set environment variables before starting your app:

```bash
export CLICKHOUSE_URL="https://example-clickhouse:8443"
export CLICKHOUSE_USERNAME="service_user"
export CLICKHOUSE_PASSWORD="supersecret"
export CLICKHOUSE_DATABASE="analytics"
```
