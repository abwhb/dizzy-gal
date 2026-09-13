import type { CartItems } from "@/lib/orders";

/**
 * The cart, as a tiny external store so components can read it with
 * useSyncExternalStore: the server (and the first client paint) see an
 * empty, un-hydrated cart; the browser's saved cart appears right after,
 * without setState-in-effect or a hydration mismatch.
 */

export type CartSnapshot = { items: CartItems; hydrated: boolean };

const KEY = "dg-cart";
const SERVER: CartSnapshot = { items: {}, hydrated: false };

let snapshot: CartSnapshot | null = null;
const listeners = new Set<() => void>();

function load(): CartItems {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItems) : {};
  } catch {
    return {};
  }
}

function persist(items: CartItems) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // storage blocked — the cart still works for this page
  }
}

export function getCartSnapshot(): CartSnapshot {
  if (!snapshot) snapshot = { items: load(), hydrated: true };
  return snapshot;
}

export function getServerCartSnapshot(): CartSnapshot {
  return SERVER;
}

export function subscribeCart(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) {
      snapshot = { items: load(), hydrated: true };
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function update(next: CartItems) {
  snapshot = { items: next, hydrated: true };
  persist(next);
  listeners.forEach((l) => l());
}

export const cart = {
  add(productId: string, quantity = 1) {
    const items = getCartSnapshot().items;
    update({ ...items, [productId]: (items[productId] ?? 0) + quantity });
  },
  setQty(productId: string, quantity: number) {
    const next = { ...getCartSnapshot().items };
    if (quantity <= 0) delete next[productId];
    else next[productId] = quantity;
    update(next);
  },
  remove(productId: string) {
    cart.setQty(productId, 0);
  },
  clear() {
    update({});
  },
};
