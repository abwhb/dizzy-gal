import { z } from "zod";

import { ApiError, json, route } from "@/lib/api";
import { findOrderForCustomer, toOrder } from "@/lib/orders-server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ code: string }> };

const lookupSchema = z.object({
  code: z.string().trim().min(4).max(24),
  phone: z.string().trim().min(10).max(40),
});

/** GET /api/orders/:code?phone=… — a customer's own order, by the phone it was placed with. */
export const GET = route<Ctx>(async (request, { params }) => {
  const { code } = await params;
  const phone = new URL(request.url).searchParams.get("phone") ?? "";
  const query = lookupSchema.parse({ code, phone });

  const record = await findOrderForCustomer(query.code, query.phone);
  if (!record) throw new ApiError(404, "No order matches that number and phone.");
  return json({ ok: true, order: toOrder(record) });
});
