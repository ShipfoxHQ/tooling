---
"@shipfox/swc": patch
"@shipfox/typescript": patch
---

Support wildcard paths as baseUrl substitute in tsc-alias

When a tsconfig uses `"*": ["./src/*"]` in paths instead of `baseUrl` (the TypeScript 6
migration pattern), the build and type tools now derive the effective baseUrl from that
entry and pass it to tsc-alias via a temporary config. This ensures bare intra-package
imports are resolved to their correct output paths in both tools.
