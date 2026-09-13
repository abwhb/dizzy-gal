/**
 * Inserts the launch catalogue from `src/lib/content.ts`.
 *
 * Idempotent and non-destructive: a product whose slug already exists is left
 * untouched, so prices/stock/copy edited in the database (or the admin) win.
 * Run with `npm run db:seed`; also runs after `prisma migrate dev/reset`.
 */
import "dotenv/config";

import { products } from "../src/lib/content";
import { db } from "../src/lib/db";

async function main() {
  const prisma = db();
  const existing = new Set(
    (await prisma.product.findMany({ select: { slug: true } })).map((row) => row.slug),
  );

  let inserted = 0;
  for (const [index, product] of products.entries()) {
    if (existing.has(product.slug)) {
      console.log(`= ${product.slug} (already in database, skipped)`);
      continue;
    }
    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        tag: product.tag || null,
        description: product.description,
        warning: product.warning || null,
        ingredients: product.ingredients,
        cta: product.cta,
        imageUrl: product.jarImage ?? null,
        priceCents: product.priceCents,
        currency: product.currency,
        stock: product.stock,
        sortOrder: index,
      },
    });
    inserted += 1;
    console.log(`+ ${product.slug}`);
  }
  console.log(`Seed complete: ${inserted} inserted, ${existing.size} already present.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db().$disconnect());
