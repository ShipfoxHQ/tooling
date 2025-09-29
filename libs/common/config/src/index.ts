import {type CleanedEnv, cleanEnv} from 'envalid';

export type {CleanedEnv, CleanedEnvAccessors, CleanOptions, ReporterOptions} from 'envalid';
export {bool, cleanEnv, email, host, num, port, str, url} from 'envalid';

// Helper function to create properly typed configs
export function createConfig<T extends Record<string, unknown>>(schema: T): CleanedEnv<T> {
  return cleanEnv(process.env, schema);
}
