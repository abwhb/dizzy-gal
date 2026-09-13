import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";

/** Throw from a handler to return a specific status and message. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function json<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function errorResponse(status: number, message: string, details?: unknown) {
  return NextResponse.json({ error: { message, ...(details ? { details } : {}) } }, { status });
}

/** Parse and validate a JSON request body. A missing body is treated as `{}`. */
export async function parseBody<T>(request: Request, schema: ZodType<T>): Promise<T> {
  let raw: unknown = {};
  const text = await request.text();
  if (text.trim()) {
    try {
      raw = JSON.parse(text);
    } catch {
      throw new ApiError(400, "Request body must be valid JSON.");
    }
  }
  return schema.parse(raw);
}

type Handler<Ctx> = (request: Request, ctx: Ctx) => Promise<Response>;

/**
 * Wrap a route handler so that validation failures become 400s, `ApiError`s
 * keep their status, and anything else is logged and returned as a 500
 * without leaking internals.
 */
export function route<Ctx = unknown>(handler: Handler<Ctx>): Handler<Ctx> {
  return async (request, ctx) => {
    try {
      return await handler(request, ctx);
    } catch (error) {
      if (error instanceof ZodError) {
        return errorResponse(400, "Invalid request.", error.issues);
      }
      if (error instanceof ApiError) {
        return errorResponse(error.status, error.message, error.details);
      }
      console.error(`[api] ${request.method} ${new URL(request.url).pathname}`, error);
      return errorResponse(500, "Something went wrong on our side.");
    }
  };
}
