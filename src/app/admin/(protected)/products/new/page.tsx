import { ProductForm, emptyProduct } from "@/components/admin/product-form";

export default function NewProductPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
      <ProductForm initial={emptyProduct} />
    </div>
  );
}
