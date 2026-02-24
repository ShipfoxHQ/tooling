---
description: Create a GitHub pull request following the project's PR conventions
allowed-tools: Bash
---

Create a GitHub pull request using the `gh` CLI following the project's conventions.

Steps:

1. Run `git status` to check whether the working tree is clean.
2. If there are uncommitted changes, invoke the `/commit` skill before proceeding. Pass $ARGUMENTS through so it can use any ticket/hint provided.
3. Run `git log main..HEAD` and `git diff main...HEAD` to understand what the PR contains.
4. Check that a changeset file exists (`.changeset/*.md`) if any publishable package under `libs/` was modified. If one is missing, stop and ask the user to run `pnpm changeset` before opening the PR.
5. Push the current branch to origin if not already pushed (`git push -u origin HEAD`).
6. Draft the PR using these rules:
   - **Title:** short, business-level description of what the PR does. If the change is scoped to a specific package, prefix with the package name in square brackets (e.g. `[react-ui] Add button size variant`). Follow Google's "Writing good CL descriptions" guidelines.
   - **Description:** explain _why_ the change is being made, not just _what_ changed. Include context, motivation, and any trade-offs. If a Linear ticket is referenced in $ARGUMENTS or the branch name, link it in the description.
   - **Test plan:** bullet list of how the change was tested.
7. Create the PR with `gh pr create` and return the PR URL. Pass `--draft` if $ARGUMENTS contains `draft` or `--draft`.

If $ARGUMENTS is provided, treat it as a hint for the PR title/description or a Linear ticket reference. The word `draft` (or the flag `--draft`) is reserved to control draft status and should not be used as part of the title or description.
