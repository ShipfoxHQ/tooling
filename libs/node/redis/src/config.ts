import {createConfig, host, num, str} from '@shipfox/config';

export const config = createConfig({
  REDIS_HOST: host({default: 'localhost'}),
  REDIS_PORT: num({default: 6379}),
  REDIS_PASSWORD: str({default: 'password'}),
  REDIS_DATABASE: num({default: 0}),
});
