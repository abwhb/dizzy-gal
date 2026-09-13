import { NextResponse } from "next/server";

import { subscribeToNewsletter } from "@/lib/email";

/**
 * Newsletter signup. Adds the address as a Resend contact and sends the
 * welcome note. `source` says which form it came from (modal or footer).
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const { email, source } = (body ?? {}) as { email?: unknown; source?: unknown };
  const address = typeof email === "string" ? email.trim().slice(0, 200) : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
    return NextResponse.json({ ok: false, error: "That email looks off." }, { status: 422 });
  }
  const from = source === "modal" || source === "footer" ? source : "site";

  const result = await subscribeToNewsletter(address, from);
  console.log(`[newsletter] ${from} signup — contact ${result.contact ? "saved" : "NOT saved"}, welcome ${result.welcome ? "sent" : "NOT sent"}`);
  if (!result.contact && !result.welcome) {
    return NextResponse.json({ ok: false, error: "Could not subscribe" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, ...result });
}
