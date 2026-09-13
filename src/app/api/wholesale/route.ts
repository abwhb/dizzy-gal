import { NextResponse } from "next/server";

/**
 * Wholesale enquiry intake. Like /api/orders this is a stub: it checks the
 * shape, logs the enquiry and says ok. Wire the real destination here — an
 * email to wholesale@, a sheet row, a CRM lead — whatever the team runs on.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const enquiry = body as { business?: string; contact?: string; phone?: string };
  if (
    !enquiry?.business?.trim() ||
    !enquiry?.contact?.trim() ||
    (enquiry?.phone ?? "").replace(/\D/g, "").length < 10
  ) {
    return NextResponse.json({ ok: false, error: "Incomplete enquiry" }, { status: 422 });
  }

  console.log(`[wholesale] enquiry from ${enquiry.business} (${enquiry.contact})`);
  return NextResponse.json({ ok: true });
}
