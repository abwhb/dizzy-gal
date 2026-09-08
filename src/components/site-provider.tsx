"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type SiteState = {
  cartCount: number;
  addToCart: (quantity?: number) => void;
  newsletterOpen: boolean;
  openNewsletter: () => void;
  closeNewsletter: () => void;
};

const SiteContext = createContext<SiteState | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const addToCart = useCallback((quantity = 1) => {
    setCartCount((count) => count + quantity);
  }, []);
  const openNewsletter = useCallback(() => setNewsletterOpen(true), []);
  const closeNewsletter = useCallback(() => setNewsletterOpen(false), []);

  const value = useMemo(
    () => ({ cartCount, addToCart, newsletterOpen, openNewsletter, closeNewsletter }),
    [cartCount, addToCart, newsletterOpen, openNewsletter, closeNewsletter],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) throw new Error("useSite must be used inside <SiteProvider>");
  return context;
}
