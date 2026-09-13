"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { OrderStatus } from "@/generated/prisma/enums";
import { endAdminSession, requireAdmin, startAdminSession } from "@/lib/admin-auth";
import { adminConfigured, verifyAdminPassword } from "@/lib/admin-session";
import { db } from "@/lib/db";
import { ingredientSchema } from "@/lib/products";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
  /**
   * The values as submitted, echoed back on a validation error. React resets
   * uncontrolled inputs once a form action settles, so the form re-seeds its
   * `defaultValue`s from here to keep what the admin typed.
   */
  values?: Record<string, string>;
};

function submittedValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  return values;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

/** Every storefront page reads products, so a product change touches them all. */
function revalidateStorefront() {
  for (const path of ["/", "/shop", "/cart", "/checkout", "/wholesale"]) revalidatePath(path);
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!adminConfigured()) {
    return { error: "Admin isn't configured: set dizzy_gals_ADMIN_PASSWORD and dizzy_gals_ADMIN_SESSION_SECRET." };
  }
  const password = String(formData.get("password") ?? "");
  if (!(await verifyAdminPassword(password))) {
    return { error: "Wrong password." };
  }
  await startAdminSession();

  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction(): Promise<void> {
  await endAdminSession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null);

const colour = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^#[0-9A-F]{6}$/, "Use a hex colour like #FF8BA7.");

const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Name is required.").max(120),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and dashes only."),
  tag: optionalText(40),
  description: z.string().trim().min(1, "Description is required.").max(2000),
  warning: optionalText(80),
  cta: z.string().trim().min(1, "Button text is required.").max(60),
  imageUrl: optionalText(500),
  price: z.coerce.number().int("Whole rupees only.").min(0, "Price can't be negative.").max(1_000_000),
  panel: colour,
  bg: colour,
  dark: z.boolean(),
  stock: z.coerce.number().int("Stock must be a whole number.").min(0),
  sortOrder: z.coerce.number().int().default(0),
  active: z.boolean(),
  ingredients: z.array(ingredientSchema).max(8),
});

function fieldErrorsFrom(error: z.ZodError): FormState["fieldErrors"] {
  const out: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

export async function saveProductAction(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();

  let ingredients: unknown = [];
  try {
    ingredients = JSON.parse(String(formData.get("ingredients") || "[]"));
  } catch {
    return { fieldErrors: { ingredients: ["Ingredients are malformed."] }, values: submittedValues(formData) };
  }

  const parsed = productFormSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    slug: formData.get("slug"),
    tag: formData.get("tag") ?? "",
    description: formData.get("description"),
    warning: formData.get("warning") ?? "",
    cta: formData.get("cta"),
    imageUrl: formData.get("imageUrl") ?? "",
    price: formData.get("price"),
    panel: formData.get("panel"),
    bg: formData.get("bg"),
    dark: formData.get("dark") === "on",
    stock: formData.get("stock"),
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on",
    ingredients,
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values: submittedValues(formData) };
  }

  const { id, ...data } = parsed.data;

  const slugOwner = await db().product.findUnique({ where: { slug: data.slug }, select: { id: true } });
  if (slugOwner && slugOwner.id !== id) {
    return {
      fieldErrors: { slug: ["Another flavour already uses this id."] },
      values: submittedValues(formData),
    };
  }

  if (id) {
    await db().product.update({ where: { id }, data });
  } else {
    await db().product.create({ data });
  }

  revalidatePath("/admin/products");
  revalidateStorefront();
  redirect(`/admin/products?flash=${id ? "updated" : "created"}`);
}

export async function setProductActiveAction(id: string, active: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db().product.update({ where: { id }, data: { active } });
  revalidatePath("/admin/products");
  revalidateStorefront();
  return { ok: true };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const ordered = await db().orderItem.count({ where: { productId: id } });
  if (ordered > 0) {
    return {
      ok: false,
      error: "This flavour has been ordered, so it can't be deleted. Mark it inactive instead.",
    };
  }
  await db().product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidateStorefront();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function updateOrderStatusAction(id: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = z.enum(OrderStatus).safeParse(status);
  if (!parsed.success) return { ok: false, error: "Unknown status." };

  const order = await db().order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return { ok: false, error: "Order not found." };
  if (order.status === parsed.data) return { ok: true };

  // Cancelling puts the jars back; un-cancelling takes them again.
  const restock = order.status !== "CANCELLED" && parsed.data === "CANCELLED";
  const retake = order.status === "CANCELLED" && parsed.data !== "CANCELLED";

  await db().$transaction(async (tx) => {
    if (restock || retake) {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: restock ? { increment: item.qty } : { decrement: item.qty } },
        });
      }
    }
    await tx.order.update({ where: { id }, data: { status: parsed.data } });
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  if (restock || retake) revalidateStorefront();
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Newsletter
// ---------------------------------------------------------------------------

export async function removeSubscriberAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db().newsletterSubscriber.delete({ where: { id } });
  revalidatePath("/admin/subscribers");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Wholesale enquiries
// ---------------------------------------------------------------------------

export async function setEnquiryHandledAction(id: string, handled: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db().wholesaleEnquiry.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
  return { ok: true };
}
