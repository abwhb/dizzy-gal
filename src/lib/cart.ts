import { cookies } from "next/headers";

import type { Prisma } from "@/generated/prisma/client";
import { ApiError } from "@/lib/api";
import { FLAT_SHIPPING_CENTS, FREE_SHIPPING_MIN_JARS } from "@/lib/content";
import { db } from "@/lib/db";
import { type ShopProduct, toShopProduct } from "@/lib/products";

export const CART_COOKIE = "dg_cart";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
export const MAX_LINE_QUANTITY = 50;

export const cartInclude = {
  items: { include: { product: true }, orderBy: { createdAt: "asc" as const } },
} satisfies Prisma.CartInclude;

export type CartRecord = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

export type CartLine = {
  id: string;
  productId: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  product: ShopProduct;
};

export type CartView = {
  id: string | null;
  items: CartLine[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: string;
  freeShippingMinJars: number;
};

export function shippingFor(itemCount: number): number {
  if (itemCount === 0) return 0;
  return itemCount >= FREE_SHIPPING_MIN_JARS ? 0 : FLAT_SHIPPING_CENTS;
}

export function toCartView(cart: CartRecord | null): CartView {
  const items: CartLine[] = (cart?.items ?? []).map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPriceCents: item.product.priceCents,
    lineTotalCents: item.product.priceCents * item.quantity,
    product: toShopProduct(item.product),
  }));
  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalCents = items.reduce((sum, line) => sum + line.lineTotalCents, 0);
  const shippingCents = shippingFor(itemCount);
  return {
    id: cart?.id ?? null,
    items,
    itemCount,
    subtotalCents,
    shippingCents,
    totalCents: subtotalCents + shippingCents,
    currency: items[0]?.product.currency ?? "AUD",
    freeShippingMinJars: FREE_SHIPPING_MIN_JARS,
  };
}

export async function readCartToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value;
}

export async function writeCartToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

export async function clearCartToken(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}

/** The visitor's cart, if the cookie points at one that still exists. */
export async function findCurrentCart(): Promise<CartRecord | null> {
  const token = await readCartToken();
  if (!token) return null;
  return db().cart.findUnique({ where: { token }, include: cartInclude });
}

/** The visitor's cart, creating one (and setting the cookie) if needed. */
export async function getOrCreateCart(): Promise<CartRecord> {
  const existing = await findCurrentCart();
  if (existing) return existing;
  const cart = await db().cart.create({ data: {}, include: cartInclude });
  await writeCartToken(cart.token);
  return cart;
}

export async function reloadCart(cartId: string): Promise<CartRecord> {
  const cart = await db().cart.findUnique({ where: { id: cartId }, include: cartInclude });
  if (!cart) throw new ApiError(404, "Cart not found.");
  return cart;
}

/** Add `quantity` of a product to the visitor's cart (creating the cart if needed). */
export async function addItem(
  product: { id: string; stock: number; name: string },
  quantity: number,
): Promise<CartRecord> {
  const cart = await getOrCreateCart();
  const current = cart.items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const next = current + quantity;
  assertQuantity(next, product);

  await db().cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId: product.id } },
    create: { cartId: cart.id, productId: product.id, quantity: next },
    update: { quantity: next },
  });
  return reloadCart(cart.id);
}

/** Set a line's quantity; `0` removes it. */
export async function setItemQuantity(itemId: string, quantity: number): Promise<CartRecord> {
  const cart = await findCurrentCart();
  const item = cart?.items.find((line) => line.id === itemId);
  if (!cart || !item) throw new ApiError(404, "That item isn't in your cart.");

  if (quantity === 0) {
    await db().cartItem.delete({ where: { id: item.id } });
  } else {
    assertQuantity(quantity, item.product);
    await db().cartItem.update({ where: { id: item.id }, data: { quantity } });
  }
  return reloadCart(cart.id);
}

export async function emptyCart(): Promise<CartRecord | null> {
  const cart = await findCurrentCart();
  if (!cart) return null;
  await db().cartItem.deleteMany({ where: { cartId: cart.id } });
  return reloadCart(cart.id);
}

function assertQuantity(quantity: number, product: { stock: number; name: string }) {
  if (quantity > MAX_LINE_QUANTITY) {
    throw new ApiError(400, `You can order at most ${MAX_LINE_QUANTITY} of one flavour at a time.`);
  }
  if (quantity > product.stock) {
    throw new ApiError(
      409,
      product.stock === 0
        ? `${product.name} is sold out right now.`
        : `Only ${product.stock} jar${product.stock === 1 ? "" : "s"} of ${product.name} left.`,
      { available: product.stock },
    );
  }
}
