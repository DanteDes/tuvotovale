---
name: git-workflow
description: Use when creating commits, branches, or pull requests in this project. Covers branch naming, commit message format, and PR creation via the gh CLI.
---

# Git Workflow

## Prerequisites

Verify `gh` is available before any PR work:

```bash
gh --version
```

If the command is not found, tell the user:

> `gh` CLI is not installed. Install it with `brew install gh` (macOS) or see https://cli.github.com, then authenticate with `gh auth login`.

---

## Branches

Branch off `develop` — this repo's default branch. Name branches using one of these prefixes:

| Prefix | When to use |
|--------|-------------|
| `feat/` | New feature |
| `fix/` | Bug fix |
| `chore/` | Tooling, deps, config |
| `docs/` | Documentation only |
| `refactor/` | Restructuring with no behavior change |
| `test/` | Test-only changes |

```bash
git checkout -b feat/short-description
```

Keep the slug short (3–5 words, kebab-case).

---

## Commits

One logical change per commit. Message format:

```
<type>: <what changed, imperative mood>
```

Commit messages are enforced by the `commit-msg` husky hook via `commitlint` (`@commitlint/config-conventional`). Valid types: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`.

```bash
git commit -m "$(cat <<'EOF'
feat: add unsaved-changes ping indicator to the vote form
EOF
)"
```

- Imperative mood: "add", "fix", "remove" — not "added" or "adding"
- Lowercase type, no trailing period
- Keep the subject under 72 characters (commitlint allows up to 100, but shorter is more readable)
- Stage specific files — avoid `git add .` unless every modified file belongs in the commit

---

## Pull Requests

Always push the branch first, then open the PR:

```bash
git push -u origin HEAD
```

Create the PR with a structured body:

```bash
gh pr create \
  --title "feat: short description" \
  --body "$(cat <<'EOF'
## Summary
<!-- One-paragraph description of the change and why it was made -->

## Changes
<!-- Bullet list of what was modified, added, or removed -->
EOF
)"
```

- `--title` must match the commit type prefix (`feat:`, `fix:`, etc.)
- Target branch defaults to `develop` — pass `--base <branch>` only when explicitly needed
- Do **not** push or open a PR without the user's confirmation first

---

## Checklist before opening a PR or committing

Run the project's quality gates (see **Quality Gates** in `.claude/CLAUDE.md`) and don't commit or open a PR on a failing one.

---

## Quick reference

```bash
# New branch
git checkout -b feat/my-feature

# Stage + commit
git add src/path/to/file.tsx
git commit -m "feat: describe the change"

# Push and open PR
git push -u origin HEAD
gh pr create --title "feat: describe the change" --body "..."

# Check PR status
gh pr status

# View open PRs
gh pr list
```
