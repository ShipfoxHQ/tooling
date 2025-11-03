#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {getProjectBinaryPath, getProjectFilePath, log} from '@shipfox/tool-utils';
import {cleanup, getOwnedFileStats, replaceTypescriptPaths} from './utils';

async function run() {
  const swcPath = getProjectBinaryPath('swc', import.meta.url);
  const configPath = getProjectFilePath('.swcrc', import.meta.url);
  const outputPath = getProjectFilePath('dist');
  const ownedFiles = await getOwnedFileStats(outputPath);
  const extraArgs = process.argv.slice(2);
  execSync(
    `'${swcPath}' --strip-leading-paths --config-file '${configPath}' -d '${outputPath}' ${extraArgs.join(' ')} src`,
    {stdio: 'inherit'},
  );
  await cleanup(outputPath, ownedFiles);

  const tsConfigPath = getProjectFilePath('tsconfig.build.json');
  await replaceTypescriptPaths({outputPath, tsConfigPath});
}

run().catch((e) => {
  log.error(e);
  process.exit(1);
});
