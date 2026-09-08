"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import { Illustration } from "@/components/illustrations";
import { PageBody, pillPrimary } from "@/components/page-shell";
import { checkoutCopy } from "@/lib/content";
import { formatDeliveryDay } from "@/lib/delivery";
import { formatDate, money } from "@/lib/format";
import { parseOrders, readOrdersRaw, subscribeOrders } from "@/lib/orders";

export function OrdersList() {
  const raw = useSyncExternalStore(subscribeOrders, readOrdersRaw, () => null);
  const orders = useMemo(() => (raw === null ? null : parseOrders(raw)), [raw]);

  if (orders === null) return <PageBody className="min-h-[40vh]" />;

  if (!orders.length) {
    return (
      <PageBody className="flex flex-col items-center py-20 text-center">
        <Illustration name="zzz" strokeWidth={2.4} className="w-20 text-dizzy-orange" style={{ rotate: "-10deg" }} />
        <p className="mt-6 font-display text-3xl font-extrabold">{checkoutCopy.ordersEmpty}</p>
        <p className="mt-1 text-sm font-medium">{checkoutCopy.ordersNote}</p>
        <Link href="/#shop" className={`${pillPrimary} mt-8`}>
          go on. dig in.
        </Link>
      </PageBody>
    );
  }

  return (
    <PageBody>
      <p className="text-sm font-medium">{checkoutCopy.ordersNote}</p>
      <ul className="m-0 mt-6 flex list-none flex-col gap-4 p-0">
        {/* No data-reveal on these: the list mounts after Motion has already scanned. */}
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/order/${order.id}`}
              className="flex flex-wrap items-center gap-4 rounded-2xl border-[3px] border-burgundy bg-cream p-5 transition-transform duration-200 hover:-translate-y-0.5 hover:text-burgundy sm:gap-6"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-2xl leading-none font-extrabold">{order.id}</p>
                <p className="mt-1.5 text-[12px] font-medium">
                  Arriving {formatDeliveryDay(order.deliveryDate)} · placed {formatDate(order.createdAt)} ·{" "}
                  {order.lines.map((l) => `${l.qty} × ${l.name}`).join(", ")}
                </p>
              </div>
              <span className="rounded-full border-2 border-burgundy bg-lemon px-3 py-1 text-[10px] font-semibold tracking-[.18em] uppercase">
                {order.status}
              </span>
              <span className="font-display text-xl font-extrabold">{money(order.total)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageBody>
  );
}
