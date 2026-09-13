import { track } from "@vercel/analytics";

/**
 * Custom events sent to Vercel Web Analytics.
 *
 * Keep the event names and payloads in one place so the dashboard stays
 * consistent as the site grows. Property values must be primitives
 * (string / number / boolean / null) — Vercel drops anything else.
 */
export const analytics = {
  addToCart(product: { id: string; name: string }, quantity = 1) {
    track("add_to_cart", { product: product.id, name: product.name, quantity });
  },
  newsletterOpened() {
    track("newsletter_open");
  },
  newsletterSubscribed() {
    track("newsletter_subscribe");
  },
};
