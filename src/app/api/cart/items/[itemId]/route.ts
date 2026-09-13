import { z } from "zod";

import { json, parseBody, route } from "@/lib/api";
import { MAX_LINE_QUANTITY, setItemQuantity, toCartView } from "@/lib/cart";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ itemId: string }> };

const updateSchema = z.object({
  quantity: z.coerce.number().int().min(0).max(MAX_LINE_QUANTITY),
});

/** PATCH /api/cart/items/:itemId — set a line's quantity (0 removes it). */
export const PATCH = route<Ctx>(async (request, { params }) => {
  const { itemId } = await params;
  const { quantity } = await parseBody(request, updateSchema);
  const cart = await setItemQuantity(itemId, quantity);
  return json({ cart: toCartView(cart) });
});

/** DELETE /api/cart/items/:itemId */
export const DELETE = route<Ctx>(async (_request, { params }) => {
  const { itemId } = await params;
  const cart = await setItemQuantity(itemId, 0);
  return json({ cart: toCartView(cart) });
});
