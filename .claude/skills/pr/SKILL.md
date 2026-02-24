---
description: "ALWAYS use this skill when creating pull requests — never create a PR directly without it. Follows Shipfox conventions for PR titles, descriptions, and Linear ticket references. Trigger on any create PR, open PR, submit PR, make PR, push and create PR, or prepare changes for review task."
allowed-tools: Bash
---

# Create Pull Request

Create pull requests following Shipfox's engineering practices.

**Requires**: GitHub CLI (`gh`) authenticated and available.

## Prerequisites

Before creating a PR, ensure all changes are committed. If there are uncommitted changes, invoke the `/commit` skill first. Pass $ARGUMENTS through so it can use any ticket/hint provided.

```bash
# Check for uncommitted changes
git status --porcelain
```

## Process

### Step 1: Verify Branch State

```bash
# Check current branch, commits ahead of main, and remote sync status
git status
git log main..HEAD --oneline
```

Ensure:

- All changes are committed
- The branch is not `main` (PRs must come from a feature branch)
- Push the branch if not already on remote: `git push -u origin HEAD`

### Step 2: Check for Changeset

If any publishable package under `libs/` was modified, a changeset file must exist before opening the PR:

```bash
ls .changeset/*.md 2>/dev/null | grep -v README
```

If no changeset file exists, stop and instruct the user to run:

```bash
nix develop --command bash -c "pnpm changeset"
```

They should select the affected packages, choose `patch` / `minor` / `major`, and commit the generated `.changeset/*.md` file before proceeding.

### Step 3: Analyze Changes

```bash
# Full commit history diverging from main
git log main..HEAD

# Full diff
git diff main...HEAD
```

Understand the scope and purpose of all changes before writing the description.

### Step 4: Write the PR Description

Use this structure:

```markdown
<brief description of what the PR does>

<why these changes are being made - the motivation>

<alternative approaches considered, if any>

<any additional context reviewers need>
```

**Do include:**

- Clear explanation of the _why_, not just the _what_
- Linear ticket reference if one exists (see Issue References below)
- Notes on areas that need careful review

**Do NOT include:**

- "Test plan" sections
- Checkbox lists of testing steps
- Redundant summaries of the diff

### Step 5: Create the PR

```bash
gh pr create --title "<title>" --body "$(cat <<'EOF'
<description body here>
EOF
)"
```

Pass `--draft` if $ARGUMENTS contains `draft` or `--draft`.

## Title Format

- If the change is scoped to a specific package, prefix with the package name in square brackets: `[react-ui] Add button size variant`
- Otherwise use a short, business-level sentence: `Add size variant to Button component`
- Follow Google's "Writing good CL descriptions" guidelines: describe the change at a high level; say _what_ changed and _why_ in the title if it fits concisely.

## PR Description Examples

### Feature PR

```markdown
[react-ui] Add size variant to Button component

The design system needed xs and xl button sizes to cover new product
requirements. Introduces two new size tokens without touching existing
sm/md/lg behaviour.

Considered adding a custom className escape hatch instead, but explicit
variant tokens keep usage consistent and Storybook stories accurate.

Refs LINEAR-123
```

### Bug Fix PR

```markdown
[node-pg] Fix connection pool not releasing on query timeout

Pool connections were not returned on timeout errors, causing gradual
pool exhaustion under high load. Add a finally block to ensure release
in all code paths.

Fixes LINEAR-456
```

### Refactor PR

```markdown
[react-ui] Extract cn() utility into shared helpers

Duplicate class-merging logic existed across three components. Moves it
into a single shared helper. No behavior change.

Prepares for the design token migration in LINEAR-789.
```

## Issue References

Reference Linear tickets in the PR body:

| Syntax             | Effect                                   |
| ------------------ | ---------------------------------------- |
| `Fixes LINEAR-123` | Links and signals the ticket is resolved |
| `Refs LINEAR-123`  | Links without closing                    |

If a ticket is referenced in $ARGUMENTS or in the branch name, include the appropriate reference in the PR body.

## Guidelines

- **One PR per feature/fix** — don't bundle unrelated changes
- **Keep PRs small** — smaller PRs get faster, better reviews
- **Explain the why** — code shows what; the description explains why
- **Use draft PRs** for early feedback before the work is complete
- **Always include a changeset** for any PR that modifies a publishable package under `libs/`

## Editing Existing PRs

Use `gh api` to update a PR after creation (more reliable than `gh pr edit`):

```bash
# Update description
gh api -X PATCH repos/{owner}/{repo}/pulls/PR_NUMBER -f body="$(cat <<'EOF'
Updated description here
EOF
)"

# Update title
gh api -X PATCH repos/{owner}/{repo}/pulls/PR_NUMBER -f title='[scope] New title'

# Update both
gh api -X PATCH repos/{owner}/{repo}/pulls/PR_NUMBER \
  -f title='[scope] New title' \
  -f body='New description'
```
