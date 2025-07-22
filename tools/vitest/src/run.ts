#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {getProjectBinaryPath} from '@shipfox/tool-utils';

const binPath = getProjectBinaryPath('vitest', import.meta.url);

execSync(`${binPath} run`, {stdio: 'inherit'});
