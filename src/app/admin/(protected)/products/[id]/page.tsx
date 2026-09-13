import { notFound } from "next/navigation";

import { ProductForm, type ProductFormValues } from "@/components/admin/product-form";
import { db } from "@/lib/db";
import { toShopProduct } from "@/lib/products";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db().product.findUnique({ where: { id } });
  if (!product) notFound();

  const initial: ProductFormValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    tag: product.tag ?? "",
    description: product.description,
    warning: product.warning ?? "",
    cta: product.cta,
    imageUrl: product.imageUrl ?? "",
    price: String(product.price),
    panel: product.panel,
    bg: product.bg,
    dark: product.dark,
    stock: String(product.stock),
    sortOrder: String(product.sortOrder),
    active: product.active,
    ingredients: toShopProduct(product).ingredients,
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
      <ProductForm initial={initial} />
    </div>
  );
}
