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
