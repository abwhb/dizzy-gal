import { NextResponse } from "next/server";

/**
 * Order intake. Right now this only validates the shape and acknowledges —
 * the browser keeps the order record. Wire the real thing in here: an email
 * to the kitchen, a Google Sheet row, a WhatsApp message, a Shopify draft
 * order — whatever the team runs on.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const order = body as { id?: string; lines?: unknown[]; customer?: { phone?: string } };
  if (!order?.id || !Array.isArray(order.lines) || !order.lines.length || !order.customer?.phone) {
    return NextResponse.json({ ok: false, error: "Incomplete order" }, { status: 422 });
  }

  console.log(`[orders] received ${order.id}`);
  return NextResponse.json({ ok: true, id: order.id });
}
