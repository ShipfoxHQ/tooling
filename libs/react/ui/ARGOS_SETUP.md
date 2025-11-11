# Argos CI Visual Testing Setup Guide

This document provides a comprehensive guide for setting up and using Argos CI for visual regression testing in the Shipfox UI library.

## Overview

Argos CI is integrated with your Storybook setup to automatically capture and compare visual snapshots of all UI components. This helps catch unintended visual regressions before they reach production.

## What's Been Integrated

### 1. Package Installation

- **@argos-ci/cli** (v3.2.1) - CLI tool for uploading screenshots to Argos

### 2. NPM Scripts

Added to `package.json`:

- `pnpm storybook:build` - Builds static Storybook site
- `pnpm argos` - Uploads Storybook build to Argos for visual comparison

### 3. Argos Configuration

Created `argos.config.ts` with the following settings:

- **buildDir**: `storybook-static` - Location of built Storybook
- **reference**: `main` - Base branch for comparisons
- **threshold**: `0` - Sensitivity for detecting changes (any pixel difference)
- **parallel uploads**: Enabled for faster processing

### 4. Turborepo Integration

Updated `turbo.json` with new tasks:

- `storybook:build` - Cached task for building Storybook
- `argos` - Task for uploading to Argos (depends on storybook:build)

### 5. GitHub Actions Workflow

Created `.github/workflows/argos.yml`:

- Runs on every pull request and push to main
- Builds Storybook automatically
- Uploads screenshots to Argos
- Compares with baseline from main branch

### 6. Git Configuration

Updated `.gitignore` to exclude:

- `storybook-static/` - Build output directory

## Initial Setup Steps

### 1. Create Argos Account

1. Visit [argos-ci.com](https://argos-ci.com/)
2. Sign up using your GitHub account
3. Install the Argos GitHub App on your repository

### 2. Connect Repository

1. In Argos dashboard, click "Add Project"
2. Select your GitHub repository: `shipfox/tooling`
3. Argos will automatically detect the Storybook build

### 3. Configure GitHub Secret

Add the Argos token to your GitHub repository:

1. Go to your GitHub repository settings
2. Navigate to **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Name: `ARGOS_TOKEN`
5. Value: Copy from Argos dashboard (Project Settings → Token)

### 4. Set Baseline

The first successful build on the `main` branch will become your baseline for comparisons.

## How It Works

### Automatic PR Checks

1. **Trigger**: When you open or update a pull request
2. **Build**: GitHub Actions builds Storybook
3. **Upload**: Screenshots are uploaded to Argos
4. **Compare**: Argos compares against the main branch baseline
5. **Report**: Results appear as a check in your PR

### Visual Diff Review

When changes are detected:

1. Click the Argos check in your PR
2. Review highlighted differences in the Argos dashboard
3. **Accept** changes if intentional
4. **Reject** changes if they're bugs
5. Add comments for discussion

## Local Development

### Build and Upload Locally

```bash
# From the UI library directory
cd libs/react/ui

# Build Storybook
pnpm storybook:build

# Upload to Argos (requires ARGOS_TOKEN env var)
export ARGOS_TOKEN=your-token-here
pnpm argos
```

### Preview Without Uploading

```bash
# Just build and serve locally
pnpm storybook:build
npx serve storybook-static
```

## Best Practices

### 1. Story Organization

- Keep stories focused and isolated
- Use consistent viewport sizes
- Avoid random data or timestamps in stories

### 2. Handling Dynamic Content

For content that changes (dates, random IDs, etc.):

```typescript
// In your story
export const Example: Story = {
  parameters: {
    // Mock dates for consistency
    date: new Date("2024-01-01"),
  },
}
```

### 3. Responsive Testing

Test different viewports:

```typescript
export const Responsive: Story = {
  parameters: {
    viewport: {
      viewports: {
        mobile: { width: 375, height: 667 },
        tablet: { width: 768, height: 1024 },
        desktop: { width: 1920, height: 1080 },
      },
    },
  },
}
```

### 4. Pseudo States

Use the pseudo-states addon for hover/focus states:

```typescript
export const Interactive: Story = {
  parameters: {
    pseudo: {
      hover: true,
      focus: true,
      active: true,
    },
  },
}
```

## Troubleshooting

### Upload Fails

**Problem**: `pnpm argos` fails with authentication error

**Solution**:

1. Verify `ARGOS_TOKEN` is set correctly
2. Check token permissions in Argos dashboard
3. Regenerate token if needed

### Missing Screenshots

**Problem**: Argos doesn't capture all stories

**Solution**:

1. Verify Storybook builds successfully: `pnpm storybook:build`
2. Check that all stories are exported properly
3. Review Argos logs for build errors

### Too Many Differences

**Problem**: Every PR shows hundreds of changes

**Solution**:

1. Update baseline: Merge a PR with accepted changes to main
2. Check for non-deterministic elements (animations, random data)
3. Adjust threshold in `argos.config.ts` if needed

## Configuration Options

### argos.config.ts

```typescript
const config = {
  // Directory containing Storybook build
  buildDir: "storybook-static",

  // Reference branch for comparisons
  reference: "main",

  // Sensitivity: 0 = detect any change, 1 = no changes
  threshold: 0,

  // Parallel upload settings
  parallel: {
    total: -1, // Auto-detect
    nonce: process.env.GITHUB_RUN_ID || Date.now().toString(),
  },

  // Ignore specific paths
  // ignore: ['**/internal/**', '**/experimental/**'],
}
```

## Integration with Development Workflow

### Pre-commit

Consider adding a pre-commit hook to build Storybook:

```bash
# .husky/pre-commit
pnpm turbo storybook:build --filter=@shipfox/react-ui
```

### PR Template

Add Argos checklist to PR template:

```markdown
## Visual Changes

- [ ] Reviewed Argos visual differences
- [ ] All intentional changes approved
- [ ] No unintended regressions detected
```

## Resources

- [Argos Documentation](https://argos-ci.com/docs)
- [Storybook Best Practices](https://storybook.js.org/docs/react/writing-stories/introduction)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
