import { json, route } from "@/lib/api";
import { emptyCart, findCurrentCart, toCartView } from "@/lib/cart";

export const dynamic = "force-dynamic";

/** GET /api/cart — the visitor's cart (empty if they don't have one yet). */
export const GET = route(async () => {
  const cart = await findCurrentCart();
  return json({ cart: toCartView(cart) });
});

/** DELETE /api/cart — remove every line. */
export const DELETE = route(async () => {
  const cart = await emptyCart();
  return json({ cart: toCartView(cart) });
});
