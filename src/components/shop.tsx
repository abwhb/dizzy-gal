import { FlavourCarousel } from "@/components/flavour-carousel";
import { listProducts } from "@/lib/products";

/** The home page shop section, one flavour at a time, from the database. */
export async function Shop() {
  const products = await listProducts();
  if (products.length === 0) return null;
  return <FlavourCarousel products={products} />;
}
