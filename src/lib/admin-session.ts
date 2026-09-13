/**
 * Admin session tokens: `<expiresAtMs>.<hmac>` signed with
 * dizzy_gals_ADMIN_SESSION_SECRET. Web Crypto only, so the same code runs in
 * the proxy and in server components.
 */
import { adminPassword, adminSessionSecret } from "@/lib/env";

export const ADMIN_COOKIE = "dg_admin";
export const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

export function adminConfigured(): boolean {
  return Boolean(adminPassword() && adminSessionSecret());
}

async function hmacKey(): Promise<CryptoKey> {
  const secret = adminSessionSecret();
  if (!secret) throw new Error("dizzy_gals_ADMIN_SESSION_SECRET is not set.");
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
}

function toHex(bytes: ArrayBuffer): string {
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sign(payload: string): Promise<string> {
  const key = await hmacKey();
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(payload)));
}

/** Constant-time string comparison (both sides are hashed first so lengths match). */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const ua = new Uint8Array(da);
  const ub = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < ua.length; i += 1) diff |= ua[i] ^ ub[i];
  return diff === 0 && a.length === b.length;
}

export async function createSessionToken(now = Date.now()): Promise<string> {
  const expiresAt = String(now + ADMIN_SESSION_TTL_SECONDS * 1000);
  return `${expiresAt}.${await sign(expiresAt)}`;
}

export async function verifySessionToken(token: string | undefined, now = Date.now()): Promise<boolean> {
  if (!token || !adminConfigured()) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const expiresAt = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!/^\d+$/.test(expiresAt) || Number(expiresAt) < now) return false;
  return safeEqual(signature, await sign(expiresAt));
}

export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const expected = adminPassword();
  if (!expected) return false;
  return safeEqual(candidate, expected);
}
