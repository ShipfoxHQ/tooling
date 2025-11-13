import {getProjectRootPath} from '@shipfox/tool-utils';
import tsconfigPaths from 'vite-tsconfig-paths';
import {
  type TestProjectConfiguration,
  type UserWorkspaceConfig,
  defineConfig as vitestDefineConfig,
  defineProject as vitestDefineProject,
} from 'vitest/config';

export type {
  TestProjectConfiguration,
  UserWorkspaceConfig,
} from 'vitest/config';

export type UserConfigExport = ReturnType<typeof vitestDefineConfig>;
export type UserConfigFnObject = () => Parameters<typeof vitestDefineConfig>[0];

export type UserConfig = Parameters<typeof vitestDefineConfig>[0];

type ConfigInput = UserConfig | UserWorkspaceConfig;

function mergeConfig(config: ConfigInput, callerUrl?: string): ConfigInput {
  const projectRoot = callerUrl ? getProjectRootPath(callerUrl) : undefined;

  if (typeof config === 'function') {
    return ((env) => {
      const resolved = config(env);
      if (resolved instanceof Promise) {
        return resolved.then((resolvedConfig) => {
          const existingPlugins = (resolvedConfig as {plugins?: unknown[]}).plugins || [];
          const merged = {
            ...resolvedConfig,
            plugins: [tsconfigPaths(), ...existingPlugins],
            test: {
              ...((resolvedConfig as {test?: {exclude?: string[]}}).test || {}),
              exclude: [
                '**/node_modules/**',
                '**/dist/**',
                '**/build/**',
                '**/out/**',
                ...((resolvedConfig as {test?: {exclude?: string[]}}).test?.exclude || []),
              ],
            },
          };
          if (projectRoot && !(merged as {root?: string}).root) {
            (merged as {root: string}).root = projectRoot;
          }
          return merged as ConfigInput;
        });
      }
      const existingPlugins = (resolved as {plugins?: unknown[]}).plugins || [];
      const merged = {
        ...resolved,
        plugins: [tsconfigPaths(), ...existingPlugins],
        test: {
          ...((resolved as {test?: {exclude?: string[]}}).test || {}),
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/out/**',
            ...((resolved as {test?: {exclude?: string[]}}).test?.exclude || []),
          ],
        },
      };
      if (projectRoot && !(merged as {root?: string}).root) {
        (merged as {root: string}).root = projectRoot;
      }
      return merged as ConfigInput;
    }) as typeof config;
  }

  const existingPlugins = (config as {plugins?: unknown[]}).plugins || [];
  const merged = {
    ...config,
    plugins: [tsconfigPaths(), ...existingPlugins],
    test: {
      ...((config as {test?: {exclude?: string[]}}).test || {}),
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/out/**',
        ...((config as {test?: {exclude?: string[]}}).test?.exclude || []),
      ],
    },
  };

  if (projectRoot && !(merged as {root?: string}).root) {
    (merged as {root: string}).root = projectRoot;
  }

  return merged as ConfigInput;
}

export function defineConfig(config: UserConfig, callerUrl?: string): UserConfigExport {
  return vitestDefineConfig(mergeConfig(config, callerUrl) as UserConfig);
}

export function defineProject(
  configOrFn: UserWorkspaceConfig,
  callerUrl: string,
): TestProjectConfiguration {
  return vitestDefineProject(mergeConfig(configOrFn, callerUrl) as UserWorkspaceConfig);
}
