import { z } from "zod";

import type { Product as ProductRow } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { type Ingredient, illustrationNames } from "@/lib/content";

export const ingredientSchema = z.object({
  label: z.string().trim().min(1).max(40),
  illustration: z.enum(illustrationNames),
});

/** JSON-safe product as sent to the browser and rendered by the shop. */
export type ShopProduct = {
  id: string;
  slug: string;
  name: string;
  tag: string | null;
  description: string;
  warning: string | null;
  ingredients: Ingredient[];
  cta: string;
  imageUrl: string | null;
  priceCents: number;
  currency: string;
  /** How many can still be ordered. */
  stock: number;
  inStock: boolean;
};

export function toShopProduct(row: ProductRow): ShopProduct {
  const parsed = z.array(ingredientSchema).safeParse(row.ingredients);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tag: row.tag,
    description: row.description,
    warning: row.warning,
    // Ingredients are free-form JSON in the DB; drop anything the UI can't draw.
    ingredients: parsed.success ? parsed.data : [],
    cta: row.cta,
    imageUrl: row.imageUrl,
    priceCents: row.priceCents,
    currency: row.currency,
    stock: row.stock,
    inStock: row.stock > 0,
  };
}

export async function listProducts(): Promise<ShopProduct[]> {
  const rows = await db().product.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(toShopProduct);
}

export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  const row = await db().product.findFirst({ where: { slug, active: true } });
  return row ? toShopProduct(row) : null;
}

export { formatPrice } from "@/lib/format";
