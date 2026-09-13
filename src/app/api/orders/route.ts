import { NextResponse } from "next/server";

import { sendOrderEmails } from "@/lib/email";
import type { Order } from "@/lib/orders";

/**
 * Order intake. Validates the order the browser built, then emails it to
 * the kitchen (and a confirmation to the customer if they left an email)
 * through Resend. The browser keeps its own copy of the order regardless,
 * so an email failure is reported in the response rather than failing the
 * order — the confirmation page still works and the kitchen can be chased.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const order = parseOrder(body);
  if (!order) {
    return NextResponse.json({ ok: false, error: "Incomplete order" }, { status: 422 });
  }

  const emailed = await sendOrderEmails(order);
  console.log(`[orders] received ${order.id} (kitchen email ${emailed.kitchen ? "sent" : "NOT sent"})`);
  return NextResponse.json({ ok: true, id: order.id, emailed });
}

const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/** Everything the emails print has to be present and the right shape. */
function parseOrder(body: unknown): Order | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const customer = o.customer as Record<string, unknown> | undefined;

  if (
    !isString(o.id) ||
    !/^[A-Z0-9-]{4,24}$/.test(o.id) ||
    !isString(o.createdAt) ||
    !isString(o.deliveryDate) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(o.deliveryDate) ||
    !Array.isArray(o.lines) ||
    !o.lines.length ||
    !isNumber(o.jars) ||
    !isNumber(o.subtotal) ||
    !isNumber(o.delivery) ||
    !isNumber(o.total) ||
    !customer ||
    !isString(customer.name) ||
    !isString(customer.phone) ||
    !isString(customer.address) ||
    !isString(customer.area) ||
    !isString(customer.city) ||
    (customer.email !== undefined && !isString(customer.email)) ||
    (customer.notes !== undefined && !isString(customer.notes))
  ) {
    return null;
  }

  const lines = o.lines.map((l) => {
    const line = l as Record<string, unknown>;
    if (!isString(line.productId) || !isString(line.name) || !isNumber(line.qty) || !isNumber(line.price)) return null;
    return { productId: line.productId, name: line.name, qty: line.qty, price: line.price };
  });
  if (lines.some((l) => l === null)) return null;

  return {
    id: o.id,
    createdAt: o.createdAt,
    deliveryDate: o.deliveryDate,
    lines: lines as Order["lines"],
    jars: o.jars,
    subtotal: o.subtotal,
    delivery: o.delivery,
    total: o.total,
    customer: {
      name: customer.name.trim().slice(0, 120),
      phone: customer.phone.trim().slice(0, 40),
      email: customer.email?.trim().slice(0, 200) || undefined,
      address: customer.address.trim().slice(0, 500),
      area: customer.area.trim().slice(0, 80),
      city: customer.city.trim().slice(0, 80),
      notes: customer.notes?.trim().slice(0, 1000) || undefined,
    },
    payment: "cod",
    status: "placed",
  };
}
