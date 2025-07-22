import core from '@actions/core';
import {getContext} from './context';
import {nixExecSync} from './utils';

function getTurboTasks(): string[] {
  const tasks: string[] = ['check', 'type', 'build', 'test'];
  return tasks;
}

function runTurbo() {
  const context = getContext();
  const tasks = getTurboTasks();
  core.info(`Running tasks: ${tasks.join(', ')}`);
  const command = `pnpm turbo ${tasks.join(' ')} --affected --concurrency 100%`;
  core.info(`Running turbo command: ${command}`);
  nixExecSync(command, {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_VERSION: context.versions.node,
      PNPM_VERSION: context.versions.pnpm,
      TURBO_SCM_BASE: context.turboBase,
    },
  });
}

function run() {
  runTurbo();
}

try {
  run();
} catch (error) {
  const displayedError =
    error instanceof Error || typeof error === 'string' ? error : JSON.stringify(error);
  core.setFailed(displayedError);
}
