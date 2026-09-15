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
