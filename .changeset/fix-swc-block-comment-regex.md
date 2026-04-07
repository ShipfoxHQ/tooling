---
"@shipfox/swc": patch
---

Fix tsconfig parser corrupting glob patterns

The block comment regex used to strip `/* ... */` from tsconfig JSON
incorrectly matched `/*` inside `"./src/*"` and `*/` inside `"**/*.test.tsx"`,
eating everything in between and producing invalid JSON. Replaced with a
line-anchored `//` comment stripper that cannot match inside string values.
