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
