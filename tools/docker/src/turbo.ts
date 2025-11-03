import {execSync} from 'node:child_process';
import {cpSync, existsSync, readdirSync, rmSync, statSync} from 'node:fs';
import {dirname, join, relative} from 'node:path';
import {
  buildShellCommand,
  getProjectFilePath,
  getWorkspaceBinaryPath,
  getWorkspaceRootPath,
} from '@shipfox/tool-utils';

export function prepareOutDir() {
  const contextPath = getProjectFilePath('out');
  rmSync(contextPath, {recursive: true, force: true});

  const turboBin = getWorkspaceBinaryPath('turbo');

  const command = buildShellCommand([
    turboBin,
    'prune',
    '--docker',
    '--out-dir',
    contextPath,
    process.env.npm_package_name as string,
  ]);
  execSync(command, {stdio: 'inherit'});

  addDistToDir(join(contextPath, 'full'));
}

function findPackageJsonFiles(dir: string): string[] {
  let results: string[] = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    if (stat?.isDirectory()) {
      results = results.concat(findPackageJsonFiles(filePath));
    } else if (file === 'package.json') {
      results.push(filePath);
    }
  }
  return results;
}

function addDistToDir(dir: string) {
  const packages = findPackageJsonFiles(dir);
  const workspaceRoot = getWorkspaceRootPath();

  for (const targetPackage of packages) {
    const packageRelativePath = relative(dir, dirname(targetPackage));
    const source = join(workspaceRoot, packageRelativePath, 'dist');
    const dest = join(dir, packageRelativePath, 'dist');
    if (!existsSync(source)) continue;
    cpSync(source, dest, {recursive: true});
  }
}
