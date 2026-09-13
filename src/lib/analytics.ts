import { track } from "@vercel/analytics";

import { products } from "@/lib/content";
import type { Order } from "@/lib/orders";

/**
 * Custom events sent to Vercel Web Analytics.
 *
 * Keep the event names and payloads in one place so the dashboard stays
 * consistent as the site grows. Property values must be primitives
 * (string / number / boolean / null) — Vercel drops anything else.
 */
export const analytics = {
  addToCart(productId: string, quantity = 1) {
    const product = products.find((p) => p.id === productId);
    track("add_to_cart", { product: productId, name: product?.name ?? productId, quantity });
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
