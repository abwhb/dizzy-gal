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

  const order = body as {
    id?: string;
    deliveryDate?: string;
    lines?: unknown[];
    customer?: { phone?: string; area?: string };
  };
  if (
    !order?.id ||
    !/^\d{4}-\d{2}-\d{2}$/.test(order.deliveryDate ?? "") ||
    !Array.isArray(order.lines) ||
    !order.lines.length ||
    !order.customer?.phone ||
    !order.customer?.area
  ) {
    return NextResponse.json({ ok: false, error: "Incomplete order" }, { status: 422 });
  }

  console.log(`[orders] received ${order.id}`);
  return NextResponse.json({ ok: true, id: order.id });
}
