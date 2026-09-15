# Primary Workflow

**Orchestrator (the top-level session talking to the user): do not implement.** Decide what needs
to happen, route work to the sub-agent whose description best fits it (`general-purpose` as
fallback), and review the evidence that comes back. A sub-agent reading this file is not the
orchestrator — it does the work it was routed to do, and does not re-delegate.

**Exception — who does the work:** the orchestrator implements directly when delegating would cost
more than the change is worth — a one-line edit, a config value, a typo, a path correction — and
only while it touches a single file, needs no skill loaded, and needs no build or test to verify
it. Lose any one of those and it goes to a sub-agent, however small it looked. When in doubt,
delegate.

Superpowers owns the pipeline: `brainstorming` → `writing-plans` → `subagent-driven-development` →
`finishing-a-development-branch`. This file pins only the decisions those skills leave open, plus
one declared override in Integration, below.

## Isolation

A separate axis from the Exception above: that decided *who* does the work, this decides *where* —
once you know who, match the isolation to the size of the work.

- **Work in place** for small, self-contained changes — one file, a config or doc edit, a focused
  bug fix. A worktree costs more setup than the change is worth.
- **Use a worktree** (`superpowers:using-git-worktrees`) for a plan with more than one task, work
  spanning several files, or anything long enough that stopping halfway leaves the branch
  unreviewable — always, if the user's checkout already holds uncommitted work of their own.

`subagent-driven-development` requires an isolated workspace for plan execution, so that case is
already decided whenever a plan is in play.

## Integration

`superpowers:finishing-a-development-branch` owns the completion menu — present it exactly as
written and let the user choose.

One addition, for **option 1 (merge back locally)** only. Before merging, ask:

> Preserve the commits, or land the change unstaged so you can read the diff before committing?

**Preserve commits** — run the skill's option 1 unchanged.

**Unstaged diff** — apply the cumulative change to the base branch without committing:

```bash
git merge --squash <feature-branch>
git reset                                                 # unstage everything
git ls-files --others --exclude-standard -z | xargs -0 -r git add -N
git diff                                                  # what the user reviews
```

`add -N` is not optional: without it, files the work created stay untracked and `git diff`
silently omits them. Scope it to untracked paths as shown — a bare `git add -N .` stages
deletions too, splitting the change across staged and unstaged.

Then stop: do not commit, and — if this branch is in its own worktree — do not delete the branch
or remove the worktree. Until the user commits, the change exists only as working-tree edits plus
that branch's history.

## Handling sub-agent output

When a sub-agent's output (review, audit, test failure, debugging finding) conflicts with a
decision already verified or accepted, apply `review-audit-self-decision.md` before acting on it
or presenting it as fact.

When a sub-agent comes back blocked or short on context, change the context, scope, or approach —
don't re-dispatch the same prompt unchanged.