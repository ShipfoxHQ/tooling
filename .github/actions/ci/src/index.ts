import core from '@actions/core';
import {getContext} from 'src/context';
import {nixExecSync} from 'src/utils';

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
  nixExecSync('docker compose up -d', {stdio: 'inherit'});

  // Wait for all containers to be healthy
  core.info('Waiting for containers to be healthy...');
  nixExecSync('docker compose ps --format "table {{.Name}}\t{{.Status}}"', {stdio: 'inherit'});

  // Wait for all services to be healthy
  nixExecSync('timeout 60 bash -c "until docker compose ps | grep -q healthy; do sleep 2; done"', {
    stdio: 'inherit',
  });

  core.info('All containers are healthy!');
  runTurbo();
}

try {
  run();
} catch (error) {
  const displayedError =
    error instanceof Error || typeof error === 'string' ? error : JSON.stringify(error);
  core.setFailed(displayedError);
}
