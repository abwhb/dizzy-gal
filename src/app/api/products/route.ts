import { json, route } from "@/lib/api";
import { listProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

/** GET /api/products — every active product, in shop order. */
export const GET = route(async () => {
  const products = await listProducts();
  return json({ products });
});
