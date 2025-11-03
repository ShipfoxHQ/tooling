#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {getProjectBinaryPath} from '@shipfox/tool-utils';

const binPath = getProjectBinaryPath('vite', import.meta.url);

execSync(`'${binPath}' build --outDir dist`, {stdio: 'inherit'});
