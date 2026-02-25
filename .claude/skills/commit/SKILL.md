---
description: Commit staged changes following the project's git conventions
allowed-tools: Bash
---

# Commit Changes

Commit staged changes (or all modified files if nothing is staged) following Shipfox's engineering practices.

## Prerequisites

Before committing, check the current branch:

```bash
git branch --show-current
```

**If you're on `main`, you MUST create a feature branch first** — do not ask for confirmation, default to creating the branch.

Derive a short, kebab-case branch name from the intent of the changes. If a Linear ticket is in $ARGUMENTS or inferrable from context, prefix with it:

```bash
# With a ticket reference
git checkout -b fox-123-add-button-variant

# Without a ticket reference
git checkout -b add-button-variant
```

## Process

### Step 1: Understand the Changes

```bash
git status
git diff
git diff --cached
```

Review what is staged vs. unstaged. Stage the appropriate files if nothing is already staged.

### Step 2: Run Conformity Checks

Run all three checks via Nix **before** committing. If any fails, stop and report the error — do not commit:

```bash
nix develop --command bash -c "pnpm turbo build --filter ...[HEAD]"
nix develop --command bash -c "pnpm turbo test --filter ...[HEAD]"
nix develop --command bash -c "pnpm turbo check --filter ...[HEAD]"
```

### Step 3: Write the Commit Message

**Format:**

```
<subject>

<body>

<footer>
```

Only the subject is required. Add a body when the change needs context beyond what the subject conveys. Add a footer to reference Linear tickets.

**Subject line rules:**

- Short sentence describing the change at a high level from a business/product perspective
- Use imperative mood: "Add button size variant" not "Added…"
- Maximum ~70 characters
- No period at the end
- Never includes a `Co-authored-by` or `Co-Authored-By` trailer

**Body guidelines:**

- Explain **what** and **why**, not how
- Include motivation for the change
- Contrast with previous behavior when relevant

**Footer — Linear ticket references:**

```
Fixes LINEAR-123   # links and signals the ticket is resolved
Refs LINEAR-123    # links without closing
```

### Step 4: Create the Commit

```bash
git commit -m "$(cat <<'EOF'
Subject line here

Optional body explaining why.

Refs LINEAR-123
EOF
)"
```

If $ARGUMENTS is provided, use it as guidance for the commit message and branch name. Otherwise infer from the diff.

## Examples

### Simple fix

```
Fix tooltip shadow not rendering on Safari

The shadow-tooltip class relies on a drop-shadow filter that was missing
a webkit prefix. Add the prefixed variant to the TailwindCSS config.

Fixes LINEAR-456
```

### Feature

```
Add size variant to Button component

Introduces xs and xl sizes to cover new design requirements across the
product. Existing sm/md/lg sizes are unchanged.

Refs LINEAR-123
```

### Refactor (no ticket needed)

```
Extract cn() utility into shared helpers

Duplicate class-merging logic existed in three components. No behavior
change.
```

## Principles

- Each commit should be a single, stable change
- The repository should be in a working state after each commit
- Commits should be independently reviewable
