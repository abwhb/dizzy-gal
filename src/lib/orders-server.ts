import "server-only";

import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/api";
import { store } from "@/lib/content";
import { db } from "@/lib/db";
import { type Order, type OrderStatus, totalsFor } from "@/lib/orders";

export const MAX_LINE_QTY = 50;

export const checkoutSchema = z.object({
  items: z.record(z.string().min(1), z.coerce.number().int().min(1).max(MAX_LINE_QTY)),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a delivery day."),
  customer: z.object({
    name: z.string().trim().min(2, "We need a name for the box.").max(120),
    phone: z
      .string()
      .trim()
      .max(40)
      .refine((v) => v.replace(/\D/g, "").length >= 10, "A phone number we can actually call."),
    email: z
      .string()
      .trim()
      .max(200)
      .transform((v) => v || undefined)
      .pipe(z.email("That email looks off.").optional()),
    address: z.string().trim().min(8, "A little more detail for the rider.").max(500),
    area: z.string().trim().min(1, "Which phase?").max(80),
    city: z.string().trim().min(1).max(80),
    notes: z
      .string()
      .trim()
      .max(1000)
      .transform((v) => v || undefined),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderInclude = {
  items: { include: { product: { select: { slug: true } } }, orderBy: { name: "asc" as const } },
} satisfies Prisma.OrderInclude;

export type OrderRecord = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;

/** The database row in the shape the browser, emails and confirmation page use. */
export function toOrder(record: OrderRecord): Order {
  return {
    id: record.code,
    createdAt: record.createdAt.toISOString(),
    deliveryDate: record.deliveryDate,
    lines: record.items.map((item) => ({
      // The public id (slug), never the database id.
      productId: item.product.slug,
      name: item.name,
      qty: item.qty,
      price: item.price,
    })),
    jars: record.jars,
    subtotal: record.subtotal,
    delivery: record.delivery,
    total: record.total,
    customer: {
      name: record.name,
      phone: record.phone,
      email: record.email ?? undefined,
      address: record.address,
      area: record.area,
      city: record.city,
      notes: record.notes ?? undefined,
    },
    payment: "cod",
    status: record.status.toLowerCase() as OrderStatus,
  };
}

function newOrderCode(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const salt = Math.random().toString(36).toUpperCase().slice(2, 4);
  return `DG-${stamp}${salt}`;
}

/** Today's date in the shop's time zone, as YYYY-MM-DD. */
function todayInLahore(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * The date must be a real, future day on which we deliver. The client
 * already applies the cut-off hour (src/lib/delivery.ts); the server checks
 * the parts that don't depend on the customer's clock.
 */
function assertDeliveryDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const valid = date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  if (!valid) throw new ApiError(422, "That delivery day isn't a real date.");
  if (iso <= todayInLahore()) throw new ApiError(422, "That delivery day has already passed.");
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  if (!store.deliveryDays.includes(weekday)) {
    throw new ApiError(422, `We only deliver on ${store.deliveryDays.join(" and ")}.`);
  }
}

/**
 * Turn a cart into an order. Prices and totals come from the database, never
 * the browser. Runs in a transaction: stock is decremented with a
 * `stock >= qty` guard so two customers can't buy the last jar.
 */
export async function placeOrder(input: CheckoutInput): Promise<OrderRecord> {
  assertDeliveryDate(input.deliveryDate);

  const slugs = Object.keys(input.items);
  if (slugs.length === 0) throw new ApiError(400, "Your jar is empty.");

  const products = await db().product.findMany({ where: { slug: { in: slugs }, active: true } });
  const missing = slugs.filter((slug) => !products.some((p) => p.slug === slug));
  if (missing.length) {
    throw new ApiError(409, "One of those flavours isn't available any more.", { missing });
  }

  const lines = products.map((product) => ({
    product,
    qty: input.items[product.slug],
  }));
  const totals = totalsFor(
    lines.map((l) => ({ productId: l.product.slug, name: l.product.name, qty: l.qty, price: l.product.price })),
  );
  if (!store.areas.includes(input.customer.area)) {
    throw new ApiError(422, `We deliver to ${store.areas[0]} through ${store.areas[store.areas.length - 1]} only.`);
  }

  return db().$transaction(async (tx) => {
    for (const { product, qty } of lines) {
      const { count } = await tx.product.updateMany({
        where: { id: product.id, stock: { gte: qty } },
        data: { stock: { decrement: qty } },
      });
      if (count === 0) {
        throw new ApiError(409, `Not enough ${product.name} left for that order.`, {
          productId: product.slug,
          available: product.stock,
        });
      }
    }

    return tx.order.create({
      data: {
        code: newOrderCode(),
        deliveryDate: input.deliveryDate,
        name: input.customer.name,
        phone: input.customer.phone,
        email: input.customer.email?.toLowerCase() ?? null,
        address: input.customer.address,
        area: input.customer.area,
        city: input.customer.city,
        notes: input.customer.notes ?? null,
        jars: totals.jars,
        subtotal: totals.subtotal,
        delivery: totals.delivery,
        total: totals.total,
        items: {
          create: lines.map(({ product, qty }) => ({
            productId: product.id,
            name: product.name,
            price: product.price,
            qty,
          })),
        },
      },
      include: orderInclude,
    });
  });
}

/** Look an order up by its public code, gated on the phone number it was placed with. */
export async function findOrderForCustomer(code: string, phone: string): Promise<OrderRecord | null> {
  const record = await db().order.findUnique({ where: { code: code.toUpperCase() }, include: orderInclude });
  if (!record) return null;
  const digits = (value: string) => value.replace(/\D/g, "");
  return digits(record.phone) === digits(phone) ? record : null;
}
