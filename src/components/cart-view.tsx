"use client";

import Link from "next/link";

import { Illustration } from "@/components/illustrations";
import { PageBody, pillPrimary, pillSecondary } from "@/components/page-shell";
import { useSite } from "@/components/site-provider";
import { checkoutCopy, products, store } from "@/lib/content";
import { money } from "@/lib/format";
import { linesFor, totalsFor } from "@/lib/orders";

export function CartView() {
  const { items, hydrated, setQty, removeItem } = useSite();
  const lines = linesFor(items);
  const totals = totalsFor(lines);

  if (!hydrated) return <PageBody className="min-h-[40vh]" />;

  if (!lines.length) {
    return (
      <PageBody className="flex flex-col items-center py-20 text-center">
        <Illustration name="jar" strokeWidth={1.6} className="w-28 text-dizzy-orange" />
        <p className="mt-6 font-display text-3xl font-extrabold">{checkoutCopy.cartEmpty}</p>
        <p className="mt-1 text-sm font-medium">{checkoutCopy.cartEmptyHint}</p>
        <Link href="/shop" className={`${pillPrimary} mt-8`}>
          go on. dig in.
        </Link>
      </PageBody>
    );
  }

  const toFree = Math.max(0, store.freeDeliveryFrom - totals.jars);

  return (
    <PageBody className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12">
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {lines.map((line) => {
          const product = products.find((p) => p.id === line.productId)!;
          return (
            <li
              key={line.productId}
              className="flex flex-wrap items-center gap-4 rounded-2xl border-[3px] border-burgundy bg-cream p-4 sm:gap-6 sm:p-5"
            >
              <span
                className="flex size-16 flex-none items-center justify-center rounded-xl border-[3px] border-burgundy"
                style={{ background: product.panel }}
              >
                <Illustration
                  name="jar"
                  strokeWidth={2.2}
                  className={`size-9 ${product.dark ? "text-cream" : "text-burgundy"}`}
                />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-2xl leading-none font-extrabold">{line.name}</p>
                <p className="mt-1 text-[12px] font-medium">{money(line.price)} / jar</p>
              </div>
              <div className="flex items-center gap-2" aria-label={`Quantity of ${line.name}`}>
                <button
                  type="button"
                  onClick={() => setQty(line.productId, line.qty - 1)}
                  aria-label={`One less ${line.name}`}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border-[3px] border-burgundy text-lg font-bold transition-colors hover:bg-burgundy hover:text-cream"
                >
                  −
                </button>
                <span className="w-6 text-center font-display text-xl font-extrabold">
                  {line.qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(line.productId, line.qty + 1)}
                  aria-label={`One more ${line.name}`}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border-[3px] border-burgundy text-lg font-bold transition-colors hover:bg-burgundy hover:text-cream"
                >
                  +
                </button>
              </div>
              <div className="ml-auto flex items-center gap-4">
                <span className="font-display text-xl font-extrabold">
                  {money(line.qty * line.price)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(line.productId)}
                  className="cursor-pointer text-[10px] font-semibold tracking-[.18em] uppercase hover:text-dizzy-orange"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit rounded-2xl border-[3px] border-burgundy bg-lemon p-6">
        <h2 className="font-display text-2xl font-extrabold">Summary</h2>
        <dl className="mt-4 space-y-2 text-sm font-medium">
          <div className="flex justify-between">
            <dt>
              {totals.jars} {totals.jars === 1 ? "jar" : "jars"}
            </dt>
            <dd>{money(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{totals.delivery === 0 ? "Free" : money(totals.delivery)}</dd>
          </div>
          <div className="flex justify-between border-t-[3px] border-burgundy pt-3 font-display text-xl font-extrabold">
            <dt>Total</dt>
            <dd>{money(totals.total)}</dd>
          </div>
        </dl>
        {toFree > 0 ? (
          <p className="mt-3 text-[12px] leading-snug font-medium">
            Add {toFree} more {toFree === 1 ? "jar" : "jars"} and delivery&rsquo;s on us.
          </p>
        ) : (
          <p className="mt-3 text-[12px] leading-snug font-medium">
            Free delivery unlocked. You&rsquo;re a professional.
          </p>
        )}
        <Link href="/checkout" className={`${pillPrimary} mt-5 w-full`}>
          Checkout
        </Link>
        <Link href="/shop" className={`${pillSecondary} mt-3 w-full`}>
          Keep shopping
        </Link>
        <p className="mt-4 text-[11px] leading-snug font-medium text-burgundy/70">
          Cash on delivery, {store.deliveryDays.map((d) => `${d}s`).join(" and ")}, DHA {store.city} only.
          Pick your day at checkout.
        </p>
      </aside>
    </PageBody>
  );
}
