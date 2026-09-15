import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  baseURL: {
    allowedHosts: ["tuvotovale.com", "*.vercel.app", "localhost:3000"],
    protocol: process.env.NODE_ENV === "development" ? "http" : "https",
    fallback: "https://tuvotovale.com",
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  advanced: {
    database: {
      generateId: false, // Use UUIDs from PostgreSQL
    },
  },
});
