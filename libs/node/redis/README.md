# Shipfox Redis

Thin wrapper around `ioredis` that centralizes connection config via environment variables and exposes a simple lifecycle API.

It should be used with other packages from [Shipfox](https://www.shipfox.io/).

### What it does

- **createRedisClient(options)**: Creates and stores a singleton `ioredis` client configured from environment variables and optional overrides.
- **redisClient()**: Returns the previously created client; throws if not initialized.
- **closeRedisClient()**: Disconnects and clears the client.
- **isRedisHealthy()**: Performs a `PING` and returns a boolean.
- **Re-exports all types/exports from `ioredis`** for direct usage.

Environment variables (with defaults):

- `REDIS_HOST` (default: `localhost`)
- `REDIS_PORT` (default: `6379`)
- `REDIS_PASSWORD` (default: `password`)
- `REDIS_DATABASE` (default: `0`)

### Installation

```bash
pnpm add @shipfox/node-redis
# or
yarn add @shipfox/node-redis
# or
npm install @shipfox/node-redis
```

### Usage

```ts
import {
  createRedisClient,
  redisClient,
  closeRedisClient,
  isRedisHealthy,
  type Redis,
} from "@shipfox/node-redis";

// 1) Create the client at startup (pass any ioredis options to override env-driven defaults)
const client: Redis = createRedisClient({
  // keyPrefix: "app:",
});

// 2) Use the client elsewhere without passing it around
async function cacheExample() {
  const redis = redisClient();
  await redis.set("greeting", "hello", "EX", 60);
  return await redis.get("greeting");
}

// 3) Health check
async function ready() {
  return await isRedisHealthy();
}

// 4) Clean shutdown
async function shutdown() {
  await closeRedisClient();
}
```

Configure via environment variables before starting your app:

```bash
export REDIS_HOST="127.0.0.1"
export REDIS_PORT="6379"
export REDIS_PASSWORD="supersecret"
export REDIS_DATABASE="0"
```
