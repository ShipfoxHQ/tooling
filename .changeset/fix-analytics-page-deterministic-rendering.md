---
'@shipfox/react-ui': patch
---

Fix non-deterministic rendering in `AnalyticsPage`: replace `Math.random()` in `generateDurationData` with a deterministic sine-wave formula, and set `CountUp` initial value equal to its target to avoid animation flicker on first render.
