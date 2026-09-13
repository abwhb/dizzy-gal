import { store } from "@/lib/content";

/**
 * Cart maths and the order record as the browser sees it. This module is
 * client-safe: the server side (pricing, storing and emailing an order)
 * lives in `src/lib/orders-server.ts`.
 *
 * Orders are created by `POST /api/orders`, which returns this `Order`
 * shape; the browser keeps a copy in `localStorage` so `/orders` and
 * `/order/[id]` work without an account.
 */

/** Product id (slug) → quantity. */
export type CartItems = Record<string, number>;

export type OrderLine = { productId: string; name: string; qty: number; price: number };

export type Customer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  /** e.g. "DHA Phase 6" */
  area: string;
  city: string;
  notes?: string;
};

export type OrderStatus = "placed" | "confirmed" | "delivered" | "cancelled";

export type Order = {
  /** The public order number, e.g. "DG-K3P9QA7". */
  id: string;
  createdAt: string;
  /** Chosen delivery day, local YYYY-MM-DD. */
  deliveryDate: string;
  lines: OrderLine[];
  jars: number;
  subtotal: number;
  delivery: number;
  total: number;
  customer: Customer;
  payment: "cod";
  status: OrderStatus;
};

/** What the browser sends to `POST /api/orders`. */
export type CheckoutRequest = {
  items: CartItems;
  deliveryDate: string;
  customer: Customer;
};

type PricedProduct = { id: string; name: string; price: number };

export function linesFor(items: CartItems, products: PricedProduct[]): OrderLine[] {
  return products
    .filter((p) => (items[p.id] ?? 0) > 0)
    .map((p) => ({ productId: p.id, name: p.name, qty: items[p.id], price: p.price }));
}

export function totalsFor(lines: OrderLine[]) {
  const jars = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.price, 0);
  const delivery = jars === 0 || jars >= store.freeDeliveryFrom ? 0 : store.deliveryFee;
  return { jars, subtotal, delivery, total: subtotal + delivery };
}

const KEY = "dg-orders";
const listeners = new Set<() => void>();

/** The stored JSON as-is (strings compare by value, so this is a stable snapshot). */
export function readOrdersRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

export function parseOrders(raw: string | null): Order[] {
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function subscribeOrders(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function saveOrder(order: Order) {
  try {
    const existing = parseOrders(readOrdersRaw());
    window.localStorage.setItem(KEY, JSON.stringify([order, ...existing].slice(0, 50)));
  } catch {
    // Storage full or blocked — the confirmation page will say it can't find it.
  }
  listeners.forEach((l) => l());
}
