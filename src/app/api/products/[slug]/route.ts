import { ApiError, json, route } from "@/lib/api";
import { getProductBySlug } from "@/lib/products";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

/** GET /api/products/:slug */
export const GET = route<Ctx>(async (_request, { params }) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) throw new ApiError(404, "No such flavour.");
  return json({ product });
});
