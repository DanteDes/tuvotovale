# Project Documentation Management

## When To Update Docs

Update docs only when the change affects user-visible behavior, setup, commands, architecture,
security posture, public contracts, or future maintainer decisions. Do not add changelog noise for
purely internal edits unless the repo already requires it.

**The test, before any of the categories below: a document stays if it changes a technical
decision. If it reports status, dates or owners, it belongs on the board.** That rules out phase
ladders, blocked registers, meeting minutes, delivery plans and progress notes, however carefully
written. Nothing in `docs/` exists to record that work happened. When in doubt, ask what a reader
would do differently having read it; if the answer is nothing, it is not a document.

Write it down when the work produced any of these, all of them easy to lose:

- **A decision with a live alternative** — something was chosen, something else rejected, and a
  reader would ask why. → an ADR.
- **Constraints found empirically** — a command that fails and why, an integration that cannot be
  exercised locally, a gate only the developer can clear. Costs a session to find, nothing to record.
- **Footguns** — code that looks correct, passes review, and is wrong here. → `docs/code-standards.md`.
- **A business rule or product decision** — a threshold, an eligibility or exclusion condition,
  a disposition, an approval path, a scope cut. `review-audit-self-decision.md` keeps these from
  being reversed mid-session; only a doc keeps them past it.

Do not narrate what a session did or explain what the code and git history already show. 
The transcript is not documentation: anything above that ends the task living only in
the conversation is lost, so file it before reporting done — in the same commit as the change
that caused it, not as a later pass.

## Writing It

Open with a two-column header table carrying at least **Purpose** and **Date**; add **Status**,
**Source**, **Owners** or **Verified on** when they earn their place. Add the index row that makes the
doc findable.

**Correct a wrong sentence in place, and leave no record of the correction.** A document should
read as though it had been right the first time. Do not leave a new claim beside a stale one, and
do not add a banner, a dated note or a paragraph explaining what the file used to say: that
narration is what a reader has to wade through before reaching the thing they came for, and it
accumulates faster than the content does. Fold the correction in and stop. ADRs have their own
rule, in the `update-docs` skill.