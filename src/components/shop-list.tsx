import { Scallop } from "@/components/decor";
import { ProductFeature } from "@/components/product-feature";
import { SectionRail } from "@/components/section-rail";
import { products } from "@/lib/content";

/**
 * Every flavour as its own full-bleed panel, one after another, for /shop.
 * Each panel is addressable (`/shop#pink-lemonade`) and scrolls in under the
 * sticky header. `scallop` is the colour of whatever sits above the first.
 */
export function ShopList({ scallop = "#FF6A00" }: { scallop?: string }) {
  return (
    <>
      {products.map((product, i) => (
        <section
          key={product.id}
          id={product.id}
          aria-label={product.name}
          className="relative grid scroll-mt-14 grid-cols-[46px_minmax(0,1fr)] border-b-[3px] border-burgundy"
          style={{ backgroundColor: product.bg }}
        >
          <Scallop color={i === 0 ? scallop : products[i - 1].bg} />
          <SectionRail label={product.tag} />
          <div className="min-w-0">
            <ProductFeature product={product} />
          </div>
        </section>
      ))}
    </>
  );
}
