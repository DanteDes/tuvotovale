# Drizzle ORM Data Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dead Supabase client with a working Drizzle ORM data layer, and move the project under a `src/` root.

**Architecture:** Every directory moves under `src/` and `@/*` is remapped to `./src/*`, so no import statement changes. A `postgres-js` connection lives in `src/lib/db/index.ts`, hand-written schema in `src/lib/db/schema/`, and all data access in `src/lib/db/queries/`. Column names are derived from TypeScript property keys by `casing: "snake_case"`, set identically in the runtime `drizzle()` call and in `drizzle.config.ts`.

**Tech Stack:** Next.js 16, TypeScript, `drizzle-orm@0.45.2`, `drizzle-kit@0.31.10`, `postgres` (to install), `better-auth@1.7.5`, PostgreSQL, Biome, Node v24.1.0.

**Spec:** `docs/superpowers/specs/2026-09-14-drizzle-db-setup-design.md`

## Global Constraints

- **No test framework is installed.** This project has no Vitest/Jest and none is added here — it was not in the approved spec. Verification is command-based: `npx tsc --noEmit`, `npm run lint`, reading the generated SQL, and a throwaway `tsx` probe against a real database. Where a task says "run X and expect Y", that **is** the test — run it and read the output before checking the box.
- **Biome is the only linter and formatter.** 120-column lines, 2-space indent, double quotes, semicolons always, trailing commas everywhere. Never add ESLint or Prettier config.
- **Conventional Commits are enforced** by a husky `commit-msg` hook running commitlint. A non-conforming message is rejected. No AI references in commit messages.
- **Never use `any`.** Use `unknown` when a type cannot be determined.
- **Named function declarations**, not arrow functions assigned to consts.
- **`interface` for object shapes, `type` for unions and utility types.**
- **Import through the `@/` alias**, except inside `src/lib/db/schema/`, where drizzle-kit cannot resolve aliases (see Task 3).
- **Never read `process.env` outside `src/config/env.ts`.**
- **`casing: "snake_case"` must be identical** in `src/lib/db/index.ts` and `drizzle.config.ts`. If they diverge, generated SQL creates columns the queries cannot find and nothing fails until a query runs.
- **Table names are plural and every `id` has a database default.** `src/lib/auth.ts` sets `usePlural: true` and `generateId: false`; violating either breaks Better Auth at runtime, not at compile time.
- **Do not touch** `src/types/index.ts`, the five components importing `Team` from it, `src/lib/auth-client.ts`, or `src/lib/mercadopago.ts`.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `src/config/env.ts` | The only module that reads `process.env` |
| `src/lib/db/index.ts` | Builds the `postgres` client and exports the `db` instance |
| `src/lib/db/schema/auth.ts` | Better Auth's four tables |
| `src/lib/db/schema/teams.ts` | The `teams` table |
| `src/lib/db/schema/index.ts` | Barrel consumed by `db`, `drizzleAdapter` and drizzle-kit |
| `src/lib/db/queries/teams.ts` | All reads of `teams` |
| `src/lib/db/queries/users.ts` | All reads of `users` |
| `src/lib/db/migrations/` | drizzle-kit output — generated, never hand-edited |
| `drizzle.config.ts` | drizzle-kit configuration, repository root |

---

### Task 1: Move the project under `src/` and delete dead files

**Files:**
- Move: `app/`, `components/`, `lib/`, `types/` → `src/`
- Modify: `tsconfig.json`
- Delete: `src/lib/supabase.ts`, `supabase/schema.sql`, `supabase/`, `eslint.config.mjs`

**Interfaces:**
- Consumes: nothing.
- Produces: the `src/` root that every later task writes into, and the `@/*` → `./src/*` mapping every later import depends on.

Context: `.claude/CLAUDE.md` already documents a `src/` layout and `biome.json` already ignores `src/components/ui`, so this move makes the repository match its own configuration. `lib/supabase.ts` imports `@supabase/supabase-js`, which is no longer in `package.json`, so it cannot compile today. `eslint.config.mjs` is leftover scaffold — Biome is the only linter.

- [ ] **Step 1: Record the baseline typecheck failures**

Run: `npx tsc --noEmit`

Expected — exactly these two errors:

```
lib/auth.ts(4,20): error TS2307: Cannot find module '@/lib/db' or its corresponding type declarations.
lib/supabase.ts(1,30): error TS2307: Cannot find module '@supabase/supabase-js' or its corresponding type declarations.
```

This is the starting state. Both are pre-existing; this plan removes the second in this task and the first in Task 4.

- [ ] **Step 2: Move the four directories**

```bash
mkdir -p src
git mv app src/app
git mv components src/components
git mv lib src/lib
git mv types src/types
```

`git mv` is required, not `mv` — it preserves file history.

- [ ] **Step 3: Delete the dead files**

```bash
git rm src/lib/supabase.ts
git rm supabase/schema.sql
git rm eslint.config.mjs
rmdir supabase 2>/dev/null || true
```

`supabase/schema.sql` is the only definition of `votes` and `payments`. That is intentional and was accepted when the spec was scoped to auth plus teams — git history is the recovery path.

- [ ] **Step 4: Remap the path alias**

In `tsconfig.json`, change the `paths` entry:

```json
    "paths": {
      "@/*": ["./src/*"]
    }
```

Leave every other compiler option and the `include` array alone — `"**/*.ts"` already covers `src/`.

- [ ] **Step 5: Verify the move left exactly one known failure**

Run: `npx tsc --noEmit`

Expected — exactly one error, and note the path now starts with `src/`:

```
src/lib/auth.ts(4,20): error TS2307: Cannot find module '@/lib/db' or its corresponding type declarations.
```

If any *other* error appears, a file was missed in the move or an import escaped the alias. Fix it before continuing. If the `supabase.ts` error is still present, Step 3 did not run.

- [ ] **Step 6: Verify the linter still resolves the tree**

Run: `npm run lint`

Expected: PASS. If Biome reports files it cannot parse under `src/`, check that nothing was left behind at the repository root.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "refactor: mover el proyecto a src/ y eliminar el cliente de Supabase"
```

---

### Task 2: Install the driver and add `ENV_CONFIG`

**Files:**
- Create: `src/config/env.ts`
- Modify: `package.json`, `package-lock.json`, `.env.example`

**Interfaces:**
- Consumes: the `src/` root from Task 1.
- Produces: `ENV_CONFIG`, an object with `DATABASE_URL: string | undefined`, `BETTER_AUTH_SECRET: string | undefined`, `BETTER_AUTH_URL: string | undefined`, and `NODE_ENV: string`. Consumed by Task 4 (`src/lib/db/index.ts`) and Task 5 (`drizzle.config.ts`).

Context: `drizzle-orm/postgres-js` needs the `postgres` driver, which is not installed. `.claude/CLAUDE.md` forbids reading `process.env` anywhere but a central `ENV_CONFIG`, which does not exist yet. The values stay `string | undefined` deliberately — no Zod, per the approved spec — and the loud failure for a missing `DATABASE_URL` lives in Task 4, where it actually matters.

- [ ] **Step 1: Install the driver**

```bash
npm install postgres
```

Note `.npmrc` sets `ignore-scripts=true` and `min-release-age=7`. `postgres` has no install scripts, so this is fine. If npm refuses a version as too recently released, take the previous one.

- [ ] **Step 2: Verify it resolved**

Run: `node -e "console.log(require('postgres/package.json').version)"`

Expected: a `3.x` version number. If it prints an error, the install did not take.

- [ ] **Step 3: Create `src/config/env.ts`**

```ts
/**
 * The only module that reads `process.env`.
 *
 * Spreading `process.env.SOMETHING` through the codebase hides which variables a deployment
 * actually has to set, and a typo in one of those string literals fails silently at runtime.
 * Everything the app needs configured is listed here, once.
 *
 * Values stay possibly-undefined on purpose: the module that needs a variable is the module that
 * knows what a useful error about it sounds like.
 */
export const ENV_CONFIG = {
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  NODE_ENV: process.env.NODE_ENV ?? "development",
} as const;
```

- [ ] **Step 4: Fix `.env.example`**

The current file ends with `DATABASE_URL` and no `=`. Replace the whole file with:

```
# Better Auth Configuration
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Database configuration
DATABASE_URL=postgresql://user:password@localhost:5432/tuvotovale
```

`.gitignore` excludes `.env*`, and `.env.example` is force-added already in git — confirm with `git status` that it shows as modified, not untracked.

- [ ] **Step 5: Verify nothing regressed**

Run: `npx tsc --noEmit`

Expected: still exactly one error, the `@/lib/db` one from Task 1. `ENV_CONFIG` is not imported by anything yet, so it must not introduce new errors.

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/config/env.ts .env.example
git commit -m "feat: agregar driver postgres y ENV_CONFIG"
```

---

### Task 3: Write the database schema

**Files:**
- Create: `src/lib/db/schema/auth.ts`
- Create: `src/lib/db/schema/teams.ts`
- Create: `src/lib/db/schema/index.ts`

**Interfaces:**
- Consumes: the `src/` root from Task 1.
- Produces: `users`, `sessions`, `accounts`, `verifications`, `teams` (all `PgTable`s), plus the types `User = typeof users.$inferSelect` and `Team = typeof teams.$inferSelect`. Task 4 passes the barrel to `drizzle()` and to `drizzleAdapter`; Task 6 queries these tables.

Context, and the three things that make this file non-obvious:

1. **The adapter resolves columns by property key, not column name.** Verified in `@better-auth/drizzle-adapter`: it indexes the table object as `schemaModel[fieldName]`, where `fieldName` defaults to Better Auth's camelCase names. So the keys below **must** stay camelCase. The `camelCase` option on `drizzleAdapter` does not change this — it only affects the Better Auth CLI's schema generator.
2. **Column names come from `casing: "snake_case"`,** set in Task 4 and Task 5. That is why the calls below are `text()` and not `text("email_verified")`.
3. **Four tables, not five.** Better Auth's `rateLimit` table is created only when `rateLimit.storage === "database"`, which this project does not set.

- [ ] **Step 1: Create `src/lib/db/schema/auth.ts`**

```ts
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Better Auth's core schema, hand-written from `@better-auth/core`'s table definitions for 1.7.5.
 *
 * Three constraints shape this file and none of them are visible from the code alone:
 *
 * - The adapter looks up columns by the *property key* on these objects, never by column name. The
 *   keys must stay camelCase because that is what Better Auth calls its fields. The column names
 *   are derived separately, by `casing: "snake_case"` on the `drizzle()` call.
 * - Table names are plural because `auth.ts` sets `usePlural: true`.
 * - Every `id` carries a database default because `auth.ts` sets `generateId: false`: Better Auth
 *   omits `id` on insert and expects Postgres to supply one. Without the default, every insert
 *   fails on a not-null violation.
 *
 * A mistake in any of the three compiles cleanly and fails on the first query.
 */
export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable("sessions", {
  id: uuid().primaryKey().defaultRandom(),
  expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
  token: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable("accounts", {
  id: uuid().primaryKey().defaultRandom(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  userId: uuid()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text(),
  refreshToken: text(),
  idToken: text(),
  accessTokenExpiresAt: timestamp({ withTimezone: true, mode: "date" }),
  refreshTokenExpiresAt: timestamp({ withTimezone: true, mode: "date" }),
  scope: text(),
  password: text(),
  createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verifications = pgTable("verifications", {
  id: uuid().primaryKey().defaultRandom(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp({ withTimezone: true, mode: "date" }).notNull(),
  createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
```

Only `User` is exported as a type, because only `User` has a consumer (Task 6). Add the others when something needs them.

The cascade on `sessions.userId` and `accounts.userId` is what makes deleting a user leave no live sessions and no orphaned credentials behind.

- [ ] **Step 2: Create `src/lib/db/schema/teams.ts`**

```ts
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Ported from the deleted `supabase/schema.sql`. Under `casing: "snake_case"` these keys land on
 * the same column names that table already used, so an existing database needs no rename.
 *
 * `createdAt` is `notNull` here where the original SQL left it nullable: the column always had a
 * default, so no row could ever have held a null anyway.
 */
export const teams = pgTable("teams", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  logoUrl: text(),
  votesCount: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true, mode: "date" }).notNull().defaultNow(),
});

export type Team = typeof teams.$inferSelect;
```

`.unique()` on `slug` produces the index the original schema had. Do not add an index on `votesCount` — the old schema had none, and there is no query volume to justify inventing one.

- [ ] **Step 3: Create `src/lib/db/schema/index.ts`**

```ts
/**
 * Relative re-exports, not `@/` ones, and this is the one place in the codebase where that is
 * correct: drizzle-kit compiles these files outside the Next toolchain and does not read the path
 * mappings in `tsconfig.json`, so an aliased import here fails to resolve at generate time.
 */
export * from "./auth";
export * from "./teams";
```

- [ ] **Step 4: Verify the schema compiles**

Run: `npx tsc --noEmit`

Expected: still exactly one error, the `@/lib/db` one. Nothing imports the schema yet, so any *new* error is a mistake in the three files above — most likely a `pg-core` helper imported under the wrong name.

- [ ] **Step 5: Verify formatting**

Run: `npm run lint`

Expected: PASS. If Biome reports formatting differences, run `npm run format` and re-run lint.

- [ ] **Step 6: Commit**

```bash
git add src/lib/db/schema
git commit -m "feat: definir schema de Drizzle para auth y teams"
```

---

### Task 4: Create the `db` instance and wire it into Better Auth

**Files:**
- Create: `src/lib/db/index.ts`
- Modify: `src/lib/auth.ts`

**Interfaces:**
- Consumes: `ENV_CONFIG` from Task 2; the schema barrel from Task 3.
- Produces: `db`, the Drizzle instance, imported by Task 6's query modules as `import { db } from "@/lib/db"`.

This task is the milestone: the typecheck goes fully green here for the first time.

- [ ] **Step 1: Create `src/lib/db/index.ts`**

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { ENV_CONFIG } from "@/config/env";
import * as schema from "@/lib/db/schema";

function createClient() {
  if (!ENV_CONFIG.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  }

  // Connection poolers running in transaction mode do not support prepared statements, and the
  // failure appears only once the app is deployed behind one — never in local development.
  return postgres(ENV_CONFIG.DATABASE_URL, { prepare: false });
}

/**
 * The dev server re-evaluates this module on every hot reload. Without this cache each reload
 * opens a fresh pool and never closes the previous one, until Postgres starts refusing
 * connections. Production instantiates the module once, so the cache is skipped there.
 */
const globalForDb = globalThis as unknown as { dbClient?: ReturnType<typeof createClient> };

const client = globalForDb.dbClient ?? createClient();

if (ENV_CONFIG.NODE_ENV !== "production") {
  globalForDb.dbClient = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });
```

`casing: "snake_case"` here must match `drizzle.config.ts` in Task 5 exactly.

- [ ] **Step 2: Wire the schema into the adapter**

In `src/lib/auth.ts`, add the schema import alongside the existing `db` import:

```ts
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
```

and replace the `database` option, which currently passes an empty object:

```ts
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
```

Change nothing else in that file. `usePlural: true` and `advanced.database.generateId: false` are what the schema in Task 3 was written against.

- [ ] **Step 3: Verify the typecheck is finally clean**

Run: `npx tsc --noEmit`

Expected: **no output at all.** This is the first point in the plan where that is true. If `@/lib/db` still cannot be found, the alias change in Task 1 Step 4 did not take.

- [ ] **Step 4: Verify lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/index.ts src/lib/auth.ts
git commit -m "feat: crear instancia de Drizzle y conectarla a Better Auth"
```

---

### Task 5: Configure drizzle-kit and generate the migration

**Files:**
- Create: `drizzle.config.ts` (repository root)
- Create: `src/lib/db/migrations/` (generated)
- Modify: `package.json`

**Interfaces:**
- Consumes: `ENV_CONFIG` from Task 2; the schema from Task 3.
- Produces: SQL migration files and a `meta/` journal under `src/lib/db/migrations/`, which Task 7 applies.

Context: drizzle-kit bundles `dotenv` and imports `dotenv/config` in its bin before evaluating the config file, so it picks up `.env` with no flag and the project needs no `dotenv` dependency. It does **not** read `tsconfig.json` path mappings, which is why the import below is relative.

- [ ] **Step 1: Create `drizzle.config.ts` at the repository root**

```ts
import { defineConfig } from "drizzle-kit";

import { ENV_CONFIG } from "./src/config/env";

// A relative import, not `@/config/env`: drizzle-kit compiles this file outside the Next toolchain
// and does not resolve the path mappings in tsconfig.json.

if (!ENV_CONFIG.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema",
  out: "./src/lib/db/migrations",
  casing: "snake_case",
  dbCredentials: {
    url: ENV_CONFIG.DATABASE_URL,
  },
});
```

- [ ] **Step 2: Add the database scripts**

In `package.json`, add to `scripts`, after `"lint"`:

```json
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio",
```

- [ ] **Step 3: Make sure a `.env` exists**

```bash
test -f .env && echo "ok" || cp .env.example .env
```

If it had to be copied, fill in a real `DATABASE_URL` and a `BETTER_AUTH_SECRET` before continuing — Task 7 needs both against a real database. Generate a secret with `openssl rand -base64 32`.

- [ ] **Step 4: Generate the migration**

Run: `npm run db:generate`

Expected: drizzle-kit reports five tables created and writes a `0000_*.sql` file plus a `meta/` directory into `src/lib/db/migrations/`.

- [ ] **Step 5: Read the generated SQL — this is the real check**

Run: `cat src/lib/db/migrations/0000_*.sql`

Confirm, line by line:

- Five `CREATE TABLE` statements: `users`, `sessions`, `accounts`, `verifications`, `teams` — all plural.
- Every `id` column reads `uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL`. A missing default breaks every insert, because `generateId: false` means Better Auth never sends one.
- Column names are snake_case: `email_verified`, `ip_address`, `user_agent`, `access_token_expires_at`, `logo_url`, `votes_count`, `created_at`. If any of these came out camelCase, `casing` is missing from `drizzle.config.ts`.
- `sessions.user_id` and `accounts.user_id` carry `ON DELETE cascade`.
- `users.email`, `sessions.token` and `teams.slug` are unique.

Do not edit this file to fix a problem. Fix the schema and re-run `npm run db:generate`.

- [ ] **Step 6: Commit**

```bash
git add drizzle.config.ts package.json src/lib/db/migrations
git commit -m "feat: configurar drizzle-kit y generar la migracion inicial"
```

---

### Task 6: Add the query modules

**Files:**
- Create: `src/lib/db/queries/teams.ts`
- Create: `src/lib/db/queries/users.ts`

**Interfaces:**
- Consumes: `db` from Task 4; `teams`, `users`, `Team`, `User` from Task 3.
- Produces: `getTeams(): Promise<Team[]>`, `getTeamBySlug(slug: string): Promise<Team | undefined>`, `getUserById(id: string): Promise<User | undefined>`, `getUserByEmail(email: string): Promise<User | undefined>`. Task 7's probe calls `getUserByEmail` and `getTeams`.

Context: `.claude/CLAUDE.md` requires that pages and server actions never touch `db.query` directly — every read goes through this directory. These two modules are the pattern the rest of the project will copy, so keep them boring.

- [ ] **Step 1: Create `src/lib/db/queries/teams.ts`**

```ts
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { type Team, teams } from "@/lib/db/schema";

export async function getTeams(): Promise<Team[]> {
  return db.select().from(teams).orderBy(desc(teams.votesCount));
}

export async function getTeamBySlug(slug: string): Promise<Team | undefined> {
  const [team] = await db.select().from(teams).where(eq(teams.slug, slug)).limit(1);
  return team;
}
```

Destructuring the first element is how a "find one" reads in Drizzle: `select` always returns an array, and an empty one destructures to `undefined` without a length check.

- [ ] **Step 2: Create `src/lib/db/queries/users.ts`**

```ts
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { type User, users } from "@/lib/db/schema";

export async function getUserById(id: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return user;
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`

Expected: no output. If the `Team` or `User` import fails, the type exports at the bottom of the Task 3 schema files are missing.

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/lib/db/queries
git commit -m "feat: agregar queries de teams y users"
```

---

### Task 7: Apply the migration and prove the schema works end to end

**Files:**
- Create then delete: `scripts/probe-auth.ts`
- Modify: `docs/superpowers/specs/2026-09-14-drizzle-db-setup-design.md` only if something in it turns out to be wrong

**Interfaces:**
- Consumes: everything from Tasks 1-6.
- Produces: nothing the codebase keeps. This task produces evidence.

Why this task exists: a green typecheck proves nothing about Better Auth here. The adapter resolves field names at runtime, so a wrong property key, a missing `id` default or a singular table name all compile cleanly and fail on the first real query. Only a real sign-up against a real database catches them.

- [ ] **Step 1: Apply the migration**

Run: `npm run db:migrate`

Expected: drizzle-kit applies `0000_*.sql` and exits without error. If it reports that a relation already exists, the database is not empty — stop and ask before dropping anything.

- [ ] **Step 2: Confirm the tables exist**

Run: `npm run db:studio` and look for `users`, `sessions`, `accounts`, `verifications` and `teams`, then stop it with Ctrl-C.

If you prefer not to open Studio, `psql "$DATABASE_URL" -c "\dt"` lists the same thing.

- [ ] **Step 3: Write the throwaway probe**

Create `scripts/probe-auth.ts`. It is deleted in Step 6, which is also why its `console.log` calls are acceptable — this file never ships.

```ts
import { auth } from "@/lib/auth";
import { getTeams } from "@/lib/db/queries/teams";
import { getUserByEmail } from "@/lib/db/queries/users";

const email = `probe-${Date.now()}@example.com`;

await auth.api.signUpEmail({
  body: { name: "Probe", email, password: "probe-password-123" },
});

const user = await getUserByEmail(email);

if (!user) {
  throw new Error("sign-up returned without persisting a user row");
}

console.log("user:", user.id, user.email, user.emailVerified, user.createdAt);
console.log("teams:", await getTeams());

process.exit(0);
```

- [ ] **Step 4: Run it**

Run: `npx tsx --env-file=.env scripts/probe-auth.ts`

`tsx` does not load `.env` on its own the way drizzle-kit does, so the flag is required here. It
resolves the `@/` alias from `tsconfig.json`, which is why the probe's imports look like normal
application imports.

Expected output, in this shape:

```
user: 3f6c1b0e-... probe-1757...@example.com false 2026-09-14T...
teams: []
```

The empty `teams` array is correct — the seed rows from the old `schema.sql` were not ported.

What the failures mean:

- `relation "user" does not exist` → `usePlural: true` and the plural table names disagree.
- `null value in column "id" violates not-null constraint` → a primary key is missing `.defaultRandom()`.
- `column "emailVerified" does not exist` → `casing: "snake_case"` is missing from `drizzle.config.ts`, so the columns were created camelCase.
- `Cannot read properties of undefined` inside the adapter → a schema property key does not match Better Auth's field name; compare against `src/lib/db/schema/auth.ts`.
- `DATABASE_URL is not set` → the `--env-file=.env` flag was dropped from the command.
- A Better Auth error about a missing secret → `BETTER_AUTH_SECRET` is empty in `.env`.

- [ ] **Step 5: Confirm the row landed in Postgres**

Run: `psql "$DATABASE_URL" -c "select id, email, email_verified, created_at from users;"`

Expected: one row, with a UUID `id` the application never generated. That column is the whole point of the probe.

- [ ] **Step 6: Delete the probe and clean up the row**

```bash
rm scripts/probe-auth.ts
rmdir scripts 2>/dev/null || true
psql "$DATABASE_URL" -c "delete from users where email like 'probe-%@example.com';"
```

The delete should also remove the matching `accounts` row via the cascade. Confirm:

Run: `psql "$DATABASE_URL" -c "select count(*) from accounts;"`

Expected: `0`. A non-zero count means the cascade in the schema did not make it into the SQL.

- [ ] **Step 7: Final gates**

Run: `npm run format`
Run: `npm run lint`

Expected: both PASS.

Run: `npx tsc --noEmit`

Expected: no output.

Run: `git status --short`

Expected: clean, apart from anything `npm run format` rewrote. There must be no `scripts/` directory left.

- [ ] **Step 8: Correct the spec if reality disagreed with it**

If anything in Step 4 or Step 5 contradicted the spec, fix the wrong sentence in
`docs/superpowers/specs/2026-09-14-drizzle-db-setup-design.md` **in place**. Do not add a note
explaining what it used to say — per `.claude/rules/documentation-management.md`, a document should
read as though it had been right the first time. If everything matched, change nothing.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: aplicar migracion inicial y verificar el setup de Drizzle"
```

If Steps 1-8 left nothing to commit, skip this step rather than creating an empty commit.

---

## Deliberately left alone

Noted so a reviewer does not mistake any of it for an oversight:

- `src/lib/auth.ts` reads `process.env.NODE_ENV` and `src/lib/mercadopago.ts` reads four
  `process.env.*` values directly. Both predate `ENV_CONFIG` and both should route through it — but
  that is a separate cleanup, and folding it in here would put unrelated changes in the same diff.
- `src/lib/auth-client.ts` configures `organizationClient()` against a server instance that
  registers no plugins. It will not work as written. Out of scope for this plan.
- `src/types/index.ts` keeps its snake_case `Team` alongside the camelCase one inferred from the
  schema. Nothing makes them meet yet, because no component reads the database. The task that wires
  real data in should delete the hand-written interface rather than keep both.

## Done when

- `npx tsc --noEmit` produces no output.
- `npm run lint` passes.
- The five tables exist in Postgres with snake_case columns and UUID defaults.
- A Better Auth sign-up persisted a user row and it was read back through `getUserByEmail`.
- `lib/supabase.ts`, `supabase/schema.sql` and `eslint.config.mjs` are gone.
- No `scripts/` directory remains.
