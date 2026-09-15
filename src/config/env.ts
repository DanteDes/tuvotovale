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
  MP_ACCESS_TOKEN: process.env.MP_ACCESS_TOKEN,
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  VOTE_PRICE_ARS: process.env.VOTE_PRICE_ARS,
} as const;
