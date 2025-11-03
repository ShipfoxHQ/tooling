#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {buildShellCommand} from '@shipfox/tool-utils';

if (process.argv.length !== 4) throw new Error('Usage: skopeo-copy <source_image> <target_env>');

const sourceImage = process.argv[2];
const targetEnv = process.argv[3];

const command = buildShellCommand([
  'skopeo',
  'copy',
  '--all',
  `docker://${sourceImage}`,
  `docker://${sourceImage}-${targetEnv}`,
]);
execSync(command, {stdio: 'inherit'});
