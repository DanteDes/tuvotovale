---
name: next-safe-action
description: Use when creating or editing server actions. Covers which action client to use (actionClient vs authActionClient), ctx destructuring, inputSchema, error handling, return values, revalidatePath. Triggered by any work with actions.ts, server mutations, useAction, safe-action, or authActionClient.
---

# next-safe-action

## Overview

All server-side mutations go through `next-safe-action`. Clients are exported from `src/lib/safe-action.ts`, each with a different auth context level. Choosing the right client is the first decision when writing an action.

---

## Choosing the Right Client

```
Is a session required?
  No  → actionClient
  Yes → authActionClient
```

| Client | Auth | ctx shape |
|--------|------|-----------|
| `actionClient` | — | none |
| `authActionClient` | ✓ | `{ headers, auth }` |

---

## Action Shape

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createNote, deleteNote, updateNote } from "@/lib/db/queries/notes";
import { authActionClient } from "@/lib/safe-action";
import { noteSchema } from "./schema";

const NOTES_PATH = "/notes";

export const createNoteAction = authActionClient
  .inputSchema(noteSchema)
  .action(async ({ parsedInput: { title }, ctx: { auth } }) => {
    const note = await createNote({ createdByUserId: auth.user.id, title });
    revalidatePath(NOTES_PATH);
    return note;
  });

export const updateNoteAction = authActionClient
  .inputSchema(noteSchema.extend({ id: z.string().uuid() }))
  .action(async ({ parsedInput: { id, title } }) => {
    const note = await updateNote(id, { title });
    if (!note) throw new Error("...");
    revalidatePath(NOTES_PATH);
    return note;
  });

export const deleteNoteAction = authActionClient
  .inputSchema(z.object({ id: z.string().uuid() }))
  .action(async ({ parsedInput: { id } }) => {
    await deleteNote(id);
    revalidatePath(NOTES_PATH);
  });
```

---

## Input Schema

Always use `.inputSchema()` — never skip it, even for actions with no client input.

```typescript
// Complex schema → import from ./schema.ts
.inputSchema(noteSchema)

// Extend a base schema for update actions
.inputSchema(noteSchema.extend({ id: z.string().uuid() }))

// Simple inline schema
.inputSchema(z.object({ id: z.string().uuid() }))

// No input needed — omit .inputSchema() entirely
export const getSettingsAction = actionClient.action(async () => getSettings());
```

---

## Context Destructuring

Destructure only what you need:

```typescript
ctx: { auth }              // minimum for user-scoped queries
ctx: { headers, auth }     // when also calling auth.api.* methods
```

```typescript
// correct — trust the id derived from the session
const note = await getNoteById(auth.user.id, id);

// wrong — an ownerId from client input is not trusted
const note = await getNoteById(parsedInput.ownerId, id);
```

---

## Error Handling

Throw `new Error("message")` directly — `handleServerError` in the client propagates the message to `onError` / `serverError`.

```typescript
// Simple guard
if (!note) throw new Error("message");
```

No `try/catch` unless catching a specific known error — generic wrapping hides stack traces.

---

## Return Values

```typescript
// Create / update → return the entity
const note = await createNote(...);
return note;

// Delete → no return (void)
await deleteNote(id);
revalidatePath(NOTES_PATH);

// Multiple distinct fields → return object
return { userId, settings };

// Never wrap in { data: ... } unless multiple named fields are needed
```

---

## revalidatePath

Store the path as a module-level constant. Call it after every mutation.

```typescript
const NOTES_PATH = "/notes";

// after mutation:
revalidatePath(NOTES_PATH);
```

---

## DB Access Rules

- Never import `db` or write raw Drizzle in `actions.ts`.
- Always call query functions from `@/lib/db/queries/[domain]`.
- Minimize DB round-trips — batch with `Promise.all` when possible.

---

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Create | `createXxxAction` | `createNoteAction` |
| Update | `updateXxxAction` | `updateNoteAction` |
| Delete | `deleteXxxAction` | `deleteNoteAction` |
| Domain verb | `verbNounAction` | `castVoteAction` |
| Read / search | `searchXxx` / `fetchMoreXxxAction` | `globalSearchAction` |

---

## Common Mistakes

| Mistake | Correct pattern |
|---------|-----------------|
| Raw Drizzle in actions.ts | Call `@/lib/db/queries/[domain]` functions |
| Generic `try/catch` swallowing all errors | Catch only known errors, always re-throw unknown |
| Wrapping return value in `{ data: ... }` unnecessarily | Return entity directly |
| Hardcoded path string in `revalidatePath` | Extract to a module-level constant |
