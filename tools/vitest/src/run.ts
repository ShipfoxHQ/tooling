#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {buildShellCommand, getProjectBinaryPath} from '@shipfox/tool-utils';

const binPath = getProjectBinaryPath('vitest', import.meta.url);

const command = buildShellCommand([binPath, 'run']);
execSync(command, {stdio: 'inherit'});
