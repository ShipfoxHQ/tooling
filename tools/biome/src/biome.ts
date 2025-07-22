#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {getProjectBinaryPath, getWorkspaceFilePath} from '@shipfox/tool-utils';

const binPath = getProjectBinaryPath('biome', import.meta.url);
const biomeConfigFile = getWorkspaceFilePath('biome.json');

const extraArgs: string[] = [];

if (process.argv.includes('--fix')) extraArgs.push('--fix');

const biomeCommand = `${binPath} check --config-path ${biomeConfigFile} ${extraArgs.join(' ')} ${process.cwd()}`;

execSync(biomeCommand, {stdio: 'inherit'});
