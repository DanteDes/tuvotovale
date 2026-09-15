# Drizzle ORM — Data Layer Setup

| | |
| --- | --- |
| **Purpose** | Replace the Supabase client with a Drizzle ORM data layer, and move the project to a `src/` root |
| **Date** | 2026-09-14 |
| **Status** | Approved — ready for implementation planning |
| **Verified on** | `better-auth@1.7.5`, `drizzle-orm@0.45.2`, `drizzle-kit@0.31.10`, Node v24.1.0 |

## Problem

The project was scaffolded against `supabase-js`, with the domain schema living in a hand-written
`supabase/schema.sql`. Drizzle ORM and drizzle-kit are installed but nothing is wired up:

- `lib/auth.ts` already imports `@/lib/db`, which does not exist — the module graph is broken today.
- `@supabase/supabase-js` is no longer in `package.json`, so `lib/supabase.ts` is dead code that
  cannot resolve its own import.
- `postgres`, the driver `drizzle-orm/postgres-js` requires, is not installed.
- `.claude/CLAUDE.md` documents a `src/` layout, but every directory sits at the repository root and
  `tsconfig.json` maps `@/*` to `./*`.

## Scope

**In:** the `src/` migration, the Drizzle connection, schema for Better Auth plus `teams`, two
example query modules, migration tooling, and `ENV_CONFIG`.

**Out:** `votes` and `payments` schema, wiring components to real data, the Better Auth route
handler, the MercadoPago flow, and `lib/auth-client.ts`.

## Decisions

### Move the project under `src/`

`app/`, `components/`, `lib/` and `types/` move to `src/`; `tsconfig.json` changes its path mapping
to `"@/*": ["./src/*"]`. No import statement changes, because every existing import already goes
through the `@/` alias.

Config files stay at the repository root: `biome.json`, `next.config.ts`, `postcss.config.mjs`,
`commitlint.config.ts`, and the new `drizzle.config.ts`.

The alternative — creating `lib/db/` at the root and correcting `.claude/CLAUDE.md` to describe the
flat layout — was rejected: the documented layout is the intended one, and the move is a mechanical
`git mv` that gets more expensive the longer it waits.

### Column names come from `casing: "snake_case"`

The `drizzleAdapter` resolves Better Auth's field names against **the property keys of the Drizzle
schema object**, not against column names. Better Auth's default field names are camelCase
(`emailVerified`, `ipAddress`, `accessTokenExpiresAt`), so the TypeScript keys are forced to
camelCase. Column names remain free.

Setting `casing: "snake_case"` once in `drizzle()` and once in `drizzle.config.ts` derives every
column name from its key. This keeps `teams` on the exact columns the old SQL used (`logo_url`,
`votes_count`, `created_at`) and removes an entire class of typo that would otherwise only surface
at runtime.

**This setting must be identical in both places.** If the runtime and drizzle-kit disagree, the
generated SQL creates columns the queries cannot find, and nothing fails until a query runs.

### The auth schema is hand-written, not CLI-generated

`npx @better-auth/cli generate` cannot run here: it loads `lib/auth.ts`, which imports `@/lib/db`,
which needs the schema the CLI is supposed to produce. It also emits one flat file, and has no
knowledge of the UUID primary keys this project wants.

The schema is therefore written by hand from the field set in
`node_modules/@better-auth/core/dist/db/get-tables.mjs`, and verified against a real database by
calling `auth.api.signUpEmail()`.

### Four auth tables, not five

With no plugins configured, Better Auth's core tables are `user`, `session`, `account` and
`verification`. The `rateLimit` table is created only when `rateLimit.storage === "database"`, which
this project does not set. The `verification` table is included because no `secondaryStorage` is
configured.

### UUID primary keys with a database default

`lib/auth.ts` already sets `advanced.database.generateId: false`, which means Better Auth omits `id`
on insert and expects the database to supply it. Every primary key is therefore
`uuid().primaryKey().defaultRandom()` — without the default, every insert fails on a not-null
violation.

### Table names are plural

`lib/auth.ts` sets `usePlural: true`, so the adapter looks up `users`, `sessions`, `accounts` and
`verifications` in the schema object. Both the exported constant and the `pgTable` name use the
plural form.

### `ENV_CONFIG` without Zod

`.claude/CLAUDE.md` forbids reading `process.env` directly, but no `ENV_CONFIG` exists. This work
adds `src/config/env.ts` as a typed object that reads `process.env` without runtime validation —
the smallest thing that satisfies the rule. Schema validation can be added later if missing
variables start costing debugging time.

## Design

### File layout

```
drizzle.config.ts                     # new, repository root
src/
├── app/                              # moved
├── components/                       # moved
├── config/
│   └── env.ts                        # new — ENV_CONFIG
├── lib/
│   ├── auth.ts                       # moved, schema wired in
│   ├── auth-client.ts                # moved, untouched
│   ├── errors.ts                     # moved, untouched
│   ├── mercadopago.ts                # moved, untouched
│   ├── safe-action.ts                # moved, untouched
│   └── db/
│       ├── index.ts                  # new — db instance
│       ├── migrations/               # new — drizzle-kit output
│       ├── queries/
│       │   ├── teams.ts              # new
│       │   └── users.ts              # new
│       └── schema/
│           ├── auth.ts               # new
│           ├── teams.ts              # new
│           └── index.ts              # new — barrel
└── types/                            # moved, untouched
```

Deleted: `lib/supabase.ts`, `supabase/schema.sql` (and the now-empty `supabase/`), and
`eslint.config.mjs` — Biome is the project's only linter, so the ESLint config is dead
configuration that survived the scaffold.

### `src/config/env.ts`

Exports `ENV_CONFIG` as a typed object with `DATABASE_URL`, `BETTER_AUTH_SECRET`,
`BETTER_AUTH_URL` and `NODE_ENV`. Consumed by `src/lib/db/index.ts` and `drizzle.config.ts`.

`src/lib/db/index.ts` imports it through the `@/config/env` alias. `drizzle.config.ts` must use a
relative import (`./src/config/env`) instead: drizzle-kit compiles the config outside the Next
toolchain and does not read `tsconfig.json` path mappings, so the alias fails to resolve there.

The same limitation applies to everything drizzle-kit loads. `src/lib/db/schema/index.ts` therefore
re-exports its siblings relatively (`./auth`, `./teams`) rather than through `@/`. This is the one
place in the codebase where a relative import is correct, and it is not a deep one.

`.env.example` is corrected — `DATABASE_URL` currently has no trailing `=` — and gains a sample
Postgres connection string.

### `src/lib/db/index.ts`

Creates a `postgres` client and wraps it with `drizzle-orm/postgres-js`, passing the full schema
(so `db.query` is typed) and `casing: "snake_case"`.

Two runtime concerns:

- **Hot reload.** Next's dev server re-evaluates modules on every change. Without a cache, each
  reload opens a new connection pool until Postgres refuses new connections. The client is cached on
  `globalThis` in development and instantiated normally in production.
- **Poolers.** `prepare: false` on the `postgres` client. Prepared statements are not supported by
  connection poolers running in transaction mode, and the failure only appears in a deployed
  environment.

Exports the `db` instance.

### `src/lib/db/schema/auth.ts`

Field set verified against `@better-auth/core` 1.7.5. Timestamps are `timestamp` with
`withTimezone: true` and `mode: "date"`, matching both the old `timestamptz` columns and the
`Date` objects Better Auth reads and writes.

**`users`** — `id` uuid PK; `name` text not null; `email` text not null unique; `emailVerified`
boolean not null default `false`; `image` text nullable; `createdAt` and `updatedAt` not null,
defaulting to now, with `$onUpdate` on `updatedAt`.

**`sessions`** — `id` uuid PK; `expiresAt` not null; `token` text not null unique; `ipAddress` and
`userAgent` text nullable; `userId` uuid not null referencing `users.id` with `onDelete: "cascade"`;
`createdAt` and `updatedAt`.

**`accounts`** — `id` uuid PK; `accountId` and `providerId` text not null; `userId` uuid not null
referencing `users.id` with `onDelete: "cascade"`; `accessToken`, `refreshToken`, `idToken`, `scope`
and `password` text nullable; `accessTokenExpiresAt` and `refreshTokenExpiresAt` nullable;
`createdAt` and `updatedAt`.

**`verifications`** — `id` uuid PK; `identifier` and `value` text not null; `expiresAt` not null;
`createdAt` and `updatedAt`.

The cascade on `sessions.userId` and `accounts.userId` is what makes deleting a user leave no
orphaned credentials or live sessions behind.

### `src/lib/db/schema/teams.ts`

Ports the `teams` table from the deleted `supabase/schema.sql`: `id` uuid PK; `name` text not null;
`slug` text not null unique; `logoUrl` text nullable; `votesCount` integer not null default `0`;
`createdAt` not null defaulting to now. Under `casing: "snake_case"` these land on the same column
names the old SQL used.

The `votes` and `payments` tables, the `votes_team_id_idx` / `votes_fingerprint_idx` indexes, the
`increment_votes()` function, the Supabase realtime publication and the seed rows are **not
ported** — they belong to the payment flow, which is out of scope. Everything needed to rebuild them
is in this repository's git history at `supabase/schema.sql`.

### `src/lib/db/schema/index.ts`

Re-exports both modules. This barrel is what `db` receives for typed `db.query` access and what
`drizzleAdapter` receives as its `schema`.

### `src/lib/db/queries/`

All data access lives here; pages and server actions never touch `db.query` directly.

- `teams.ts` — `getTeams()` ordered by `votesCount` descending, and `getTeamBySlug(slug)` returning
  the row or `undefined`.
- `users.ts` — `getUserById(id)` and `getUserByEmail(email)`.

Named function declarations, per the project's conventions.

### `src/lib/auth.ts`

The only change is filling in the adapter's schema:

```ts
import * as schema from "@/lib/db/schema";
// ...
database: drizzleAdapter(db, { provider: "pg", usePlural: true, schema }),
```

`usePlural`, `provider` and `generateId: false` stay as they are.

### `drizzle.config.ts`

At the repository root, with `dialect: "postgresql"`, `schema: "./src/lib/db/schema"`,
`out: "./src/lib/db/migrations"`, `casing: "snake_case"`, and `dbCredentials.url` from `ENV_CONFIG`.

New `package.json` scripts: `db:generate`, `db:migrate` and `db:studio`.

drizzle-kit loads `.env` on its own — it bundles `dotenv` and imports `dotenv/config` in its bin
before evaluating the config file — so the scripts need no `--env-file` flag and the project needs
no `dotenv` dependency.

## Verification

1. `npx drizzle-kit generate` produces SQL in `src/lib/db/migrations/` — no database needed.
2. Read the generated SQL and confirm the column names are snake_case and the primary keys carry
   `DEFAULT gen_random_uuid()`.
3. `npx drizzle-kit migrate` against the real `DATABASE_URL` creates the four auth tables plus
   `teams`.
4. A throwaway `tsx` script calls `auth.api.signUpEmail()` with a test address and then reads the
   row back through `getUserByEmail()`. This exercises the adapter end to end — the field-name
   mapping, the UUID defaults and the plural table lookup all fail loudly here if wrong. The script
   is deleted afterwards; it is a probe, not a test.
5. `npx tsc --noEmit` passes.
6. `npm run lint` and `npm run format` pass.

A green typecheck is not sufficient on its own: the Better Auth field mapping is resolved at
runtime, so a wrong property key compiles cleanly and fails only on the first query. Step 4 is the
step that actually proves the schema.

## Risks

- **The `src/` move touches every path in the repository.** It is mechanical, but a missed file
  breaks the build. `git mv` keeps history, and the typecheck in step 5 catches stragglers.
- **Deleting `supabase/schema.sql` discards `votes` and `payments`.** Accepted, explicitly, when
  scoping this to auth plus teams. Git history is the recovery path.
- **Two `Team` types will coexist.** `src/types/index.ts` keeps its snake_case `Team`, used by five
  components rendering hard-coded mock data (`src/app/page.tsx`), while the schema infers a
  camelCase one. They do not meet in this change because no component reads the database yet.
  Reconciling them belongs to the task that wires real data in, and that task should delete the
  hand-written interface rather than keep both.

## Follow-up work

Not part of this change, listed so it is not mistaken for an oversight: the `votes` and `payments`
schema, the Better Auth route handler at `src/app/api/auth/[...all]/route.ts`, replacing the mock
data in `src/app/page.tsx` with `getTeams()`, and deleting `src/types/index.ts` in favour of
inferred types. Separately, `src/lib/auth-client.ts` configures `organizationClient()` — a plugin,
against a server instance that registers none. It is left alone here but will not work as written.
