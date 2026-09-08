"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from "react";

import { cart, getCartSnapshot, getServerCartSnapshot, subscribeCart } from "@/lib/cart-store";
import type { CartItems } from "@/lib/orders";

type SiteState = {
  items: CartItems;
  cartCount: number;
  /** True once the cart has been read from this browser's storage. */
  hydrated: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  setQty: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  newsletterOpen: boolean;
  openNewsletter: () => void;
  closeNewsletter: () => void;
};

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const { items, hydrated } = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const openNewsletter = useCallback(() => setNewsletterOpen(true), []);
  const closeNewsletter = useCallback(() => setNewsletterOpen(false), []);

  const cartCount = useMemo(() => Object.values(items).reduce((n, q) => n + q, 0), [items]);

  const value = useMemo<SiteState>(
    () => ({
      items,
      cartCount,
      hydrated,
      addToCart: cart.add,
      setQty: cart.setQty,
      removeItem: cart.remove,
      clearCart: cart.clear,
      newsletterOpen,
      openNewsletter,
      closeNewsletter,
    }),
    [items, cartCount, hydrated, newsletterOpen, openNewsletter, closeNewsletter],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used inside <SiteProvider>");
  return context;
}
