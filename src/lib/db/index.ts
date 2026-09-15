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
