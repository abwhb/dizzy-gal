import { after } from "next/server";

import { json, parseBody, route } from "@/lib/api";
import { sendOrderEmails } from "@/lib/email";
import { checkoutSchema, placeOrder, toOrder } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

/**
 * Order intake. The browser sends its cart (product id → quantity), the
 * chosen delivery day and the customer; the server prices it from the
 * database, takes the stock, stores the order and returns it in the shape
 * the confirmation page keeps in `localStorage`.
 *
 * The kitchen email (and the customer's confirmation, if they left an
 * email) go out after the response, so a slow mail API never delays or
 * fails the order.
 */
export const POST = route(async (request) => {
  const input = await parseBody(request, checkoutSchema);
  const order = toOrder(await placeOrder(input));

  after(async () => {
    const emailed = await sendOrderEmails(order);
    console.log(`[orders] ${order.id} stored (kitchen email ${emailed.kitchen ? "sent" : "NOT sent"})`);
  });

  return json({ ok: true, order }, { status: 201 });
});
