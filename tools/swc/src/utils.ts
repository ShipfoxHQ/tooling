import {type Stats, existsSync, readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import {readdir, rm, stat} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {isEqual} from 'date-fns';
import {replaceTscAliasPaths} from 'tsc-alias';

async function listFilesWithExtension(path: string, extensions: string[]) {
  if (!existsSync(path)) return [];
  const allFiles = await readdir(path, {recursive: true});
  return allFiles.filter((f) => extensions.some((e) => f.endsWith(e))).map((f) => join(path, f));
}

interface OwnedFileStat {
  file: string;
  stat: Stats;
}

function getFileStats(files: string[]): Promise<OwnedFileStat[]> {
  return Promise.all(files.map(async (f) => ({file: f, stat: await stat(f)})));
}

export async function getOwnedFileStats(outputPath: string): Promise<OwnedFileStat[]> {
  const ownedFiles = await listFilesWithExtension(outputPath, ['.js', '.js.map']);
  return getFileStats(ownedFiles);
}

function rmFiles(files: string[]): Promise<unknown[]> {
  return Promise.all(files.map((f) => rm(f, {force: true})));
}

export async function cleanup(
  outputPath: string,
  previousFiles: OwnedFileStat[],
): Promise<OwnedFileStat[]> {
  const currentFiles = await getOwnedFileStats(outputPath);

  const filesToDelete = previousFiles.filter((previous) => {
    const current = currentFiles.find((f) => f.file === previous.file);
    return !current || isEqual(current.stat.mtime, previous.stat.mtime);
  });
  await rmFiles(filesToDelete.map((f) => f.file));
  return currentFiles;
}

interface ReplaceTypescriptPathsOptions {
  tsConfigPath: string;
  outputPath: string;
}

function parseTsConfigCompilerOptions(configPath: string): Record<string, unknown> {
  const raw = readFileSync(configPath, 'utf-8')
    .replace(/\/\/[^\n]*/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const config = JSON.parse(raw);
  return config?.compilerOptions ?? {};
}

export async function replaceTypescriptPaths(options: ReplaceTypescriptPathsOptions) {
  const {tsConfigPath, outputPath} = options;
  const compilerOptions = parseTsConfigCompilerOptions(tsConfigPath);

  const hasBaseUrl = !!compilerOptions.baseUrl;
  const catchAll = compilerOptions.paths as Record<string, string[]> | undefined;
  const derivedBaseUrl =
    !hasBaseUrl && Array.isArray(catchAll?.['*'])
      ? catchAll['*'][0]?.match(/^\.\/(.+)\/\*$/)?.[1]
      : undefined;

  if (derivedBaseUrl) {
    const tempConfigPath = join(dirname(tsConfigPath), '.tsconfig-alias-temp.json');
    writeFileSync(tempConfigPath, JSON.stringify({extends: tsConfigPath, compilerOptions: {baseUrl: derivedBaseUrl}}));
    try {
      await replaceTscAliasPaths({configFile: tempConfigPath, outDir: outputPath, resolveFullPaths: true});
    } finally {
      unlinkSync(tempConfigPath);
    }
  } else {
    await replaceTscAliasPaths({configFile: tsConfigPath, outDir: outputPath, resolveFullPaths: true});
  }
}
