# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is

Shipfox Tooling is the **shared library and tooling monorepo** for the Shipfox platform. It publishes npm packages consumed by the main Shipfox application and other internal services. It contains:

- **Node libraries** — wrappers around infrastructure clients (PostgreSQL, Redis, ClickHouse, OpenTelemetry, feature flags, logging)
- **Common libraries** — framework-agnostic utilities (config, query parser)
- **React UI** — Shipfox design system component library (Radix UI + TailwindCSS + Storybook)
- **Tools** — shared build, lint, type-check, and test configurations used across all Shipfox repos

## Local Environment

All tooling is standardized with **Nix** (defined in `flake.nix`). Every command must be run through Nix:

```bash
nix develop --command bash -c "<command>"
```

## Commands

All tasks run through **Turborepo** (`pnpm turbo`) and must be wrapped with `nix develop`:

```bash
nix develop --command bash -c "pnpm turbo build"   # Compile/transpile all packages
nix develop --command bash -c "pnpm turbo test"    # Run unit tests
nix develop --command bash -c "pnpm turbo check"   # Lint and format (Biome)
nix develop --command bash -c "pnpm turbo type"    # TypeScript type checking
nix develop --command bash -c "pnpm turbo dev"     # Run packages in dev/watch mode
```

Before committing, always ensure `build`, `test`, and `check` pass.

### Filtering to a single package

```bash
nix develop --command bash -c "pnpm turbo test --filter @shipfox/<package-name>"
# e.g.:
nix develop --command bash -c "pnpm turbo test --filter @shipfox/node-pg"
nix develop --command bash -c "pnpm turbo build --filter @shipfox/react-ui"
```

## Monorepo Architecture

This is a **pnpm + Turborepo** monorepo. Packages are thin, focused wrappers or utilities that are versioned and published independently via Changesets.

```
libs/
│  common/        # Framework-agnostic shared libraries
│  │  config/         # @shipfox/config — envalid-based config management
│  │  shipql-parser/  # @shipfox/shipql-parser — PEG grammar query parser
│  node/          # Node.js infrastructure client wrappers
│  │  clickhouse/     # @shipfox/node-clickhouse
│  │  feature-flag/   # @shipfox/node-feature-flag — LaunchDarkly integration
│  │  log/            # @shipfox/node-log — Pino logging abstraction
│  │  opentelemetry/  # @shipfox/node-opentelemetry — OTel instrumentation
│  │  pg/             # @shipfox/node-pg — PostgreSQL wrapper
│  │  redis/          # @shipfox/node-redis — ioredis wrapper
│  react/         # React component libraries
│     ui/             # @shipfox/react-ui — Design system (Radix UI + TailwindCSS)
tools/            # Shared build/lint/test configuration packages
│  biome/             # @shipfox/biome — Biome CLI wrapper
│  docker/            # @shipfox/docker — Docker build utilities
│  skopeo/            # @shipfox/skopeo — Container image copy utilities
│  swc/               # @shipfox/swc — SWC transpiler wrapper
│  ts-config/         # @shipfox/ts-config — Base TypeScript configurations
│  typescript/        # @shipfox/typescript — tsc-check / tsc-emit CLI wrappers
│  vite/              # @shipfox/vite — Vite build wrapper
│  vitest/            # @shipfox/vitest — Vitest runner wrapper (vitest-run CLI)
│  tool-utils/        # @shipfox/tool-utils — Shared utilities for tools
.github/
│  actions/       # Composite GitHub Actions (ci, nix, pnpm)
│  workflows/     # CI and publish workflows
```

## Package Structure

Every library package follows this standard layout:

```
src/
  index.ts        # Public API barrel export
dist/             # Compiled output (SWC → ESM), generated — never edit
tsconfig.json     # References build + test configs
tsconfig.build.json
tsconfig.test.json
package.json
```

**Standard scripts per package:**

```json
{
  "build": "swc ...",        // SWC transpilation via @shipfox/swc
  "check": "biome-check",   // Biome lint + format via @shipfox/biome
  "type": "tsc-emit",       // Type check + declaration emit via @shipfox/typescript
  "test": "vitest-run"      // Run tests via @shipfox/vitest
}
```

## TypeScript Configuration

All packages extend the base config from `@shipfox/ts-config`:

```json
{
  "extends": "@shipfox/ts-config/tsconfig.json"
}
```

Key settings (do not override unless necessary):
- `target`: ESNext, `module`: ESNext, `moduleResolution`: bundler
- Strict mode enabled
- Source maps and declaration files enabled

Packages use **three tsconfig files**: `tsconfig.json` (references), `tsconfig.build.json` (production), `tsconfig.test.json` (test-only includes).

## Testing

Tests use **Vitest** via the `@shipfox/vitest` wrapper. Run with `vitest-run` (the wrapper binary).

Node library tests are typically unit tests against real clients where possible (e.g. `node-pg` tests against a real PostgreSQL instance).

React UI tests use **Playwright** (`@vitest/browser-playwright`) and **Testing Library**.

### Test structure — Arrange / Act / Assert

```typescript
it('returns the parsed config value', () => {
  const env = { PORT: '3000' };

  const config = parseConfig(env);

  expect(config.port).toBe(3000);
});
```

Keep a blank line between each phase. Never interleave assertions with setup.

## React UI (`@shipfox/react-ui`)

The component library has additional tooling:

```bash
# Start Storybook development server
nix develop --command bash -c "pnpm --filter @shipfox/react-ui storybook"

# Build Storybook static site
nix develop --command bash -c "pnpm turbo storybook:build --filter @shipfox/react-ui"

# Upload to Argos CI for visual regression testing
nix develop --command bash -c "pnpm turbo argos --filter @shipfox/react-ui"
```

Components use **Radix UI** primitives, **TailwindCSS 4** for styling, and **Tailwind Merge** for class composition. Use `cn()` utility for conditional class merging.

## Versioning & Publishing

Packages are versioned with **Changesets**. Never manually bump `package.json` versions.

### Adding a changeset (before opening a PR)

```bash
nix develop --command bash -c "pnpm changeset"
```

Select the affected packages, choose `patch` / `minor` / `major`, and write a short description. Commit the generated `.changeset/*.md` file with your PR.

### Publishing (CI-automated, manual trigger available)

Publishing runs via `.github/workflows/publish-packages.yaml`:
1. `pnpm changeset version` — bumps package versions from pending changesets
2. `pnpm turbo check -- --fix` — auto-formats the version bump
3. `pnpm turbo build --affected` — builds only changed packages
4. `pnpm changeset publish` — publishes to npm

Do **not** run `publish` locally. Trigger the workflow via GitHub Actions UI if needed.

## Linting & Formatting

**Biome** (`biome.json` at the root) handles both linting and formatting:

```bash
# Check (read-only)
nix develop --command bash -c "pnpm turbo check"

# Auto-fix
nix develop --command bash -c "pnpm turbo check -- --fix"
```

Key rules enforced: no `console.*`, proper `await` usage, no unused imports/variables (errors), arrow functions, single quotes.

## Tech Stack

**Node Libraries:** Node.js 22, TypeScript ~5.9, pg, ioredis, ClickHouse client, Pino, LaunchDarkly, OpenTelemetry SDK

**React UI:** React 19, Radix UI, TailwindCSS 4, Framer Motion, Storybook 10, Argos CI, TanStack Table, Recharts, Zod, React Hook Form

**Tooling:** Biome 2.x (lint + format), Vitest 4.x (tests), SWC (transpiler), pnpm 9, Turborepo 2, Changesets (versioning), Nix (environment)

## Git Workflow

- Base branch: `main`. Trunk-based development with short-lived branches and small changes.
- Commit messages: short sentences describing the change at a high level. No `Co-authored-by` trailers.
- PR titles: reflect the business-level change. If scoped to a package, prefix with `[package-name]`.
- Always include a changeset file in PRs that touch publishable packages.
- Use `gh` CLI for opening PRs.
