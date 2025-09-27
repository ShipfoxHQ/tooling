#!/usr/bin/env node

import {execSync} from 'node:child_process';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {getWorkspaceFilePath} from '@shipfox/tool-utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const binPath = join(__dirname, '..', 'node_modules', '.bin', 'biome');
const biomeConfigFile = getWorkspaceFilePath('biome.json');

const extraArgs: string[] = [];

if (process.argv.includes('--fix')) extraArgs.push('--fix');

const biomeCommand = `${binPath} check --config-path ${biomeConfigFile} ${extraArgs.join(' ')} ${process.cwd()}`;

execSync(biomeCommand, {stdio: 'inherit'});