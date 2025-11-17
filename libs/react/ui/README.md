# Shipfox Design System

The Shipfox Design System is the core of the [Shipfox](https://www.shipfox.io/) UI grammar. It contains all the React components which are the building blocks of our front-end projects.

## Installation

### Installation

```bash
pnpm add @shipfox/react-ui
# or
yarn add @shipfox/react-ui
# or
npm install @shipfox/react-ui
```

### CSS Styles

This package includes a pre-built, minified CSS bundle with all Tailwind CSS styles and design tokens. Import it in your application:

```typescript
import "@shipfox/react-ui/dist/styles.css"
```

Or in your HTML:

```html
<link rel="stylesheet" href="node_modules/@shipfox/react-ui/dist/styles.css" />
```

The CSS bundle is self-contained and includes all design tokens, so you don't need to configure Tailwind CSS in your consuming project.

## Storybook

The storybook is [publicly accessible online](https://react-ui.shipfox.vercel.app).

You can also launch it locally by running `pnpm storybook` from within this package's directory.

## Visual Testing with Argos

This library uses [Argos](https://argos-ci.com/) for automated visual regression testing. Argos captures screenshots of all Storybook stories and compares them across pull requests to detect unintended visual changes.

### How it works

1. On every pull request, GitHub Actions builds Storybook and uploads screenshots to Argos
2. Argos compares the screenshots with the baseline from the main branch
3. If visual differences are detected, they are highlighted in the Argos dashboard
4. Reviewers can approve or reject changes directly from the PR

### Running Argos locally

To upload screenshots to Argos from your local machine:

```bash
# Build Storybook
pnpm storybook:build

# Upload to Argos (requires ARGOS_TOKEN environment variable)
pnpm argos
```

### Configuration

Argos configuration is located in `argos.config.ts`. You can customize:

- Screenshot capture settings
- Ignored patterns
- Comparison threshold
- Reference branch

### Setting up Argos

1. Create an account on [Argos](https://argos-ci.com/)
2. Connect your GitHub repository
3. Add the `ARGOS_TOKEN` secret to your GitHub repository settings
4. Argos will automatically run on all pull requests
