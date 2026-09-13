import { NextResponse } from "next/server";

import { sendWholesaleEmails, type WholesaleEnquiryEmail } from "@/lib/email";

/**
 * Wholesale enquiry intake. Validates the form, then emails the enquiry to
 * the wholesale inbox (and an acknowledgement to the enquirer if they left
 * an email) through Resend. Unlike orders, nothing else keeps a copy of an
 * enquiry, so if the team email can't be sent this fails loudly and the
 * form tells them to email instead.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const enquiry = parseEnquiry(body);
  if (!enquiry) {
    return NextResponse.json({ ok: false, error: "Incomplete enquiry" }, { status: 422 });
  }

  const emailed = await sendWholesaleEmails(enquiry);
  console.log(`[wholesale] enquiry from ${enquiry.business} (${enquiry.contact}) — team email ${emailed.team ? "sent" : "NOT sent"}`);
  if (!emailed.team) {
    return NextResponse.json({ ok: false, error: "Could not deliver enquiry" }, { status: 502 });
  }
  return NextResponse.json({ ok: true, emailed });
}

const str = (v: unknown, max: number): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim().slice(0, max) : undefined;

function parseEnquiry(body: unknown): WholesaleEnquiryEmail | null {
  if (!body || typeof body !== "object") return null;
  const e = body as Record<string, unknown>;

  const business = str(e.business, 120);
  const contact = str(e.contact, 120);
  const phone = str(e.phone, 40);
  if (!business || !contact || !phone || phone.replace(/\D/g, "").length < 10) return null;

  const email = str(e.email, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const flavours = Array.isArray(e.flavours)
    ? e.flavours.filter((f): f is string => typeof f === "string").map((f) => f.slice(0, 60)).slice(0, 20)
    : undefined;

  return {
    business,
    contact,
    phone,
    email,
    type: str(e.type, 80),
    area: str(e.area, 120),
    volume: str(e.volume, 80),
    frequency: str(e.frequency, 80),
    flavours,
    message: str(e.message, 2000),
  };
}
