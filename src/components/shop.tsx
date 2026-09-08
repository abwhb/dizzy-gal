import { FlavourCarousel } from "@/components/flavour-carousel";
import { products } from "@/lib/content";

export function Shop() {
  return <FlavourCarousel products={products} />;
}
