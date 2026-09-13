import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/api";
import { clearCartToken, findCurrentCart, shippingFor } from "@/lib/cart";
import { db } from "@/lib/db";

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  email: z.email("Enter a valid email address.").max(200),
  address: z.object({
    line1: z.string().trim().min(1, "Address is required.").max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(1, "City is required.").max(100),
    region: z.string().trim().max(100).optional(),
    postcode: z.string().trim().min(1, "Postcode is required.").max(20),
    country: z.string().trim().min(2, "Country is required.").max(60).default("Australia"),
  }),
  notes: z.string().trim().max(1000).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderInclude = {
  items: { orderBy: { name: "asc" as const } },
} satisfies Prisma.OrderInclude;

export type OrderRecord = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

export type OrderView = {
  id: string;
  number: number;
  status: OrderRecord["status"];
  email: string;
  name: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    region: string | null;
    postcode: string;
    country: string;
  };
  notes: string | null;
  items: { productId: string; name: string; unitPriceCents: number; quantity: number }[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  createdAt: string;
};

export function toOrderView(order: OrderRecord): OrderView {
  return {
    id: order.id,
    number: order.number,
    status: order.status,
    email: order.email,
    name: order.name,
    address: {
      line1: order.addressLine1,
      line2: order.addressLine2,
      city: order.city,
      region: order.region,
      postcode: order.postcode,
      country: order.country,
    },
    notes: order.notes,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
    })),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    totalCents: order.totalCents,
    currency: order.currency,
    createdAt: order.createdAt.toISOString(),
  };
}

/**
 * Turn the visitor's cart into an order. Runs in a transaction: stock is
 * decremented with a guard so two checkouts can't oversell the last jar, and
 * the cart is emptied only if everything succeeds. Payment is not taken here;
 * the order is created as PENDING for a payment step to move on.
 */
export async function placeOrder(input: CheckoutInput): Promise<OrderRecord> {
  const cart = await findCurrentCart();
  if (!cart || cart.items.length === 0) throw new ApiError(400, "Your cart is empty.");

  const inactive = cart.items.find((item) => !item.product.active);
  if (inactive) throw new ApiError(409, `${inactive.product.name} is no longer available.`);

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = cart.items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0,
  );
  const shippingCents = shippingFor(itemCount);

  const order = await db().$transaction(async (tx) => {
    for (const item of cart.items) {
      const { count } = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (count === 0) {
        throw new ApiError(409, `Not enough ${item.product.name} left for that order.`, {
          productId: item.productId,
        });
      }
    }

    const created = await tx.order.create({
      data: {
        email: input.email.toLowerCase(),
        name: input.name,
        addressLine1: input.address.line1,
        addressLine2: input.address.line2 || null,
        city: input.address.city,
        region: input.address.region || null,
        postcode: input.address.postcode,
        country: input.address.country,
        notes: input.notes || null,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
        currency: cart.items[0].product.currency,
        cartId: cart.id,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            unitPriceCents: item.product.priceCents,
            quantity: item.quantity,
          })),
        },
      },
      include: orderInclude,
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
    return created;
  });

  // The cart has been consumed; a fresh one is created on the next add.
  await clearCartToken();
  return order;
}

/** Look an order up by its number, gated on the customer's email. */
export async function findOrderForCustomer(
  number: number,
  email: string,
): Promise<OrderRecord | null> {
  const order = await db().order.findUnique({ where: { number }, include: orderInclude });
  if (!order || order.email !== email.toLowerCase()) return null;
  return order;
}
