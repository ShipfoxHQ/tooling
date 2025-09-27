import {bool, createConfig, str} from '@shipfox/config';
import {type LoggerOptions, pino, stdSerializers, stdTimeFunctions} from 'pino';

const env = createConfig({
  LOG_LEVEL: str({default: 'info'}),
  LOG_PRETTY: bool({default: false}),
});

export const settings: LoggerOptions = {
  level: env.LOG_LEVEL,
  transport: env.LOG_PRETTY ? {target: 'pino-pretty', options: {colorize: true}} : undefined,
  timestamp: stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({level: label.toUpperCase()}),
  },
  serializers: {
    error: stdSerializers.errWithCause,
    errors: (errors: unknown) => {
      if (Array.isArray(errors))
        return errors.map((error) => stdSerializers.errWithCause(error as Error));
      return stdSerializers.errWithCause(errors as Error);
    },
    err: stdSerializers.errWithCause,
    req: stdSerializers.req,
    res: stdSerializers.res,
  },
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
