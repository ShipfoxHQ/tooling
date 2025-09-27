import {type CleanedEnv, cleanEnv} from 'envalid';

export {cleanEnv, str, num, bool, host, port, url, email} from 'envalid';
export type {CleanedEnv, CleanedEnvAccessors, CleanOptions, ReporterOptions} from 'envalid';

// Helper function to create properly typed configs
export function createConfig<T extends Record<string, unknown>>(schema: T): CleanedEnv<T> {
  return cleanEnv(process.env, schema);
}
