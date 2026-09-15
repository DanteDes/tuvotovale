/**
 * Errors whose message is safe to show a user.
 *
 * `handleServerError` in `safe-action.ts` masks every thrown message in production, because a raw
 * Error can carry a driver dump, a constraint name or an upstream response body. Throwing an
 * AppError is how a caller states that this particular message was written for a user to read.
 * Exposure is therefore opt-in: adding a plain `throw new Error(...)` anywhere still cannot leak.
 */
export type AppErrorCode =
  | "not_found"
  | "forbidden"
  | "conflict"
  | "limit_reached"
  | "invalid_input"
  | "operation_failed";

export class AppError extends Error {
  readonly isAppError = true as const;
  readonly code: AppErrorCode;

  constructor(message: string, code: AppErrorCode) {
    super(message);
    this.name = new.target.name;
    this.code = code;
  }

  /**
   * Checks a branded property rather than the prototype chain. Next builds server actions and
   * Server Components into separate module graphs; if this class were instantiated in one and
   * tested with `instanceof` in the other, the check would silently return false and every
   * message would revert to being masked — in a production build only, with nothing in the logs
   * to say so.
   */
  static is(error: unknown): error is AppError {
    return error instanceof Error && (error as Partial<AppError>).isAppError === true;
  }
}

/** The resource does not exist, or does not belong to this organization. */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, "not_found");
  }
}

/** The session, the membership or the role does not permit this. */
export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, "forbidden");
  }
}

/** The request collides with existing state: a duplicate name, a dependency, a closed record. */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, "conflict");
  }
}

/** A plan or product cap has been reached. */
export class LimitReachedError extends AppError {
  constructor(message: string) {
    super(message, "limit_reached");
  }
}

/** The input is well-formed for Zod but invalid as business data: a file too large, a mismatched id set. */
export class InvalidInputError extends AppError {
  constructor(message: string) {
    super(message, "invalid_input");
  }
}

/** A downstream operation failed and the user should retry. */
export class OperationFailedError extends AppError {
  constructor(message: string) {
    super(message, "operation_failed");
  }
}
