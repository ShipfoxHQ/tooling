import {createConfig, port} from '@shipfox/config';

export const config = createConfig({
  OTEL_INSTANCE_METRICS_PORT: port({default: 9464}),
  OTEL_SERVICE_METRICS_PORT: port({default: 9474}),
});
