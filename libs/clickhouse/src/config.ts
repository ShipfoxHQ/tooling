import {url, createConfig, str} from '@shipfox/config';

export const config = createConfig({
  CLICKHOUSE_URL: url({default: 'http://localhost:8123'}),
  CLICKHOUSE_USERNAME: str({default: 'shipfox'}),
  CLICKHOUSE_PASSWORD: str({default: 'password'}),
  CLICKHOUSE_DATABASE: str({default: 'api'}),
});
