import pg from 'pg';
import {config} from './config';

export type * from 'pg';

let _pool: pg.Pool | undefined;

export function createPostgresClient(options?: pg.PoolConfig): pg.Pool {
  _pool = new pg.Pool({
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    database: config.POSTGRES_DATABASE,
    user: config.POSTGRES_USERNAME,
    password: config.POSTGRES_PASSWORD,
    ...options,
  });
  return _pool;
}

export function pgClient(): pg.Pool {
  if (!_pool) {
    throw new Error('Postgres client has not been created');
  }
  return _pool;
}

export async function closePostgresClient() {
  await _pool?.end();
  _pool = undefined;
}

export async function isPostgresHealthy() {
  if (!_pool) return false;
  try {
    const health = await _pool?.query('SELECT 1');
    return health.rowCount === 1;
  } catch (_err) {
    return false;
  }
}
