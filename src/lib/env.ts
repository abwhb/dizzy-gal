/**
 * Environment lookup shared by the app and `prisma.config.ts`.
 *
 * Every variable this project reads is prefixed `dizzy_gals_` so it can't be
 * confused with another project's settings on the same machine or host.
 * `DATABASE_URL` is deliberately NOT consulted.
 */
export const DATABASE_URL_KEYS = [
  "dizzy_gals_PRISMA_DATABASE_URL",
  "dizzy_gals_POSTGRES_URL",
] as const;

export const ADMIN_PASSWORD_KEY = "dizzy_gals_ADMIN_PASSWORD";
export const ADMIN_SESSION_SECRET_KEY = "dizzy_gals_ADMIN_SESSION_SECRET";

function read(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim() ? value.trim() : undefined;
}

export function findDatabaseUrl(): string | undefined {
  for (const key of DATABASE_URL_KEYS) {
    const value = read(key);
    if (value) return value;
  }
  return undefined;
}

export function databaseUrl(): string {
  const url = findDatabaseUrl();
  if (!url) {
    throw new Error(
      `No database URL configured. Set one of: ${DATABASE_URL_KEYS.join(", ")} (see .env.example).`,
    );
  }
  return url;
}

export function adminPassword(): string | undefined {
  return read(ADMIN_PASSWORD_KEY);
}

export function adminSessionSecret(): string | undefined {
  return read(ADMIN_SESSION_SECRET_KEY);
}

export const RESEND_API_KEY_KEY = "dizzy_gals_RESEND_API_KEY";
export const EMAIL_FROM_KEY = "dizzy_gals_EMAIL_FROM";
export const ORDER_NOTIFY_EMAIL_KEY = "dizzy_gals_ORDER_NOTIFY_EMAIL";

/** Resend API key; email is skipped (and logged) when unset. */
export function resendApiKey(): string | undefined {
  return read(RESEND_API_KEY_KEY);
}

/** Sender for every email. Must be on a domain verified in Resend. */
export function emailFrom(): string {
  return read(EMAIL_FROM_KEY) ?? "Dizzy Gals <hello@dizzygals.com>";
}

/** Optional inbox that gets a copy of every new order. */
export function orderNotifyEmail(): string | undefined {
  return read(ORDER_NOTIFY_EMAIL_KEY);
}
