import {bool, createConfig, str} from '@shipfox/config';

export const env = createConfig({
  LOG_LEVEL: str({default: 'info'}),
  LOG_PRETTY: bool({default: false}),
  LOG_FILE: str({default: undefined}),
});
