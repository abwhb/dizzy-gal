"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { CartView } from "@/lib/cart";

type AddResult = { ok: true; cart: CartView } | { ok: false; error: string };

type SiteState = {
  cart: CartView | null;
  cartCount: number;
  cartLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<AddResult>;
  refreshCart: () => Promise<void>;
  newsletterOpen: boolean;
  openNewsletter: () => void;
  closeNewsletter: () => void;
};

const SiteContext = createContext<SiteState | null>(null);

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: { message?: string } };
    return body.error?.message ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

/** Fetch the visitor's cart; `null` when it can't be reached (keep the last known one). */
async function fetchCart(): Promise<CartView | null> {
  try {
    const response = await fetch("/api/cart", { cache: "no-store" });
    if (!response.ok) return null;
    const body = (await response.json()) as { cart: CartView };
    return body.cart;
  } catch {
    return null;
  }
}

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartView | null>(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const refreshCart = useCallback(async () => {
    const next = await fetchCart();
    if (next) setCart(next);
    setCartLoading(false);
  }, []);

  // Hydrate the cart count from the cookie-backed cart once on mount.
  useEffect(() => {
    let active = true;
    fetchCart().then((next) => {
      if (!active) return;
      if (next) setCart(next);
      setCartLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const addToCart = useCallback(async (productId: string, quantity = 1): Promise<AddResult> => {
    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) return { ok: false, error: await readError(response) };
      const body = (await response.json()) as { cart: CartView };
      setCart(body.cart);
      return { ok: true, cart: body.cart };
    } catch {
      return { ok: false, error: "Couldn't reach the shop. Try again in a moment." };
    }
  }, []);

  const openNewsletter = useCallback(() => setNewsletterOpen(true), []);
  const closeNewsletter = useCallback(() => setNewsletterOpen(false), []);

  const value = useMemo<SiteState>(
    () => ({
      cart,
      cartCount: cart?.itemCount ?? 0,
      cartLoading,
      addToCart,
      refreshCart,
      newsletterOpen,
      openNewsletter,
      closeNewsletter,
    }),
    [cart, cartLoading, addToCart, refreshCart, newsletterOpen, openNewsletter, closeNewsletter],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used inside <SiteProvider>");
  return context;
}
