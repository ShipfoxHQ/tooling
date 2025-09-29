import {Redis, type RedisOptions} from 'ioredis';
import {config} from './config';

export type * from 'ioredis';

let _redis: Redis | undefined;

export function createRedisClient(options: RedisOptions): Redis {
  _redis = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    db: config.REDIS_DATABASE,
    ...options,
  });
  return _redis;
}

export function redisClient(): Redis {
  if (!_redis) {
    throw new Error('Redis client has not been created');
  }
  return _redis;
}

export async function closeRedisClient() {
  if (_redis) await _redis.disconnect();
  _redis = undefined;
}

export async function isRedisHealthy() {
  if (!_redis) return false;
  try {
    const pong = await _redis.ping();
    return pong === 'PONG';
  } catch (_err) {
    return false;
  }
}
