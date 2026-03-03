import * as core from '@actions/core';
import {getContext} from './context';
import {nixExecSync} from './utils';

function getTurboTasks(): string[] {
  const tasks: string[] = ['check', 'type', 'build', 'test'];
  return tasks;
}

function getTurboEnv() {
  const context = getContext();
  return {
    ...process.env,
    NODE_VERSION: context.versions.node,
    PNPM_VERSION: context.versions.pnpm,
    TURBO_SCM_BASE: context.turboBase,
  };
}

function runTurbo() {
  const tasks = getTurboTasks();
  core.info(`Running tasks: ${tasks.join(', ')}`);
  const command = `pnpm turbo ${tasks.join(' ')} --affected --concurrency 100%`;
  core.info(`Running turbo command: ${command}`);
  nixExecSync(command, {
    stdio: 'inherit',
    env: getTurboEnv(),
  });
}

function skipArgosIfNotAffected() {
  try {
    const dryRunOutput = nixExecSync('pnpm turbo test --affected --dry=json', {
      env: getTurboEnv(),
    });
    const dryRun = JSON.parse(dryRunOutput) as {tasks: {taskId: string}[]};
    const isReactUiAffected = dryRun.tasks.some((task) => task.taskId === '@shipfox/react-ui#test');
    if (!isReactUiAffected) {
      core.info('react-ui not affected — skipping Argos');
      nixExecSync('pnpm --filter @shipfox/react-ui exec argos skip', {
        stdio: 'inherit',
        env: getTurboEnv(),
      });
    }
  } catch (error) {
    core.warning(`Failed to check Argos skip: ${error}`);
  }
}

function run() {
  runTurbo();
  skipArgosIfNotAffected();
}

try {
  run();
} catch (error) {
  const displayedError =
    error instanceof Error || typeof error === 'string' ? error : JSON.stringify(error);
  core.setFailed(displayedError);
}
