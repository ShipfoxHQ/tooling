#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {log} from '@shipfox/tool-utils';
import {prepareOutDir} from './turbo';
import {makeTagLatest} from './utils';

async function run() {
  const args: string[] = [
    '--provenance=false',
    '--output',
    'type=image,oci-mediatypes=true,compression-level=1,compression=zstd',
  ];

  if (process.argv.includes('--setup-context')) {
    prepareOutDir();
    process.argv = process.argv.filter((arg) => arg !== '--setup-context');
  }

  let imageName: string | undefined;
  const tagArgIndex = process.argv.findIndex((arg) => arg === '--tag');
  if (tagArgIndex !== -1) {
    const tag = process.argv[tagArgIndex + 1];
    imageName = tag.split(':')[0];
    args.push('--tag', makeTagLatest(tag));
  }

  if (process.env.GITHUB_ACTION) {
    log.debug('Running in GitHub Action, setting up cache');
    const cacheFromParams = ['type=gha', 'url_v2=http://localhost:4854/'];
    const cacheToParams = [
      'type=gha',
      'url_v2=http://localhost:4854/',
      'mode=max',
      'ignore-error=true',
    ];
    if (imageName) {
      cacheFromParams.push(`scope=${imageName}-${process.env.BUILD_ARCH}`);
      cacheToParams.push(`scope=${imageName}-${process.env.BUILD_ARCH}`);
    }
    args.push('--cache-from', cacheFromParams.join(','));
    args.push('--cache-to', cacheToParams.join(','));
  }

  if (process.env.NODE_VERSION) {
    args.push(`--build-arg=NODE_VERSION=${process.env.NODE_VERSION}`);
  }
  if (process.env.PNPM_VERSION) {
    args.push(`--build-arg=PNPM_VERSION=${process.env.PNPM_VERSION}`);
  }

  if (process.argv.length > 2) args.push(...process.argv.slice(2));

  const command = `docker buildx build ${args.join(' ')} .`;
  log.info(command);
  execSync(command, {stdio: 'inherit'});
}

run().catch((error) => {
  log.error(error);
  process.exit(1);
});
