---
name: code-review
description: Use before merging a branch, when auditing a completed plan end to end, or on any "review this" request. Defines how to scope a review from the diff, the review dimensions in priority order (correctness, contracts, conventions, performance, maintainability), the severity taxonomy, the required report format, what evidence a finding must carry, and what not to flag. Triggered by code review, PR review, quality gate, or plan-completion verification.
---

# Code Review

Every finding must name a **file:line** and a **concrete failure** — a reader should be able to disagree with you using evidence.

## 1. Scope the review from the diff

Never review "the codebase." Establish the exact change set first:

```bash
git status
git diff --stat                       # uncommitted work
git diff develop...HEAD --stat        # a feature branch
git diff develop...HEAD -- <path>     # narrowed
```

Then read the changed files **in full** — not just the hunks. A hunk hides its own context: the removed guard clause three lines above, the now-unused import, the sibling function that made the same assumption.

If a plan or spec file was named, read it before the code. The first question a task-level review answers is *did this implement what the plan said*, and the first question a plan-level review answers is *is every task in the plan actually done*.

## 2. Review dimensions, in priority order

Work down this list. A finding in an earlier dimension outranks a stylistic one every time.

### 1. Correctness

Does it do what the plan said? Trace the actual data path rather than reading intent from names. Look for: unhandled `undefined` from a query that returns `undefined` for a missing row, empty-array arguments to `inArray`/`.values()`, `Promise.all` that swallows a rejection path, `await` missing on a mutation, off-by-one in pagination offsets, state that resets or fails to reset when a dialog reopens.

### 2. Contracts

Did a public contract change without the change being the point? Query signatures, action inputs/outputs, exported component props, Zod schemas shared between an action and a form, `pgEnum` values, table columns. A changed contract with unupdated callers is Critical.

### 3. Conventions

Check against the skill or doc that owns the file type rather than against your taste:

| File | Owning reference |
| --- | --- |
| `actions.ts` | `next-safe-action` skill |
| `*.tsx` components, composition | `vercel-composition-patterns`, `vercel-react-best-practices` skills |
| Tailwind classes, shadcn components | `tailwind-v4-shadcn`, `shadcn` skills |
| `lib/db/**` (Drizzle) | `docs/code-standards.md` — no dedicated skill yet |
| App Router routes/pages | `docs/code-standards.md` — no dedicated skill yet |

Load the relevant ones before flagging a convention issue, and cite the rule. "This violates the hook ordering rule in `vercel-react-best-practices`" is a finding; "I'd order these differently" is noise.

Project-wide non-negotiables worth checking every time: no `any` (use `unknown`), no `process.env` outside `ENV_CONFIG`, no `db.query` outside `lib/db/queries/`, no deep relative imports, kebab-case filenames, no hand-written migrations, no `console.log`.

### 5. Performance

Real costs only: N+1 queries in a loop, a `findMany` with no `limit` on an unbounded table, a query fetching every column when three are used, `await`ing sequentially what could be one `Promise.all`, a `"use client"` boundary pushed so high it ships the page to the browser, a heavy import pulled into a client component.

### 6. Maintainability

Speculative abstraction (YAGNI), duplicated logic that already exists, a helper in `src/components/` that only one route uses, comment blocks where the codebase says none, a file past ~500 lines or a function past ~50.

## 3. Severity

| Severity | Meaning | Examples |
| --- | --- | --- |
| **Critical** | Ships a bug, a data leak, or breaks a contract. Blocks merge. | Missing ownership check on a delete/update, unupdated caller of a changed signature, secret in code |
| **High** | Wrong under a reachable input; silent failure. Blocks merge. | Unhandled `undefined`, missing error path, `any` hiding a real type mismatch, N+1 on a hot path |
| **Medium** | Correct today, costly later. Fix before merge if cheap. | Convention violation, duplicated logic, missing revalidation, unbounded query |
| **Low** | Preference-adjacent. Non-blocking. | Naming, ordering, a clearer alternative |

Report the count per severity. Do not inflate to look thorough — a review with three real Criticals and no Lows is a better review than one with fifteen findings.

## 4. Run the gates yourself

Do not take "tests pass" on faith from the implementer. Run the project's quality gates (see **Quality Gates** in `.claude/CLAUDE.md`) against the working tree and report what you actually observed.

If a gate fails, that is a Critical finding regardless of what the implementation report claimed.

## 5. Report format

```markdown
## Review: <what was reviewed>

**Scope:** <N files, from `git diff …`>
**Gates:** lint ✓ (0 errors) | format ✓ | build ✓
**Plan adherence:** <matches / deviates: what and whether it's justified>

### Critical (N)
1. `src/lib/db/queries/notes.ts:40` — delete filters on `id` only, no owner check.
   **Impact:** any authenticated user can delete another user's note by guessing a UUID.
   **Fix:** `and(eq(notes.id, id), eq(notes.createdByUserId, userId))`

### High (N)
…

### Medium (N)
…

### Low (N)
…

### What's good
<1–3 specific things — reinforces the patterns worth repeating>

**Verdict:** APPROVE | APPROVE_WITH_COMMENTS | REQUEST_CHANGES
```

`REQUEST_CHANGES` whenever there is a Critical or High. `APPROVE_WITH_COMMENTS` for Medium/Low only. `APPROVE` for a clean review — say so plainly instead of manufacturing a finding.

## 6. Plan-level review

When reviewing a whole implemented plan rather than one task, add:

- **Task completeness** — walk the plan's task list and mark each done / partial / missing, citing the file that satisfies it. A task nobody implemented is Critical.
- **Coherence across tasks** — the seams between tasks are where bugs live: a type one task introduced and another duplicated, two routes revalidating different paths for the same data, a query added in task 1 that task 4 made redundant.
- **Leftovers** — `TODO`/`FIXME` added by the work, dead code from a superseded approach, an unused export, a migration generated but never applied.
- **Documentation debt** — did the work produce an architectural decision, an empirical constraint, or a business rule that is not written down? Name it; the `docs-manager` agent handles writing it up.

## What not to flag

- Pre-existing issues in files the change did not touch. Note them once at the end as *out of scope*, do not itemize them.
- `src/components/ui/` — shadcn-generated, excluded from Biome, not hand-maintained.
- Style the formatter owns. Biome already ran; if it passes, spacing is not a finding.
- Missing tests where the repo has no test suite for that area — say "no coverage exists here" once, not per file.
- Rewrites of a decision the user already made. If you think a decision is wrong, state the trade-off and let them choose; do not report their choice as a defect.
- Speculative security concerns with no reachable path in this codebase. Name the actual failure mode or drop the finding.
