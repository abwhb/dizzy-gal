import { z } from "zod";

import { ApiError, json, parseBody, route } from "@/lib/api";
import { MAX_LINE_QUANTITY, addItem, toCartView } from "@/lib/cart";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const addItemSchema = z
  .object({
    productId: z.string().min(1).optional(),
    slug: z.string().min(1).optional(),
    quantity: z.coerce.number().int().min(1).max(MAX_LINE_QUANTITY).default(1),
  })
  .refine((body) => body.productId || body.slug, {
    message: "Provide a productId or a slug.",
    path: ["productId"],
  });

/** POST /api/cart/items — add `quantity` of a product; sets the cart cookie. */
export const POST = route(async (request) => {
  const body = await parseBody(request, addItemSchema);
  const product = await db().product.findFirst({
    where: body.productId ? { id: body.productId, active: true } : { slug: body.slug, active: true },
  });
  if (!product) throw new ApiError(404, "No such flavour.");

  const cart = await addItem(product, body.quantity);
  return json({ cart: toCartView(cart) }, { status: 201 });
});
