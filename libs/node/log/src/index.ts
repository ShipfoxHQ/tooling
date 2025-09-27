import {bool, createConfig, str} from '@shipfox/config';
import {type LoggerOptions, pino} from 'pino';

const env = createConfig({
  LOG_LEVEL: str({default: 'info'}),
  LOG_PRETTY: bool({default: false}),
});

export const settings: LoggerOptions = {
  level: env.LOG_LEVEL,
  transport: env.LOG_PRETTY ? {target: 'pino-pretty', options: {colorize: true}} : undefined,
};

const logger = pino(settings);

export function createLogger(options: LoggerOptions) {
  return pino({...settings, ...options});
}

export const log = {
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
};
