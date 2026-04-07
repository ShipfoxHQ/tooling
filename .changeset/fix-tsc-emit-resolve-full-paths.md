---
"@shipfox/typescript": patch
---

Fix tsc-emit to resolve full paths in tsc-alias

Add `resolveFullPaths: true` to the `replaceTscAliasPaths` call in `tsc-emit`. Without this flag, `tsc-alias` resolves baseUrl directory imports to `./path/to/dir` but omits the `/index.js` suffix, producing imports that fail under Node.js ESM (`ERR_UNSUPPORTED_DIR_IMPORT`).

The `build` task (via `@shipfox/swc`) already uses `resolveFullPaths: true`. Because `build` and `type` run concurrently in Turborepo and both invoke `tsc-alias` on the same `dist/` directory, the `type` task's invocation (without `resolveFullPaths`) can race and overwrite correctly resolved `.js` imports with partially resolved ones. This caused intermittent production crashes in the API container.
