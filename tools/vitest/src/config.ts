import {getProjectRootPath} from '@shipfox/tool-utils';
import tsconfigPaths from 'vite-tsconfig-paths';
import {
  type TestProjectConfiguration,
  type UserConfigExport,
  type UserConfigFnObject,
  type UserWorkspaceConfig,
  defineConfig as vitestDefineConfig,
  defineProject as vitestDefineProject,
} from 'vitest/config';

export type UserConfig = ReturnType<UserConfigFnObject>;

function mergeConfig<T extends UserConfig | UserWorkspaceConfig>(config: T, callerUrl?: string): T {
  const projectRoot = callerUrl ? getProjectRootPath(callerUrl) : undefined;

  return {
    ...config,
    root: projectRoot,
    plugins: [tsconfigPaths(), ...(config.plugins || [])],
    test: {
      ...config.test,
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/out/**',
        ...(config.test?.exclude || []),
      ],
    },
  };
}

export function defineConfig(configOrFn: UserConfig, callerUrl?: string): UserConfigExport {
  return vitestDefineConfig(mergeConfig(configOrFn, callerUrl));
}

export function defineProject(
  configOrFn: UserWorkspaceConfig,
  callerUrl: string,
): TestProjectConfiguration {
  return vitestDefineProject(mergeConfig(configOrFn, callerUrl));
}
