---
name: update-docs
description: Use when writing or updating anything under docs/ — an architecture decision record, a design note, an empirical constraint, a business rule, or an update to system-architecture.md or code-standards.md. Covers what is worth writing down versus changelog noise, which destination a given piece of knowledge belongs in, the ADR format, header and heading conventions, and the index row in .claude/CLAUDE.md that makes a doc findable. Triggered by any work with docs/, ADRs, architecture docs, design notes, or "document this".
---

# Documentation

`docs/` explains the **why** behind non-obvious choices. It is not a changelog, not a transcript, and not a restatement of what the code already says.

## Destinations

| Destination | What goes there | Naming |
| --- | --- | --- |
| `docs/system-architecture.md` | Static structure: planes, stack, layout, data model, integrations | edit in place |
| `docs/code-standards.md` | Project-wide TypeScript/tooling/language conventions | edit in place |
| `docs/adr/NNNN-<slug>.md` | A decision with a live alternative that was rejected | sequential number + kebab slug |
| `docs/specs/YYYY-MM-DD-<slug>-design.md` | Design specs (written in the main session during brainstorming) | dated |
| `docs/plans/YYYY-MM-DD-<slug>.md` | Implementation plans (written in the main session) | dated |
| `.claude/skills/<name>/SKILL.md` | A repeatable *how-to* an agent needs while working | — |

The last row is the most-missed routing rule. **If the knowledge tells someone how to do a recurring task, it is a skill, not a doc.** `docs/` is for decisions and structure; skills are for procedure. Writing a how-to into `docs/` buries it where no agent will load it.

Specs and plans are authored by the user in the main session. Do not write them from a subagent.

## Write it down when the work produced

- **A decision with a live alternative.** Something was chosen, something else rejected, and a reader would ask why. → an ADR.
- **A constraint found empirically.** A command that fails and why, an integration that cannot be exercised locally, a gate only the developer can clear. Costs a session to discover, nothing to record.
- **A footgun.** Code that looks correct, passes review, and is wrong *here* — like adding a foreign key to a table, or taking `id` from client input.
- **A business rule or product decision.** A threshold, an eligibility condition, an approval path, a scope cut. These are the first thing lost between sessions and the hardest to recover.

## Do not write

- A narration of what a session did.
- A restatement of `CLAUDE.md` or of a skill.
- Anything the code and `git log` already show. "Added `isBanned` to users" is a commit message, not a doc.
- Changelog entries for internal edits.
- Secrets, connection strings, API keys, `.env` values, or personal data — in any doc, ever, including as "example" values.

Test before writing: *would a competent engineer reading the code six months from now ask this question, and would the code fail to answer it?* If no, don't write it.

## ADR format

```markdown
# NNNN — <Decision, stated as the outcome>

- **Status:** Accepted | Superseded by [NNNN](./NNNN-slug.md) | Deprecated
- **Date:** YYYY-MM-DD
- **Context:** ...

## Context

The situation that forced a choice. Constraints, what was already true, what triggered it. Facts only.

## Decision

What was decided, in the present tense. "Soft-deleted rows are excluded via a partial index rather than a `deleted_at IS NULL` filter on every query."

## Alternatives considered

- **<Alternative>** — why it was rejected. One or two sentences.
- **<Alternative>** — why it was rejected.

An ADR with no rejected alternative is not an ADR. It is a note — put it in `system-architecture.md` instead.

## Consequences

What this makes easy, what it makes hard, and what a future change would have to unwind. Include the cost, not only the benefit.
```

Numbering: next unused four-digit number, zero-padded, never reused. A decision that reverses an earlier one gets a **new** ADR and marks the old one `Superseded by`. Never edit a decision out of history.

## Editing an existing doc

`system-architecture.md` and `code-standards.md` are living documents. When a change makes one of them wrong, fix it **in the same commit as the change** — a doc that describes the previous architecture is worse than no doc.

- Match the surrounding voice: declarative present tense, tables for enumerations, mermaid for structure.
- Update the mermaid diagrams when the structure they show changes. A stale diagram is read as current.
- Keep cross-references live. If you move content, fix every file that links to it.

## The index row

A doc nobody can find does not exist. After creating a new doc, add one row to the documentation table in `.claude/CLAUDE.md`:

```markdown
| `docs/adr/0003-soft-delete-partial-index.md` | Why soft-deleted rows are excluded via a partial index, not a per-query filter |
```

One line, path plus the question the doc answers. Never put the content in the index.

Check the table for **dangling rows** while you are there — a row pointing at a file that no longer exists is worse than a missing row, because it sends a reader looking.

## Voice

Write for a competent engineer who does not have this session's context.

- Present tense, declarative. "Migrations are generated, never hand-written."
- Name files and symbols exactly, in backticks.
- Prefer a table or a code block over a paragraph when the content is enumerable.
- No plan ids, phase numbers, audit labels, or finding codes — in docs, code comments, migration names, or commit messages. Explain the invariant, not the process that produced it.
- No hedging and no filler. If something is uncertain, say what is uncertain and why.

## Before reporting done

The transcript is not documentation. Anything the work discovered that ends the session living only in the conversation is lost. File it **before** reporting done, in the same commit as the change that caused it — not as a later pass.

## Related skills

- Commit and PR conventions → `git-workflow`
