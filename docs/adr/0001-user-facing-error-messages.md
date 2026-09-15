# 0001 — Only `AppError` messages reach the user; everything else stays masked

- **Status:** Accepted
- **Date:** 2026-09-14
- **Context:** Server action error handling

## Context

`handleServerError` in `src/lib/safe-action.ts` is passed to every `next-safe-action` client, so
every server action funnels its errors through it. Outside development it replaces the thrown
message with a generic string:

```ts
if (process.env.NODE_ENV === "development") return error.message;
return "Ocurrió un error al procesar la solicitud.";
```

The masking is correct in itself. A raw `Error` can carry a Postgres constraint dump, a driver
message, a connection string fragment, a file path, or an upstream API's response body — MercadoPago's,
for instance — and none of that belongs on a user's screen.

The problem is that a blanket guard cannot tell an intentional message from an accidental one, so it
has to assume the worst about all of them. A message written in Spanish for a voter to read is
indistinguishable, at the point of masking, from a driver dump. Without a way to express that
difference, either every message leaks or none of them arrive.

## Decision

`src/lib/errors.ts` defines an `AppError` base class carrying a `code`, plus six subclasses.
**A message reaches the user if, and only if, it was thrown as an `AppError`.** Everything else is
masked in production.

Exposure is therefore opt-in. Adding a plain `throw new Error(...)` anywhere — in our code, in a
helper, in a dependency — cannot leak, because leaking requires importing a class and naming a
category.

### Choosing a class

| Throw | When |
| --- | --- |
| `NotFoundError` | The resource does not exist, or does not belong to the caller |
| `ForbiddenError` | The session or role does not permit the action |
| `ConflictError` | The request collides with existing state: a duplicate slug, a dependent record, a closed or wrong-state row |
| `LimitReachedError` | A product cap was hit |
| `InvalidInputError` | Well-formed for Zod but invalid as business data: a mismatched id set, a wrong format, a value outside an allowed range |
| `OperationFailedError` | A downstream write or call failed and retrying may work |
| plain `Error` | Everything else — see below |

Keep a plain `Error` when the message is **not for a user**:

- **A broken internal invariant.** Misconfigured seed data or a constant that contradicts the schema
  means our code is wrong, the user can do nothing about it, and it must stay masked.
- **Anything interpolating an internal identifier** — a table, column, constraint, environment
  variable, payment-provider reference, or an upstream service's raw response.
- **A programmer error**, including React context guards (`"useX must be used within XProvider"`).
  These signal a broken component tree, not a user mistake.

### Where the mechanism applies

The guard sits in `handleServerError`, so it only sees errors that propagate out of a **server
action**. Two consequences that are easy to get wrong:

- **Query-layer throws do participate.** An `AppError` thrown in `src/lib/db/queries/` surfaces
  correctly, as long as a server action is what called it.
- **Client-side throws do not.** A `throw` inside a component's own `fetch` flow is caught by that
  component's `try/catch` and shown with a toast; it never touches `handleServerError`. Converting
  those to `AppError` buys nothing.

### Field-scoped errors use a different mechanism

An `AppError` becomes a `serverError` string, which the client turns into a toast. That is the right
shape for "no se pudo registrar el voto" and the wrong shape for "ese slug ya existe" — the second
belongs under the input the user just typed into.

For those, use `returnValidationErrors`, which bypasses `handleServerError` and arrives as
`validationErrors`:

```ts
returnValidationErrors(createTeamSchema, {
  slug: { _errors: ["Ya existe un equipo con ese slug."] },
});
```

**The rule:** if the failure points at one form field the user can correct in place, use
`returnValidationErrors`. Otherwise throw an `AppError`.

### `AppError.is` checks a brand, not the prototype chain

```ts
static is(error: unknown): error is AppError {
  return error instanceof Error && (error as Partial<AppError>).isAppError === true;
}
```

Next builds server actions and Server Components into separate module graphs. If this class were
instantiated in one graph and tested with `instanceof` in the other, the check would return `false`,
and every message would silently revert to being masked — in production builds only, with nothing in
the logs to say so. A brand property cannot fail that way.

## Alternatives considered

- **Remove the masking and return every message.** One line, and every Spanish message written for a
  user works immediately. Rejected: it also exposes driver output, constraint names and upstream
  response bodies, and it fails open — any future `throw` anywhere becomes user-visible by default.
- **Return a discriminated result object from each action** (`{ ok: false, reason: "duplicate" }`)
  instead of throwing. Type-safe on the client and no reliance on message strings, but it changes the
  return type of every action and forces every caller to branch. It also does nothing for errors
  thrown by middleware or the query layer, which are not action return values at all.
- **A flag on the error object** (`Object.assign(new Error(msg), { expose: true })`). Same runtime
  effect with less ceremony, but no type safety, nothing to grep for, and no category — so no basis
  for log severity or for the client to ever branch.
- **`instanceof AppError` inside `is()`.** The obvious implementation, rejected for the module-graph
  reason above.
- **A deeper hierarchy, one subclass per message family.** Rejected as ceremony: subclasses that
  differ only in a string earn nothing. Six categories is the granularity that log filtering and
  future client branching can actually use.

## Consequences

**Safe by default.** New code cannot accidentally expose anything. The failure mode of forgetting
`AppError` is a generic message — annoying, never dangerous.

**Every new message is a copy decision.** Choosing `AppError` asserts that the sentence was written
for a user to read. That is an editorial obligation, not a mechanical class substitution: a message
that names an internal id, reports a state the code has not actually confirmed, or lists constraints
inaccurately will now ship to users verbatim.

**The `code` is server-side only.** It reaches `console.error` and makes logs filterable, but the
client cannot branch on it, because `handleServerError` returns a `string`. Exposing the code to the
client means changing that return type and updating every call site that reads `error.serverError` —
a deliberate deferral.

**A message that leaks is now a real risk, where before it was impossible.** The mitigation is the
"keep a plain `Error`" list above, and it is not optional. Any `AppError` whose message confirms the
existence of a record belonging to someone else is an information disclosure, and needs to be
weighed at the call site rather than assumed harmless.

**Unwinding this means touching every throw.** Reverting to unconditional masking is one line in
`handleServerError`, but reverting the taxonomy would mean rewriting every call site that chose a
class. That choice is part of the product's behaviour, not an implementation detail.
