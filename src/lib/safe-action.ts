import { headers as fetchHeaders } from "next/headers";

import { betterAuth } from "@next-safe-action/adapter-better-auth";
import { createSafeActionClient, type ServerErrorFunctionUtils } from "next-safe-action";

import { auth } from "@/lib/auth";
import { AppError, ForbiddenError } from "@/lib/errors";

// biome-ignore lint/suspicious/noExplicitAny: this file is meant to be a generic utility for server actions, so we want to allow any context shape
const handleServerError = (error: Error, utils?: ServerErrorFunctionUtils<any>) => {
  console.error("Action error:", {
    message: error.message,
    code: AppError.is(error) ? error.code : undefined,
    clientInput: utils?.clientInput,
  });

  // An AppError's message was written for a user to read; anything else may carry a driver dump,
  // a constraint name or an upstream response body, so it stays masked outside development.
  if (AppError.is(error)) {
    return error.message;
  }

  if (process.env.NODE_ENV === "development") {
    return error.message;
  }

  return "Ocurrió un error al procesar la solicitud.";
};

const withBetterAuth = betterAuth(auth, {
  authorize: ({ authData, next }) => {
    if (!authData) throw new ForbiddenError("No se encontró una sesión válida.");
    return next({ ctx: { auth: authData } });
  },
});

// Public — no authentication required
export const actionClient = createSafeActionClient({ handleServerError });

// Auth — requires a valid session and an organization
export const authActionClient = createSafeActionClient({ handleServerError })
  .use(withBetterAuth)
  .use(async ({ ctx, next }) => {
    const headers = await fetchHeaders();
    return next({ ctx: { ...ctx, headers } });
  });