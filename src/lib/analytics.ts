import { track } from "@vercel/analytics";

import type { Order } from "@/lib/orders";

/**
 * Custom events sent to Vercel Web Analytics.
 *
 * Keep the event names and payloads in one place so the dashboard stays
 * consistent as the site grows. Property values must be primitives
 * (string / number / boolean / null) — Vercel drops anything else.
 */
export const analytics = {
  addToCart(productId: string, name: string, quantity = 1) {
    track("add_to_cart", { product: productId, name, quantity });
  },
  orderPlaced(order: Order) {
    track("order_placed", {
      jars: order.jars,
      total: order.total,
      delivery: order.delivery,
      area: order.customer.area,
      payment: order.payment,
    });
  },
  newsletterOpened() {
    track("newsletter_open");
  },
  newsletterSubscribed(source: "modal" | "footer") {
    track("newsletter_subscribe", { source });
  },
};
