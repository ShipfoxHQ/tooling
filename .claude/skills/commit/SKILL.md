---
description: Commit staged changes following the project's git conventions
allowed-tools: Bash
---

Commit staged changes (or all modified files if nothing is staged) following the project's git conventions.

Steps:

1. Run `git status`, `git branch --show-current`, and `git diff` to understand what changed.
2. If the current branch is `main`, create and switch to a new branch before proceeding:
   - Derive a short, kebab-case branch name from the intent of the changes (and the Linear ticket in $ARGUMENTS if provided, e.g. `fox-123-add-button-variant`).
   - Run `git checkout -b <branch-name>`.
3. Run the three conformity checks via Nix **before** committing. If any fails, stop and report the error — do not commit:
   - `nix develop --command bash -c "pnpm turbo build --filter ...[HEAD]"`
   - `nix develop --command bash -c "pnpm turbo test --filter ...[HEAD]"`
   - `nix develop --command bash -c "pnpm turbo check --filter ...[HEAD]"`
4. Check whether a changeset is needed:
   - If any publishable package under `libs/` was modified and no `.changeset/*.md` file exists for this change, run `nix develop --command bash -c "pnpm changeset"`, select the affected packages, choose the appropriate semver bump, and commit the generated changeset file alongside the code changes.
5. Stage the appropriate files if nothing is already staged.
6. Write a commit message that:
   - Is a short sentence describing the change at a high level from a business/product point of view.
   - Uses the imperative mood (e.g. "Add button size variant", not "Added…").
   - Never includes a `Co-authored-by` or `Co-Authored-By` trailer.
7. Create the commit.

If $ARGUMENTS is provided, use it as guidance for the commit message. Otherwise infer the message from the diff.
