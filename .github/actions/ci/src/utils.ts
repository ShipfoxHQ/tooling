import {type ExecSyncOptions, execSync} from 'node:child_process';

function escapeCommand(command: string) {
  return command.replace(/"/g, '\\"');
}

export const nixExecSync = (command: string, options?: ExecSyncOptions) =>
  execSync(`nix develop -c bash -c "${escapeCommand(command)}"`, {
    ...options,
    encoding: 'utf-8',
  });
