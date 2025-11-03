#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {getProjectFilePath, log} from '@shipfox/tool-utils';
import {replaceTscAliasPaths} from 'tsc-alias';
import {cleanup} from './utils';

async function run() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  let configFile = join(process.cwd(), 'tsconfig.build.json');
  if (!existsSync(configFile)) configFile = join(process.cwd(), 'tsconfig.json');

  const outDir = getProjectFilePath('dist');

  const binPath = join(__dirname, '..', 'node_modules', '.bin', 'tsc');

  execSync(
    `'${binPath}' --project '${configFile}' --declaration --emitDeclarationOnly --outDir '${outDir}'`,
    {
      stdio: 'inherit',
    },
  );
  await cleanup(configFile);
  await replaceTscAliasPaths({outDir, configFile});
}

run().catch((e) => {
  log.error(e);
  process.exit(1);
});
