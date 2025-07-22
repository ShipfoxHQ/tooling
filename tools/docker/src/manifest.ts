#! /usr/bin/env node

import {execSync} from 'node:child_process';
import {log} from '@shipfox/tool-utils';
import {makeTagLatest} from './utils';

function imageExists(image: string): boolean {
  try {
    execSync(`docker manifest inspect ${image}`, {stdio: 'inherit'});
    return true;
  } catch (_) {
    return false;
  }
}

interface CreateManifestOptions {
  manifest: string;
  platformImages: string[];
}

function createManifest({manifest, platformImages}: CreateManifestOptions) {
  execSync(`docker manifest create ${manifest} ${platformImages.join(' ')}`, {stdio: 'inherit'});
  execSync(`docker manifest push ${manifest}`, {stdio: 'inherit'});
}

if (process.argv.length !== 3)
  throw new Error(
    'docker-manifest command requires exactly one argument, which is the name of the target image',
  );

const manifest = process.argv[2];
const platformImages = ['arm64', 'amd64'].map((platform) => `${manifest}-${platform}`);
const platformExists = platformImages.map(imageExists);
if (platformExists.some((exists) => !exists)) {
  log.info(
    `Some platform image is missing for ${manifest}, skipping multi platform manifest creation`,
  );
  process.exit(0);
}

createManifest({manifest, platformImages});
createManifest({manifest: makeTagLatest(manifest), platformImages});
