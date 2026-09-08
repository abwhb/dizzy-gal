"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import { Illustration } from "@/components/illustrations";
import { PageBody, pillPrimary, pillSecondary } from "@/components/page-shell";
import { checkoutCopy, store } from "@/lib/content";
import { formatDeliveryDay } from "@/lib/delivery";
import { formatDate, money } from "@/lib/format";
import { parseOrders, readOrdersRaw, subscribeOrders } from "@/lib/orders";

export function OrderConfirmation({ id }: { id: string }) {
  // null on the server / first paint, the stored JSON once the browser has it.
  const raw = useSyncExternalStore(subscribeOrders, readOrdersRaw, () => null);
  const order = useMemo(
    () => (raw === null ? undefined : (parseOrders(raw).find((o) => o.id === id) ?? null)),
    [raw, id],
  );

  if (order === undefined) return <PageBody className="min-h-[40vh]" />;

  if (order === null) {
    return (
      <PageBody className="py-20 text-center">
        <p className="font-display text-3xl font-extrabold">We can&rsquo;t find that order here.</p>
        <p className="mt-2 text-sm font-medium">
          Orders are remembered on the device they were placed from. Order <strong>{id}</strong> wasn&rsquo;t placed on this one.
        </p>
        <Link href="/orders" className={`${pillSecondary} mt-8`}>
          My orders
        </Link>
      </PageBody>
    );
  }

  const day = formatDeliveryDay(order.deliveryDate);
  const steps = [
    { title: "We call you", body: "A quick call to confirm the order and the address. Usually within the hour." },
    { title: "Into the oven", body: `Baked the morning of ${day.split(" ")[0]}, layered, chilled. Nothing sits on a shelf.` },
    { title: `${day}`, body: `The rider arrives. Pay ${money(order.total)} in cash at the door. Then dig in.` },
  ];

  return (
    <PageBody>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-4">
            {/* No motion hooks here: this renders after hydration, once the
                browser's order store is read, which is after Motion set up. */}
            <p className="font-display text-[clamp(40px,6vw,72px)] leading-[.9] font-extrabold text-dizzy-orange">
              {checkoutCopy.confirmedTitle}
            </p>
            <Illustration name="smiley" strokeWidth={2.4} className="w-14 text-dizzy-orange" style={{ rotate: "-10deg" }} />
          </div>
          <p className="mt-3 max-w-md text-base font-medium">{checkoutCopy.confirmedBody}</p>
          <p className="mt-5 inline-flex items-center gap-3 rounded-full border-[3px] border-burgundy bg-lemon px-4 py-2 text-[11px] font-semibold tracking-[.2em] uppercase">
            Order {order.id}
            <span className="font-normal tracking-normal normal-case">{formatDate(order.createdAt)}</span>
          </p>

          <ol className="m-0 mt-10 grid list-none gap-4 p-0 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border-[3px] border-burgundy bg-cream p-5">
                <span className="flex size-8 items-center justify-center rounded-full bg-burgundy font-display text-base font-extrabold text-cream">
                  {i + 1}
                </span>
                <p className="mt-3 font-display text-xl leading-none font-extrabold">{step.title}</p>
                <p className="mt-2 text-[13px] leading-snug font-medium">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/#shop" className={pillPrimary}>
              Back to the jars
            </Link>
            <Link href="/orders" className={pillSecondary}>
              My orders
            </Link>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border-[3px] border-burgundy bg-strawberry p-6">
          <h2 className="font-display text-2xl font-extrabold">The order</h2>
          <ul className="m-0 mt-4 list-none space-y-2 p-0 text-sm font-medium">
            {order.lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-4">
                <span>
                  {line.qty} × {line.name}
                </span>
                <span>{money(line.qty * line.price)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t-[3px] border-burgundy pt-3 text-sm font-medium">
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{order.delivery === 0 ? "Free" : money(order.delivery)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Arriving</dt>
              <dd>{day}</dd>
            </div>
            <div className="flex justify-between font-display text-xl font-extrabold">
              <dt>Cash on delivery</dt>
              <dd>{money(order.total)}</dd>
            </div>
          </dl>
          <div className="mt-5 border-t-[3px] border-burgundy pt-4 text-sm font-medium">
            <p className="text-[10px] font-semibold tracking-[.2em] uppercase">Delivering to</p>
            <p className="mt-1">{order.customer.name}</p>
            <p>{order.customer.phone}</p>
            <p className="whitespace-pre-line">{order.customer.address}</p>
            <p>
              {order.customer.area}, {order.customer.city}
            </p>
            {order.customer.notes ? <p className="mt-2 italic">“{order.customer.notes}”</p> : null}
          </div>
          <p className="mt-4 text-[11px] font-medium text-burgundy/70">
            Questions? hello@dizzygals.com — quote {order.id}. Orders of {store.freeDeliveryFrom}+ jars ship free.
          </p>
        </aside>
      </div>
    </PageBody>
  );
}
