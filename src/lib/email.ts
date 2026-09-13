import "server-only";

import { Resend } from "resend";

import { emailFrom, orderNotifyEmail, resendApiKey } from "@/lib/env";
import { formatPrice } from "@/lib/format";
import type { OrderView } from "@/lib/orders";

/**
 * Transactional email via Resend. Every sender is a no-op (with a log line)
 * when dizzy_gals_RESEND_API_KEY isn't set, so local development and tests
 * never need an API key. Sending failures are logged, never thrown: an email
 * that didn't go out must not fail the order or sign-up it belongs to.
 */

let client: Resend | null = null;

function resend(): Resend | null {
  const key = resendApiKey();
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type Message = { to: string; subject: string; html: string; text: string; replyTo?: string };

async function send(kind: string, message: Message): Promise<boolean> {
  const api = resend();
  if (!api) {
    console.info(`[email] ${kind} to ${message.to} skipped: dizzy_gals_RESEND_API_KEY not set`);
    return false;
  }
  const { error } = await api.emails.send({ from: emailFrom(), ...message });
  if (error) {
    console.error(`[email] ${kind} to ${message.to} failed:`, error);
    return false;
  }
  return true;
}

function orderLines(order: OrderView): { html: string; text: string } {
  const rows = order.items.map((item) => ({
    label: `${item.quantity} × ${item.name}`,
    amount: formatPrice(item.unitPriceCents * item.quantity, order.currency),
  }));
  rows.push({ label: "Shipping", amount: order.shippingCents ? formatPrice(order.shippingCents, order.currency) : "Free" });
  rows.push({ label: "Total", amount: formatPrice(order.totalCents, order.currency) });

  const html = `<table style="border-collapse:collapse;width:100%;max-width:420px">${rows
    .map(
      (row, i) =>
        `<tr><td style="padding:6px 0;${i >= rows.length - 1 ? "font-weight:700" : ""}">${escapeHtml(row.label)}</td><td style="padding:6px 0;text-align:right;${i >= rows.length - 1 ? "font-weight:700" : ""}">${escapeHtml(row.amount)}</td></tr>`,
    )
    .join("")}</table>`;
  const text = rows.map((row) => `${row.label}: ${row.amount}`).join("\n");
  return { html, text };
}

function addressBlock(order: OrderView): string {
  return [
    order.name,
    order.address.line1,
    order.address.line2,
    `${order.address.city}${order.address.region ? `, ${order.address.region}` : ""} ${order.address.postcode}`,
    order.address.country,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendOrderConfirmation(order: OrderView): Promise<boolean> {
  const lines = orderLines(order);
  const address = addressBlock(order);
  const subject = `Order #${order.number} — cake is on its way to being yours`;

  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#57151f;line-height:1.5">
      <h1 style="color:#ff6a00;font-size:28px;margin:0 0 12px">You look dizzy. Cake incoming.</h1>
      <p>Thanks ${escapeHtml(order.name)} — we've got your order <strong>#${order.number}</strong>.</p>
      ${lines.html}
      <h2 style="font-size:16px;margin:24px 0 6px">Shipping to</h2>
      <p style="white-space:pre-line;margin:0">${escapeHtml(address)}</p>
      <p style="margin-top:24px;font-size:13px;color:#8a5a62">Reply to this email if anything looks wrong.</p>
    </div>`;
  const text = `Thanks ${order.name} — we've got your order #${order.number}.\n\n${lines.text}\n\nShipping to:\n${address}\n\nReply to this email if anything looks wrong.`;

  return send("order-confirmation", { to: order.email, subject, html, text });
}

/** Heads-up to the shop owner when an order lands (only if dizzy_gals_ORDER_NOTIFY_EMAIL is set). */
export async function sendOrderNotification(order: OrderView): Promise<boolean> {
  const to = orderNotifyEmail();
  if (!to) return false;
  const lines = orderLines(order);
  const address = addressBlock(order);
  const subject = `New order #${order.number} from ${order.name}`;
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;line-height:1.5">
      <p><strong>Order #${order.number}</strong> · ${escapeHtml(order.email)}</p>
      ${lines.html}
      <p style="white-space:pre-line">${escapeHtml(address)}</p>
      ${order.notes ? `<p><em>Notes:</em> ${escapeHtml(order.notes)}</p>` : ""}
    </div>`;
  const text = `Order #${order.number} · ${order.email}\n\n${lines.text}\n\n${address}${order.notes ? `\n\nNotes: ${order.notes}` : ""}`;
  return send("order-notification", { to, subject, html, text, replyTo: order.email });
}

export async function sendNewsletterWelcome(to: string): Promise<boolean> {
  const subject = "You're on the list";
  const html = `
    <div style="font-family:Helvetica,Arial,sans-serif;color:#57151f;line-height:1.5">
      <h1 style="color:#ff6a00;font-size:28px;margin:0 0 12px">Bad day? Cake. Good day? Also cake.</h1>
      <p>You're signed up for drops, restocks and the odd terrible pun. Your 15% off your first jar is coming in the next email.</p>
    </div>`;
  const text = "You're signed up for drops, restocks and the odd terrible pun. Your 15% off your first jar is coming in the next email.";
  return send("newsletter-welcome", { to, subject, html, text });
}
