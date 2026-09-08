import { products, store } from "@/lib/content";

/**
 * Cart maths and the order record. Orders are kept in the browser (there is
 * no account system) and mirrored to `POST /api/orders`, which is the place
 * to wire up a real back end.
 */

export type CartItems = Record<string, number>;

export type OrderLine = { productId: string; name: string; qty: number; price: number };

export type Customer = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  notes?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  lines: OrderLine[];
  jars: number;
  subtotal: number;
  delivery: number;
  total: number;
  customer: Customer;
  payment: "cod";
  status: "placed";
};

export function linesFor(items: CartItems): OrderLine[] {
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

export function newOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const salt = Math.random().toString(36).toUpperCase().slice(2, 4);
  return `DG-${stamp}${salt}`;
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
