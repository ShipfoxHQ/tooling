import {
  type Level,
  type LogFn,
  type LoggerOptions,
  pino,
  stdSerializers,
  stdTimeFunctions,
  type TransportSingleOptions,
} from 'pino';
import {config} from './config';

export type {Level, LogFn} from 'pino';

const transports: TransportSingleOptions[] = [];
if (config.LOG_PRETTY) {
  transports.push({target: 'pino-pretty', options: {colorize: true}});
} else if (config.LOG_FILE) {
  // This also logs to stdout
  transports.push({target: 'pino/file', options: {destination: 1}});
  transports.push({target: 'pino/file', options: {destination: config.LOG_FILE, mkdir: true}});
} else {
  transports.push({target: 'pino/file', options: {destination: 1}});
}

export const settings: LoggerOptions = {
  level: config.LOG_LEVEL,
  transport: {targets: transports},
  timestamp: stdTimeFunctions.isoTime,
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
} & {
  flush: (cb?: (error?: Error) => void) => void;
};

export const log: Logger = {
  trace: logger.trace.bind(logger),
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  fatal: logger.fatal.bind(logger),
  flush: logger.flush.bind(logger),
};
