/**
 * Inserts the launch catalogue from `products` in `src/lib/content.ts`.
 *
 * Idempotent and non-destructive: a flavour whose id already exists is left
 * untouched, so prices, stock, copy and colours edited in /admin win.
 * Run with `npm run db:seed`; also runs after `prisma migrate dev/reset` and
 * on every Vercel build (see `vercel-build` in package.json).
 */
import "dotenv/config";

import { products } from "../src/lib/content";
import { db } from "../src/lib/db";

const DEFAULT_STOCK = 100;

async function main() {
  const prisma = db();
  const existing = new Set(
    (await prisma.product.findMany({ select: { slug: true } })).map((row) => row.slug),
  );

  let inserted = 0;
  for (const [index, product] of products.entries()) {
    if (existing.has(product.id)) {
      console.log(`= ${product.id} (already in database, skipped)`);
      continue;
    }
    await prisma.product.create({
      data: {
        slug: product.id,
        name: product.name,
        tag: product.tag || null,
        description: product.description,
        warning: product.warning || null,
        ingredients: product.ingredients,
        cta: product.cta,
        imageUrl: product.jarImage ?? null,
        price: product.price,
        panel: product.panel,
        bg: product.bg,
        dark: Boolean(product.dark),
        stock: product.stock ?? DEFAULT_STOCK,
        sortOrder: index,
      },
    });
    inserted += 1;
    console.log(`+ ${product.id}`);
  }
  console.log(`Seed complete: ${inserted} inserted, ${existing.size} already present.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db().$disconnect());
