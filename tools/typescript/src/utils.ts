import {writeFileSync, unlinkSync} from 'node:fs';
import {readdir, rm} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {sys, parseJsonConfigFileContent, readConfigFile} from 'typescript';
import {replaceTscAliasPaths} from 'tsc-alias';

const tsExtensionRegex = /\.tsx?/;

export async function cleanup(tsConfigPath: string) {
  const configStr = readConfigFile(tsConfigPath, sys.readFile);
  const config = parseJsonConfigFileContent(configStr.config, sys, dirname(tsConfigPath));
  const {outDir, rootDir} = config.options;
  if (!outDir) throw new Error('TS config is missing outDir');
  if (!rootDir) throw new Error('TS config is missing rootDir');

  const filesInOutput = await readdir(outDir, {recursive: true});
  const tsFilesInOutput = filesInOutput
    .filter((f) => f.endsWith('d.ts') || f.endsWith('d.ts.map'))
    .map((f) => join(outDir, f));

  const expectedTsTilesInOutput = config.fileNames
    .map((f) => f.replace(rootDir, outDir))
    .map((f) => f.replace(tsExtensionRegex, '.d.ts'))
    .flatMap((f) => [f, `${f}.map`]);

  const filesToDelete = tsFilesInOutput.filter((f) => !expectedTsTilesInOutput.includes(f));
  await Promise.all(filesToDelete.map((f) => rm(f, {force: true})));
}

export async function replacePathAliases(configFile: string, outDir: string) {
  const configStr = readConfigFile(configFile, sys.readFile);
  const compilerOptions = configStr.config?.compilerOptions ?? {};

  const hasBaseUrl = !!compilerOptions.baseUrl;
  const catchAll = compilerOptions.paths?.['*'];
  const derivedBaseUrl =
    !hasBaseUrl && Array.isArray(catchAll)
      ? (catchAll[0] as string)?.match(/^\.\/(.+)\/\*$/)?.[1]
      : undefined;

  if (derivedBaseUrl) {
    const tempConfigPath = join(dirname(configFile), '.tsconfig-alias-temp.json');
    writeFileSync(tempConfigPath, JSON.stringify({extends: configFile, compilerOptions: {baseUrl: derivedBaseUrl}}));
    try {
      await replaceTscAliasPaths({configFile: tempConfigPath, outDir, resolveFullPaths: true});
    } finally {
      unlinkSync(tempConfigPath);
    }
  } else {
    await replaceTscAliasPaths({configFile, outDir, resolveFullPaths: true});
  }
}
