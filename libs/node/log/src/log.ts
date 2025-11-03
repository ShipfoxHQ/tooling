import {
  type Level,
  type LogFn,
  type LoggerOptions,
  pino,
  stdSerializers,
  stdTimeFunctions,
} from 'pino';
import {env} from './env';

export type {Level, LogFn} from 'pino';

let transport = undefined;
if (env.LOG_PRETTY) {
  transport = {target: 'pino-pretty', options: {colorize: true}};
} else if (env.LOG_FILE) {
  transport = {target: 'pino/file', options: {destination: env.LOG_FILE, mkdir: true}};
}

export const settings: LoggerOptions = {
  level: env.LOG_LEVEL,
  transport,
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

export type Logger = {
  [level in Level]: LogFn;
};

export const log: Logger = {
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
};
