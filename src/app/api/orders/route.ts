import { after } from "next/server";

import { json, parseBody, route } from "@/lib/api";
import { sendOrderConfirmation, sendOrderNotification } from "@/lib/email";
import { checkoutSchema, placeOrder, toOrderView } from "@/lib/orders";

export const dynamic = "force-dynamic";

/**
 * POST /api/orders — check out the visitor's cart. Clears the cart on success.
 * Confirmation emails go out after the response so a slow mail API never
 * delays (or fails) the order itself.
 */
export const POST = route(async (request) => {
  const input = await parseBody(request, checkoutSchema);
  const order = toOrderView(await placeOrder(input));

  after(async () => {
    await Promise.allSettled([sendOrderConfirmation(order), sendOrderNotification(order)]);
  });

  return json({ order }, { status: 201 });
});
