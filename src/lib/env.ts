/**
 * Environment lookup shared by the app and `prisma.config.ts`.
 *
 * Every variable this project reads is prefixed `dizzy_gals_` so it can't be
 * confused with another project's settings on the same machine or host.
 * `DATABASE_URL` / `RESEND_API_KEY` are deliberately NOT consulted.
 * (`NEXT_PUBLIC_SITE_URL` in src/lib/seo.ts is the one exception: Next.js
 * requires that prefix for anything the browser bundle can read.)
 */
export const DATABASE_URL_KEYS = [
  "dizzy_gals_PRISMA_DATABASE_URL",
  "dizzy_gals_POSTGRES_URL",
] as const;

export const ADMIN_PASSWORD_KEY = "dizzy_gals_ADMIN_PASSWORD";
export const ADMIN_SESSION_SECRET_KEY = "dizzy_gals_ADMIN_SESSION_SECRET";

export const RESEND_API_KEY_KEYS = ["dizzy_gals_RESEND_API_KEY", "dizzy_gals_RESEND"] as const;
export const ORDERS_NOTIFY_EMAIL_KEY = "dizzy_gals_ORDERS_NOTIFY_EMAIL";
export const WHOLESALE_NOTIFY_EMAIL_KEY = "dizzy_gals_WHOLESALE_NOTIFY_EMAIL";

function read(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim() ? value.trim() : undefined;
}

function first(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = read(key);
    if (value) return value;
  }
  return undefined;
}

export function findDatabaseUrl(): string | undefined {
  return first(DATABASE_URL_KEYS);
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

/** Resend API key; email is skipped (and logged) when unset. */
export function resendApiKey(): string | undefined {
  return first(RESEND_API_KEY_KEYS);
}

/** Inbox that receives new orders (defaults to `site.email`). */
export function ordersNotifyEmail(): string | undefined {
  return read(ORDERS_NOTIFY_EMAIL_KEY);
}

/** Inbox that receives wholesale enquiries. */
export function wholesaleNotifyEmail(): string | undefined {
  return read(WHOLESALE_NOTIFY_EMAIL_KEY);
}
