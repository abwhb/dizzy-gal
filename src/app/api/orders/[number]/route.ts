import { z } from "zod";

import { ApiError, json, route } from "@/lib/api";
import { findOrderForCustomer, toOrderView } from "@/lib/orders";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ number: string }> };

const lookupSchema = z.object({
  number: z.coerce.number().int().positive(),
  email: z.email(),
});

/** GET /api/orders/:number?email=… — a customer's own order. */
export const GET = route<Ctx>(async (request, { params }) => {
  const { number } = await params;
  const email = new URL(request.url).searchParams.get("email") ?? "";
  const query = lookupSchema.parse({ number, email });

  const order = await findOrderForCustomer(query.number, query.email);
  if (!order) throw new ApiError(404, "No order matches that number and email.");
  return json({ order: toOrderView(order) });
});
