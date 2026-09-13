import { cache } from "react";
import { z } from "zod";

import type { Product as ProductRow } from "@/generated/prisma/client";
import { type Product, illustrationNames, products as seedCatalogue } from "@/lib/content";
import { db } from "@/lib/db";

export const ingredientSchema = z.object({
  label: z.string().trim().min(1).max(40),
  illustration: z.enum(illustrationNames),
});

/**
 * A flavour as the storefront renders it: the same shape as the seed
 * catalogue in `content.ts` (so every component keeps working), plus live
 * stock. `id` is the product's public slug.
 */
export type ShopProduct = Product & {
  stock: number;
  inStock: boolean;
};

export function toShopProduct(row: ProductRow): ShopProduct {
  const parsed = z.array(ingredientSchema).safeParse(row.ingredients);
  return {
    id: row.slug,
    name: row.name,
    tag: row.tag ?? "",
    description: row.description,
    warning: row.warning ?? "",
    // Ingredients are free-form JSON in the DB; drop anything the UI can't draw.
    ingredients: parsed.success ? parsed.data : [],
    cta: row.cta,
    price: row.price,
    panel: row.panel,
    bg: row.bg,
    dark: row.dark || undefined,
    jarImage: row.imageUrl ?? undefined,
    stock: row.stock,
    inStock: row.stock > 0,
  };
}

/** The seed catalogue in storefront shape, for when the database can't be reached. */
function fallbackProducts(): ShopProduct[] {
  return seedCatalogue.map((product) => ({
    ...product,
    stock: product.stock ?? 0,
    inStock: (product.stock ?? 0) > 0,
  }));
}

/**
 * Every active flavour, in shop order. Deduplicated per request with React's
 * `cache`, so the header, footer, shop and structured data share one query.
 *
 * If the database is unreachable the launch catalogue is served instead (with
 * an error logged) so the storefront stays up; checkout still needs the
 * database and will fail honestly.
 */
export const listProducts = cache(async (): Promise<ShopProduct[]> => {
  try {
    const rows = await db().product.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(toShopProduct);
  } catch (error) {
    console.error("[products] database unavailable, serving the seed catalogue", error);
    return fallbackProducts();
  }
});

export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  const row = await db().product.findFirst({ where: { slug, active: true } });
  return row ? toShopProduct(row) : null;
}
