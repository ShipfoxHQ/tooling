import {
  type BaseClickHouseClientConfigOptions,
  type ClickHouseClient,
  createClient,
} from '@clickhouse/client';
import {config} from './config.js';

export type * from '@clickhouse/client';

let _clickhouse: ClickHouseClient | undefined;

export function createClickHouseClient(
  options?: BaseClickHouseClientConfigOptions,
): ClickHouseClient {
  _clickhouse = createClient({
    url: config.CLICKHOUSE_URL,
    username: config.CLICKHOUSE_USERNAME,
    password: config.CLICKHOUSE_PASSWORD,
    database: config.CLICKHOUSE_DATABASE,
    ...options,
    clickhouse_settings: {
      date_time_input_format: 'best_effort',
      date_time_output_format: 'iso',
      // Workaround for 24.3 version of ClickHouse
      // https://github.com/ClickHouse/ClickHouse/issues/62113
      // Remove when upgrading to 24.4 as it has been fixed
      allow_experimental_analyzer: 0,
      ...options?.clickhouse_settings,
    },
  });
  return _clickhouse;
}

export function chClient(): ClickHouseClient {
  if (!_clickhouse) {
    throw new Error('ClickHouse client has not been created');
  }
  return _clickhouse;
}

export async function closeClickHouseClient() {
  if (_clickhouse) await _clickhouse.close();
  _clickhouse = undefined;
}

export async function isClickhouseHealthy() {
  if (!_clickhouse) return false;
  try {
    const health = await _clickhouse?.ping();
    return health.success;
  } catch (_err) {
    return false;
  }
}
